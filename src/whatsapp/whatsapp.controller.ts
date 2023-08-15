import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { WhatsappService } from './whatsapp.service';
import { MessageDirection } from '../history/entities/history.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsApp = require('whatsapp');

@Controller('whatsapp')
export class WhatsappController {
  wa = new WhatsApp(this.configService.get('WA_PHONE_NUMBER_ID'));
  private readonly logger = new Logger(WhatsappController.name);

  constructor(
    private configService: ConfigService,
    private service: WhatsappService,
  ) {}
  @Get('webhook')
  tokenCheck(@Req() req: RawBodyRequest<Request>, @Query() query): string {
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(query));
    if (
      query['hub.mode'] == 'subscribe' &&
      query['hub.verify_token'] ===
        this.configService.get('WEBHOOK_VERIFICATION_TOKEN')
    ) {
      return query['hub.challenge'];
    } else {
      throw new UnauthorizedException('Token mismatch');
    }
  }

  @Post('webhook')
  async webhook(@Body() bodyRaw) {
    this.logger.log('webhook called');
    const body: WebhookObject = bodyRaw;

    const histlog = await this.service.historyService.create(
      body,
      MessageDirection.INCOMING,
    );
    this.logger.log('history log created: ' + histlog.id);

    if (body.object !== 'whatsapp_business_account') {
      console.error('object is not whatsapp_business_account: ' + body.object);
      return;
    }

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

            this.logger.log(
              'message sent: ' + (await sent_text_message.responseBodyToJSON()),
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
}
