import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserState } from '../entities/user-state';

export class UserDataPrivacyConfirmationState extends MessageState {
  public async processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await context.userService.findOneByWhatsappId(contact.wa_id);

    // If the user is not registered, do nothing.
    if (!user) {
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = this.formatPhoneNumber(message.from);

      if (message.type === 'text') {
        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.invalidOption,
        );

        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.dataPrivacy,
          prefix.dataPrivacy,
          false,
        );

        continue;
      }

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        // this.context.logger.error('message.interactive.type is not ListReplyObject');
        context.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (!this.optionHasPrefix(selectedOption, prefix.dataPrivacy)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.dataPrivacy}.`,
        );

        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.dataPrivacy,
          prefix.dataPrivacy,
          false,
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
        state: UserState.WAITING_NAME,
      });

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.dataPrivacyConfirmationSuccess,
      );

      // TODO: Go to next state.
      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.requestName,
      );
    }
  }
}
