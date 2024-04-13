import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserEntity } from '../entities/user.entity';
import { UserRegistrationCompleteState } from './user-registration-complete.state';
import { UserState } from '../entities/user-state.enum';
import { formatPhoneNumber } from '../../shared/utils';

export class UserAddressState extends MessageState {
  public prefix = 'USER_ADDRESS';

  public async onStateBegin(phoneNumber: string, user?: UserEntity) {
    // Update the user state.
    await this.userService.save({
      ...user,

      state: UserState.ADDRESS,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.USER_ADDRESS_REQUEST(),
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

      if (message.type === 'text' && user.state === UserState.ADDRESS) {
        const address = message.text.body;

        user.address = address;

        // Update the user state.
        await this.userService.save({
          ...user,
          state: UserState.ADDRESS_CONFIRMATION,
        });

        if (!user.address) {
          await this.onMessageProcessingError(phoneNumber);
          continue;
        }

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_ADDRESS_CONFIRMATION_REQUEST(address),
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
          messages.USER_ADDRESS_CONFIRMATION_REQUEST(user.address),
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
        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.USER_ADDRESS_CONFIRMATION_REQUEST(user.address),
          this.prefix,
          false,
        );
        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        user.address = null;

        await this.onStateBegin(phoneNumber, user);
        continue;
      }

      this.nextState = new UserRegistrationCompleteState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user);
    }
  }
}
