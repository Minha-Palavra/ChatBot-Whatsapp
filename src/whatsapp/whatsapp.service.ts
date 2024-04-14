import {
  HttpStatus,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import WhatsApp from 'whatsapp';
import { InteractiveTypesEnum } from 'whatsapp/build/types/enums';
import { InteractiveObject } from 'whatsapp/build/types/messages';
import {
  MessagesObject,
  ValueObject,
  WebhookObject,
} from 'whatsapp/build/types/webhooks';
import { HistoryService } from '../history/history.service';
import { TicketService } from '../ticket/ticket.service';
import { UserService } from '../user/user.service';
import { getTicketStateProcessor } from '../ticket/entities/get-ticket-state-processor';
import { TicketEntity } from '../ticket/entities/ticket.entity';
import { CategoryEntity } from '../category/category.entity';
import { CategoryService } from '../category/category.service';
import { ContractService } from '../contract/contract.service';
import { IMessageState } from './states/message-state.interface';
import { TicketStatus } from '../ticket/entities/ticket-status.enum';
import { getUserStateProcessor } from '../user/entities/get-user-state-processor';
import { ContractParty } from '../ticket/entities/contract-party.enum';
import { splitString } from '../shared/utils';
import { TicketState } from '../ticket/entities/ticket-state.enum';
import { UserState } from '../user/entities/user-state.enum';
import { ContractGeneratedEvent } from '../contract/contract-generated.event';
import { OnEvent } from '@nestjs/event-emitter';
import { UserEntity } from '../user/entities/user.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entities/payment.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsApp = require('whatsapp');

@Injectable()
export class whatsAppService {
  public readonly logger = new Logger(whatsAppService.name);
  private readonly whatsapp = new WhatsApp(
    this.configService.get('WA_PHONE_NUMBER_ID'),
  );

  constructor(
    private configService: ConfigService,
    public categoryService: CategoryService,
    private historyService: HistoryService,
    public contractService: ContractService,
    public paymentService: PaymentService,
    public ticketService: TicketService,
    public userService: UserService,
  ) {}

  public async checkWebhookMinimumRequirements(body: WebhookObject) {
    if (body.object !== 'whatsapp_business_account') {
      this.logger.error(
        `object is not whatsapp_business_account: ${body.object}.`,
      );
      throw new UnprocessableEntityException({
        message: 'object is not whatsapp_business_account.',
      });
    }
  }

  public async handleWebhook(body: WebhookObject) {
    await this.checkWebhookMinimumRequirements(body);

    // TODO: Save the incoming webhook message to the history.
    // await this.historyService.create(body, MessageDirection.INCOMING);

    this.logger.log('Message Received: ' + JSON.stringify(body));

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') {
          this.logger.error(`field is not messages: ${change.field}`);
          continue;
        }

        const data = change.value;

        if (data.messaging_product !== 'whatsapp') {
          this.logger.error(
            `messaging_product is not whatsapp: ${data.messaging_product}`,
          );
          continue;
        }

        if (data.statuses) {
          // Those are status messages. Do not process them.
          this.logger.warn('An status message arrived. not processed.');
          continue;
        }

        if (data.contacts === undefined || data.contacts.length !== 1) {
          this.logger.error(
            `contacts.length is not 1: ${data?.contacts.length}.`,
          );
          continue;
        }

        if (data.messages && data.messages.length !== 0) {
          await this.processMessages(data);
        }
      }
    }
    return;
  }

  public async sendMessage(
    phoneNumber: string,
    message: string,
    attempts = 0,
  ): Promise<void> {
    if (attempts > 5) {
      this.logger.error('Error sending message after 5 attempts!');
      // throw new Error(`Error sending text message: ${message}.`);
    }

    // If the message is too long, split it into smaller messages.
    const messages = splitString(message, 4096);

    // Send each message.
    for (message of messages) {
      const response = await this.whatsapp.messages.text(
        { body: message },
        phoneNumber,
      );

      if (response.statusCode() !== HttpStatus.OK) {
        this.logger.warn('Failed to send the text message.');
        this.logger.warn('Retrying in 5 seconds.');
        this.logger.error(await response.responseBodyToJSON());

        setTimeout(
          () => this.sendMessage(phoneNumber, message, attempts + 1),
          15000,
        );
      }
    }
  }

  public async sendConfirmationOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
    attempts = 0,
  ) {
    if (attempts > 5) {
      this.logger.error('Error sending message after 5 attempts!');
      // throw new Error(`Error sending text message: ${message}.`);
    }

    // Generate the confirmation options using the prefix.
    const options = await this.generateConfirmationOptions(
      message,
      prefix,
      cancelable,
    );

    const response = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (response.statusCode() !== HttpStatus.OK) {
      this.logger.warn('Failed to send the text message.');
      this.logger.warn('Retrying in 5 seconds.');
      this.logger.error(await response.responseBodyToJSON());

      setTimeout(
        () =>
          this.sendConfirmationOptions(
            phoneNumber,
            message,
            prefix,
            cancelable,
            attempts + 1,
          ),
        15000,
      );
    }
  }

  public async sendContractPartyOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
    attempts = 0,
  ) {
    if (attempts > 5) {
      this.logger.error('Error sending message after 5 attempts!');
      throw new Error(`Error sending text message: ${message}.`);
    }

    // Generate the confirmation options using the prefix.
    const options = await this.generateContractPartyOptions(
      message,
      prefix,
      cancelable,
    );

    const response = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (response.statusCode() !== HttpStatus.OK) {
      this.logger.warn('Failed to send the text message.');
      this.logger.warn('Retrying in 5 seconds.');
      this.logger.error(await response.responseBodyToJSON());

      setTimeout(
        () =>
          this.sendContractPartyOptions(
            phoneNumber,
            message,
            prefix,
            cancelable,
            attempts + 1,
          ),
        15000,
      );
    }
  }

  public async sendCategoryOptions(
    phoneNumber: string,
    category: CategoryEntity,
    attempts = 0,
  ): Promise<boolean> {
    if (attempts > 5) {
      this.logger.error('Error sending message after 5 attempts!');
      throw new Error(`Error sending category: ${category.title}.`);
    }

    // Generate the confirmation options using the prefix.
    const options = await this.generateInteractiveObjectFromCategory(category);

    if (!options) {
      return false;
    }
    const response = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (response.statusCode() !== HttpStatus.OK) {
      this.logger.warn('Failed to send the text message.');
      this.logger.warn('Retrying in 5 seconds.');
      this.logger.error(await response.responseBodyToJSON());

      setTimeout(
        () => this.sendCategoryOptions(phoneNumber, category, attempts + 1),
        15000,
      );
    }

    return true;
  }

  public async sendPaymentMethodsOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    attempts = 0,
  ) {
    if (attempts > 5) {
      this.logger.error('Error sending message after 5 attempts!');
      throw new Error(`Error sending text message: ${message}.`);
    }

    // Generate the confirmation options using the prefix.
    const options = await this.generatePaymentMethodsOptions(message, prefix);

    const response = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (response.statusCode() !== HttpStatus.OK) {
      this.logger.warn('Failed to send the text message.');
      this.logger.warn('Retrying in 5 seconds.');
      this.logger.error(await response.responseBodyToJSON());

      setTimeout(
        () =>
          this.sendPaymentMethodsOptions(
            phoneNumber,
            message,
            prefix,
            attempts + 1,
          ),
        15000,
      );
    }
  }

  public async sendPaymentInCashOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    attempts = 0,
  ) {
    if (attempts > 5) {
      this.logger.error('Error sending message after 5 attempts!');
      throw new Error(`Error sending text message: ${message}.`);
    }

    // Generate the confirmation options using the prefix.
    const options = await this.generatePaymentInCashOptions(message, prefix);

    const response = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (response.statusCode() !== HttpStatus.OK) {
      this.logger.warn('Failed to send the text message.');
      this.logger.warn('Retrying in 5 seconds.');
      this.logger.error(await response.responseBodyToJSON());

      setTimeout(
        () =>
          this.sendPaymentInCashOptions(
            phoneNumber,
            message,
            prefix,
            attempts + 1,
          ),
        15000,
      );
    }
  }

  public async sendTemplate(
    phoneNumber: string,
    name: string,
    parameters?: any,
  ) {
    try {
      const sentMessage = await this.whatsapp.messages.template(
        {
          namespace: '1ceacd4d_95b2_4134_858a_39ee2f4734c6',
          name: name,
          //TODO: Parametros da msg
          components: [
            {
              type: 'body',
              parameters: parameters,
            },
          ],
          language: {
            code: 'pt_BR',
          },
        },

        phoneNumber,
      );
      // this.logger.log(JSON.stringify(sentMessage));
      this.logger.log(
        `${sentMessage.statusCode()}: ${JSON.stringify(
          sentMessage.responseBodyToJSON(),
        )}`,
      );
    } catch (error) {
      throw error;
    }
  }

  public async sendPaymentInInstallmentsOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    attempts = 0,
  ) {
    if (attempts > 5) {
      this.logger.error('Error sending message after 5 attempts!');
      throw new Error(`Error sending text message: ${message}.`);
    }

    // Generate the confirmation options using the prefix.
    const options = await this.generatePaymentInInstallmentsOptions(
      message,
      prefix,
    );

    const response = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (response.statusCode() !== HttpStatus.OK) {
      this.logger.warn('Failed to send the text message.');
      this.logger.warn('Retrying in 5 seconds.');
      this.logger.error(await response.responseBodyToJSON());

      setTimeout(
        () =>
          this.sendPaymentInInstallmentsOptions(
            phoneNumber,
            message,
            prefix,
            attempts + 1,
          ),
        15000,
      );
    }
  }

  public async sendWarrantyOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
  ) {
    // Generate the confirmation options using the prefix.
    const options = await this.generateWarrantyOptions(message, prefix);

    const messageSent = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(() =>
        this.sendContractPartyOptions(phoneNumber, message, prefix),
      );
    }

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  public async generateContract(
    phoneNumber: string,
    user: UserEntity,
    ticket: TicketEntity,
  ) {
    return await this.contractService.generateProposal(
      phoneNumber,
      user,
      ticket,
    );
  }

  public async updateContract(
    phoneNumber: string,
    user: UserEntity,
    ticket: TicketEntity,
  ) {
    return await this.contractService.updateContract(phoneNumber, user, ticket);
  }

  @OnEvent('contract.generated', { async: true })
  public async handleContractGeneratedEvent(payload: ContractGeneratedEvent) {
    const ticket = await this.ticketService.save({
      ...payload.ticket,
      contract: payload.contract,
      state: TicketState.OWNER_SIGNATURE,
    });

    const state = getTicketStateProcessor[ticket.state];
    state.whatsAppService = this;
    state.logger = this.logger;
    state.userService = this.userService;
    await state.onStateBegin(ticket.owner.phoneNumber, ticket.owner, ticket);
  }

  @OnEvent('contract.updated', { async: true })
  public async handleContractUpdatedEvent(payload: ContractGeneratedEvent) {
    const ticket = await this.ticketService.save({
      ...payload.ticket,
      contract: payload.contract,
      state: TicketState.OWNER_SIGNATURE,
    });

    const state = getTicketStateProcessor[ticket.state];
    state.whatsAppService = this;
    state.logger = this.logger;
    state.userService = this.userService;
    await state.onStateBegin(ticket.owner.phoneNumber, ticket.owner, ticket);
  }

  @OnEvent('payment.success', { async: true })
  public async handlePixPaid(payment: Payment) {
    const ticket = await this.ticketService.findOne({
      where: { id: payment.ticket.id },
      relations: { owner: true, category: true, paymentData: true },
    });
    const state = getTicketStateProcessor[ticket.state];
    state.whatsAppService = this;
    state.logger = this.logger;
    state.userService = this.userService;
    await state.onStateBegin(ticket.owner.phoneNumber, ticket.owner, ticket);
  }

  public async cancelTicket(phoneNumber: string, ticket: TicketEntity) {
    await this.ticketService.save({
      ...ticket,
      status: TicketStatus.CLOSED,
    });

    await this.sendMessage(
      phoneNumber,
      'O ticket foi cancelado com sucesso. Obrigado por usar o nosso serviço.',
    );
  }

  protected getSelectedOptionFromMessage(
    message: MessagesObject,
  ): string | null {
    const interaction: any = message.interactive;

    if ('list_reply' in interaction) {
      return interaction.list_reply.id;
    } else if ('button_reply' in interaction) {
      return interaction.button_reply.id;
    } else {
      return null;
    }
  }

  protected clampString(str: string, max: number): string {
    if (!str) return '.';
    return str.length > max ? str.substr(0, max - 4) + '...' : str;
  }

  protected async generateInteractiveObjectFromCategory(
    root: Partial<CategoryEntity>,
  ): Promise<InteractiveObject> {
    let category = await this.categoryService.findOne({
      where: [{ slug: root.slug }, { id: root.id }],
      relations: ['parent'],
    });

    category = await this.categoryService.fillChildren(category);

    if (!category.children || category.children.length === 0) return null;

    const interactive: InteractiveObject = {
      action: {
        button: 'Escolha',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sections: [{ rows: [] }],
      },
      type: InteractiveTypesEnum.List,
      body: {
        text: this.clampString(category.description, 1024),
      },
      header: {
        type: 'text',
        text: this.clampString(category.title, 60),
      },
      footer: {
        text: this.clampString('Escolha uma opção', 60),
      },
    };
    if (category.children.length > 0) {
      if (category.children.length > 9) {
        category.children = category.children.slice(0, 8);
      }
      for (const child of category.children) {
        interactive.action.sections[0].rows.push({
          title: this.clampString(child.title, 24),
          id: this.clampString(child.slug, 200),
          description: this.clampString(child.description, 72),
        });
      }

      //
      // if (category.parent) {
      //   if (interactive.action.sections[0].rows.length < 9) {
      //     interactive.action.sections[0].rows.push({
      //       title: this.clampString('Voltar', 24),
      //       id: 'previous-category',
      //       description: this.clampString(
      //         'Voltar para a categoria anterior',
      //         72,
      //       ),
      //     });
      //   }
      // }
    }
    return interactive;
  }

  private async processMessages(data: ValueObject) {
    const contact = data.contacts[0];

    // TODO: wa_id is the same as the phoneNumber in the value.messages[0].from?
    const phoneNumber = data.messages[0].from;

    let ticket: TicketEntity;
    let state: IMessageState;

    ticket =
      await this.ticketService.findUserNewestOpenTicketAsCounterpartByPhoneNumber(
        phoneNumber,
      );

    // TODO: Check if the user by the contact id or phone number has a contract open as counterpart.
    if (ticket && ticket.status !== TicketStatus.CLOSED) {
      if (ticket.awaitingResponseFrom !== ContractParty.COUNTERPART) {
        // TODO: Send a message to the user to wait for the owner action.
        await this.sendMessage(
          phoneNumber,
          'Você já tem um contrato em andamento. Aguarde o retorno da sua contraparte.',
        );
        return;
      } else {
        state = getTicketStateProcessor[ticket.state];
      }
    } else {
      // Get the user by the contact's WhatsApp id.
      // TODO: After the user creation if user wanna change the phoneNumber, it should be done by an email verification.
      const user = await this.userService.findOneByWhatsappId(contact.wa_id);

      // If user is not found, start user registration process.
      if (!user) {
        state = getUserStateProcessor[UserState.REGISTRATION_INITIAL];
      } else if (user.state !== UserState.REGISTRATION_COMPLETE) {
        // Usar already have completed the registration process.
        state = getUserStateProcessor[user.state];
      } else {
        ticket = await this.ticketService.findUserNewestTicket(user);

        if (!ticket || ticket.status === TicketStatus.CLOSED) {
          // User does not have any open ticket.
          const ticketsCount =
            await this.ticketService.getUserTicketsCount(user);

          if (ticketsCount > 0) {
            state = getTicketStateProcessor[TicketState.NEW_TICKET];
          } else {
            // If user doesn't have any ticket at all it should go to the first ticket flow.
            state = getTicketStateProcessor[TicketState.FIRST_TICKET];
          }
        } else {
          state = getTicketStateProcessor[ticket.state];
        }

        if (
          ticket &&
          ticket.status !== TicketStatus.CLOSED &&
          ticket.awaitingResponseFrom !== ContractParty.OWNER
        ) {
          await this.sendMessage(
            phoneNumber,
            'Você já tem um contrato em andamento. Aguarde o retorno da sua contraparte.',
          );
          return;
        }
      }
      for (const message of data.messages) {
        if (message.type === 'interactive') {
          const selectedOption = this.getSelectedOptionFromMessage(message);
          if (selectedOption === 'cancel') {
            await this.cancelTicket(phoneNumber, ticket);
            return;
          }
        }
      }
    }
    await this.processData(state, data);
  }

  private async processData(state: IMessageState, data: ValueObject) {
    state.whatsAppService = this;
    state.logger = this.logger;
    state.userService = this.userService;

    await state.processMessages(data);
  }

  private async generateContractPartyOptions(
    message: string,
    prefix: string,
    cancelable = true,
  ): Promise<InteractiveObject> {
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.Button,
      body: {
        text: message,
      },
    };

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-PROVIDER`,
        title: 'Contratado',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-CUSTOMER`,
        title: 'Contratante',
      },
    });

    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `CANCEL`,
          title: 'Cancelar contrato',
        },
      });
    }
    return interactive;
  }

  private async generateConfirmationOptions(
    message: string,
    prefix: string,
    cancelable = true,
  ): Promise<InteractiveObject> {
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.Button,
      body: {
        text: message,
      },
    };

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-YES`,
        title: 'Sim',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-NO`,
        title: 'Não',
      },
    });

    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `CANCEL`,
          title: 'Cancelar Contrato',
        },
      });
    }

    return interactive;
  }

  private async generatePaymentMethodsOptions(
    message: string,
    prefix: string,
  ): Promise<InteractiveObject> {
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.Button,
      body: {
        text: message,
      },
    };

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-IN-CASH`,
        title: 'A vista',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-IN-INSTALLMENTS`,
        title: 'Parcelado',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-OTHER`,
        title: 'Outros',
      },
    });

    return interactive;
  }

  private async generatePaymentInCashOptions(
    message: string,
    prefix: string,
  ): Promise<InteractiveObject> {
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.Button,
      body: {
        text: message,
      },
    };

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-CASH`,
        title: 'Dinheiro',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-PIX`,
        title: 'PIX',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-OTHER`,
        title: 'Outros',
      },
    });

    return interactive;
  }

  private async generatePaymentInInstallmentsOptions(
    message: string,
    prefix: string,
  ): Promise<InteractiveObject> {
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.Button,
      body: {
        text: message,
      },
    };

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-CREDIT-CARD`,
        title: 'Cartão',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-BANK-SLIP`,
        title: 'Boleto',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-OTHER`,
        title: 'Outros',
      },
    });

    return interactive;
  }

  private async generateWarrantyOptions(
    message: string,
    prefix: string,
  ): Promise<InteractiveObject> {
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.Button,
      body: {
        text: message,
      },
    };

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-TOTAL`,
        title: 'Total',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-PARCIAL`,
        title: 'Parcial',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-NONE`,
        title: 'Sem Garantia',
      },
    });

    return interactive;
  }
}
