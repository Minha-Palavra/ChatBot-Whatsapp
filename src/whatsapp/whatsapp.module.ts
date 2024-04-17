import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HistoryModule } from '../history/history.module';
import { TicketModule } from '../ticket/ticket.module';
import { UserModule } from '../user/user.module';
import { WhatsappController } from './whatsapp.controller';
import { whatsAppService } from './whatsapp.service';
import { CategoryModule } from '../category/category.module';
import { ContractModule } from '../contract/contract.module';
import { PaymentModule } from '../payment/payment.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ConfigModule,
    HistoryModule,
    TicketModule,
    CategoryModule,
    UserModule,
    ContractModule,
    PaymentModule,
    EmailModule,
  ],
  controllers: [WhatsappController],
  providers: [whatsAppService],
  exports: [whatsAppService],
})
export class WhatsappModule {}
