import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserState } from '../entities/user-state';

export class UserAddressInputState extends MessageState {
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
        const address = message.text.body;

        user.address = address;

        // Update the user state.
        await context.userService.save({
          ...user,
          state: UserState.WAITING_ADDRESS_CONFIRMATION,
        });

        // Send the confirmation options.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_ADDRESS_CONFIRMATION_REQUEST(address),
          prefix.USER_ADDRESS,
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
      if (!this.optionHasPrefix(selectedOption, prefix.USER_ADDRESS)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.USER_ADDRESS}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_ADDRESS_CONFIRMATION_REQUEST(user.address),
          prefix.USER_ADDRESS,
        );

        continue;
      }

      if (selectedOption === `${prefix.USER_ADDRESS}-no`) {
        // TODO: Go to previous state.
        user.address = null;

        await context.userService.save({
          ...user,
          state: UserState.WAITING_ADDRESS,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.USER_ADDRESS_REQUEST(),
        );

        continue;
      }

      // Save the user.
      await context.userService.save({
        ...user,
        state: UserState.REGISTRATION_COMPLETE,
      });

      // TODO: Send the address confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.,
      // );

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.USER_TAXPAYER_NUMBER_REQUEST(),
      );
    }
  }
}
