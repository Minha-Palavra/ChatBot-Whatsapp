import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { TicketEntity } from './entities/ticket.entity';
import { TicketStatus } from './entities/ticket-status.enum';

@Injectable({ scope: Scope.DEFAULT })
export class TicketService extends TypeOrmCrudService<TicketEntity> {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    @InjectRepository(TicketEntity)
    private readonly repository: Repository<TicketEntity>,
  ) {
    super(repository);
  }

  public async findUserNewestTicket(
    user: Partial<UserEntity>,
  ): Promise<TicketEntity | null> {
    return await this.findOne({
      where: {
        owner: { id: user.id },
      },
      order: { updatedAt: 'DESC' },
      relations: { owner: true, category: true, paymentData: true },
    });
  }

  public async getUserTicketsCount(user: Partial<UserEntity>): Promise<number> {
    return await this.repository.count({
      where: {
        owner: { id: user.id },
      },
    });
  }

  public async findUserNewestOpenTicketAsCounterpartByPhoneNumber(
    phoneNumber: string,
  ): Promise<TicketEntity | null> {
    const options: FindOneOptions<TicketEntity> = {
      where: {
        counterpartPhoneNumber: phoneNumber,
        status: TicketStatus.OPEN,
      },
      order: { updatedAt: 'DESC' },
      relations: { owner: true, category: true, paymentData: true },
    };

    const ticket = await this.findOne(options);

    if (ticket) {
      return ticket;
    }

    options.where = {
      counterpartPhoneNumber: `${phoneNumber.slice(0, 4)}9${phoneNumber.slice(4)}`,
    };

    return await this.findOne(options);
  }

  public async create(data: Partial<TicketEntity>) {
    return await this.repository.save(data);
  }

  public async save(data: Partial<TicketEntity>) {
    return await this.repository.save(data);
  }
}
