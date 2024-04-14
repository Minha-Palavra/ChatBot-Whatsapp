import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../../whatsapp/states/message-state';
import { UserEntity } from '../../../user/entities/user.entity';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketState } from '../../entities/ticket-state.enum';
import { PaidTicketState } from './paid-ticket.state';
import { messages } from '../../../whatsapp/entities/messages';
import { WasPaidState } from './was-paid.state.';

export class WaitingPaymentState extends MessageState {
  public prefix = 'WAITING_PAYMENT';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    await this.whatsAppService.ticketService.save({
      ...ticket,
      state: TicketState.WAITING_PAYMENT,
    });

    ticket = await this.whatsAppService.ticketService.findOne({
      where: {
        id: ticket.id,
      },
      order: { updatedAt: 'DESC' },
      relations: { owner: true, category: true, paymentData: true },
    });

    if (!ticket.paymentData) {
      this.nextState = new PaidTicketState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user, ticket);
      return;
    }

    const data = await this.whatsAppService.paymentService.checkPaymentStatus(
      ticket.paymentData.transaction_id,
    );

    if (data.status === 'paid') {
      this.nextState = new WasPaidState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;
      await this.toNextState(phoneNumber, user, ticket);
      return;
    }
    const dueDate = new Date(ticket.paymentData.dueDate);
    const now = new Date();

    const difference = Math.abs(now.getTime() - dueDate.getTime());
    const hours = difference / (1000 * 60 * 60);

    if (hours > 24) {
      // MANTER MENSAGEM DE AGUARDANDO PAGAMENTO.
      this.whatsAppService.cancelTicket(phoneNumber, ticket);
      return;
    }

    // MANTER MENSAGEM DE AGUARDANDO PAGAMENTO.
    await this.whatsAppService.sendMessage(
      phoneNumber,
      messages.WAITING_PAYMENT(),
    );

    await this.whatsAppService.sendMessage(
      phoneNumber,
      `${ticket.paymentData.emv}`,
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
        ticket.state === TicketState.WAITING_PAYMENT
      ) {
        await this.onStateBegin(phoneNumber, user, ticket);
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.WAITING_PAYMENT
      ) {
        await this.onStateBegin(phoneNumber, user, ticket);
      }
      await this.onStateBegin(phoneNumber, user, ticket);
    }
  }
}
