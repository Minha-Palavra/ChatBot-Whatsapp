import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../shared/entities/abstract.entity';
import { TicketEntity } from '../../ticket/entities/ticket.entity';
import { UserState } from './user-state';


@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ unique: true })
  whatsappId: string;

  @ApiProperty()
  @Column({ nullable: true })
  fullName: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  phoneNumber: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  taxpayerNumber: string;

  @ApiProperty()
  @OneToMany(() => TicketEntity, (ticket) => ticket.owner)
  tickets: TicketEntity[];

  @ApiProperty()
  @Column({ default: UserState.REGISTRATION_INITIAL, nullable: false })
  state: UserState;
}
