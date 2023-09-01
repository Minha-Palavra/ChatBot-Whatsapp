import { AbstractEntity } from '../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { TicketEntity } from '../ticket/ticket.entity';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  fullname: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  taxpayerNumber: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  phonenumber: string;

  @ApiProperty()
  @OneToMany(() => TicketEntity, (ticket) => ticket.user)
  tickets: TicketEntity[];
}
