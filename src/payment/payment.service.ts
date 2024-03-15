import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createPixPayment(orderInfo: any): Promise<any> {
    const apiURL = 'https://pix.paghiper.com/invoice/create/';
    const apiKey = process.env.PAGHIPER_API_KEY;

    const data = {
      apiKey,
      order_id: orderInfo.order_id,
      payer_email: orderInfo.payer_email,
      payer_name: orderInfo.payer_name,
      payer_cpf_cnpj: orderInfo.payer_cpf_cnpj,
      payer_phone: orderInfo.payer_phone,
      notification_url: 'https://wp.tolstenko.net/payment/feedback',
      days_due_date: 1,
      items: [
        {
          description: 'Minha Palavra Bot',
          quantity: '1',
          item_id: '1',
          price_cents: '499'
        }
      ],
    };

    const headersRequest = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await lastValueFrom(this.httpService.post(apiURL, data, headersRequest));
      const responseData = response.data;

      if (responseData.pix_create_request && responseData.pix_create_request.result === "success") {
        const paymentRecord = this.paymentRepository.create({
          order_id: orderInfo.order_id,
          payer_phone: orderInfo.payer_phone,
          transaction_id: responseData.pix_create_request.transaction_id,
          status: responseData.pix_create_request.status,
          emv: responseData.pix_create_request.pix_code.emv,
        });

        await this.paymentRepository.save(paymentRecord);
      }

      return responseData;
    } catch (error) {
      throw new Error('Falha ao criar pagamento PIX: ' + error.message);
    }
  }
}