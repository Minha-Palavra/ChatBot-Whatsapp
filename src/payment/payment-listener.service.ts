import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentListenerService implements OnModuleInit {
  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.eventEmitter.on('payment.success', (payment: Payment) => {
      this.handlePaymentSuccess(payment);
    });
  }

  @OnEvent('payment.success')
  handlePaymentSuccess(payment: Payment) {
    console.log('Pagamento confirmado:', payment);
    // aqui o pagamento confirmou, faz o que tem q fazer
  }
}
