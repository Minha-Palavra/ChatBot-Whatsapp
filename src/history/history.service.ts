import { Injectable } from '@nestjs/common';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity, MessageDirection } from './entities/history.entity';
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

  findAll() {
    return `This action returns all history`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }

  update(id: number, updateHistoryDto: UpdateHistoryDto) {
    return `This action updates a #${id} history`;
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
