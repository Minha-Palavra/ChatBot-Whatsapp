import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { TicketState } from '../entities/ticket-state';
import { TicketEntity } from '../entities/ticket.entity';

export class MaterialDetailsState extends MessageState {
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
        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.MATERIAL_DETAILS_REQUEST(),
          prefix.MATERIAL_DETAILS,
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
      if (!this.optionHasPrefix(selectedOption, prefix.MATERIAL_DETAILS)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.MATERIAL_DETAILS}.`,
        );

        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.MATERIAL_DETAILS_REQUEST(),
          prefix.MATERIAL_DETAILS,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.MATERIAL_DETAILS}-no`) {
        // TODO: Go to previous state.

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_CONTRACT_HAS_MORE,
        });

        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_HAS_MORE_REQUEST(),
          prefix.CONTRACT_HAS_MORE,
          false,
        );

      } else if (selectedOption === `${prefix.MATERIAL_DETAILS}-yes`) {
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_MATERIAL_DETAILS_DESCRIPTION,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.MATERIAL_DETAILS_DESCRIPTION_REQUEST(),
        );
      }

      // TODO: Send the data privacy confirmation success message.
    }
  }
}
