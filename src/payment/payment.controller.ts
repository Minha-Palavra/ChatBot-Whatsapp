import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/create-pix')
  async createPix(@Body() orderInfo: any) {
    return this.paymentService.createPixPayment(orderInfo);
  }
}
