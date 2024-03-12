import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class ServicePaymentMethodState extends MessageState {
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

        await context.whatsappService.sendPaymentMethodsOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_METHOD_REQUEST(),
          prefix.SERVICE_PAYMENT_METHOD,
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
        !this.paymentMethodOptionHasPrefix(
          selectedOption,
          prefix.SERVICE_PAYMENT_METHOD,
        )
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.SERVICE_PAYMENT_METHOD}.`,
        );

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await context.whatsappService.sendPaymentMethodsOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_METHOD_REQUEST(),
          prefix.SERVICE_PAYMENT_METHOD,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.SERVICE_PAYMENT_METHOD}-in-cash`) {
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_PAYMENT_IN_CASH_METHOD,
        });

        await context.whatsappService.sendPaymentInCashOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_DATES_REQUEST(),
          prefix.SERVICE_PAYMENT_IN_CASH_METHOD,
        );

        continue;
      } else if (
        //
        selectedOption === `${prefix.SERVICE_PAYMENT_METHOD}-installments`
      ) {
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_PAYMENT_IN_INSTALLMENTS_METHOD,
        });

        await context.whatsappService.sendPaymentInInstallmentsOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_DATES_REQUEST(),
          prefix.SERVICE_PAYMENT_IN_INSTALLMENTS_METHOD,
        );

        continue;
      } else if (selectedOption === `${prefix.SERVICE_PAYMENT_METHOD}-others`) {
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_PAYMENT_OTHERS_METHOD,
        });

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_PAYMENT_METHOD,
        });

        continue;
      } else {
        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await context.whatsappService.sendPaymentMethodsOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_METHOD_REQUEST(),
          prefix.SERVICE_PAYMENT_METHOD,
          false,
        );

        continue;
      }
    }
  }
}
