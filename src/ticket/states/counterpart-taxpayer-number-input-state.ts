import { MessageState } from '../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class CounterpartTaxpayerNumberInputStateTaxpayerNumberInputState extends MessageState {
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
        const taxpayerNumber = message.text.body.replace(/\D/g, '');

        if (!this.isValidTaxpayerNumber(taxpayerNumber)) {
          await context.whatsappService.sendMessage(
            phoneNumber,
            messages.INVALID_TAXPAYER_NUMBER(),
          );

          await context.whatsappService.sendMessage(
            phoneNumber,
            messages.COUNTERPART_TAXPAYER_NUMBER_REQUEST(ticket.ownerType),
          );

          continue;
        }

        ticket.counterpartTaxpayerNumber =
          this.formatTaxpayerNumber(taxpayerNumber);

        // Update the user state.
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION,
        });

        // Send the confirmation options.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION_REQUEST(
            ticket.ownerType,
            user.taxpayerNumber,
          ),
          prefix.COUNTERPART_TAXPAYER_NUMBER,
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
          prefix.COUNTERPART_TAXPAYER_NUMBER,
        )
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.COUNTERPART_TAXPAYER_NUMBER}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION_REQUEST(
            ticket.ownerType,
            ticket.counterpartTaxpayerNumber,
          ),
          prefix.COUNTERPART_TAXPAYER_NUMBER,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.COUNTERPART_TAXPAYER_NUMBER}-no`) {
        // TODO: Go to previous state.
        ticket.counterpartTaxpayerNumber = null;

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_COUNTERPART_TAXPAYER_NUMBER,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.COUNTERPART_TAXPAYER_NUMBER_REQUEST(ticket.ownerType),
        );

        continue;
      }

      // Save the user.
      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_COUNTERPART_PHONE_NUMBER,
      });

      // TODO: Send the name confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.userTaxpayerNumberConfirmationSuccess,
      // );

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.COUNTERPART_PHONE_NUMBER_REQUEST(ticket.ownerType),
      );
    }
  }
}
