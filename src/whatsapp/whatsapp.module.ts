import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HistoryModule } from '../history/history.module';
import { TicketModule } from '../ticket/ticket.module';
import { UserModule } from '../user/user.module';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [
    ConfigModule,
    HistoryModule,
    TicketModule,
    UserModule,
    WhatsappModule,
  ],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
