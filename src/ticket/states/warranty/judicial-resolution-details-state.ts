import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { prefix } from '../../../whatsapp/entities/prefix';
import { TicketEntity } from '../../entities/ticket.entity';

import { formatPhoneNumber } from '../../../shared/utils';
import { UserEntity } from '../../../user/entities/user.entity';
import { TicketState } from '../../entities/ticket-state.enum';
import { GeneratingContractState } from './generating-contract.state';

export class JudicialResolutionDetailsState extends MessageState {
  public prefix = 'JUDICIAL_RESOLUTION_DETAILS';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      materialsDeliverySchedule: null,
      state: TicketState.JUDICIAL_RESOLUTION_DETAILS,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.JUDICIAL_RESOLUTION_REQUEST(),
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
        ticket.state === TicketState.JUDICIAL_RESOLUTION_DETAILS
      ) {
        ticket.judicialResolution = message.text.body;

        // Update the user state.
        await this.whatsAppService.ticketService.save({
          ...ticket,
          state: TicketState.JUDICIAL_RESOLUTION_DETAILS_CONFIRMATION,
        });
        if (!ticket.judicialResolution) {
          await this.onMessageProcessingError(phoneNumber);
          continue;
        }
        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.JUDICIAL_RESOLUTION_CONFIRMATION_REQUEST(
            ticket.judicialResolution,
          ),
          prefix.JUDICIAL_RESOLUTION,
          true,
        );
        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.JUDICIAL_RESOLUTION_CONFIRMATION_REQUEST(
            ticket.judicialResolution,
          ),
          prefix.JUDICIAL_RESOLUTION,
          true,
        );
        continue;
      }
      if (!ticket.judicialResolution) {
        await this.onMessageProcessingError(phoneNumber);
        continue;
      }
      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        this.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (
        !this.optionHasValidPrefix(selectedOption, prefix.JUDICIAL_RESOLUTION)
      ) {
        this.logger.error(
          `${selectedOption} is not a valid option for ${prefix.JUDICIAL_RESOLUTION}.`,
        );
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        // Send the confirmation options again.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.JUDICIAL_RESOLUTION_CONFIRMATION_REQUEST(
            ticket.judicialResolution,
          ),
          prefix.JUDICIAL_RESOLUTION,
          true,
        );

        continue;
      }

      if (selectedOption === `${prefix.JUDICIAL_RESOLUTION}-NO`) {
        await this.onStateBegin(phoneNumber, user, ticket);
      } else if (selectedOption === `${prefix.JUDICIAL_RESOLUTION}-YES`) {
        this.nextState = new GeneratingContractState();
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
        // Send the confirmation options again.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.JUDICIAL_RESOLUTION_CONFIRMATION_REQUEST(
            ticket.judicialResolution,
          ),
          prefix.JUDICIAL_RESOLUTION,
          true,
        );
      }
    }
  }
}
