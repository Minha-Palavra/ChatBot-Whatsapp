import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private eventEmitter: EventEmitter2, // Injetar o EventEmitter
    private configService: ConfigService,
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
          price_cents: '499',
        },
      ],
    };

    const headersRequest = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(apiURL, data, headersRequest),
      );
      const responseData = response.data;

      if (
        responseData.pix_create_request &&
        responseData.pix_create_request.result === 'success'
      ) {
        const paymentRecord = this.paymentRepository.create({
          order_id: orderInfo.order_id,
          payer_phone: orderInfo.payer_phone,
          transaction_id: responseData.pix_create_request.transaction_id,
          status: responseData.pix_create_request.status,
          emv: responseData.pix_create_request.pix_code.emv,
          qrCodeBase64: responseData.pix_create_request.pix_code.qrcode_base64,
          qrCodeImageUrl:
            responseData.pix_create_request.pix_code.qrcode_image_url,
          bacenUrl: responseData.pix_create_request.pix_code.bacen_url,
          dueDate: new Date().toISOString(),
        });

        await this.paymentRepository.save(paymentRecord);

        return {
          success: true,
          message: 'Pagamento PIX criado e salvo com sucesso.',
          paymentDetails: paymentRecord,
        };
      } else {
        return {
          success: false,
          message: 'Falha ao criar pagamento PIX.',
          details: responseData,
        };
      }
    } catch (error) {
      throw new Error(`Falha ao criar pagamento PIX: ${error.message}`);
    }
  }

  async handlePaymentNotification(notificationData: any): Promise<any> {
    const statusCheckUrl = 'https://pix.paghiper.com/invoice/notification/';
    const params = {
      token: process.env.PAGHIPER_TOKEN,
      apiKey: notificationData.apiKey,
      transaction_id: notificationData.transaction_id,
      notification_id: notificationData.notification_id,
    };
    console.warn(`CALABRESO: ${notificationData}`);
    try {
      const response = await lastValueFrom(
        this.httpService.post(statusCheckUrl, params, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );
      const paymentDetails = response.data;

      if (
        paymentDetails.status_request &&
        paymentDetails.status_request.result === 'success'
      ) {
        const payment = await this.paymentRepository.findOne({
          where: {
            transaction_id: paymentDetails.status_request.transaction_id,
          },
          relations: { ticket: true },
        });

        if (
          payment &&
          (paymentDetails.status_request.status === 'paid' ||
            paymentDetails.status_request.status === 'completed')
        ) {
          payment.status = paymentDetails.status_request.status;
          payment.used = 1;
          await this.paymentRepository.save(payment);
          this.eventEmitter.emit('payment.success', payment);
          return {
            success: true,
            message: 'Pagamento atualizado com sucesso.',
          };
        } else {
          return {
            success: false,
            message:
              'Pagamento não encontrado ou status não é pago/completado.',
            details: paymentDetails,
          };
        }
      } else {
        return {
          success: false,
          message: 'Falha ao confirmar status do pagamento.',
          details: paymentDetails,
        };
      }
    } catch (error) {
      console.error('Erro ao processar notificação de pagamento:', error);
      return {
        success: false,
        message: `Erro ao processar notificação: ${error.message}`,
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<any> {
    const payment = await this.paymentRepository.findOne({
      where: { transaction_id: transactionId },
      relations: { ticket: true },
    });
    const paymentDetails = await this.fetchPaymentStatus(transactionId);

    if (
      paymentDetails.status_request &&
      paymentDetails.status_request.result === 'success'
    ) {
      await this.paymentRepository.save({
        ...payment,
        status: paymentDetails.status_request.status,
      });
      return {
        success: true,
        status: paymentDetails.status_request.status,
        details: paymentDetails.status_request,
        message: 'Status recebido com sucesso.',
      };
    } else {
      return {
        success: false,
        details: paymentDetails,
        message: 'Status não recebido.',
      };
    }
  }

  private async fetchPaymentStatus(transactionId: string): Promise<any> {
    const statusCheckUrl = 'https://pix.paghiper.com/invoice/status/';
    const params = {
      token: process.env.PAGHIPER_TOKEN,
      apiKey: process.env.PAGHIPER_API_KEY,
      transaction_id: transactionId,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(statusCheckUrl, params, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }),
      );
      return response.data;
    } catch (error) {
      console.error('Erro no fetchPaymentStatus:', error);
      throw new Error(`Erro no fetchPaymentStatus: ${error.message}`);
    }
  }
}
