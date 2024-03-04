import { IMessageState } from '../../whatsapp/states/message-state.interface';

export enum TicketState {
  NONE= 'NONE',
  CLOSED = 'CLOSED',
  FIRST_TICKET = 'FIRST_TICKET',
  SELECT_TICKET = 'SELECT_TICKET',
}

export const getTicketStateProcessor: Record<TicketState, IMessageState> = {
  [TicketState.NONE]: null,
  [TicketState.FIRST_TICKET]: null,
  [TicketState.SELECT_TICKET]: null,
  [TicketState.CLOSED]: null,
};
