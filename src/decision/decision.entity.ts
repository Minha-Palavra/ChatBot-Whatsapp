import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TicketEntity } from '../ticket/ticket.entity';

@Entity({ name: 'decision' })
export class DecisionEntity extends AbstractEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Index({ unique: false })
  @Column()
  slug: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ type: () => DecisionEntity })
  @ManyToMany(() => DecisionEntity, (decision) => decision.parent)
  @JoinTable()
  parent: DecisionEntity[];

  @ApiProperty({ type: () => [DecisionEntity] })
  @ManyToMany(() => DecisionEntity, (decision) => decision.children)
  children: DecisionEntity[];

  // reference to ticket
  @OneToMany(() => TicketEntity, (ticket) => ticket.decision)
  tickets: TicketEntity[];
}
