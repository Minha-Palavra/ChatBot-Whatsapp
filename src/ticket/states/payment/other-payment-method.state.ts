import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../../whatsapp/states/message-state';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketState } from '../../entities/ticket-state.enum';
import { messages } from '../../../whatsapp/entities/messages';
import { PaymentDueDatesState } from './payment-due-dates.state';
import { UserEntity } from '../../../user/entities/user.entity';

export class OtherPaymentMethodState extends MessageState {
  public prefix = 'OTHER_PAYMENT_METHOD';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      paymentMethod: null,
      state: TicketState.OTHER_PAYMENT_METHOD_DESCRIPTION,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.OTHER_PAYMENT_METHOD_REQUEST(),
    );
  }

  public async processMessages(value: ValueObject): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);
    const ticket: TicketEntity =
      await this.whatsAppService.ticketService.findUserNewestTicket(user);

    // If the user is not registered, do nothing.
    if (!user) {
      this.logger.error('User not found.');
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = formatPhoneNumber(message.from);

      if (
        message.type === 'text' &&
        ticket.state === TicketState.OTHER_PAYMENT_METHOD_DESCRIPTION
      ) {
        ticket.paymentMethod = message.text.body;

        // Update the user state.
        await this.whatsAppService.ticketService.save({
          ...ticket,
          state: TicketState.OTHER_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION,
        });

        if (!ticket.paymentMethod) {
          await this.onMessageProcessingError(phoneNumber);
          continue;
        }

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.OTHER_PAYMENT_METHOD_CONFIRMATION_REQUEST(
            ticket.paymentMethod,
          ),
          this.prefix,
          true,
        );
        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.OTHER_PAYMENT_METHOD_DESCRIPTION
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.OTHER_PAYMENT_METHOD_CONFIRMATION_REQUEST(
            ticket.paymentMethod,
          ),
          this.prefix,
          true,
        );
        continue;
      }

      if (!ticket.paymentMethod) {
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
          messages.OTHER_PAYMENT_METHOD_CONFIRMATION_REQUEST(
            ticket.paymentMethod,
          ),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        await this.onStateBegin(phoneNumber, user, ticket);
      } else if (selectedOption === `${this.prefix}-YES`) {
        this.nextState = new PaymentDueDatesState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        // Send the confirmation options again.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.OTHER_PAYMENT_METHOD_CONFIRMATION_REQUEST(
            ticket.paymentMethod,
          ),
          this.prefix,
          true,
        );
      }
    }
  }
}
