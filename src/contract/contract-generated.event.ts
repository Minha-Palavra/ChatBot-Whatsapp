import { TicketEntity } from '../ticket/entities/ticket.entity';
import { UserEntity } from '../user/entities/user.entity';

export class ContractGeneratedEvent {
  constructor(
    public user: UserEntity,
    public ticket: TicketEntity,
    public contract: string,
    public phoneNumber: string,
  ) {}
}
