import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { MessageState } from '../../../whatsapp/states/message-state';
import { OwnerTypeState } from './owner-type.state';
import { UserEntity } from '../../../user/entities/user.entity';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { ContractParty } from '../../entities/contract-party.enum';
import { TicketStatus } from '../../entities/ticket-status.enum';
import { TicketState } from '../../entities/ticket-state.enum';

export class PaidTicketState extends MessageState {
  public prefix = 'PAID_TICKET';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    await this.whatsAppService.sendMessage(
      phoneNumber,
      `Você já tem mais de 5 contratos em sua conta, iremos gerar um PIX de R$ 4,99 para a realização de cada novo contrato.`,
    );

    const response = await this.whatsAppService.paymentService.createPixPayment(
      {
        order_id: ticket.id,
        payer_email: user.email,
        payer_name: user.fullName,
        payer_cpf_cnpj: user.taxpayerNumber,
        payer_phone: user.phoneNumber,
      },
    );
    await this.whatsAppService.sendMessage(
      phoneNumber,
      `Copie o código e cole em seu pix para seguir com o pagamento de R$ 4,99.`,
    );
    const emv = response.details.emv;
    await this.whatsAppService.sendMessage(phoneNumber, `${emv}`);
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
        ticket.state === TicketState.CREATE_TICKET_PIX_PAYMENT
      ) {
        await this.onStateBegin(phoneNumber, user, ticket);
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.CREATE_TICKET_PIX_PAYMENT
      ) {
        await this.onStateBegin(phoneNumber, user, ticket);
      }
      await this.onStateBegin(phoneNumber, user, ticket);
    }
  }
}
