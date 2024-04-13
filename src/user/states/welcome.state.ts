import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../whatsapp/states/message-state';
import { messages } from '../../whatsapp/entities/messages';
import { DataPrivacyAgreementState } from './data-privacy-agreement.state';
import { UserState } from '../entities/user-state.enum';
import { formatPhoneNumber } from '../../shared/utils';

export class WelcomeState extends MessageState {
  public prefix = 'WELCOME';

  public async onStateBegin() {
    // ticket?: TicketEntity, // user?: UserEntity, // phoneNumber: string,
    // Send the welcome message.
    // await this.whatsAppService.sendMessage(phoneNumber);
  }

  public async processMessages(value: ValueObject): Promise<void> {
    const contact = value.contacts[0];

    // Iterate over the messages.
    for (const message of value.messages) {
      // Get the phone number from the message.
      const phoneNumber = formatPhoneNumber(message.from);

      // Check if the user is already registered.
      let user = await this.userService.findOneByWhatsappId(contact.wa_id);

      // If the user is not registered, create a new user.
      if (!user) {
        user = await this.userService.save({
          whatsappId: contact.wa_id,
          phoneNumber: phoneNumber,
          state: UserState.REGISTRATION_INITIAL,
        });
      }

      // Send the welcome message.
      await this.whatsAppService.sendMessage(phoneNumber, messages.WELCOME());

      this.nextState = new DataPrivacyAgreementState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user);
    }
  }
}
