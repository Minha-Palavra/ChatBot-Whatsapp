import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class ContractHasDeadlineMoreDescriptionState extends MessageState {
  public async processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await context.userService.findOneByWhatsappId(contact.wa_id);
    const ticket: TicketEntity =
      await context.whatsappService.ticketService.findUserNewestTicket(user);

    // If the user is not registered, do nothing.
    if (!user) {
      context.logger.error('User not found.');
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = this.formatPhoneNumber(message.from);

      if (message.type === 'text') {
        const contractHasDeadlineMoreDescription = message.text.body;

        ticket.contractHasDeadlineMoreDescription =
          contractHasDeadlineMoreDescription;

        // Update the user state.
        await context.whatsappService.ticketService.save({
          ...ticket,
          state:
            TicketState.WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_CONFIRMATION,
        });

        // Send the confirmation options.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_CONFIRMATION_REQUEST(
            ticket.contractHasDeadlineMoreDescription,
          ),
          prefix.CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION,
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
        context.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (
        !this.optionHasPrefix(
          selectedOption,
          prefix.CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION,
        )
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_CONFIRMATION_REQUEST(
            ticket.contractHasDeadlineMoreDescription,
          ),
          prefix.CONTRACT_HAS_DEADLINE_MORE,
          false,
        );

        continue;
      }

      if (
        selectedOption === `${prefix.CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION}-no`
      ) {
        // TODO: Go to previous state.
        ticket.contractHasDeadlineMoreDescription = null;

        await context.whatsappService.ticketService.save({
          ...ticket,
          state:
            TicketState.WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_REQUEST(),
        );

        continue;
      }

      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE,
      });

      await context.whatsappService.sendConfirmationOptions(
        phoneNumber,
        messages.CONTRACT_HAS_DEADLINE_MORE_REQUEST(),
        prefix.CONTRACT_HAS_DEADLINE_MORE,
        false,
      );
    }
  }
}
