import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ApiConfigService } from '../shared/api-config.service';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private openai: OpenAI;

  constructor(private configService: ApiConfigService) {
    this.openai = new OpenAI({ apiKey: configService.chatGPTConfig.apiKey });
  }

  public async generateProposal(
    category: string,
    description: string,
    serviceDescription: string,
    startDate: string,
    endDate: string,
    payment: string,
    servicePrice: string,
    paymentMethod: string,
    paymentDates: string,
    cancellation: string,
    cancellationDetails: string,
    userName: string,
    userPhoneNumber: string,
    userEmail: string,
    userTaxpayerNumber: string,
    clientNome: string,
    clientPhoneNumber: string,
    clientEmail: string,
    clientTaxpayerNumber: string,
    deadline: string,
    disputeForum: string,
    warranty: string,
    warrantyPeriod: string,
  ) {
    const date: Date = new Date();
    const dataFormatada = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    this.logger.log(dataFormatada);
    const prompt = `
       Crie um contrato de prestação de serviço utilizando os seguintes dados:

    *Categoria do Serviço*: ${category}
    *Descrição do Serviço*: ${description}
    *Valor, forma de pagamento e multa*: ${payment}
    *Prazo de prestação do Serviço*: ${deadline}
    
    *Detalhes do Contratado*:
    - *Nome*: ${userName}
    - *E-mail*: ${userEmail}
    - *Telefone*: ${userPhoneNumber}
    - *CPF/CNPJ*: ${userTaxpayerNumber}
    
    *Detalhes do Contratante*:
    - *Nome*: ${clientNome}
    - *E-mail*: ${clientEmail}
    - *Telefone*: ${clientPhoneNumber}
    - *CPF/CNPJ*: ${clientTaxpayerNumber}

    Leve em consideração para a construção do contrato as informações:
    Categoria do contrato é para Construção Civil, sendo um prestãção de um ${serviceDescription}.
    O início da prestação será ${startDate} e término ${endDate},

    O valor total do contrato será ${servicePrice}, e a forma de pagamento ${paymentMethod},
    as datas de pagamento para ${paymentDates}.
    Será considerado um cancelamento ${cancellation}.
    Aqui estão detalhes as práticas exigidas para cancelamentos de contratos em andamento do seu serviço prestado, bem como, como devem ser feitas as avaliações da qualidade dos serviços prestados ${cancellationDetails}. 
    A garantia será ${warranty}, com os prazos ${warrantyPeriod}
    
    
    *Foro para Resolução de Disputas*: ${disputeForum}
    
    *Data do Contrato:* ${dataFormatada}
    Observações: Este contrato não incluirá detalhes sobre endereço do contratante e contratado, nacionalidade, estado civil ou profissão. O contrato será validado pelo apertar do botão "Sim" enviado via WhatsApp número +55 (11) 91238-5500. Formate o contrato usando * para trechos em negrito e ** para trechos em itálico. Não inclua espaços para preenchimento manual da assinatura.
    
    `;
    //horarios pula e fazemos if depois
    //fazer depois sobre compra materiais
    //multa

    const data = {
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 3500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'Você é um advogado especialista na crianção de contratos de prestação de serviços',
        },
        { role: 'user', content: prompt },
      ],
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    this.logger.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  }

  public async updateContract(contract: string, updates: string) {
    const prompt = `
    Atualize o contrato : ${contract} com as seguintes informações: ${updates}`;
    const data = {
      model: 'gpt-4-turbo-preview',
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 128000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'Você é um advogado especialista na crianção de contratos de prestação de serviços',
        },
        { role: 'user', content: prompt },
      ],
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    this.logger.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  }
}
