import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { ConfigModule } from '@nestjs/config';
import { HistoryModule } from '../history/history.module';
import { UserModule } from '../user/user.module';
import { DecisionModule } from '../decision/decision.module';
import { TicketModule } from '../ticket/ticket.module';
import { ProposalModule } from 'src/proposal/proposal.module';

@Module({
  imports: [
    ConfigModule,
    HistoryModule,
    UserModule,
    DecisionModule,
    TicketModule,
    ProposalModule,
  ],
  providers: [WhatsappService],
  controllers: [WhatsappController],
  exports: [WhatsappService],
})
export class WhatsappModule {}
