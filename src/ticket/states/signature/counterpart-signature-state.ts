import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { formatPhoneNumber } from '../../../shared/utils';
import { messages } from '../../../whatsapp/entities/messages';
import { TicketState } from '../../entities/ticket-state.enum';
import { TicketEntity } from '../../entities/ticket.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { ContractParty } from '../../entities/contract-party.enum';
import { HasRejectedByCounterpartState } from './has-rejected-by-counterpart-state';
import { ContractWasCompletedState } from '../others/contract-was-completed.state.';

export class CounterpartSignatureState extends MessageState {
  public prefix = 'CONTRACT_COUNTERPART_SIGNATURE';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    await this.whatsAppService.ticketService.save({
      ...ticket,
      signedByCounterpart: null,
      signedByCounterpartAt: null,
      state: TicketState.COUNTERPART_SIGNATURE,
      awaitingResponseFrom: ContractParty.COUNTERPART,
    });

    await this.whatsAppService.sendMessage(
      ticket.counterpartPhoneNumber,
      messages.CONTRACT_SIGNATURE_REQUEST(ticket.owner.fullName),
    );
    await this.whatsAppService.sendTemplate(
      ticket.counterpartPhoneNumber,
      'envio_contrato ',
      {
        type: 'text',
        text: ticket.owner.fullName,
      },
    );

    await this.whatsAppService.sendMessage(
      ticket.counterpartPhoneNumber,
      ticket.contract,
    );
    //
    await this.whatsAppService.sendConfirmationOptions(
      ticket.counterpartPhoneNumber,
      messages.COUNTERPART_SIGNATURE_REQUEST(),
      this.prefix,
      true,
    );

    await this.whatsAppService.sendMessage(
      ticket.owner.phoneNumber,
      messages.CONTRACT_HAS_SENT_TO_COUNTERPART(ticket.counterpartName),
    );
  }

  public async processMessages(value: ValueObject): Promise<void> {
    // const contact = value.contacts[0];

    // Get the user from the database.
    // const user = await this.userService.findOneByWhatsappId(contact.wa_id);
    // TODO
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
        ticket.state === TicketState.COUNTERPART_SIGNATURE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_SIGNATURE_REQUEST(ticket.owner.fullName),
        );

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          ticket.contract,
        );

        await this.whatsAppService.sendConfirmationOptions(
          ticket.counterpartPhoneNumber,
          messages.COUNTERPART_SIGNATURE_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.COUNTERPART_SIGNATURE
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_SIGNATURE_REQUEST(ticket.owner.fullName),
        );

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          ticket.contract,
        );

        await this.whatsAppService.sendConfirmationOptions(
          ticket.counterpartPhoneNumber,
          messages.COUNTERPART_SIGNATURE_REQUEST(),
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

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_SIGNATURE_REQUEST(ticket.owner.fullName),
        );

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          ticket.contract,
        );

        await this.whatsAppService.sendConfirmationOptions(
          ticket.counterpartPhoneNumber,
          messages.COUNTERPART_SIGNATURE_REQUEST(),
          this.prefix,
          true,
        );

        continue;
      }

      if (selectedOption === `${this.prefix}-NO`) {
        this.nextState = new HasRejectedByCounterpartState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, null, ticket);
      } else if (selectedOption === `${this.prefix}-YES`) {
        await this.whatsAppService.ticketService.save({
          ...ticket,
          signedByCounterpart: true,
          signedByCounterpartAt: new Date(),
          contractHasRejectedByCounterpartDescription: null,
        });

        this.nextState = new ContractWasCompletedState();
        this.nextState.whatsAppService = this.whatsAppService;
        this.nextState.logger = this.logger;
        this.nextState.userService = this.userService;

        // go to the next state.
        await this.toNextState(phoneNumber, null, ticket);
      } else {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_SIGNATURE_REQUEST(ticket.owner.fullName),
        );

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          ticket.contract,
        );

        await this.whatsAppService.sendConfirmationOptions(
          ticket.counterpartPhoneNumber,
          messages.COUNTERPART_SIGNATURE_REQUEST(),
          this.prefix,
          true,
        );
      }
    }
  }
}
