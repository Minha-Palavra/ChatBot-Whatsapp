import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { FirstTicketConfirmationState } from '../states/first-ticket-confirmation-state';
import { OwnerTypeInputState } from '../states/owner-type-input-state';

export enum TicketState {
  NONE = 'NONE',
  CLOSED = 'CLOSED',
  FIRST_TICKET = 'FIRST_TICKET',
  SELECT_TICKET = 'SELECT_TICKET',
  WAITING_OWNER_TYPE = 'WAITING_OWNER_TYPE',
  COUNTERPART_NAME_INPUT = 'COUNTERPART_NAME_INPUT',
}

export const getTicketStateProcessor: Record<TicketState, IMessageState> = {
  [TicketState.NONE]: null,
  [TicketState.FIRST_TICKET]: new FirstTicketConfirmationState(),
  [TicketState.SELECT_TICKET]: null,
  [TicketState.WAITING_OWNER_TYPE]: new OwnerTypeInputState(),
  [TicketState.COUNTERPART_NAME_INPUT]: null,
  [TicketState.CLOSED]: null,
};
