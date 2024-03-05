import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../shared/entities/abstract.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { TicketState } from './ticket-state';
import { OwnerType } from './owner-type';

@Entity({ name: 'ticket' })
export class TicketEntity extends AbstractEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.tickets)
  owner: UserEntity;

  @ApiProperty({enum: OwnerType})
  @Column({type: 'enum', enum: OwnerType, default : OwnerType.NONE})
  ownerType: OwnerType;

  @ApiProperty({ enum: TicketState })
  @Column({ type: 'enum', enum: TicketState, default: TicketState.NONE })
  state: TicketState;

}
