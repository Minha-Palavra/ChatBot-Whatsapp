import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from './ticket.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

@Injectable()
export class TicketService extends TypeOrmCrudService<TicketEntity> {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly repository: Repository<TicketEntity>,
  ) {
    super(repository);
  }

  // create(data: Partial<WebhookObject>) {
  //   return this.repository.save({
  //     message: data,
  //     direction: direction,
  //   });
  // }
}
