import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { AbstractEntity } from '../../shared/entities/abstract.entity';
import { MessageDirection } from './message-direction';

@Entity({ name: 'history' })
export class HistoryEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ type: 'json' })
  message: WebhookObject;

  @ApiProperty({ enum: MessageDirection })
  @Column({ type: 'enum', enum: MessageDirection })
  direction: MessageDirection;
}
