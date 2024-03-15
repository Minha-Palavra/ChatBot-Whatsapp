import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class ServiceWarrantyState extends MessageState {
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

        await context.whatsappService.sendWarrantyOptions(
          phoneNumber,
          messages.SERVICE_WARRANTY_REQUEST(),
          prefix.SERVICE_WARRANTY,
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
        !this.warrantyOptionHasPrefix(selectedOption, prefix.SERVICE_WARRANTY)
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.SERVICE_WARRANTY}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_WARRANTY_CONFIRMATION_REQUEST(),
          prefix.SERVICE_WARRANTY,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.DATA_PRIVACY}-total`) {
        //
        ticket.serviceWarranty = 'total';
      } else if (selectedOption === `${prefix.DATA_PRIVACY}-parcial`) {
        //
        ticket.serviceWarranty = 'parcial';
      } else if (selectedOption === `${prefix.DATA_PRIVACY}-none`) {
        //
        ticket.serviceWarranty = 'nenhuma';

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_JUDICIAL_RESOLUTION,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.JUDICIAL_RESOLUTION_REQUEST(),
        );
        continue;
      }

      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_SERVICE_WARRANTY_DESCRIPTION,
      });

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.WARRANTY_DESCRIPTION_REQUEST(),
      );
    }
  }
}
