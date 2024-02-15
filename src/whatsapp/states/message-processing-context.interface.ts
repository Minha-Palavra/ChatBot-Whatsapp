import { Logger } from '@nestjs/common';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { UserService } from '../../user/user.service';
import { WhatsappService } from '../whatsapp.service';

export interface IMessageProcessingContext {
  logger: Logger;
  whatsappService: WhatsappService;
  userService: UserService;

  processMessages(value: ValueObject): Promise<void>;
}
