import { AbstractEntity } from '../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { TicketEntity } from '../ticket/ticket.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  phonenumber: string;

  @ApiProperty()
  @OneToMany(() => TicketEntity, (ticket) => ticket.user)
  tickets: TicketEntity[];
}
