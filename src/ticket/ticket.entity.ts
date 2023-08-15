import { AbstractEntity } from '../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DecisionEntity } from '../decision/decision.entity';

@Entity({ name: 'ticket' })
export class TicketEntity extends AbstractEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (user) => user.tickets)
  user: UserEntity;

  @ApiProperty()
  @ManyToOne(() => DecisionEntity, (decision) => decision.tickets)
  decision: DecisionEntity;
}
