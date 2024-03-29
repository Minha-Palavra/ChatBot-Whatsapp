import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { MessageState } from '../../whatsapp/states/message-state';
import { TicketState } from '../entities/ticket-state';
import { TicketEntity } from '../entities/ticket.entity';

export class ContractCounterpartSignatureState extends MessageState {
  public async processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void> {
    // const contact = value.contacts[0];

    // Get the user from the database.
    // const user = await context.userService.findOneByWhatsappId(contact.wa_id);
    const ticket: TicketEntity =
      await context.whatsappService.ticketService.findUserNewestTicketAsCounterpart(
        value.messages[0].from,
      );

    // If the user is not registered, do nothing.
    // if (!user) {
    //   context.logger.error('User not found.');
    //   return;
    // }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = this.formatPhoneNumber(message.from);

      if (message.type === 'text') {
        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_COUNTERPART_SIGNATURE,
        });

        await context.whatsappService.sendConfirmationOptions(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_COUNTERPART_SIGNATURE_REQUEST(),
          prefix.CONTRACT_COUNTERPART_SIGNATURE,
          false,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
        continue;
      }

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        context.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (
        !this.optionHasPrefix(
          selectedOption,
          prefix.CONTRACT_COUNTERPART_SIGNATURE,
        )
      ) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.CONTRACT_COUNTERPART_SIGNATURE}.`,
        );

        await context.whatsappService.sendConfirmationOptions(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_COUNTERPART_SIGNATURE_REQUEST(),
          prefix.CONTRACT_COUNTERPART_SIGNATURE,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.CONTRACT_COUNTERPART_SIGNATURE}-no`) {
        // TODO: Go to previous state.
        await context.whatsappService.ticketService.save({
          ...ticket,
          signedByCounterpart: false,
          signedByCounterpartAt: null,
          contractHasRejectedByCounterpartDescription: null,
          state:
            TicketState.WAITING_CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_REQUEST(),
        );
        continue;
      }

      await context.whatsappService.ticketService.save({
        ...ticket,
        signedByCounterpart: true,
        signedByCounterpartAt: new Date(),
        contractHasRejectedByCounterpartDescription: null,
        state: TicketState.WAITING_COUNTERPART_SIGNATURE,
      });

      await context.whatsappService.sendMessage(
        ticket.counterpartPhoneNumber,
        ticket.contract,
      );
    }
  }
}
