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
    deadline: string,
    disputeForum: string,
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
    
    *Foro para Resolução de Disputas*: ${disputeForum}
    *Data do Contrato:* ${Date.now().toLocaleString()} como data do contrato.
    Observações: Este contrato não incluirá detalhes sobre endereços, nacionalidade, estado civil ou profissão. O contrato será validado pelo apertar do botão "Sim" enviado via WhatsApp número +1 (802) 383-6625. Formate o contrato usando * para trechos em negrito e ** para trechos em itálico. Não inclua espaços para preenchimento manual da assinatura.`;
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
