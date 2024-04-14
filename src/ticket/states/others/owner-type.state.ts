import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { TicketEntity } from '../../entities/ticket.entity';
import { OwnerType } from '../../entities/owner-type';
import { UserEntity } from '../../../user/entities/user.entity';
import { TicketState } from '../../entities/ticket-state.enum';
import { formatPhoneNumber } from '../../../shared/utils';
import { CounterpartNameState } from '../counterpart/counterpart-name.state';
import { ContractParty } from '../../entities/contract-party.enum';

export class OwnerTypeState extends MessageState {
  public prefix = 'OWNER-TYPE';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      ownerType: OwnerType.NONE,
      state: TicketState.OWNER_TYPE,
      awaitingResponseFrom: ContractParty.OWNER,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.TICKET_START(),
    );

    await this.whatsAppService.sendContractPartyOptions(
      phoneNumber,
      messages.TICKET_OWNER_TYPE_REQUEST(),
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

      if (message.type === 'text') {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendContractPartyOptions(
          phoneNumber,
          messages.TICKET_OWNER_TYPE_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.OWNER_TYPE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendContractPartyOptions(
          phoneNumber,
          messages.TICKET_OWNER_TYPE_REQUEST(),
          this.prefix,
          true,
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
        // Send the confirmation options.
        await this.whatsAppService.sendContractPartyOptions(
          phoneNumber,
          messages.TICKET_OWNER_TYPE_REQUEST(),
          this.prefix,
          true,
        );
        continue;
      }

      if (selectedOption === `${this.prefix}-PROVIDER`) {
        //
        ticket.ownerType = OwnerType.SERVICE_PROVIDER;

        await this.whatsAppService.ticketService.save({
          ...ticket,
          ownerType: OwnerType.SERVICE_PROVIDER,
        });
      } else if (selectedOption === `${this.prefix}-CUSTOMER`) {
        //
        ticket.ownerType = OwnerType.CUSTOMER;

        await this.whatsAppService.ticketService.save({
          ...ticket,
          ownerType: OwnerType.CUSTOMER,
        });
      } else {
        await this.onStateBegin(phoneNumber, user);
        continue;
      }

      this.nextState = new CounterpartNameState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user, ticket);
    }
  }
}
