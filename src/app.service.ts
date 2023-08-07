import { Injectable } from '@nestjs/common';
// import WhatsApp from 'whatsapp';

@Injectable()
export class AppService {
  // const wa = new WhatsApp( "" );

  getHello(): string {
    return 'Hello World!';
  }
}
