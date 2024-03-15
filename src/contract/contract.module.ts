import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { SharedModule } from '../shared/shared.module';
import { ContractController } from './contract.controller';

@Module({
  imports: [SharedModule],
  providers: [ContractService],
  exports: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {
}
