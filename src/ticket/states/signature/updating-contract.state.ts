import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { TicketEntity } from '../../entities/ticket.entity';
import { UserEntity } from '../../../user/entities/user.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketState } from '../../entities/ticket-state.enum';

export class UpdatingContractState extends MessageState {
  public prefix = 'UPDATING_CONTRACT';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    if (ticket.state !== TicketState.UPDATING_CONTRACT) {
      this.whatsAppService.updateContract(phoneNumber, user, ticket); //.then(async (contract) => {
    }
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      state: TicketState.UPDATING_CONTRACT,
    });

    await this.whatsAppService.sendMessage(
      phoneNumber,
      `Por favor aguarde estamos analisando todas as informações e gerando seu contrato.`,
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
        ticket.state === TicketState.UPDATING_CONTRACT
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.UPDATING_CONTRACT(),
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.UPDATING_CONTRACT
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.UPDATING_CONTRACT(),
        );
      }

      await this.whatsAppService.sendMessage(
        phoneNumber,
        messages.INVALID_OPTION(),
      );

      await this.whatsAppService.sendMessage(
        phoneNumber,
        messages.UPDATING_CONTRACT(),
      );
    }
  }
}
