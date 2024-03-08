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

  public async handleWebhook(body: WebhookObject): Promise<string> {
    this.logger.log('Message Arrived: ' + JSON.stringify(body));

    await this.historyService.create(body, MessageDirection.INCOMING);
    await this.checkWebhookMinimumRequirements(body);

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
          await this.processReceivedMessages(value);
        }
      }
    }

    if (isMessage) {
      this.logger.log(JSON.stringify(body));
    }

    return 'ok';
  }

  private async processReceivedMessages(value: ValueObject) {
    const contact = value.contacts[0];

    // TODO: After the user creation if user wanna change the phoneNumber, it should be done by an email verification.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);

    let state: IMessageState;
    let ticket: TicketEntity;
    if (!user) {
      // TODO: if user is not found, start user registration process.
      state = new UserRegistrationInitialState();
    } else if (user.state !== UserState.REGISTRATION_COMPLETE) {
      //
      state = getUserStateProcessor[user.state];
    } else {
      // Conversation flow to select a ticket or create a new one.
      ticket = await this.ticketService.findUserNewestTicket(user);

      if (!ticket || ticket.state === TicketState.CLOSED) {
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
    const messageSent = await this.whatsapp.messages.text(
      { body: message },
      phoneNumber,
    );
    this.logger.log(
      `${messageSent.statusCode()}: #${JSON.stringify(messageSent.responseBodyToJSON)}`,
    );
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
      await this.generateInteractiveObjectFromDecision(category);

    if (!optionList) {
      return false;
    }
    this.logger.log(JSON.stringify(optionList));
    const messageSent = await this.whatsapp.messages.interactive(
      optionList,
      phoneNumber,
    );

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
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

  protected async generateInteractiveObjectFromDecision(
    root: Partial<CategoryEntity>,
  ): Promise<InteractiveObject> {
    let decision = await this.categoryService.findOne({
      where: [{ slug: root.slug }, { id: root.id }],
      relations: ['parent'],
    });

    decision = await this.categoryService.fillChildren(decision);

    if (!decision.children || decision.children.length === 0) return null;

    const interactive: InteractiveObject = {
      action: {
        button: 'Escolha',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sections: [{ rows: [] }],
      },
      type: InteractiveTypesEnum.List,
      body: {
        text: this.clampString(decision.description, 1024),
      },
      header: {
        type: 'text',
        text: this.clampString(decision.title, 60),
      },
      footer: {
        text: this.clampString('Escolha uma opção', 60),
      },
    };
    if (decision.children.length > 0) {
      for (const child of decision.children) {
        interactive.action.sections[0].rows.push({
          title: this.clampString(child.title, 24),
          id: this.clampString(child.slug, 200),
          description: this.clampString(child.description, 72),
        });
      }

      if (decision.parent) {
        if (interactive.action.sections[0].rows.length < 9) {
          interactive.action.sections[0].rows.push({
            title: this.clampString('Voltar', 24),
            id: 'previous-category',
            description: this.clampString(
              'Voltar para a categoria anterior',
              72,
            ),
          });
        }
      }
    }
    return interactive;
  }

  protected clampString(str: string, max: number): string {
    if (!str) return '.';
    return str.length > max ? str.substr(0, max - 4) + '...' : str;
  }
}
