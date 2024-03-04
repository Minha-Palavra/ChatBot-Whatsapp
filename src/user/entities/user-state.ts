import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { UserDataPrivacyConfirmationState } from '../states/user-data-privacy-confirmation-state';
import { UserNameInputState } from '../states/user-name-input-state';
import { UserRegistrationInitialState } from '../states/user-registration-initial-state';
import { UserTaxpayerNumberInputState } from '../states/user-taxpayer-number-input-state';
import { UserPhoneNumberInputState } from '../states/user-phone-number-input-state';
import { UserEmailInputState } from '../states/user-email-input-state';
import { UserAddressInputState } from '../states/user-address-input-state';

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
  WAITING_TAXPAYER_NUMBER = 'WAITING_TAXPAYER_NUMBER',
  WAITING_TAXPAYER_NUMBER_CONFIRMATION = 'WAITING_TAXPAYER_NUMBER_CONFIRMATION',
  WAITING_ADDRESS = 'WAITING_ADDRESS',
  WAITING_ADDRESS_CONFIRMATION = 'WAITING_ADDRESS_CONFIRMATION',
}

export const getUserStateProcessor: Record<UserState, IMessageState> = {

  [UserState.REGISTRATION_INITIAL]: new UserRegistrationInitialState(),
  [UserState.REGISTRATION_COMPLETE]: null,

  [UserState.DATA_PRIVACY_CONFIRMATION]: new UserDataPrivacyConfirmationState(),

  [UserState.WAITING_NAME]: new UserNameInputState(),
  [UserState.WAITING_NAME_CONFIRMATION]: new UserNameInputState(),

  [UserState.WAITING_TAXPAYER_NUMBER]: new UserTaxpayerNumberInputState(),
  [UserState.WAITING_TAXPAYER_NUMBER_CONFIRMATION]:
    new UserTaxpayerNumberInputState(),

  [UserState.WAITING_PHONE_NUMBER]: new UserPhoneNumberInputState(),
  [UserState.WAITING_PHONE_NUMBER_CONFIRMATION]:
    new UserPhoneNumberInputState(),

  [UserState.WAITING_EMAIL]: new UserEmailInputState(),
  [UserState.WAITING_EMAIL_CONFIRMATION]: new UserEmailInputState(),

  [UserState.WAITING_ADDRESS]: new UserAddressInputState(),
  [UserState.WAITING_ADDRESS_CONFIRMATION]: new UserAddressInputState(),
};
