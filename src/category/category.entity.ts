import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../shared/entities/abstract.entity';
import { TicketEntity } from '../ticket/entities/ticket.entity';

@Entity({ name: 'decision' })
export class CategoryEntity extends AbstractEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column()
  slug: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ type: () => CategoryEntity })
  @ManyToMany(() => CategoryEntity, (decision) => decision.children)
  @JoinTable()
  parent: CategoryEntity[];

  @ApiProperty({ type: () => [CategoryEntity] })
  @ManyToMany(() => CategoryEntity, (decision) => decision.parent)
  children: CategoryEntity[];

  // reference to ticket
  @OneToMany(() => TicketEntity, (ticket) => ticket.category)
  tickets: TicketEntity[];
}
