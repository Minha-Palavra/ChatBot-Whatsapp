import { Logger } from '@nestjs/common';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { UserService } from '../../user/user.service';
import { WhatsappService } from '../whatsapp.service';
import { IMessageProcessingContext } from './message-processing-context.interface';
import { IMessageState } from './message-state.interface';
import { TicketService } from '../../ticket/ticket.service';
import { TicketEntity } from '../../ticket/entities/ticket.entity';

export class MessagesProcessingContext implements IMessageProcessingContext {
  public ticketService: TicketService;

  constructor(
    public whatsappService: WhatsappService,
    public userService: UserService,
    public logger: Logger,
    public state: IMessageState,
    public ticket?: TicketEntity
  ) {
    this.ticketService = whatsappService.ticketService;
  }

  public async processMessages(value: ValueObject): Promise<void> {
    await this.state.processMessages(value, this);
  }
}
