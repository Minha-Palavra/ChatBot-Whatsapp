import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
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
import { getTicketStateProcessor, TicketState } from '../ticket/entities/ticket-state';

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
    private historyService: HistoryService,
    public ticketService: TicketService,
    public userService: UserService,
  ) {
  }

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

  private async processReceivedMessages(value: ValueObject) {
    const contact = value.contacts[0];

    // TODO: After the user creation if user wanna change the phoneNumber, it should be done by an email verification.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);

    let state: IMessageState;

    if (!user) {
      // TODO: if user is not found, start user registration process.
      state = new UserRegistrationInitialState();
    } else if (user.state !== UserState.REGISTRATION_COMPLETE) {
      //
      state = getUserStateProcessor[user.state];
    } else {

      // Conversation flow to select a ticket or create a new one.
      const ticket = await this.ticketService.findUserNewestOpenTicket(user);

      if (!ticket) {
        let tickets = await this.ticketService.find({ where: { owner: user } });

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
    );

    await context.processMessages(value);
  }
}
