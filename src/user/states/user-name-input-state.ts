import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserState } from '../entities/user-state';

export class UserNameInputState extends MessageState {
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
          `O seu nome completo é ${fullName}?`,
          prefix.userFullName,
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
      if (!this.optionHasPrefix(selectedOption, prefix.userFullName)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.userFullName}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          `O seu nome completo é ${user.fullName}?`,
          prefix.userFullName,
        );

        continue;
      }

      if (selectedOption === `${prefix.dataPrivacy}-no`) {
        // TODO: Go to previous state.
        continue;
      }

      // TODO: Save the user data privacy confirmation.
      await context.userService.save({
        ...user,
        //dataPrivacyConfirmation: true,
        state: UserState.WAITING_PHONE_NUMBER,
      });

      // TODO: Go to next state.
      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.requestPhoneNumber,
      );
    }
  }
}
