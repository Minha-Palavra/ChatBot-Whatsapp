import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { TicketState } from '../entities/ticket-state';
import { TicketEntity } from '../entities/ticket.entity';

export class MaterialsWhoWillPayState extends MessageState {
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

        await context.whatsappService.sendContextOptions(
          phoneNumber,
          messages.MATERIAL_WHO_PAY_REQUEST(),
          prefix.MATERIAL_WHO_WILL_PAY,
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
        !this.contextOptionHasPrefix(
          selectedOption,
          prefix.MATERIAL_WHO_WILL_PAY,
        )
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.MATERIAL_WHO_WILL_PAY}.`,
        );

        await context.whatsappService.sendContextOptions(
          phoneNumber,
          messages.MATERIAL_WHO_PAY_REQUEST(),
          prefix.MATERIAL_WHO_WILL_PAY,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.MATERIAL_WHO_WILL_PAY}-provider`) {
        // TODO: Go to previous state.

        await context.whatsappService.ticketService.save({
          ...ticket,
          whoWillPayForTheMaterials: 'provider',
          state: TicketState.WAITING_SERVICE_MATERIAL_DATE,
        });
      } else if (
        selectedOption === `${prefix.MATERIAL_WHO_WILL_PAY}-customer`
      ) {
        await context.whatsappService.ticketService.save({
          ...ticket,
          whoWillPayForTheMaterials: 'customer',
          state: TicketState.WAITING_SERVICE_MATERIAL_DATE,
        });
      }

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.SERVICE_MATERIAL_DATE_REQUEST(),
      );

      continue;
    }
  }
}
