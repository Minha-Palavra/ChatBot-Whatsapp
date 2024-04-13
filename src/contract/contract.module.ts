import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { SharedModule } from '../shared/shared.module';
import { ContractController } from './contract.controller';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [SharedModule, TicketModule],
  providers: [ContractService],
  exports: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
