import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class CounterpartPhoneNumberInputState extends MessageState {
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
        const counterpartPhoneNumber = message.text.body.replace(/\D/g, '');

        if (!this.isValidPhoneNumber(counterpartPhoneNumber)) {
          await context.whatsappService.sendMessage(
            phoneNumber,
            messages.INVALID_PHONE_NUMBER(),
          );

          await context.whatsappService.sendMessage(
            phoneNumber,
            messages.COUNTERPART_PHONE_NUMBER_REQUEST(ticket.ownerType),
          );

          continue;
        }

        ticket.counterpartPhoneNumber = this.formatPhoneNumber(
          counterpartPhoneNumber,
        );

        // Update the user state.
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION,
        });

        // Send the confirmation options.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.COUNTERPART_PHONE_NUMBER_CONFIRMATION_REQUEST(
            ticket.ownerType,
            ticket.counterpartPhoneNumber,
          ),
          prefix.COUNTERPART_PHONE_NUMBER,
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
        !this.optionHasPrefix(selectedOption, prefix.COUNTERPART_PHONE_NUMBER)
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.COUNTERPART_PHONE_NUMBER}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.COUNTERPART_PHONE_NUMBER_CONFIRMATION_REQUEST(
            ticket.ownerType,
            ticket.counterpartPhoneNumber,
          ),
          prefix.COUNTERPART_PHONE_NUMBER,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.COUNTERPART_PHONE_NUMBER}-no`) {
        // TODO: Go to previous state.
        ticket.counterpartPhoneNumber = null;

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_COUNTERPART_PHONE_NUMBER,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.COUNTERPART_PHONE_NUMBER_REQUEST(ticket.ownerType),
        );

        continue;
      }

      // Save the user.
      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_COUNTERPART_EMAIL,
      });

      // TODO: Send the name confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.userPhoneNumberConfirmationSuccess,
      // );

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.COUNTERPART_EMAIL_REQUEST(ticket.ownerType),
      );
    }
  }
}
