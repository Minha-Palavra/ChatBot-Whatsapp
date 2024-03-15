import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class ServiceDeliveryDescriptionState extends MessageState {
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
        const serviceDeliveryDescription = message.text.body;

        ticket.serviceDeliveryDescription = serviceDeliveryDescription;

        // Update the user state.
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_DELIVERY_CONFIRMATION,
        });

        // Send the confirmation options.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_DELIVERY_DESCRIPTION_CONFIRMATION_REQUEST(),
          prefix.SERVICE_DELIVERY_DESCRIPTION,
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
          prefix.SERVICE_DELIVERY_DESCRIPTION,
        )
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.SERVICE_DELIVERY_DESCRIPTION}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_DELIVERY_DESCRIPTION_CONFIRMATION_REQUEST(),
          prefix.SERVICE_DELIVERY_DESCRIPTION,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.SERVICE_DELIVERY_DESCRIPTION}-no`) {
        // TODO: Go to previous state.
        ticket.serviceDeliveryDescription = null;

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_DELIVERY,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.SERVICE_DELIVERY_REQUEST(),
        );

        continue;
      }

      // Save the user.
      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_SERVICE_PAYMENT_AMOUNT,
      });

      // TODO: Send the name confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.userPhoneNumberConfirmationSuccess,
      // );

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.SERVICE_PAYMENT_AMOUNT_REQUEST(),
      );
    }
  }
}
