import { Logger } from '@nestjs/common';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { UserService } from '../../user/user.service';
import { WhatsappService } from '../whatsapp.service';
import { IMessageProcessingContext } from './message-processing-context.interface';
import { IMessageState } from './message-state.interface';

export class MessagesProcessingContext implements IMessageProcessingContext {
  constructor(
    public whatsappService: WhatsappService,
    public userService: UserService,
    public logger: Logger,
    public state: IMessageState,
  ) {}

  public async processMessages(value: ValueObject): Promise<void> {
    await this.state.processMessages(value, this);
  }
}
