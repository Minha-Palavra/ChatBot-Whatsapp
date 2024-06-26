import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { MessageState } from '../../../whatsapp/states/message-state';
import { OwnerTypeState } from './owner-type.state';
import { UserEntity } from '../../../user/entities/user.entity';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { ContractParty } from '../../entities/contract-party.enum';
import { TicketStatus } from '../../entities/ticket-status.enum';
import { PaidTicketState } from './paid-ticket.state';

export class NewTicketState extends MessageState {
  public prefix = 'NEW_TICKET';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    await this.whatsAppService.sendConfirmationOptions(
      phoneNumber,
      messages.NEW_TICKET_CONFIRMATION(),
      this.prefix,
      false,
    );
  }

  public async processMessages(value: ValueObject): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);

    // If the user is not registered, do nothing.
    if (!user) {
      this.logger.error('User not found.');
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = formatPhoneNumber(message.from);

      if (message.type === 'text') {
        // TODO: I should not send this message when user is trying to create a ticket.
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.NEW_TICKET_CONFIRMATION(),
          this.prefix,
          false,
        );
        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
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
        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.NEW_TICKET_CONFIRMATION(),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        // TODO: Go to previous state.
        // TODO: Should send a message to the user.
        continue;
      }

      // Create a new ticket for the user.
      const ticket = await this.whatsAppService.ticketService.create({
        owner: user,
        awaitingResponseFrom: ContractParty.OWNER,
        status: TicketStatus.OPEN,
      });
      const ticketsCount =
        await this.whatsAppService.ticketService.getUserTicketsCount(user);
      if (ticketsCount > 5) {
        this.nextState = new PaidTicketState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else {
        this.nextState = new OwnerTypeState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state. 
        await this.toNextState(phoneNumber, user, ticket);
      }
    }
  }
}
