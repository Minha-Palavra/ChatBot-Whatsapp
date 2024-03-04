import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserState } from '../entities/user-state';

export class UserRegistrationInitialState extends MessageState {
  public async processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void> {
    const contact = value.contacts[0];

    // Iterate over the messages.
    for (const message of value.messages) {
      // Get the phone number from the message.
      const phoneNumber = this.formatPhoneNumber(message.from);

      // Check if the user is already registered.
      let user = await context.userService.findOneByWhatsappId(contact.wa_id);

      // If the user is not registered, create a new user.
      if (!user) {
        user = await context.userService.save({
          whatsappId: contact.wa_id,
          phoneNumber: phoneNumber,
          state: UserState.REGISTRATION_INITIAL,
        });
      }

      // Send the welcome message.
      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.WELCOME(),
      );

      // Send the data privacy confirmation message.
      await context.whatsappService.sendConfirmationOptions(
        phoneNumber,
        messages.DATA_PRIVACY(),
        prefix.DATA_PRIVACY,
        false,
      );

      // Update the user state.
      await context.userService.save({
        ...user,
        state: UserState.DATA_PRIVACY_CONFIRMATION,
      });
    }
  }
}
