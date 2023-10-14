import { AbstractEntity } from '../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DecisionEntity } from '../decision/decision.entity';

export enum TicketState {
  NONE = 'NONE',
  InProgress = 'INPROGRESS',
  Chosing = 'CHOSING',
  Finished = 'FINISHED',
  Name = 'NAME',
  TaxpayerNumber = 'TAXPAYER_NUMBER',
  Email = 'EMAIL',
  JobDescription = 'JOB_DESCRIPTION',
  PaymentMethod = 'PAYMENT_METHOD',
  PaymentAmount = 'PAYMENT_AMOUNT',
  ClientPhoneNumber = 'CLIENT_PHONE_NUMBER',
  ClientName = 'CLIENT_NAME',
  ClientTaxpayerNumber = 'CLIENT_TAXPAYER_NUMBER',
  ClientEmail = 'CLIENT_EMAIL',
  ClientRecieve = 'CLIENT_RECIEVE',
  ClientApproval = 'CLIENT_APPROVAL',
  Proporsal = 'PROPOSAL',
  ServiceDeadline = 'SERVICE_DEADLINE',
  LGPD = 'LGPD',
  JurisdictionInDispute = 'JURISDICTION_IN_DISPUTE',
}

export enum TicketOwner {
  None = 'NONE',
  ServiceProvider = 'SERVICE_PROVIDER',
  Customer = 'CUSTOMER',
}

@Entity({ name: 'ticket' })
export class TicketEntity extends AbstractEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.tickets)
  user: UserEntity;

  @ApiProperty({ enum: TicketState })
  @Column({ type: 'enum', enum: TicketState, default: TicketState.NONE })
  state: TicketState;

  @ApiProperty({ enum: TicketOwner })
  @Column({ type: 'enum', enum: TicketOwner, default: TicketOwner.None })
  owner: TicketOwner;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column({ nullable: true })
  paymentMethod: string;

  @ApiProperty()
  @Column({ nullable: true })
  proporsal: string;

  @ApiProperty()
  @Column({ nullable: true })
  deadline: string;

  @ApiProperty()
  @Column({ nullable: true })
  disputeForum: string;

  @ApiProperty()
  @Column({ nullable: true })
  accepted: boolean;

  @ApiProperty()
  @ManyToOne(() => DecisionEntity, (decision) => decision.tickets)
  decision: DecisionEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.tickets, { nullable: true })
  counterpart: UserEntity;

  // @ApiProperty()
  // @ManyToOne(() => UserEntity, (user) => user.tickets, { nullable: true })
  // client: UserEntity;
}
