import { Injectable, Logger } from '@nestjs/common';
import { AgreementCreationPayload } from './types/agreement-creation-payload';
import { OpenAI } from 'openai';
import { ApiConfigService } from '../shared/api-config.service';

@Injectable()
export class AgreementService {
  private readonly logger = new Logger(AgreementService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ApiConfigService) {
    this.openai = new OpenAI({ apiKey: configService.chatGPTConfig.apiKey });
  }

  public async generateAgreement(payload: AgreementCreationPayload) {
    const date = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const prompt: string = `
      Crie um contrato de prestação de serviço utilizando os seguintes dados:
      
      Detalhes do Contratado:
        - Nome: ${payload.provider.name}
        - CPF/CNPJ: ${payload.provider.taxpayerNumber}
        - Telefone: ${payload.provider.phoneNumber}
        - E-mail: ${payload.provider.email}
        - Endereço: ${payload.provider.address}
        
      Detalhes do Contratante:
        - Nome: ${payload.customer?.name}
        - CPF/CNPJ: ${payload.customer?.taxpayerNumber}
        - Telefone: ${payload.customer?.phoneNumber}
        - E-mail: ${payload.customer?.email}
        - Endereço: ${payload.customer?.address}
        
      Detalhes do Serviço:
        - Descrição: ${payload.service?.description}
        - Endereço: ${payload.service?.address}
        - Data de início: ${payload.service?.startDate}
        - Data de término: ${payload.service?.endDate}
        - Preço: ${payload.service?.price}
        - Detalhes da entrega: ${payload.service?.deliveryDetails}
        - Tem horários de prestação de serviço: ${payload.service?.hasWorkingHours}
        - Detalhes dos horários de serviço: ${payload.service?.workingHoursDetails}
      
      Detalhes do Método de Pagamento:
        - Descrição: ${payload.paymentMethod?.description}
        - É pagamento parcelado: ${payload.paymentMethod?.isPaymentInInstallments}
        - Quantidade de parcelas: ${payload.paymentMethod?.installments}
        - Detalhes das parcelas: ${payload.paymentMethod?.installmentsDetails}
        - Tem taxa de entrada: ${payload.paymentMethod?.hasAnEntranceFee}
        - Detalhes da taxa de entrada: ${payload.paymentMethod?.entranceFeeDetails}
        - Datas de pagamento: ${payload.paymentMethod?.paymentDates}
        
        Detalhes dos Materiais:
        - Faz parte do contrato: ${payload.materials?.isPartOfContract}
        - Descrição: ${payload.materials?.description}
        - Quantidade de orçamentos necessários: ${payload.materials?.requiredBudgetsCount}
        - Como será comprado: ${payload.materials?.howWillBeBought}
        - Quem comprará: ${payload.materials?.whoWillBuy}
        - Quem pagará: ${payload.materials?.whoWillPay}
        - Tem preço previsto: ${payload.materials?.hasAnPredictedPrice}
        - Preço previsto: ${payload.materials?.predictedPrice}
        - Data de entrega: ${payload.materials?.whenWillBeDelivered}
        - Local de entrega: ${payload.materials?.whereWillBeDelivered}
        - Tem reembolso: ${payload.materials?.hasPayback}
        - Detalhes do reembolso: ${payload.materials?.paybackDetails}
      
        Detalhes da Garantia:
        - Tem garantia: ${payload.warranty?.hasWarranty}
        - Período de garantia: ${payload.warranty?.warrantyPeriod}
        - Detalhes da garantia: ${payload.warranty?.warrantyDetails}
        
        Detalhes das Políticas:
        - Tem multa de atraso na entrega: ${payload.policies?.hasLateDeliveryFee}
        - Detalhes da multa de atraso na entrega: ${payload.policies?.lateDeliveryFeeDetails}
        - Tem multa de atraso no pagamento: ${payload.policies?.hasPaymentDelayFee}
        - Detalhes da multa de atraso no pagamento: ${payload.policies?.paymentDelayFeeDetails}
        - Tem cláusula de rescisão: ${payload.policies?.hasTerminationClause}
        - Detalhes da rescisão: ${payload.policies?.terminationDetails}
        - Motivos de rescisão: ${payload.policies?.terminationReasons}
        - Tem multa de rescisão: ${payload.policies?.hasTerminationFee}
        - Detalhes da multa de rescisão: ${payload.policies?.terminationFeeDetails}
        - Data do contrato: ${date}
        
        Leve em consideração para a construção do contrato as informações a cima.
        Formate o contrato usando * para trechos em negrito e ** para trechos em itálico.
        Não inclua espaços para preenchimento manual da assinatura.
    `;
    console.log(prompt);
    const body = {
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 3500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    const response = await this.openai.completions.create(body);

    return response.choices[0].text;
  }
}
