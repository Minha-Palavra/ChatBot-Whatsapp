import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import WhatsApp from 'whatsapp';
import { InteractiveTypesEnum } from 'whatsapp/build/types/enums';
import { InteractiveObject } from 'whatsapp/build/types/messages';
import { ValueObject, WebhookObject } from 'whatsapp/build/types/webhooks';
import { MessageDirection } from '../history/entities/message-direction';
import { HistoryService } from '../history/history.service';
import { TicketService } from '../ticket/ticket.service';
import { getUserStateProcessor, UserState } from '../user/entities/user-state';
import { UserRegistrationInitialState } from '../user/states/user-registration-initial-state';
import { UserService } from '../user/user.service';
import { IMessageState } from './states/message-state.interface';
import { MessagesProcessingContext } from './states/messages-processing-context';
import {
  getTicketStateProcessor,
  TicketState,
} from '../ticket/entities/ticket-state';
import { TicketEntity } from '../ticket/entities/ticket.entity';
import { CategoryEntity } from '../category/category.entity';
import { CategoryService } from '../category/category.service';
import { ContractService } from '../contract/contract.service';
import { OwnerType } from '../ticket/entities/owner-type';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsApp = require('whatsapp');

@Injectable()
export class WhatsappService {
  private readonly whatsapp = new WhatsApp(
    this.configService.get('WA_PHONE_NUMBER_ID'),
  );
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private configService: ConfigService,
    public categoryService: CategoryService,
    private historyService: HistoryService,
    public contractService: ContractService,
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

  private async cancelTicket(phoneNumber: string, ticket: TicketEntity) {
    ticket.state = TicketState.CLOSED;

    await this.ticketService.save(ticket);
    await this.sendMessage(
      phoneNumber,
      'O ticket foi cancelado com sucesso. Obrigado por usar o nosso serviço.',
    );
  }

  public async handleWebhook(body: WebhookObject) {
    await this.checkWebhookMinimumRequirements(body);

    await this.historyService.create(body, MessageDirection.INCOMING);

    let isMessage = false;

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') {
          this.logger.error(`field is not messages: ${change.field}`);
          continue;
        }

        const value = change.value;

        if (value.messaging_product !== 'whatsapp') {
          this.logger.error(
            `messaging_product is not whatsapp: ${value.messaging_product}`,
          );
          continue;
        }

        if (value.statuses) {
          this.logger.error('status message arrived. not processed.');
          continue;
        }

        if (value.contacts === undefined || value.contacts.length !== 1) {
          this.logger.error(
            `contacts.length is not 1: ${value?.contacts.length}.`,
          );
          continue;
        }

        if (value.messages && value.messages.length !== 0) {
          isMessage = true;
          await this.processMessages(value);
        }
      }
    }

    if (isMessage) {
      this.logger.log('Message Received: ' + JSON.stringify(body));
    }

    return;
  }

  private async processMessages(value: ValueObject) {
    const contact = value.contacts[0];

    // TODO: After the user creation if user wanna change the phoneNumber, it should be done by an email verification.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);

    let state: IMessageState;
    let ticket: TicketEntity;

    // TODO: Check if the user by the contact id or phone number has a contract open as counterpart.
    const phoneNumber = value.messages[0].from;
    //
    ticket =
      await this.ticketService.findUserNewestTicketAsCounterpart(phoneNumber);
    if (!ticket) {
      const newPhoneNumber =
        phoneNumber.slice(0, 4) + '9' + phoneNumber.slice(4);
      ticket =
        await this.ticketService.findUserNewestTicketAsCounterpart(
          newPhoneNumber,
        );
    }

    if (ticket && ticket.state != TicketState.CLOSED) {
      if (ticket.state == TicketState.WAITING_COUNTERPART_SIGNATURE) {
        // CONTRAPART EDITANDO.
        state = getTicketStateProcessor[ticket.state];
      } else if (
        ticket.state ==
        TicketState.WAITING_CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION
      ) {
        state = getTicketStateProcessor[ticket.state];
      } else {
        // Ele precisa aguardar, preciso mandar msg para ele aguardar.
        await this.sendMessage(
          phoneNumber,
          'Você já tem um contrato em andamento. Aguarde o retorno da sua contraparte.',
        );
        return;
      }
    } else {
      // TODO: if user is not found, start user registration process.
      if (!user) {
        state = new UserRegistrationInitialState();
      } else if (user.state != UserState.REGISTRATION_COMPLETE) {
        //
        state = getUserStateProcessor[user.state];
      } else {
        // Conversation flow to select a ticket or create a new one.
        ticket = await this.ticketService.findUserNewestTicket(user);

        if (!ticket || ticket.state == TicketState.CLOSED) {
          const tickets = await this.ticketService.find({
            where: {
              owner: { id: user.id },
            },
            order: { updatedAt: 'DESC' },
            relations: { owner: true },
          });

          if (tickets.length > 0) {
            // TODO: if user does not have any open ticket. Then I should redirect it to menu flow.
            // TODO: Menu flow allows user to select a ticket or create a new one.
            state = getTicketStateProcessor[TicketState.SELECT_TICKET];
          } else {
            // TODO: If user doesn't have any ticket at all it should go to the first ticket flow.
            state = getTicketStateProcessor[TicketState.FIRST_TICKET];
          }
        } else {
          state = getTicketStateProcessor[ticket.state];
        }

        if (
          ticket.state == TicketState.WAITING_COUNTERPART_SIGNATURE ||
          ticket.state ==
            TicketState.WAITING_CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION
        ) {
          await this.sendMessage(
            phoneNumber,
            'Você já tem um contrato em andamento. Aguarde o retorno da sua contraparte.',
          );
          return;
        }
      }

      // TODO: Cancelar o ticket.
      for (const message of value.messages) {
        if (message.type == 'text') {
          const text = message.text.body;
          if (text == 'cancelar') {
            await this.cancelTicket(phoneNumber, ticket);
          }
        }
      }
    }

    const context = new MessagesProcessingContext(
      this,
      this.userService,
      this.logger,
      state,
      ticket,
    );

    await context.processMessages(value);
  }

  public async sendMessage(
    phoneNumber: string,
    message: string,
  ): Promise<void> {
    try {
      const messageSent = await this.whatsapp.messages.text(
        { body: message },
        phoneNumber,
      );
      if (messageSent.statusCode() !== 200) {
        this.logger.error('deu erro no sendPaymentInCashOptions.');
        this.logger.log(messageSent.responseBodyToJSON());
        //
        setTimeout(() => this.sendMessage(phoneNumber, message), 5000);
      }
      this.logger.log(`${await messageSent.rawResponse()}`);
      this.logger.log(
        `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
      );
    } catch (e) {
      this.logger.log(JSON.stringify(e));
    }
  }

  public async sendConfirmationOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
  ) {
    const options = await this.generateConfirmationOptions(
      message,
      prefix,
      cancelable,
    );

    const messageSent = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );
    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(
        () =>
          this.sendConfirmationOptions(
            phoneNumber,
            message,
            prefix,
            cancelable,
          ),
        5000,
      );
    }
    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  public async sendContextOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
  ) {
    // Generate the confirmation options using the prefix.
    const options = await this.generateContextOptions(
      message,
      prefix,
      cancelable,
    );

    const messageSent = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(() =>
        this.sendContextOptions(phoneNumber, message, prefix, cancelable),
      );
    }

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  public async sendCategoryOptions(
    phoneNumber: string,
    category: CategoryEntity,
  ): Promise<boolean> {
    const optionList =
      await this.generateInteractiveObjectFromCategory(category);

    if (!optionList) {
      return false;
    }

    const messageSent = await this.whatsapp.messages.interactive(
      optionList,
      phoneNumber,
    );
    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(() => this.sendCategoryOptions(phoneNumber, category), 5000);
    }

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  public async sendPaymentMethodsOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
  ) {
    // Generate the confirmation options using the prefix.
    const options = await this.generatePaymentMethodsOptions(
      message,
      prefix,
      cancelable,
    );

    const messageSent = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );
    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(
        () =>
          this.sendPaymentMethodsOptions(
            phoneNumber,
            message,
            prefix,
            cancelable,
          ),
        5000,
      );
    }

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  public async sendPaymentInInstallmentsOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
  ) {
    // Generate the confirmation options using the prefix.
    const options = await this.generatePaymentInInstallmentsOptions(
      message,
      prefix,
      cancelable,
    );

    const messageSent = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );
    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(
        () =>
          this.sendPaymentInInstallmentsOptions(
            phoneNumber,
            message,
            prefix,
            cancelable,
          ),
        5000,
      );
    }
    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  public async sendPaymentInCashOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
  ) {
    // Generate the confirmation options using the prefix.
    const options = await this.generatePaymentInCashOptions(
      message,
      prefix,
      cancelable,
    );

    const messageSent = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(
        () =>
          this.sendPaymentInCashOptions(
            phoneNumber,
            message,
            prefix,
            cancelable,
          ),
        5000,
      );
    }

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  public async generateContract(ticket: TicketEntity) {
    return await this.contractService.generateProposal(
      ticket.category.title,
      ticket.serviceDetails,
      ticket.serviceDetails,
      ticket.serviceStartDate,
      ticket.serviceEndDate,
      ticket.servicePaymentMethodDescription,
      ticket.servicePaymentAmount,
      ticket.servicePaymentMethodDescription,
      ticket.servicePaymentDates,
      ticket.serviceContractCancelDetails,
      ticket.whatIsContractCancellation,
      ticket.ownerType == OwnerType.SERVICE_PROVIDER
        ? ticket.owner.fullName
        : ticket.counterpartName,
      ticket.ownerType == OwnerType.SERVICE_PROVIDER
        ? ticket.owner.phoneNumber
        : ticket.counterpartPhoneNumber,
      ticket.ownerType == OwnerType.SERVICE_PROVIDER
        ? ticket.owner.email
        : ticket.counterpartEmail,
      ticket.ownerType == OwnerType.SERVICE_PROVIDER
        ? ticket.owner.taxpayerNumber
        : ticket.counterpartTaxpayerNumber,
      ticket.ownerType == OwnerType.CUSTOMER
        ? ticket.owner.fullName
        : ticket.counterpartName,
      ticket.ownerType == OwnerType.CUSTOMER
        ? ticket.owner.phoneNumber
        : ticket.counterpartPhoneNumber,
      ticket.ownerType == OwnerType.CUSTOMER
        ? ticket.owner.email
        : ticket.counterpartEmail,
      ticket.ownerType == OwnerType.CUSTOMER
        ? ticket.owner.taxpayerNumber
        : ticket.counterpartTaxpayerNumber,
      ticket.serviceEndDate,
      ticket.judicialResolution,
      ticket.serviceWarranty,
      ticket.warrantyDescription,
    );
  }

  public async updateContract(ticket: TicketEntity) {
    return await this.contractService.updateContract(
      ticket.contract,
      ticket.contractCorrection,
    );
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
        id: `${prefix}-yes`,
        title: 'Sim',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-no`,
        title: 'Não',
      },
    });

    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `${prefix}-cancel`,
          title: 'Cancelar',
        },
      });
    }

    return interactive;
  }

  private async generateContextOptions(
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
        id: `${prefix}-provider`,
        title: 'Contratado',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-customer`,
        title: 'Contratante',
      },
    });

    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `${prefix}-cancel`,
          title: 'Cancelar',
        },
      });
    }
    return interactive;
  }

  public async sendWarrantyOptions(
    phoneNumber: string,
    message: string,
    prefix: string,
    cancelable = true,
  ) {
    // Generate the confirmation options using the prefix.
    const options = await this.generateWarrantyOptions(
      message,
      prefix,
      cancelable,
    );

    const messageSent = await this.whatsapp.messages.interactive(
      options,
      phoneNumber,
    );

    if (messageSent.statusCode() !== 200) {
      this.logger.error('deu erro no sendPaymentInCashOptions.');
      this.logger.log(messageSent.responseBodyToJSON());
      //
      setTimeout(() =>
        this.sendContextOptions(phoneNumber, message, prefix, cancelable),
      );
    }

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  private async generateWarrantyOptions(
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
        id: `${prefix}-total`,
        title: 'Total',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-parcial`,
        title: 'Parcial',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-none`,
        title: 'Sem Garantia',
      },
    });
    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `${prefix}-cancel`,
          title: 'Cancelar',
        },
      });
    }
    return interactive;
  }

  private async generatePaymentMethodsOptions(
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
        id: `${prefix}-in-cash`,
        title: 'A vista',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-in-installments`,
        title: 'Parcelado',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-others`,
        title: 'Outros',
      },
    });

    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `${prefix}-cancel`,
          title: 'Cancelar',
        },
      });
    }
    return interactive;
  }

  private async generatePaymentInCashOptions(
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
        id: `${prefix}-money`,
        title: 'Dinheiro',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-pix`,
        title: 'PIX',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-others`,
        title: 'Outros',
      },
    });

    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `${prefix}-cancel`,
          title: 'Cancelar',
        },
      });
    }
    return interactive;
  }

  private async generatePaymentInInstallmentsOptions(
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
        id: `${prefix}-credit-card`,
        title: 'Cartão',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-bank-slip`,
        title: 'Boleto',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${prefix}-others`,
        title: 'Outros',
      },
    });

    if (cancelable) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `${prefix}-cancel`,
          title: 'Cancelar',
        },
      });
    }
    return interactive;
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

  protected clampString(str: string, max: number): string {
    if (!str) return '.';
    return str.length > max ? str.substr(0, max - 4) + '...' : str;
  }
}
