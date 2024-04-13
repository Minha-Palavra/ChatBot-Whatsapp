import { messages } from '../../../whatsapp/entities/messages';
import { TicketState } from '../../entities/ticket-state.enum';
import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';

import { UserEntity } from '../../../user/entities/user.entity';
import { CounterpartSignatureState } from './counterpart-signature-state';
import { ContractCorrectionState } from './contract-correction-state';

export class OwnerSignatureState extends MessageState {
  public prefix = 'OWNER_SIGNATURE';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      signedByOwner: null,
      state: TicketState.OWNER_SIGNATURE,
    });

    await this.whatsAppService.sendMessage(phoneNumber, ticket.contract);

    await this.whatsAppService.sendConfirmationOptions(
      phoneNumber,
      messages.CONTRACT_APPROVAL_REQUEST(),
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
        ticket.state === TicketState.OWNER_SIGNATURE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendMessage(phoneNumber, ticket.contract);

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_APPROVAL_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.OWNER_SIGNATURE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendMessage(phoneNumber, ticket.contract);

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_APPROVAL_REQUEST(),
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

        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendMessage(phoneNumber, ticket.contract);

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_APPROVAL_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          signedByOwner: null,
          signedByOwnerAt: null,
        });

        this.nextState = new ContractCorrectionState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, null, ticket);
      } else if (selectedOption === `${this.prefix}-YES`) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          signedByOwner: true,
          signedByOwnerAt: new Date(),
          state: TicketState.OWNER_SIGNATURE,
        });

        this.nextState = new CounterpartSignatureState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, null, ticket);
      } else {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendMessage(phoneNumber, ticket.contract);

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_APPROVAL_REQUEST(),
          this.prefix,
          true,
        );
      }
    }
  }
}
