import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private configService: ConfigService) {}
  @Get('tokenCheck')
  tokenCheck(): string {
    return process.env.FB_TOKEN_VERIFY
      ? process.env.FB_TOKEN_VERIFY
      : 'Hello FB!';
  }
}
