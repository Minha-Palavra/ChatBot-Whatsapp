import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}