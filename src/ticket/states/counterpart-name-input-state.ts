import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { UserState } from '../../user/entities/user-state';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';

export class CounterpartNameInputState extends MessageState {
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
        const fullName = message.text.body;

        user.fullName = fullName;

        // Update the user state.
        await context.userService.save({
          ...user,
          state: UserState.WAITING_NAME_CONFIRMATION,
        });

        // Send the confirmation options.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_FULL_NAME_CONFIRMATION_REQUEST(fullName),
          prefix.USER_FULL_NAME,
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
      if (!this.optionHasPrefix(selectedOption, prefix.USER_FULL_NAME)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.USER_FULL_NAME}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_FULL_NAME_CONFIRMATION_REQUEST(user.fullName),
          prefix.USER_FULL_NAME,
        );

        continue;
      }

      if (selectedOption === `${prefix.DATA_PRIVACY}-no`) {
        // TODO: Go to previous state.
        user.fullName = null;

        await context.userService.save({
          ...user,
          state: UserState.WAITING_NAME,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.USER_NAME_REQUEST(),
        );

        continue;
      }

      // Save the user.
      await context.userService.save({
        ...user,
        state: UserState.WAITING_TAXPAYER_NUMBER,
      });

      // TODO: Send the name confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.userFullNameConfirmationSuccess,
      // );

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.USER_TAXPAYER_NUMBER_REQUEST(),
      );
    }
  }
}
