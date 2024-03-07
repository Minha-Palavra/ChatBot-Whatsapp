import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { FirstTicketConfirmationState } from '../states/first-ticket-confirmation-state';
import { OwnerTypeInputState } from '../states/owner-type-input-state';
import { CounterpartNameInputState } from '../states/counterpart-name-input-state';
import { CounterpartPhoneNumberInputState } from '../states/counterpart-phone-number-input-state';
import { CounterpartEmailInputState } from '../states/counterpart-email-input-state';
import { CounterpartAddressInputState } from '../states/counterpart-address-input-state';

export enum TicketState {
  NONE = 'NONE',
  CLOSED = 'CLOSED',
  FIRST_TICKET = 'FIRST_TICKET',
  SELECT_TICKET = 'SELECT_TICKET',
  WAITING_OWNER_TYPE = 'WAITING_OWNER_TYPE',
  WAITING_COUNTERPART_NAME = 'WAITING_COUNTERPART_NAME',
  WAITING_COUNTERPART_NAME_CONFIRMATION = 'WAITING_COUNTERPART_NAME_CONFIRMATION',
  WAITING_COUNTERPART_TAXPAYER_NUMBER = 'WAITING_COUNTERPART_TAXPAYER_NUMBER',
  WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION = 'WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION',
  WAITING_COUNTERPART_PHONE_NUMBER = 'WAITING_COUNTERPART_PHONE_NUMBER',
  WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION = 'WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION',
  WAITING_COUNTERPART_EMAIL = 'WAITING_COUNTERPART_EMAIL',
  WAITING_COUNTERPART_EMAIL_CONFIRMATION = 'WAITING_COUNTERPART_EMAIL_CONFIRMATION',
  WAITING_COUNTERPART_ADDRESS = 'WAITING_COUNTERPART_ADDRESS',
  WAITING_COUNTERPART_ADDRESS_CONFIRMATION = 'WAITING_COUNTERPART_ADDRESS_CONFIRMATION',
}

export const getTicketStateProcessor: Record<TicketState, IMessageState> = {
  [TicketState.NONE]: null,
  [TicketState.FIRST_TICKET]: new FirstTicketConfirmationState(),
  [TicketState.SELECT_TICKET]: null,
  [TicketState.WAITING_OWNER_TYPE]: new OwnerTypeInputState(),
  [TicketState.WAITING_COUNTERPART_NAME]: new CounterpartNameInputState(),
  [TicketState.WAITING_COUNTERPART_NAME_CONFIRMATION]:
    new CounterpartNameInputState(),
  [TicketState.WAITING_COUNTERPART_PHONE_NUMBER]:
    new CounterpartPhoneNumberInputState(),
  [TicketState.WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION]:
    new CounterpartPhoneNumberInputState(),
  [TicketState.WAITING_COUNTERPART_EMAIL]: new CounterpartEmailInputState(),
  [TicketState.WAITING_COUNTERPART_EMAIL_CONFIRMATION]:
    new CounterpartEmailInputState(),
  [TicketState.WAITING_COUNTERPART_ADDRESS]: new CounterpartAddressInputState(),
  [TicketState.WAITING_COUNTERPART_ADDRESS_CONFIRMATION]:
    new CounterpartAddressInputState(),
  [TicketState.WAITING_COUNTERPART_TAXPAYER_NUMBER]:
    new CounterpartAddressInputState(),
  [TicketState.WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION]:
    new CounterpartAddressInputState(),
  [TicketState.CLOSED]: null,
};
