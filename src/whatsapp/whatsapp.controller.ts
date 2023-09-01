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
import { MessageDirection } from '../history/history.entity';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private service: WhatsappService,
    private configService: ConfigService,
  ) {}
  @Get('webhook')
  tokenCheck(@Req() req: RawBodyRequest<Request>, @Query() query): string {
    console.log('body:' + JSON.stringify(req.body));
    console.log('query:' + JSON.stringify(query));
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
  @ApiBody({ schema: { type: 'object' } })
  async webhook(@Body() body: any): Promise<string> {
    // console.log(JSON.stringify(body));
    return await this.service.handleWebhook(body);
  }
}
