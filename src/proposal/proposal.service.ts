import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigService } from 'src/shared/config.service';
import { OpenAI } from 'openai';

@Injectable()
export class ProposalService {
  private readonly logger = new Logger(ProposalService.name);

  constructor(private configService: ApiConfigService) {}

  async generateProposal(
    category: string,
    description: string,
    payment: string,
    userName: string,
    userPhoneNumber: string,
    userEmail: string,
    userTaxpayerNumber: string,
    clientNome: string,
    clientPhoneNumber: string,
    clientEmail: string,
    clientTaxpayerNumber: string,
  ): Promise<any> {
    const apiKey = this.configService.chatGPTConfig.apiKey;
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // const url = 'https://api.openai.com/v1/completions';

    // const headers = {
    //   Authorization: `Bearer ${apiKey}`,
    //   'Content-Type': 'application/json',
    // };

    const prompt = `
    Faça um contrato formal de prestação de serviço:
    Categoria: ${category}
    Descrição do serviço: ${description}
    Valor e meio de pagamento: ${payment}
    
    Detalhes do contratado:
    Nome do contratado: ${userName}
    E-mail do contratado: ${userEmail}
    Telefone do contratado: ${userPhoneNumber}
    CNPJ/CPF do contratado: ${userTaxpayerNumber}
    
    Detalhes do contratante:
    Nome do contratante: ${clientNome}
    E-mail do contratante: ${clientEmail}
    Telefone do contratante: ${clientPhoneNumber}
    CPF/CNPJ do contratante: ${clientTaxpayerNumber}
    
    Este acordo não terá endereços, nacionalidade, estado civil, profissão, anexos e nem do Foro, a assinatura do contrato será através do apertar do botão Sim enviado via Whatsapp número +1 (802) 383-6625. O contrato será enviado via WhatsApp de forma que deve-se usar de  ** para os trechos em negrito e **** para os trechos em itálico. Sem colocar espaço para assinatura do solicitante e contratante.`;
    // this.logger.log(prompt);
    // this.logger.log(headers);
    const data = {
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 3500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };
    const response = await openai.completions.create(data);
    this.logger.log(response.choices[0].text);
    return response.choices[0].text;
    // try {
    //   const response = await axios.post(url, data, { headers });
    //   this.logger.log(response.data);
    //   return response.data;
    // } catch (error) {
    //   throw error;
    // }
  }
}
