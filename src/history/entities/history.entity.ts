import { AbstractEntity } from '../../shared/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
@Entity({ name: 'history' })
export class HistoryEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ type: 'json' })
  message: WebhookObject;
}
