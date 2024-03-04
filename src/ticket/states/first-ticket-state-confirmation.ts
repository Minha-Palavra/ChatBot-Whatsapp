import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserState } from '../../user/entities/user-state';

export class FirstTicketStateConfirmation extends MessageState {
  public async processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await context.userService.findOneByWhatsappId(contact.wa_id);

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
          messages.FIRST_TICKET_CONFIRMATION(),
          prefix.FIRST_TICKET_CONFIRMATION,
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
      if (!this.optionHasPrefix(selectedOption, prefix.FIRST_TICKET_CONFIRMATION)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.FIRST_TICKET_CONFIRMATION}.`,
        );

        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.DATA_PRIVACY(),
          prefix.DATA_PRIVACY,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.FIRST_TICKET_CONFIRMATION}-no`) {
        // TODO: Go to previous state.
        continue;
      }

      // TODO: Send the data privacy confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.DATA_PRIVACY_ACCEPTED(),
      // );

      // TODO: Go to next state.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.USER_NAME_REQUEST(),
      // );
    }
  }
}
