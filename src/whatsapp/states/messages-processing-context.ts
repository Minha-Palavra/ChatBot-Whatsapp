import { Logger } from '@nestjs/common';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { UserService } from '../../user/user.service';
import { WhatsappService } from '../whatsapp.service';
import { IMessageProcessingContext } from './message-processing-context.interface';
import { IMessageState } from './message-state.interface';

export class MessagesProcessingContext implements IMessageProcessingContext {
  private state: IMessageState;

  constructor(
    public whatsappService: WhatsappService,
    public userService: UserService,
    public logger: Logger,
    initialState: IMessageState,
  ) {
    this.state = initialState;
  }

  public async processMessages(value: ValueObject): Promise<void> {
    await this.state.processMessages(value, this);
  }
}
