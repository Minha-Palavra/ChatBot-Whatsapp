import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../../whatsapp/states/message-state';
import { TicketEntity } from '../../entities/ticket.entity';
import { TicketState } from '../../entities/ticket-state.enum';
import { messages } from '../../../whatsapp/entities/messages';
import { formatPhoneNumber } from '../../../shared/utils';
import { PaymentMethodState } from './payment-method.state';
import { UserEntity } from '../../../user/entities/user.entity';

export class PaymentAmountState extends MessageState {
  public prefix = 'PAYMENT_AMOUNT';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      paymentAmount: null,
      state: TicketState.PAYMENT_AMOUNT,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.PAYMENT_AMOUNT_REQUEST(),
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
        ticket.state === TicketState.PAYMENT_AMOUNT
      ) {
        ticket.paymentAmount = message.text.body;

        // Update the user state.
        await this.whatsAppService.ticketService.save({
          ...ticket,
          state: TicketState.PAYMENT_AMOUNT_CONFIRMATION,
        });

        if (!ticket.paymentAmount) {
          await this.onMessageProcessingError(phoneNumber);
          continue;
        }

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.PAYMENT_AMOUNT_CONFIRMATION_REQUEST(ticket.paymentAmount),
          this.prefix,
          true,
        );
        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.PAYMENT_AMOUNT_CONFIRMATION
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.PAYMENT_AMOUNT_CONFIRMATION_REQUEST(ticket.paymentAmount),
          this.prefix,
          true,
        );
        continue;
      }

      if (!ticket.paymentAmount) {
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
          messages.PAYMENT_AMOUNT_CONFIRMATION_REQUEST(ticket.paymentAmount),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        await this.onStateBegin(phoneNumber, user, ticket);
      } else if (selectedOption === `${this.prefix}-YES`) {
        this.nextState = new PaymentMethodState();
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

        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.PAYMENT_AMOUNT_CONFIRMATION_REQUEST(ticket.paymentAmount),
          this.prefix,
          true,
        );
      }
    }
  }
}
