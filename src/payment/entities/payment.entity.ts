import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TicketEntity } from '../../ticket/entities/ticket.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_id: string;

  @Column()
  payer_phone: string;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  emv: string;

  @Column({ default: 0 })
  used: number;

  @ApiProperty()
  @OneToOne(() => TicketEntity, (ticket) => ticket.paymentData)
  @JoinColumn()
  ticket: TicketEntity;

  @Column({ nullable: true })
  dueDate: string;

  @Column({ nullable: true })
  paidDate: string;

  @Column({ nullable: true })
  qrCodeBase64: string;

  @Column({ nullable: true })
  qrCodeImageUrl: string;

  @Column({ nullable: true })
  bacenUrl: string;
}
