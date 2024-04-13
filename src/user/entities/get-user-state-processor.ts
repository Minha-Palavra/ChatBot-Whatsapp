import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { DataPrivacyAgreementState } from '../states/data-privacy-agreement.state';
import { WelcomeState } from '../states/welcome.state';
import { UserFullNameState } from '../states/user-full-name.state';
import { UserTaxpayerNumberState } from '../states/user-taxpayer-number.state';
import { UserEmailState } from '../states/user-email.state';
import { UserAddressState } from '../states/user-address.state';
import { UserPhoneNumberState } from '../states/user-phone-number.state';
import { UserRegistrationCompleteState } from '../states/user-registration-complete.state';
import { UserState } from './user-state.enum';

export const getUserStateProcessor: Record<UserState, IMessageState> = {
  //
  [UserState.REGISTRATION_INITIAL]: new WelcomeState(),
  [UserState.REGISTRATION_COMPLETE]: new UserRegistrationCompleteState(),
  //
  [UserState.DATA_PRIVACY_CONFIRMATION]: new DataPrivacyAgreementState(),
  //
  [UserState.NAME]: new UserFullNameState(),
  [UserState.NAME_CONFIRMATION]: new UserFullNameState(),
  //
  [UserState.TAXPAYER_NUMBER]: new UserTaxpayerNumberState(),
  [UserState.TAXPAYER_NUMBER_CONFIRMATION]: new UserTaxpayerNumberState(),
  //
  [UserState.EMAIL]: new UserEmailState(),
  [UserState.EMAIL_CONFIRMATION]: new UserEmailState(),
  //
  [UserState.PHONE_NUMBER]: new UserPhoneNumberState(), // NOT IN USE.
  [UserState.PHONE_NUMBER_CONFIRMATION]: new UserPhoneNumberState(), // NOT IN USE.
  //
  [UserState.ADDRESS]: new UserAddressState(),
  [UserState.ADDRESS_CONFIRMATION]: new UserAddressState(),
};
