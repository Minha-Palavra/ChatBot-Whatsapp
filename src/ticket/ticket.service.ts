import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { TicketEntity } from './entities/ticket.entity';

@Injectable()
export class TicketService extends TypeOrmCrudService<TicketEntity> {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    @InjectRepository(TicketEntity)
    private readonly repository: Repository<TicketEntity>,
  ) {
    super(repository);
  }

  public async findUserNewestOpenTicket(
    user: Partial<UserEntity>,
  ): Promise<TicketEntity | null> {
    return await this.findOne({
      where: {
        // user,
        // status: 'open',
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  public async create(data: Partial<TicketEntity>) {
    return await this.repository.save(data);
  }

  public async save(data: Partial<TicketEntity>) {
    return await this.repository.save(data);
  }
}
