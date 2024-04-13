import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../../whatsapp/states/message-state';
import { TicketEntity } from '../../entities/ticket.entity';
import { messages } from '../../../whatsapp/entities/messages';
import { TicketState } from '../../entities/ticket-state.enum';
import { UserEntity } from '../../../user/entities/user.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { OtherPaymentMethodState } from './other-payment-method.state';
import { InCashPaymentMethodState } from './in-cash-payment-method.state';
import { InInstallmentsPaymentMethodState } from './in-installments-payment-method.state';

export class PaymentMethodState extends MessageState {
  public prefix = 'PAYMENT_METHOD';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      paymentMethod: null,
      state: TicketState.PAYMENT_METHOD,
    });

    await this.whatsAppService.sendPaymentMethodsOptions(
      phoneNumber,
      messages.PAYMENT_METHOD_REQUEST(),
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
        ticket.state === TicketState.PAYMENT_METHOD
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendPaymentMethodsOptions(
          phoneNumber,
          messages.PAYMENT_METHOD_REQUEST(),
          this.prefix,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.PAYMENT_METHOD
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendPaymentMethodsOptions(
          phoneNumber,
          messages.PAYMENT_METHOD_REQUEST(),
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

        await this.whatsAppService.sendPaymentMethodsOptions(
          phoneNumber,
          messages.PAYMENT_METHOD_REQUEST(),
          this.prefix,
        );
        continue;
      }

      if (selectedOption === `${this.prefix}-IN-CASH`) {
        this.nextState = new InCashPaymentMethodState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else if (
        //
        selectedOption === `${this.prefix}-IN-INSTALLMENTS`
      ) {
        this.nextState = new InInstallmentsPaymentMethodState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else if (selectedOption === `${this.prefix}-OTHER`) {
        this.nextState = new OtherPaymentMethodState();
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

        await this.whatsAppService.sendPaymentMethodsOptions(
          phoneNumber,
          messages.PAYMENT_METHOD_REQUEST(),
          this.prefix,
        );
      }
    }
  }
}
