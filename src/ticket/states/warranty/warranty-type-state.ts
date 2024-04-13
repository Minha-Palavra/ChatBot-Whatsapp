import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { TicketEntity } from '../../entities/ticket.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { JudicialResolutionDetailsState } from './judicial-resolution-details-state';
import { WarrantyDetailsState } from './warranty-details-state';
import { TicketState } from '../../entities/ticket-state.enum';

export class WarrantyTypeState extends MessageState {
  public prefix = 'WARRANTY_TYPE';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      state: TicketState.WARRANTY_TYPE,
    });

    await this.whatsAppService.sendWarrantyOptions(
      phoneNumber,
      messages.WARRANTY_TYPE_REQUEST(),
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
        ticket.state === TicketState.WARRANTY_TYPE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendWarrantyOptions(
          phoneNumber,
          messages.WARRANTY_TYPE_REQUEST(),
          this.prefix,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.WARRANTY_TYPE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        await this.whatsAppService.sendWarrantyOptions(
          phoneNumber,
          messages.WARRANTY_TYPE_REQUEST(),
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

        // Send the confirmation options again.
        await this.whatsAppService.sendWarrantyOptions(
          phoneNumber,
          messages.WARRANTY_TYPE_REQUEST(),
          this.prefix,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-TOTAL`) {
        //
        ticket.serviceWarranty = 'total';
        await this.whatsAppService.ticketService.save({
          ...ticket,
        });
        this.nextState = new WarrantyDetailsState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else if (selectedOption === `${this.prefix}-PARCIAL`) {
        //
        ticket.serviceWarranty = 'parcial';

        await this.whatsAppService.ticketService.save({
          ...ticket,
        });
        this.nextState = new WarrantyDetailsState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, user, ticket);
      } else if (selectedOption === `${this.prefix}-NONE`) {
        //
        ticket.serviceWarranty = 'nenhuma';
        await this.whatsAppService.ticketService.save({
          ...ticket,
        });
        this.nextState = new JudicialResolutionDetailsState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        await this.toNextState(phoneNumber, user, ticket);
      } else {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        // Send the confirmation options again.
        await this.whatsAppService.sendWarrantyOptions(
          phoneNumber,
          messages.WARRANTY_TYPE_REQUEST(),
          this.prefix,
        );
      }
    }
  }
}
