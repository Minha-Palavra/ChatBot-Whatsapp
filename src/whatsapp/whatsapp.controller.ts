import {Body, Controller, Get, Post, Query, RawBodyRequest, Req, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private configService: ConfigService) {}
  @Get('webhook')
  tokenCheck(@Req() req: RawBodyRequest<Request>, @Query() query): string {
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(query));
    if (
      query['hub.mode'] == 'subscribe' &&
      query['hub.verify_token'] === this.configService.get('FB_TOKEN_VERIFY')
    ) {
      return query['hub.challenge'];
    } else {
      throw new UnauthorizedException('Token mismatch');
    }
  }

  @Post('webhook')
  webhook(@Req() req: RawBodyRequest<Request>, @Query() query, @Body() body): string {
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(query));
    console.log(JSON.stringify(body));

    return 'ok';
  }
}
