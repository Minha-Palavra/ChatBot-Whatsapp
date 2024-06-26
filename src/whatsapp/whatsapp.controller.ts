import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody } from '@nestjs/swagger';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { whatsAppService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(
    private configService: ConfigService,
    private service: whatsAppService,
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
  @HttpCode(HttpStatus.OK)
  public async handleWebhook(@Body() body: WebhookObject) {
    return await this.service.handleWebhook(body);
  }
}
