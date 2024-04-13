import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { MessageState } from '../../whatsapp/states/message-state';
import { UserEntity } from '../entities/user.entity';
import { UserFullNameState } from './user-full-name.state';
import { UserState } from '../entities/user-state.enum';
import { formatPhoneNumber } from '../../shared/utils';

export class DataPrivacyAgreementState extends MessageState {
  public prefix = 'DATA_PRIVACY';

  public async onStateBegin(phoneNumber: string, user?: UserEntity) {
    // Update the user state.
    await this.userService.save({
      ...user,
      state: UserState.DATA_PRIVACY_CONFIRMATION,
    });

    // Send the data privacy message.
    await this.whatsAppService.sendConfirmationOptions(
      phoneNumber,
      messages.DATA_PRIVACY(),
      this.prefix,
      false,
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
      //
      if (message.type === 'text') {
        await this.onMessageProcessingError(phoneNumber);
        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
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

        await this.onMessageProcessingError(phoneNumber);
        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        // TODO: Go to previous state.
        continue;
      }
      // Send the data privacy confirmation success message.
      await this.whatsAppService.sendMessage(
        phoneNumber,
        messages.DATA_PRIVACY_ACCEPTED(),
      );

      this.nextState = new UserFullNameState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user);
    }
  }
}
