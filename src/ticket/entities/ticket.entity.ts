import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/entities/abstract.entity';
import { UserEntity } from '../../user/entities/user.entity';

import { OwnerType } from './owner-type';
import { CategoryEntity } from '../../category/category.entity';
import { TicketStatus } from './ticket-status.enum';
import { ContractParty } from './contract-party.enum';
import { TicketState } from './ticket-state.enum';
import { Payment } from '../../payment/entities/payment.entity';

@Entity({ name: 'ticket' })
export class TicketEntity extends AbstractEntity {
  @ApiProperty()
  @ManyToOne(() => CategoryEntity, (category) => category.tickets)
  category: CategoryEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.tickets)
  owner: UserEntity;

  @ApiProperty({ enum: TicketState })
  @Column({ type: 'enum', enum: TicketState, default: TicketState.NONE })
  state: TicketState;

  @ApiProperty({ enum: TicketStatus })
  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.NONE })
  status: TicketStatus;

  @ApiProperty({ enum: ContractParty })
  @Column({ type: 'enum', enum: ContractParty, default: ContractParty.NONE })
  awaitingResponseFrom: ContractParty;

  @ApiProperty({ enum: OwnerType })
  @Column({ type: 'enum', enum: OwnerType, default: OwnerType.NONE })
  ownerType: OwnerType;

  @ApiProperty()
  @OneToOne(() => Payment, (payment) => payment.ticket)
  paymentData: Payment;

  @ApiProperty()
  @Column({ nullable: true })
  counterpartName: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  counterpartTaxpayerNumber: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  counterpartPhoneNumber: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  counterpartEmail: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  counterpartAddress: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceAddress: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceDescription: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceStepsDescription: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceStartDate: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceEndDate: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  paymentAmount: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  paymentDueDates: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  materialsDeliverySchedule: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  howMaterialsWillBeBought: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  materiaAreRefundableState: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  howManyBudgesBeforeBuyMaterials: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  whereMaterialsWillBeDelivered: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceContractCancel: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceContractCancelDetails: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialHowMuch: string; // OK

  @ApiProperty()
  @Column({ nullable: true }) // OK
  serviceWorkHoursDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  paymentMethod: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  installmentCount: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  materialIsPartOfContract: boolean; // OK

  @ApiProperty({ enum: ContractParty })
  @Column({ type: 'enum', enum: ContractParty, default: ContractParty.NONE })
  whoWillBuyTheMaterials: ContractParty; // OK

  @ApiProperty({ enum: ContractParty })
  @Column({ type: 'enum', enum: ContractParty, default: ContractParty.NONE })
  whoWillPayForTheMaterials: ContractParty; // OK

  @ApiProperty()
  @Column({ nullable: true })
  materialsPreDeterminedValue: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  materialsPurchaseDetails: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  paymentFee: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  deadlineFee: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceDeliveryDescription: string; /// OK

  @ApiProperty()
  @Column({ nullable: true })
  cancellationFee: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  whatIsContractCancellation: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  whatIsContractCancellationDetails: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  serviceWarranty: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  warrantyDescription: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  judicialResolution: string; // OK

  @ApiProperty()
  @Column({ nullable: true })
  signedByOwner: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  signedByOwnerAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  signedByCounterpart: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  signedByCounterpartAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  contract: string;

  @ApiProperty()
  @Column({ nullable: true })
  contractHasRejectedByCounterpartDescription: string;

  @ApiProperty()
  @Column({ nullable: true, default: 'owner' })
  whoIsEditing: string;

  @ApiProperty()
  @Column({ nullable: true })
  contractCorrection: string;
}
