import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../../whatsapp/states/message-state';
import { TicketEntity } from '../../entities/ticket.entity';
import { messages } from '../../../whatsapp/entities/messages';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketState } from '../../entities/ticket-state.enum';
import { UserEntity } from '../../../user/entities/user.entity';
import { PaymentDueDatesState } from './payment-due-dates.state';
import { OtherInCashPaymentMethodState } from './other-in-cash-payment-method.state';

export class InCashPaymentMethodState extends MessageState {
  public prefix = 'IN_CASH_METHOD';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      paymentMethod: null,
      state: TicketState.IN_CASH_PAYMENT_METHOD,
    });

    await this.whatsAppService.sendPaymentInCashOptions(
      phoneNumber,
      messages.IN_CASH_PAYMENT_METHOD_REQUEST(),
      this.prefix,
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
        ticket.state === TicketState.IN_CASH_PAYMENT_METHOD
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendPaymentInCashOptions(
          phoneNumber,
          messages.IN_CASH_PAYMENT_METHOD_REQUEST(),
          this.prefix,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.IN_CASH_PAYMENT_METHOD
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendPaymentInCashOptions(
          phoneNumber,
          messages.IN_CASH_PAYMENT_METHOD_REQUEST(),
          this.prefix,
        );
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

        await this.whatsAppService.sendPaymentInCashOptions(
          phoneNumber,
          messages.IN_CASH_PAYMENT_METHOD_REQUEST(),
          this.prefix,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-CASH`) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          paymentMethod: 'Dinheiro',
        });

        this.nextState = new PaymentDueDatesState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else if (
        //
        selectedOption === `${this.prefix}-PIX`
      ) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          paymentMethod: 'PIX',
        });

        this.nextState = new PaymentDueDatesState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else if (selectedOption === `${this.prefix}-OTHER`) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          paymentMethod: 'Outros',
        });

        this.nextState = new OtherInCashPaymentMethodState();
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

        await this.whatsAppService.sendPaymentInCashOptions(
          phoneNumber,
          messages.IN_CASH_PAYMENT_METHOD_REQUEST(),
          this.prefix,
        );
      }
    }
  }
}
