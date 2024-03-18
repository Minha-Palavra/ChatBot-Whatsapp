import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/entities/abstract.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { TicketState } from './ticket-state';
import { OwnerType } from './owner-type';
import { CategoryEntity } from '../../category/category.entity';

@Entity({ name: 'ticket' })
export class TicketEntity extends AbstractEntity {
  @ApiProperty()
  @ManyToOne(() => CategoryEntity, (category) => category.tickets)
  category: CategoryEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.tickets)
  owner: UserEntity;

  @ApiProperty({ enum: OwnerType })
  @Column({ type: 'enum', enum: OwnerType, default: OwnerType.NONE })
  ownerType: OwnerType;

  @ApiProperty({ enum: TicketState })
  @Column({ type: 'enum', enum: TicketState, default: TicketState.NONE })
  state: TicketState;

  @ApiProperty()
  @Column({ nullable: true })
  counterpartName: string; // Nome do Contratante

  @ApiProperty()
  @Column({ nullable: true })
  counterpartTaxpayerNumber: string; // CPF/CNPJ do Contratante

  @ApiProperty()
  @Column({ nullable: true })
  counterpartPhoneNumber: string; // Telefone do Contratante

  @ApiProperty()
  @Column({ nullable: true })
  counterpartEmail: string; // Email do Contratante

  @ApiProperty()
  @Column({ nullable: true })
  counterpartAddress: string; // Endereço do Contratante

  @ApiProperty()
  @Column({ nullable: true })
  serviceAddress: string; // Endereço do serviço

  @ApiProperty()
  @Column({ nullable: true })
  serviceDetails: string; // Detalhes do serviço

  @ApiProperty()
  @Column({ nullable: true })
  serviceStartDate: string; // Data de início do serviço

  @ApiProperty()
  @Column({ nullable: true })
  serviceEndDate: string; // Data de término do serviço

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentAmount: string; // Valor do serviço

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentDates: string; // Datas de pagamento

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialDate: string; // Data de entrega dos materiais

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialHowBuy: string; // Como comprar os materiais

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialPayback: string; // Como será o reembolso dos materiais

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialHowMuchBudgets: string; // Quantos orçamentos

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialWhere: string; // Onde comprar os materiais

  @ApiProperty()
  @Column({ nullable: true })
  serviceContractCancel: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceContractCancelDetails: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialHowMuch: string; // Quanto comprar

  @ApiProperty()
  @Column({ nullable: true }) // Detalhes do serviço
  serviceStepsDescription: string;

  @ApiProperty()
  @Column({ nullable: true }) // Horas de serviço
  serviceHoursDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentMethodDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentMethodInstallmentCount: string; // Quantidade de parcelas

  @ApiProperty()
  @Column({ nullable: true })
  materialIsPartOfContract: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  whoWillBuyMaterial: string; // Quem irá comprar os materiais

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialPreDeterminedValue: string; // Valor pré-determinado dos materiais

  @ApiProperty()
  @Column({ nullable: true })
  whoWillPayForTheMaterials: string; // Quem irá pagar pelos materiais

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialDetails: string; // Detalhes dos materiais

  @ApiProperty()
  @Column({ nullable: true })
  contractHasMoreDescription: string; //MULTA POR ATRASO NA ENTREGA

  @ApiProperty()
  @Column({ nullable: true })
  contractHasDeadlineMoreDescription: string; // MULTA

  @ApiProperty()
  @Column({ nullable: true })
  serviceDeliveryDescription: string; // DETALHES DA ENTREGA

  @ApiProperty()
  @Column({ nullable: true })
  contractHasCancellationMoreDescription: string; // MULTA POR ATRASO NO PAGAMENTO

  @ApiProperty()
  @Column({ nullable: true })
  whatIsContractCancellation: string; // O QUE É O CANCELAMENTO

  @ApiProperty()
  @Column({ nullable: true })
  serviceWarranty: string; // GARANTIA

  @ApiProperty()
  @Column({ nullable: true })
  warrantyDescription: string; // DETALHES DA GARANTIA

  @ApiProperty()
  @Column({ nullable: true })
  judicialResolution: string;

  @ApiProperty()
  @Column({ nullable: true })
  signedByOwner: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  contract: string;
}
