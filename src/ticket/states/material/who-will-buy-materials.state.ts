import { UserEntity } from '../../../user/entities/user.entity';
import { TicketEntity } from '../../entities/ticket.entity';
import { TicketState } from '../../entities/ticket-state.enum';
import { messages } from '../../../whatsapp/entities/messages';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { formatPhoneNumber } from '../../../shared/utils';
import { MessageState } from '../../../whatsapp/states/message-state';
import { ContractParty } from '../../entities/contract-party.enum';
import { HowMaterialsWillBeBoughtState } from './how-materials-will-be-bought.state';

export class WhoWillBuyMaterialsState extends MessageState {
  public prefix = 'WHO_WILL_BUY_MATERIALS';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      state: TicketState.WHO_WILL_BUY_MATERIALS,
    });

    await this.whatsAppService.sendContractPartyOptions(
      phoneNumber,
      messages.MATERIALS_WHO_WILL_BUY_REQUEST(),
      this.prefix,
      true,
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

      if (message.type === 'text' && TicketState.WHO_WILL_BUY_MATERIALS) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendContractPartyOptions(
          phoneNumber,
          messages.MATERIALS_WHO_WILL_BUY_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.WHO_WILL_BUY_MATERIALS
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendContractPartyOptions(
          phoneNumber,
          messages.MATERIALS_WHO_WILL_BUY_REQUEST(),
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

        await this.whatsAppService.sendContractPartyOptions(
          phoneNumber,
          messages.MATERIALS_WHO_WILL_BUY_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-${ContractParty.OWNER}`) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          whoWillBuyTheMaterials: ContractParty.OWNER,
        });
      } else if (
        selectedOption === `${this.prefix}-${ContractParty.COUNTERPART}`
      ) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          whoWillBuyTheMaterials: ContractParty.COUNTERPART,
        });
      }

      this.nextState = new HowMaterialsWillBeBoughtState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user, ticket);
    }
  }
}
