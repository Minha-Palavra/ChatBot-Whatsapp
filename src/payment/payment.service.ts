import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PaymentService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private eventEmitter: EventEmitter2  // Injetar o EventEmitter
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
          description: 'MinhaPalavra Bot',
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

        return {
          success: true,
          message: "Pagamento PIX criado e salvo com sucesso.",
          paymentDetails: {
            transactionId: responseData.pix_create_request.transaction_id,
            status: responseData.pix_create_request.status,
            emv: responseData.pix_create_request.pix_code.emv,
            qrCodeBase64: responseData.pix_create_request.pix_code.qrcode_base64,
            qrCodeImageUrl: responseData.pix_create_request.pix_code.qrcode_image_url,
            bacenUrl: responseData.pix_create_request.pix_code.bacen_url,
            dueDate: responseData.pix_create_request.due_date
          }
        };
      } else {
        return { success: false, message: "Falha ao criar pagamento PIX.", details: responseData };
      }
    } catch (error) {
      throw new Error(`Falha ao criar pagamento PIX: ${error.message}`);
    }
  }

  async handlePaymentNotification(notificationData: any): Promise<any> {
    if (notificationData.transaction_id && notificationData.status === 'paid') {
      const payment = await this.paymentRepository.findOne({
        where: { transaction_id: notificationData.transaction_id }
      });

      if (payment) {
        payment.status = 'Pagamento efetuado.';
        payment.used = 1;  // caso precise usar
        await this.paymentRepository.save(payment);
        this.eventEmitter.emit('payment.success', payment);  // Emitir evento
        return { success: true, message: 'Pagamento atualizado com sucesso.' };
      } else {
        return { success: false, message: 'Pagamento não encontrado com o ID da transação fornecido.' };
      }
    }
    return { success: false, message: 'Tratamento de notificações concluído, mas nenhuma atualização aplicada.' };
  }
}