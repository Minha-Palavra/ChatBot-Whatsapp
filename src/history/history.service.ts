import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity, MessageDirection } from './history.entity';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { Repository } from 'typeorm';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly repository: Repository<HistoryEntity>,
  ) {}

  create(data: Partial<WebhookObject>, direction: MessageDirection) {
    return this.repository.save({
      message: data,
      direction: direction,
    });
  }
}
