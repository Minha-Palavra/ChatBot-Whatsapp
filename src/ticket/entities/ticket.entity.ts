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
  counterpartName: string;

  @ApiProperty()
  @Column({ nullable: true })
  counterpartTaxpayerNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  counterpartPhoneNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  counterpartEmail: string;

  @ApiProperty()
  @Column({ nullable: true })
  counterpartAddress: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceAddress: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceDetails: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceStartDate: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceEndDate: string;

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentAmount: string;

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentDates: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialDate: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialHowBuy: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialPayback: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialHowMuchBudgets: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialWhere: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceContractCancel: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceContractCancelDetails: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialHowMuch: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceStepsDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceHoursDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentMethodDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  servicePaymentMethodInstallmentCount: string;

  @ApiProperty()
  @Column({ nullable: true })
  materialIsPartOfContract: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialPreDeterminedValue: string;

  @ApiProperty()
  @Column({ nullable: true })
  whoWillPayForTheMaterials: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceMaterialDetails: string;

  @ApiProperty()
  @Column({ nullable: true })
  contractHasMoreDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  contractHasDeadlineMoreDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  serviceDeliveryDescription: string;

  @ApiProperty()
  @Column({ nullable: true })
  contractHasCancellationMoreDescription: string;
}
