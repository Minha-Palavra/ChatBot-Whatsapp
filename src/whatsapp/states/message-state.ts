import { Logger } from '@nestjs/common';
import { MessagesObject, ValueObject } from 'whatsapp/build/types/webhooks';
import phone from 'phone';

import { IMessageState } from './message-state.interface';
import { CategoryEntity } from '../../category/category.entity';
import { UserService } from '../../user/user.service';
import { whatsAppService } from '../whatsapp.service';
import { UserEntity } from '../../user/entities/user.entity';
import { TicketEntity } from '../../ticket/entities/ticket.entity';
import { messages } from '../entities/messages';

export abstract class MessageState implements IMessageState {
  public abstract readonly prefix: string;

  public logger?: Logger;
  public userService?: UserService;
  public whatsAppService?: whatsAppService;

  public constructor(public nextState?: IMessageState) {}

  public abstract onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ): Promise<void>;

  public async onMessageProcessingError(phoneNumber: string): Promise<void> {
    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.INVALID_OPTION(),
    );

    await this.onStateBegin(phoneNumber);
  }

  public async toNextState(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    if (!this.nextState) {
      return;
    }

    await this.nextState.onStateBegin(phoneNumber, user, ticket);
  }

  public abstract processMessages(data: ValueObject): Promise<void>;

  protected optionHasValidPrefix(option: string, prefix: string): boolean {
    return option.startsWith(`${prefix}-`) && option.length > prefix.length + 1;
  }

  protected getSelectedOptionFromMessage(
    message: MessagesObject,
  ): string | null {
    const interaction: any = message.interactive;

    if ('list_reply' in interaction) {
      return interaction.list_reply.id;
    } else if ('button_reply' in interaction) {
      return interaction.button_reply.id;
    } else {
      return null;
    }
  }

  protected async isValidCategory(
    selectedOption: string,
    options: CategoryEntity,
  ): Promise<boolean> {
    return !!options.children.find((child) => child.slug === selectedOption);
  }

  protected isValidPhoneNumber(phoneNumber: string): boolean {
    if (!phone(phoneNumber, { country: 'BR' }).isValid) {
      return phone(`+55${phoneNumber}`, { country: 'BR' }).isValid;
    }

    return true;
  }
}
