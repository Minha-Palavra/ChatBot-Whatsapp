import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ApiConfigService } from '../shared/api-config.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TicketService } from '../ticket/ticket.service';
import { ContractGeneratedEvent } from './contract-generated.event';
import { TicketEntity } from '../ticket/entities/ticket.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OwnerType } from '../ticket/entities/owner-type';
import { ContractParty } from '../ticket/entities/contract-party.enum';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);
  private openai: OpenAI;

  constructor(
    private configService: ApiConfigService,
    private ticketService: TicketService,
    private eventEmitter: EventEmitter2,
  ) {
    this.openai = new OpenAI({ apiKey: configService.chatGPTConfig.apiKey });
  }

  public async generateProposal(
    phoneNumber: string,
    user: UserEntity,
    ticket: TicketEntity,
  ) {
    const date: Date = new Date();
    const dataFormatada = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    this.logger.log(dataFormatada);
    let materiais = ``;
    let prompt;

    if (ticket.materialIsPartOfContract) {
      materiais = `O ${ticket.whoWillBuyTheMaterials === ContractParty.OWNER && ticket.ownerType === OwnerType.CUSTOMER ? 'cliente' : 'prestador de serviço'} será responsável pela compra dos materiais
      que serão pagos pelo ${ticket.whoWillPayForTheMaterials === ContractParty.OWNER && ticket.ownerType === OwnerType.CUSTOMER ? 'cliente' : 'prestador de serviço'}.
      A compra dos materiais será feita da seguinte forma: ${ticket.howMaterialsWillBeBought}, e ${ticket.materialsPurchaseDetails}.
      Os materiais serão entrege no endereço ${ticket.whereMaterialsWillBeDelivered} no dia ${ticket.materialsDeliverySchedule}.
      ${ticket.materiaAreRefundableState !== null ? `Os materiais são reembolsáveis, e será feito da seguinte forma ${ticket.materiaAreRefundableState}` : ''}.
      Os materiais tem um valor pre determinado: ${ticket.materialsPreDeterminedValue}
      `;
      prompt = `
        Crie um contrato de prestação de serviço utilizando os seguintes dados:
    
        *Detalhes do Contratado*:
        - *Nome*: ${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.fullName : ticket.counterpartName} 
        - *E-mail*: ${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.email : ticket.counterpartEmail} 
        - *Telefone*: ${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.phoneNumber : ticket.counterpartPhoneNumber} 
        - *CPF/CNPJ*:${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.taxpayerNumber : ticket.counterpartTaxpayerNumber} 
        - *Endereço*:${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.address : ticket.counterpartAddress} 
        
        *Detalhes do Contratante*:
        - *Nome*: ${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.fullName : ticket.counterpartName} 
        - *E-mail*: ${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.email : ticket.counterpartEmail} 
        - *Telefone*: ${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.phoneNumber : ticket.counterpartPhoneNumber} 
        - *CPF/CNPJ*:${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.taxpayerNumber : ticket.counterpartTaxpayerNumber} 
        - *Endereço*:${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.address : ticket.counterpartAddress} 
        
        Leve em consideração que:
        *Categoria do Serviço*: ${ticket.category}
        *Descrição do Serviço*: ${ticket.serviceDescription}
        
        O início da prestação será ${ticket.serviceStartDate} e término ${ticket.serviceEndDate},
        O o serviço será realizado no endereço ${ticket.serviceAddress},
        O o serviço será realizado em etapas: ${ticket.serviceStepsDescription}, ${ticket.serviceWorkHoursDescription !== null ? `com horários de trabalho ${ticket.serviceWorkHoursDescription}` : ''}
    
        O valor total do contrato será ${ticket.paymentAmount}, e a forma de pagamento ${ticket.paymentMethod}, ${ticket.installmentCount !== null ? `será parcelado em ${ticket.installmentCount} vezes` : ''}
        as datas de pagamento para ${ticket.paymentDueDates}.
        ${ticket.materialIsPartOfContract ? materiais : ''}.
        
        Como será registrada a entrega: ${ticket.serviceDeliveryDescription}
        
        *Garantia*: ${ticket.serviceWarranty}, ${ticket.warrantyDescription}
        
        Será considerado um cancelamento ${ticket.whatIsContractCancellation}.
        A multa em caso de atraso${ticket.deadlineFee}.
        A multa em caso de cancelamento${ticket.cancellationFee}.
        A multa em caso de atraso no pagamento ${ticket.paymentFee}.
        Aqui estão detalhes as práticas exigidas para cancelamentos de contratos em andamento do seu serviço prestado, bem como, como devem ser feitas as avaliações da qualidade dos serviços prestados ${ticket.whatIsContractCancellationDetails}. 
        
        
        *Foro para Resolução de Disputas*: ${ticket.judicialResolution}
        
        *Data do Contrato:* ${dataFormatada}
        Observações: Este contrato não incluirá detalhes sobre endereço do contratante e contratado, nacionalidade, estado civil ou profissão. O contrato será validado pelo apertar do botão "Sim" enviado via WhatsApp número +55 (11) 91238-5500. Formate o contrato usando * para trechos em negrito e ** para trechos em itálico. Não inclua espaços para preenchimento manual da assinatura.    
        `;
    }else{
      prompt = `
        Crie um contrato para venda utilizando os seguintes dados:
    
        *Detalhes do Contratado*:
        - *Nome*: ${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.fullName : ticket.counterpartName} 
        - *E-mail*: ${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.email : ticket.counterpartEmail} 
        - *Telefone*: ${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.phoneNumber : ticket.counterpartPhoneNumber} 
        - *CPF/CNPJ*:${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.taxpayerNumber : ticket.counterpartTaxpayerNumber} 
        - *Endereço*:${ticket.ownerType === OwnerType.SERVICE_PROVIDER ? ticket.owner.address : ticket.counterpartAddress} 
        
        *Detalhes do Contratante*:
        - *Nome*: ${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.fullName : ticket.counterpartName} 
        - *E-mail*: ${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.email : ticket.counterpartEmail} 
        - *Telefone*: ${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.phoneNumber : ticket.counterpartPhoneNumber} 
        - *CPF/CNPJ*:${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.taxpayerNumber : ticket.counterpartTaxpayerNumber} 
        - *Endereço*:${ticket.ownerType === OwnerType.CUSTOMER ? ticket.owner.address : ticket.counterpartAddress} 
        
        Leve em consideração que:
        *Categoria do Serviço*: ${ticket.category}
        *Descrição do Serviço*: ${ticket.serviceDescription}
        
        A data da compra será ${ticket.serviceStartDate} e a entrega do produto ${ticket.serviceEndDate},
        O endereço da compra ${ticket.serviceAddress},
        O serviço será realizado em etapas: ${ticket.serviceStepsDescription}, ${ticket.serviceWorkHoursDescription !== null ? `com horários de ${ticket.serviceWorkHoursDescription}` : ''}
    
        O valor total do contrato será ${ticket.paymentAmount}, e a forma de pagamento ${ticket.paymentMethod}, ${ticket.installmentCount !== null ? `será parcelado em ${ticket.installmentCount} vezes` : ''}
        as datas de pagamento para ${ticket.paymentDueDates}.
        ${ticket.materialIsPartOfContract ? materiais : ''}.
        
        Como será registrada a entrega: ${ticket.serviceDeliveryDescription}
        
        *Garantia*: ${ticket.serviceWarranty}, ${ticket.warrantyDescription}
        
        Será considerado um cancelamento ${ticket.whatIsContractCancellation}.
        A multa em caso de atraso${ticket.deadlineFee}.
        A multa em caso de cancelamento${ticket.cancellationFee}.
        A multa em caso de atraso no pagamento ${ticket.paymentFee}.
        Aqui estão detalhes as práticas exigidas para cancelamentos de contratos em andamento do seu serviço prestado, bem como, como devem ser feitas as avaliações da qualidade dos serviços prestados ${ticket.whatIsContractCancellationDetails}. 
        
        *Foro para Resolução de Disputas*: ${ticket.judicialResolution}
        
        *Data do Contrato:* ${dataFormatada}
        Observações: Este contrato não incluirá detalhes sobre endereço do contratante e contratado, nacionalidade, estado civil ou profissão. O contrato será validado pelo apertar do botão "Sim" enviado via WhatsApp número +55 (11) 91238-5500. Formate o contrato usando * para trechos em negrito e ** para trechos em itálico. Não inclua espaços para preenchimento manual da assinatura.    
        `;
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'Você é um advogado especialista na crianção de contratos, com base nas informações que serão passadas irá criar um contrato, com um texto claro, consistente e objetivo, caso não tenha a informação ou ela for NULL, por favor ignore e não insira no contrato.',
        },
        { role: 'user', content: prompt },
      ],
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    this.logger.log(response.choices[0].message.content);
    // return response.choices[0].message.content;
    await this.ticketService.save({
      ...ticket,
      contract: response.choices[0].message.content,
    });
    await this.ticketService.findOne({
      where: {
        id: ticket.id,
      },
      order: { updatedAt: 'DESC' },
      relations: { owner: true, category: true, paymentData: true },
    });
    this.eventEmitter.emit(
      'contract.generated',
      new ContractGeneratedEvent(
        user,
        ticket,
        response.choices[0].message.content,
        phoneNumber,
      ),
    );
  }

  public async updateContract(
    phoneNumber: string,
    user: UserEntity,
    ticket: TicketEntity,
  ) {
    const prompt = `
    Atualize o contrato : ${ticket.contract} com as seguintes informações: ${ticket.contractCorrection}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'Você é um advogado especialista na crianção de contratos',
        },
        { role: 'user', content: prompt },
      ],
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    this.logger.log(response.choices[0].message.content);
    await this.ticketService.save({
      ...ticket,
      contract: response.choices[0].message.content,
    });
    await this.ticketService.findOne({
      where: {
        id: ticket.id,
      },
      order: { updatedAt: 'DESC' },
      relations: { owner: true, category: true, paymentData: true },
    });
    this.eventEmitter.emit(
      'contract.updated',
      new ContractGeneratedEvent(
        user,
        ticket,
        response.choices[0].message.content,
        phoneNumber,
      ),
    );
  }
}
