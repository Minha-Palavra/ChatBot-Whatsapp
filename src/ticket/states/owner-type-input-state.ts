import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { OwnerType } from '../entities/owner-type';
import { TicketState } from '../entities/ticket-state';

export class OwnerTypeInputState extends MessageState {
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
          messages.TICKET_OWNER_TYPE_REQUEST(),
          prefix.TICKET_OWNER_TYPE,
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
      if (!this.optionHasPrefix(selectedOption, prefix.TICKET_OWNER_TYPE)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.TICKET_OWNER_TYPE}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.TICKET_OWNER_TYPE_CONFIRMATION_REQUEST(ticket.ownerType),
          prefix.TICKET_OWNER_TYPE,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.DATA_PRIVACY}-provider`) {
        //
        ticket.ownerType = OwnerType.SERVICE_PROVIDER;
      } else if (selectedOption === `${prefix.DATA_PRIVACY}-customer`) {
        //
        ticket.ownerType = OwnerType.CUSTOMER;
      } else {
      }
      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_COUNTERPART_NAME,
      });

      // TODO: Send the address confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.,
      // );

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.COUNTERPART_NAME_REQUEST(ticket.ownerType),
      );
    }
  }
}
