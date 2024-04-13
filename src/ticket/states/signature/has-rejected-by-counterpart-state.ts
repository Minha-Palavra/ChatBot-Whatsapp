import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';

import { TicketState } from '../../entities/ticket-state.enum';
import { messages } from '../../../whatsapp/entities/messages';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketEntity } from '../../entities/ticket.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { ContractParty } from '../../entities/contract-party.enum';
import { ContractCorrectionState } from './contract-correction-state';

export class HasRejectedByCounterpartState extends MessageState {
  public prefix = 'HAS_REJECTED_BY_COUNTERPART_DESCRIPTION';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    await this.whatsAppService.ticketService.save({
      ...ticket,
      contractHasRejectedByCounterpartDescription: null,
      state: TicketState.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_REQUEST(),
    );
  }

  public async processMessages(value: ValueObject): Promise<void> {
    // const contact = value.contacts[0];

    // Get the user from the database.
    // const user = await this.userService.findOneByWhatsappId(contact.wa_id);
    //TODO
    const ticket: TicketEntity =
      await this.whatsAppService.ticketService.findUserNewestOpenTicketAsCounterpartByPhoneNumber(
        value.messages[0].from,
      );

    // If the user is not registered, do nothing.
    // if (!user) {
    //   this.logger.error('User not found.');
    //   return;
    // }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = formatPhoneNumber(message.from);

      if (
        message.type === 'text' &&
        ticket.state ===
          TicketState.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION
      ) {
        ticket.contractHasRejectedByCounterpartDescription = message.text.body;

        // Update the user state.
        await this.whatsAppService.ticketService.save({
          ...ticket,
          state: TicketState.CONTRACT_HAS_REJECTED_BY_COUNTERPART_CONFIRMATION,
        });
        if (!ticket.contractHasRejectedByCounterpartDescription) {
          await this.onMessageProcessingError(phoneNumber);
          continue;
        }

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_CONFIRMATION_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        // Send the confirmation options.
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_CONFIRMATION_REQUEST(),
          this.prefix,
          true,
        );
        continue;
      }

      if (!ticket.contractHasRejectedByCounterpartDescription) {
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
          messages.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_CONFIRMATION_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        await this.onStateBegin(phoneNumber, null, ticket);
      } else if (selectedOption === `${this.prefix}-YES`) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          awaitingResponseFrom: ContractParty.OWNER,
        });

        this.nextState = new ContractCorrectionState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, null, ticket);
        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          `Informamos que a solicitação de correção do contrato foi enviada ao contratante. Aguarde a resposta.`,
        );
      } else {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        await this.whatsAppService.sendConfirmationOptions(
          phoneNumber,
          messages.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_CONFIRMATION_REQUEST(),
          this.prefix,
          true,
        );
      }
    }
  }
}
