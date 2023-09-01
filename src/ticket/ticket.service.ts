import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from './ticket.entity';
import { FindOneOptions, FindOptions, Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

@Injectable()
export class TicketService extends TypeOrmCrudService<TicketEntity> {
  constructor(
    @InjectRepository(TicketEntity)
    private readonly repository: Repository<TicketEntity>,
  ) {
    super(repository);
  }

  create(data: Partial<TicketEntity>) {
    return this.repository.save(data);
  }

  save(data: Partial<TicketEntity>) {
    return this.repository.save(data);
  }

  async findOneOptions(options: FindOneOptions<TicketEntity>) {
    return await this.repository.findOne(options);
  }
}
