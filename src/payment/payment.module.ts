import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { PaymentListenerService } from './payment-listener.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentListenerService],
  exports: [PaymentService],
})
export class PaymentModule {}
