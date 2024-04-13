import { messages } from '../../../whatsapp/entities/messages';
import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketState } from '../../entities/ticket-state.enum';
import { UserEntity } from '../../../user/entities/user.entity';
import { CancellationFeeState } from './cancellation-fee.state';
import { WhatIsContractCancellationState } from './what-is-contract-cancellation.state';

export class HasCancellationFeeState extends MessageState {
  public prefix = 'HAS_CANCELLATION_FEE';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      state: TicketState.HAS_CANCELLATION_FEE,
    });

    await this.whatsAppService.sendConfirmationOptions(
      phoneNumber,
      messages.HAS_CANCELLATION_FEE_REQUEST(),
      this.prefix,
      true,
    );
  }

  public async processMessages(value: ValueObject): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);
    const ticket: TicketEntity =
      await this.whatsAppService.ticketService.findUserNewestTicket(user);

    // If the user is not registered, do nothing.
    if (!user) {
      this.logger.error('User not found.');
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = formatPhoneNumber(message.from);

      if (
        message.type === 'text' &&
        ticket.state === TicketState.HAS_CANCELLATION_FEE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.HAS_CANCELLATION_FEE_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.HAS_CANCELLATION_FEE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.HAS_CANCELLATION_FEE_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        this.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (!this.optionHasValidPrefix(selectedOption, this.prefix)) {
        this.logger.error(
          `${selectedOption} is not a valid option for ${this.prefix}.`,
        );

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.HAS_CANCELLATION_FEE_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        this.nextState = new WhatIsContractCancellationState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else if (selectedOption === `${this.prefix}-YES`) {
        this.nextState = new CancellationFeeState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.HAS_CANCELLATION_FEE_REQUEST(),
          this.prefix,
          true,
        );
      }
    }
  }
}
