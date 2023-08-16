import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { ConfigModule } from '@nestjs/config';
import { HistoryModule } from '../history/history.module';
import { UserModule } from '../user/user.module';
import { DecisionModule } from '../decision/decision.module';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [
    ConfigModule,
    HistoryModule,
    UserModule,
    DecisionModule,
    TicketModule,
  ],
  providers: [WhatsappService],
  controllers: [WhatsappController],
  exports: [WhatsappService],
})
export class WhatsappModule {}
