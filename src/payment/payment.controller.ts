import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/create-pix')
  async createPix(@Body() orderInfo: any) {
    return this.paymentService.createPixPayment(orderInfo);
  }

  @Post('/feedback')
  @HttpCode(HttpStatus.OK) // sempre 200
  async handleNotification(@Body() notificationData: any) {
    return this.paymentService.handlePaymentNotification(notificationData);
  }
}