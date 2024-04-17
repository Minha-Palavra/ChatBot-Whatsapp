import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { MessageState } from '../../../whatsapp/states/message-state';
import { UserEntity } from '../../../user/entities/user.entity';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketStatus } from '../../entities/ticket-status.enum';
import { TicketState } from '../../entities/ticket-state.enum';

export class ContractWasCompletedState extends MessageState {
  public prefix = 'CONTRACT_WAS_COMPLETED';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    await this.whatsAppService.ticketService.save({
      ...ticket,
      signedByCounterpart: true,
      signedByCounterpartAt: new Date(),
      state: TicketState.CONTRACT_WAS_COMPLETED,
      status: TicketStatus.CLOSED,
    });

    await this.whatsAppService.sendMessage(
      ticket.counterpartPhoneNumber,
      messages.CONTRACT_WAS_SIGNED(),
    );

    await this.whatsAppService.emailService.sendContract(
      ticket.contract,
      ticket.owner.email,
    );

    await this.whatsAppService.sendMessage(
      ticket.owner.phoneNumber,
      messages.CONTRACT_WAS_SIGNED(),
    );

    await this.whatsAppService.emailService.sendContract(
      ticket.contract,
      ticket.counterpartEmail,
    );

    await this.whatsAppService.sendMessage(
      ticket.counterpartPhoneNumber,
      `O contrato foi enviado para os emails de ambos os envolvidos.`,
    );

    await this.whatsAppService.sendMessage(
      ticket.owner.phoneNumber,
      `O contrato foi enviado para os emails de ambos os envolvidos.`,
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
        ticket.state === TicketState.CONTRACT_WAS_COMPLETED
      ) {
        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_WAS_SIGNED(),
        );

        await this.whatsAppService.sendMessage(
          ticket.owner.phoneNumber,
          messages.CONTRACT_WAS_SIGNED(),
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.CONTRACT_WAS_COMPLETED
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendMessage(
          ticket.counterpartPhoneNumber,
          messages.CONTRACT_WAS_SIGNED(),
        );

        await this.whatsAppService.sendMessage(
          ticket.owner.phoneNumber,
          messages.CONTRACT_WAS_SIGNED(),
        );
      }

      await this.whatsAppService.sendMessage(
        phoneNumber,
        messages.INVALID_OPTION(),
      );

      await this.whatsAppService.sendMessage(
        ticket.counterpartPhoneNumber,
        messages.CONTRACT_WAS_SIGNED(),
      );

      await this.whatsAppService.sendMessage(
        ticket.owner.phoneNumber,
        messages.CONTRACT_WAS_SIGNED(),
      );
    }
  }
}
