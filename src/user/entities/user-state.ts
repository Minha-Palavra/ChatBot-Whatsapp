import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { UserDataPrivacyConfirmationState } from '../states/user-data-privacy-confirmation-state';
import { UserNameInputState } from '../states/user-name-input-state';
import { UserRegistrationInitialState } from '../states/user-registration-initial-state';

export enum UserState {
  REGISTRATION_INITIAL = 'REGISTRATION_INITIAL',
  REGISTRATION_COMPLETE = 'REGISTRATION_COMPLETE',
  DATA_PRIVACY_CONFIRMATION = 'DATA_PRIVACY_CONFIRMATION',
  WAITING_NAME = 'WAITING_NAME',
  WAITING_NAME_CONFIRMATION = 'WAITING_NAME_CONFIRMATION',
  WAITING_PHONE_NUMBER = 'WAITING_PHONE_NUMBER',
  WAITING_PHONE_NUMBER_CONFIRMATION = 'WAITING_PHONE_NUMBER_CONFIRMATION',
  WAITING_EMAIL = 'WAITING_EMAIL',
  WAITING_EMAIL_CONFIRMATION = 'WAITING_EMAIL_CONFIRMATION',
}
export const getUserStateProcessor: Record<UserState, IMessageState> = {
  [UserState.REGISTRATION_INITIAL]: new UserRegistrationInitialState(),
  [UserState.REGISTRATION_COMPLETE]: null,
  [UserState.DATA_PRIVACY_CONFIRMATION]: new UserDataPrivacyConfirmationState(),
  [UserState.WAITING_NAME]: new UserNameInputState(),
  [UserState.WAITING_NAME_CONFIRMATION]: new UserNameInputState(),
  [UserState.WAITING_PHONE_NUMBER]: null,
  [UserState.WAITING_PHONE_NUMBER_CONFIRMATION]: null,
  [UserState.WAITING_EMAIL]: null,
  [UserState.WAITING_EMAIL_CONFIRMATION]: null,
};
