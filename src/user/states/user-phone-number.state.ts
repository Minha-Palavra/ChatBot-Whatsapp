import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserEntity } from '../entities/user.entity';
import { UserAddressState } from './user-address.state';
import { UserState } from '../entities/user-state.enum';
import { formatPhoneNumber } from '../../shared/utils';

export class UserPhoneNumberState extends MessageState {
  public prefix = 'USER_PHONE_NUMBER';

  public async onStateBegin(phoneNumber: string, user?: UserEntity) {
    // Update the user state.
    await this.userService.save({
      ...user,

      state: UserState.PHONE_NUMBER,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.USER_PHONE_NUMBER_REQUEST(),
    );
  }

  public async processMessages(value: ValueObject): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);

    // If the user is not registered, do nothing.
    if (!user) {
      this.logger.error('User not found.');
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = formatPhoneNumber(message.from);

      if (message.type === 'text' && user.state === UserState.PHONE_NUMBER) {
        const phoneNumber = message.text.body.replace(/\D/g, '');

        if (!this.isValidPhoneNumber(phoneNumber)) {
          await this.whatsAppService.sendMessage(
            phoneNumber,
            messages.INVALID_PHONE_NUMBER(),
          );

          await this.onStateBegin(phoneNumber, user);
          continue;
        }

        user.phoneNumber = formatPhoneNumber(phoneNumber);

        // Update the user state.
        await this.userService.save({
          ...user,
          state: UserState.PHONE_NUMBER_CONFIRMATION,
        });

        if (!user.phoneNumber) {
          await this.onMessageProcessingError(phoneNumber);
          continue;
        }

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_PHONE_NUMBER_CONFIRMATION_REQUEST(user.phoneNumber),
          this.prefix,
          false,
        );
        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_PHONE_NUMBER_CONFIRMATION_REQUEST(user.phoneNumber),
          this.prefix,
          false,
        );
        continue;
      }

      if (!user.phoneNumber) {
        await this.onMessageProcessingError(phoneNumber);
        continue;
      }

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        this.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (!this.optionHasValidPrefix(selectedOption, this.prefix)) {
        this.logger.error(
          `${selectedOption} is not a valid option for ${this.prefix}.`,
        );

        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        // Send the confirmation options again.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_PHONE_NUMBER_CONFIRMATION_REQUEST(user.phoneNumber),
          this.prefix,
          false,
        );
        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        user.phoneNumber = null;

        await this.onStateBegin(phoneNumber, user);
        continue;
      }

      this.nextState = new UserAddressState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user);
    }
  }
}
