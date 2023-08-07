import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import WhatsApp from 'whatsapp';

@Controller('whatsapp')
export class WhatsappController {
  wa = new WhatsApp(this.configService.get('WA_PHONE_NUMBER_ID'));

  constructor(private configService: ConfigService) {}
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
  async webhook(@Body() body) {
    console.log('body: ' + JSON.stringify(body));

    if (body.object !== 'whatsapp_business_account') {
      console.error('object is not whatsapp_business_account: ' + body.object);
      return;
    }

    for (const entry of body.entries) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') {
          console.error('field is not messages: ' + change.field);
          return;
        }
        const value = change.value;
        if (value.messaging_product !== 'whatsapp') {
          console.error(
            'messaging_product is not whatsapp: ' + value.messaging_product,
          );
          return;
        }
        if (value.contacts.length !== 1) {
          console.error('contacts.length is not 1: ' + value.contacts.length);
          return;
        }
        const contact = value.contacts[0];
        for (const message of value.messages) {
          if (message.type !== 'text') {
            console.error('message.type is not text: ' + message.type);
            return;
          }
          try {
            const sent_text_message = await this.wa.messages.text(
              { body: message.text.body },
              message.from,
            );

            console.log(sent_text_message.rawResponse());
          } catch (e) {
            console.log(JSON.stringify(e));
            return;
          }
        }
      }
    }

    return 'ok';
  }
}
