import {
  Column,
  Entity, Index,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { AbstractEntity } from '../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TicketEntity } from '../ticket/ticket.entity';

@Entity({ name: 'decision' })
@Tree('nested-set')
export class DecisionEntity extends AbstractEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Index({ unique: false })
  @Column() // todo: make unique. ex "assistencia-tecnica/venda-de-aparelhos-quebrados" is duplicated
  slug: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ type: () => DecisionEntity })
  @TreeParent() // todo: add options here
  parent: DecisionEntity;

  @ApiProperty({ type: () => [DecisionEntity] })
  @TreeChildren() // todo: add options here
  children: DecisionEntity[];

  // reference to ticket
  @OneToMany(() => TicketEntity, (ticket) => ticket.decision)
  tickets: TicketEntity[];
}
