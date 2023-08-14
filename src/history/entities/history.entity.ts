import { AbstractEntity } from '../../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { WebhookObject } from 'whatsapp/build/types/webhooks';

// message direction relative to the bot
export enum MessageDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
}

@Entity({ name: 'history' })
export class HistoryEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ type: 'json' })
  message: WebhookObject;

  @ApiProperty({ enum: MessageDirection})
  @Column({ type: 'enum', enum: MessageDirection })
  direction: MessageDirection;
}
