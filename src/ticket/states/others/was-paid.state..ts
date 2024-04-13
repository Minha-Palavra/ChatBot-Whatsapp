import { ValueObject } from 'whatsapp/build/types/webhooks';
import { MessageState } from '../../../whatsapp/states/message-state';
import { UserEntity } from '../../../user/entities/user.entity';
import { TicketEntity } from '../../entities/ticket.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketState } from '../../entities/ticket-state.enum';
import { OwnerTypeState } from './owner-type.state';

export class WasPaidState extends MessageState {
  public prefix = 'was_PAID_TICKET';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // TODO REGISTRAR QUE O PAGAMENTO FOI EFETUADO NO TICKET E SALVAR NO BANCO DE DADOS.
    // TODO INFORMAR AO USUÁRIO QUE O TICKET FOI PAGO. E SEGUIR PARA CRIAÇÃO DO TICKET NORMALMENTE.

    this.nextState = new OwnerTypeState();
    this.nextState.whatsAppService = this.whatsAppService;
    this.nextState.logger = this.logger;
    this.nextState.userService = this.userService;

    // go to the next state.
    await this.toNextState(phoneNumber, null, ticket);
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

      if (message.type === 'text' && ticket.state === TicketState.WAS_PAID) {
        await this.onStateBegin(phoneNumber, user, ticket);
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.WAS_PAID
      ) {
        await this.onStateBegin(phoneNumber, user, ticket);
      }
      await this.onStateBegin(phoneNumber, user, ticket);
    }
  }
}
