import { formatPhoneNumber } from '../../../shared/utils';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../../whatsapp/states/message-state';
import { TicketEntity } from '../../entities/ticket.entity';
import { TicketState } from '../../entities/ticket-state.enum';
import { messages } from '../../../whatsapp/entities/messages';
import { prefix } from '../../../whatsapp/entities/prefix';
import { UserEntity } from '../../../user/entities/user.entity';
import { MaterialsArePartOfContractState } from '../material/materials-are-part-of-contract.state';

export class PaymentDueDatesState extends MessageState {
  public prefix = 'PAYMENT_DUE_DATES';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      paymentDueDates: null,
      state: TicketState.PAYMENT_DUE_DATES,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.PAYMENT_DUE_DATES_REQUEST(),
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
        ticket.state === TicketState.PAYMENT_DUE_DATES
      ) {
        ticket.paymentDueDates = message.text.body;

        // Update the user state.
        await this.whatsAppService.ticketService.save({
          ...ticket,
          state: TicketState.PAYMENT_DUE_DATES_CONFIRMATION,
        });

        if (!ticket.paymentDueDates) {
          await this.onMessageProcessingError(phoneNumber);
          continue;
        }

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_DATES_CONFIRMATION_REQUEST(
            ticket.paymentDueDates,
          ),
          prefix.SERVICE_PAYMENT_DATES,
          true,
        );
        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.PAYMENT_DUE_DATES_CONFIRMATION
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_DATES_CONFIRMATION_REQUEST(
            ticket.paymentDueDates,
          ),
          prefix.SERVICE_PAYMENT_DATES,
          true,
        );
        continue;
      }

      if (!ticket.paymentDueDates) {
        await this.onMessageProcessingError(phoneNumber);
        continue;
      }

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        this.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (
        !this.optionHasValidPrefix(selectedOption, prefix.SERVICE_PAYMENT_DATES)
      ) {
        this.logger.error(
          `${selectedOption} is not a valid option for ${prefix.SERVICE_PAYMENT_DATES}.`,
        );

        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        // Send the confirmation options again.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_PAYMENT_DATES_CONFIRMATION_REQUEST(
            ticket.paymentDueDates,
          ),
          prefix.SERVICE_PAYMENT_DATES,
          true,
        );

        continue;
      }

      if (selectedOption === `${prefix.SERVICE_PAYMENT_DATES}-NO`) {
        await this.onStateBegin(phoneNumber, user, ticket);
      } else if (selectedOption === `${prefix.SERVICE_PAYMENT_DATES}-YES`) {
        this.nextState = new MaterialsArePartOfContractState();
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
          messages.SERVICE_PAYMENT_DATES_CONFIRMATION_REQUEST(
            ticket.paymentDueDates,
          ),
          prefix.SERVICE_PAYMENT_DATES,
          true,
        );
      }
    }
  }
}
