import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../whatsapp/states/message-state';
import { messages } from '../../whatsapp/entities/messages';
import { UserEntity } from '../entities/user.entity';
import { FirstTicketState } from '../../ticket/states/others/first-ticket.state';
import { WelcomeState } from './welcome.state';
import { UserState } from '../entities/user-state.enum';
import { formatPhoneNumber } from '../../shared/utils';

export class UserRegistrationCompleteState extends MessageState {
  public prefix = 'USER_REGISTRATION_COMPLETE';

  public async onStateBegin(phoneNumber: string, user?: UserEntity) {
    // Update the user state.
    await this.userService.save({
      ...user,
      state: UserState.REGISTRATION_COMPLETE,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.REGISTRATION_COMPLETE(),
    );

    this.nextState = new FirstTicketState();
    this.nextState.whatsAppService = this.whatsAppService;
    this.nextState.logger = this.logger;
    this.nextState.userService = this.userService;

    // go to the next state.
    await this.toNextState(phoneNumber, user);
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

        this.nextState = new WelcomeState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user);
        continue;
      }

      await this.onStateBegin(phoneNumber, user);
    }
  }
}
