import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HistoryService } from '../history/history.service';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { ConfigService } from '@nestjs/config';
import { MessageDirection } from '../history/history.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsApp = require('whatsapp');

@Injectable()
export class WhatsappService {
  wa = new WhatsApp(this.configService.get('WA_PHONE_NUMBER_ID'));
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    public historyService: HistoryService,
    private configService: ConfigService,
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
        const contact = value.contacts[0];
        for (const message of value.messages) {
          isMessage = true;
          if (message.type !== 'text') {
            this.logger.error('message.type is not text: ' + message.type);
            continue;
          }
          try {
            const sent_text_message = await this.wa.messages.text(
              { body: message.text.body },
              message.from,
            );
          } catch (e) {
            this.logger.error(JSON.stringify(e.message));
            return;
          }
        }
      }
    }

    if (isMessage) {
      this.logger.log(JSON.stringify(body));
    }
    return 'ok';
  }

  // Nome
  // Versão do teste
  // Versão da assinatura
  // Assinar
  // account_alerts
  // Seletor da versão de teste para o campo de webhook account_alerts. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook account_alerts. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // account_review_update
  // Seletor da versão de teste para o campo de webhook account_review_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook account_review_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // account_update
  // Seletor da versão de teste para o campo de webhook account_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook account_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // business_capability_update
  // Seletor da versão de teste para o campo de webhook business_capability_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook business_capability_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // business_status_update
  // Seletor da versão de teste para o campo de webhook business_status_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook business_status_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // campaign_status_update
  // Seletor da versão de teste para o campo de webhook campaign_status_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook campaign_status_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // message_template_quality_update
  // Seletor da versão de teste para o campo de webhook message_template_quality_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook message_template_quality_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // message_template_status_update
  // Seletor da versão de teste para o campo de webhook message_template_status_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook message_template_status_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // messages
  // Seletor da versão de teste para o campo de webhook messages. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook messages. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // phone_number_name_update
  // Seletor da versão de teste para o campo de webhook phone_number_name_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook phone_number_name_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // phone_number_quality_update
  // Seletor da versão de teste para o campo de webhook phone_number_quality_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook phone_number_quality_update. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // security
  // Seletor da versão de teste para o campo de webhook security. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook security. Definido na versão v17.0.
  // v17.0
  // ​
  //
  // template_category_update
  // Seletor da versão de teste para o campo de webhook template_category_update. Definido na versão v17.0.
  // v17.0
  // ​
  // Seletor da versão de assinatura para o campo de webhook template_category_update. Definido na versão v17.0.
  // v17.0
  // ​
}
