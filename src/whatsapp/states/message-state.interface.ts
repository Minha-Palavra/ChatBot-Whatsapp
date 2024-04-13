import { Logger } from '@nestjs/common';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { whatsAppService } from '../whatsapp.service';
import { UserService } from '../../user/user.service';
import { UserEntity } from '../../user/entities/user.entity';
import { TicketEntity } from '../../ticket/entities/ticket.entity';

export interface IMessageState {
  logger?: Logger;
  userService?: UserService;
  whatsAppService?: whatsAppService;

  onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ): Promise<void>;

  onMessageProcessingError(phoneNumber: string): Promise<void>;

  processMessages(data: ValueObject): Promise<void>;
}
