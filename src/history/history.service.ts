import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './entities/history.entity';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { Repository } from 'typeorm';
import { MessageDirection } from './entities/message-direction';

@Injectable()
export class HistoryService extends TypeOrmCrudService<HistoryEntity> {
  private readonly logger = new Logger(HistoryService.name);

  constructor(
    @InjectRepository(HistoryEntity)
    private readonly repository: Repository<HistoryEntity>,
  ) {
    super(repository);
  }

  create(data: Partial<WebhookObject>, direction: MessageDirection) {
    return this.repository.save({
      message: data,
      direction: direction,
    });
  }
}
