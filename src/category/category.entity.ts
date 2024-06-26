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

@Entity({ name: 'category' })
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

  @ApiProperty()
  @Column({ nullable: true })
  hasMaterialFlow: boolean;

  @ApiProperty({ type: () => CategoryEntity })
  @ManyToMany(() => CategoryEntity, (category) => category.children)
  @JoinTable()
  parent: CategoryEntity;

  @ApiProperty({ type: () => [CategoryEntity] })
  @ManyToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];

  // reference to ticket
  @OneToMany(() => TicketEntity, (ticket) => ticket.category)
  tickets: TicketEntity[];
}
