import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HistoryService } from '../history/history.service';
import { ValueObject, WebhookObject } from 'whatsapp/build/types/webhooks';
import { ConfigService } from '@nestjs/config';
import { MessageDirection } from '../history/history.entity';
import { UserService } from '../user/user.service';
import { TicketService } from '../ticket/ticket.service';
import { TicketState } from '../ticket/ticket.entity';
import { InteractiveObject } from 'whatsapp/src/types/messages';
import { DecisionService } from '../decision/decision.service';
import { DecisionEntity } from '../decision/decision.entity';
import { InteractiveTypesEnum } from 'whatsapp/src/types/enums';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsApp = require('whatsapp');

@Injectable()
export class WhatsappService {
  wa = new WhatsApp(this.configService.get('WA_PHONE_NUMBER_ID'));
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    public historyService: HistoryService,
    private configService: ConfigService,
    private userService: UserService,
    private ticketService: TicketService,
    private decisionService: DecisionService,
  ) {}

  async checkWebhookMinimumRequirements(body: WebhookObject) {
    if (body.object !== 'whatsapp_business_account') {
      console.error('object is not whatsapp_business_account: ' + body.object);
      throw new UnprocessableEntityException({
        message: 'object is not whatsapp_business_account',
      });
    }
  }

  async saveMessage(body: WebhookObject) {
    const histlog = await this.historyService.create(
      body,
      MessageDirection.INCOMING,
    );
  }

  async handleWebhook(body: WebhookObject) {
    await this.checkWebhookMinimumRequirements(body);
    await this.saveMessage(body);

    let isMessage = false;
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') {
          this.logger.error('field is not messages: ' + change.field);
          continue;
        }
        const value = change.value;
        if (value.messaging_product !== 'whatsapp') {
          this.logger.error(
            'messaging_product is not whatsapp: ' + value.messaging_product,
          );
          continue;
        }
        if (value.statuses) {
          this.logger.error('status message arrived. not processed');
          continue;
        }
        if (value.contacts === undefined || value.contacts.length !== 1) {
          this.logger.error(
            'contacts.length is not 1: ' + value.contacts.length,
          );
          continue;
        }
        if (value.messages && value.messages.length !== 1) {
          isMessage = true;
          try {
            await this.processMessages(value);
          } catch (e) {
            this.logger.error(e);
          }
        }
      }
    }

    if (isMessage) this.logger.log(JSON.stringify(body));

    return 'ok';
  }

  async genarateInteractiveObjectFromDecision(
    root: Partial<DecisionEntity>,
  ): Promise<InteractiveObject> {
    const decision = await this.decisionService.findOne({
      where: [{ slug: root.slug }, { id: root.id }],
    });
    // todo: check corner cases
    const descendent = await this.decisionService.findDescendants(decision);
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.List,
      body: {
        text: decision.description,
      },
      header: {
        type: 'text',
        text: decision.title,
      },
      footer: {
        text: 'Escolha uma opção',
      },
    };
    if (descendent.length > 0) {
      for (const child of descendent) {
        interactive.action.buttons.push({
          type: 'reply',
          reply: {
            title: child.title,
            id: child.slug,
          },
        });
      }
    }
    return interactive;
  }
  async processMessages(value: ValueObject) {
    const messages = value.messages;
    if (
      value.contacts === undefined ||
      value.contacts === null ||
      value.contacts.length !== 1
    ) {
      this.logger.error('value doenst have contact');
      return;
    }
    const contact = value.contacts[0];
    for (const msg of messages) {
      if (msg.type !== 'text') {
        this.logger.error('message.type is not text: ' + msg.type);
        continue;
      }

      const phonenumber = msg.from;
      const username = contact.profile.name;
      const body = msg.text.body;

      // ensure user exists
      const user = await this.userService.createOrFindOneByNumber({
        phonenumber: phonenumber,
        name: username,
      });

      // ensure ticket exists
      // find the newest ticket
      const ticket = await this.ticketService.findOne({
        where: { user: user },
        order: { updatedAt: 'DESC' },
        relations: { decision: true },
      });

      // todo: create ticket if not exists

      if (ticket === undefined || ticket.state === TicketState.NONE) {
        // todo: send greetings
        const interactive = await this.genarateInteractiveObjectFromDecision({
          slug: 'bem-vindo',
        });

        const sent_text_message = await this.wa.messages.interactive(
          interactive,
          phonenumber,
        );
      }
    }
  }
}
