import { AbstractEntity } from '../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DecisionEntity } from '../decision/decision.entity';

export enum TicketState {
  NONE = 'NONE',
  InProgress = 'INPROGRESS',
  Finished = 'FINISHED',
}

@Entity({ name: 'ticket' })
export class TicketEntity extends AbstractEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.tickets)
  user: UserEntity;

  @ApiProperty({ enum: TicketState })
  @Column({ enum: TicketState, default: TicketState.NONE })
  state: TicketState;

  @ApiProperty()
  @ManyToOne(() => DecisionEntity, (decision) => decision.tickets)
  decision: DecisionEntity;
}
