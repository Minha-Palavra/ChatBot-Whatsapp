import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(private httpService: HttpService) {}

  async createPixPayment(orderInfo: any): Promise<any> {
    const apiURL = 'https://pix.paghiper.com/invoice/create/';
    const apiKey = process.env.PAGHIPER_API_KEY;
    const data = {
      apiKey,
      order_id: orderInfo.order_id,
      payer_email: orderInfo.payer_email,
      payer_name: orderInfo.payer_name,
      payer_cpf_cnpj: orderInfo.payer_cpf_cnpj,
      days_due_date: 1,
    };

    const headersRequest = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await lastValueFrom(this.httpService.post(apiURL, data, headersRequest));
      return response.data;
    } catch (error) {
      throw new Error('Falha ao criar pagamento PIX: ' + error.message);
    }
  }
}
