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

    this.logger.log("Message Arrived: " + JSON.stringify(body));

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
        if (value.messages && value.messages.length !== 0) {
          isMessage = true;
          await this.processMessages(value);
        }
      }
    }

    if (isMessage) this.logger.log(JSON.stringify(body));

    return 'ok';
  }

  clampString(str: string, max: number): string {
    if (!str) return '.';
    return str.length > max ? str.substr(0, max - 4) + '...' : str;
  }

  async genarateInteractiveObjectFromDecision(
    root: Partial<DecisionEntity>,
  ): Promise<InteractiveObject> {
    let decision = await this.decisionService.findOne({
      where: [{ slug: root.slug }, { id: root.id }],
    });

    decision = await this.decisionService.fillChildrenDepth1(decision);

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

      // TODO: ensure ticket exists
      // find the newest ticket
      let ticket = await this.ticketService.findOne({
        where: { user: user },
        order: { updatedAt: 'DESC' },
        relations: { decision: true },
      });
      if (!ticket) {
        ticket = await this.ticketService.create({
          user: user,
          decision: await this.decisionService.findOne({
            where: { slug: 'bem-vindo' },
          }),
          state: TicketState.Chosing,
        });
      }

      if (ticket.state === TicketState.Chosing) {
        const interactive = await this.genarateInteractiveObjectFromDecision(
          ticket.decision,
        );

        if (!interactive) {
          const sent_text_message = await this.wa.messages.interactive(
            interactive,
            phonenumber,
          );
          this.logger.log(
            sent_text_message.statusCode() +
              ' ' +
              JSON.stringify(sent_text_message.responseBodyToJSON()),
          );
        } else {
          const sent_text_message = await this.wa.messages.text(
            { body: 'nao ha mais opcoes' },
            phonenumber,
          );
          this.logger.log(
            sent_text_message.statusCode() +
              ' ' +
              JSON.stringify(sent_text_message.responseBodyToJSON()),
          );
        }
      }
    }
  }
}
