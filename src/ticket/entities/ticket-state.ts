import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { FirstTicketConfirmationState } from '../states/first-ticket-confirmation-state';
import { TicketOwnerTypeInputState } from '../states/ticket-owner-type-input-state';
import { CounterpartNameInputState } from '../states/counterpart-name-input-state';
import { CounterpartPhoneNumberInputState } from '../states/counterpart-phone-number-input-state';
import { CounterpartEmailInputState } from '../states/counterpart-email-input-state';
import { CounterpartAddressInputState } from '../states/counterpart-address-input-state';
import { CounterpartTaxpayerNumberInputState } from '../states/counterpart-taxpayer-number-input-state';
import { TicketServiceCategoryState } from '../states/ticket-service-category-state';
import { ServiceAddressInputState } from '../states/service-address-input-state';
import { ServiceDetailsInputState } from '../states/service-details-input-state';
import { ServiceStartDateInputState } from '../states/service-start-date-input-state';
import { ServiceEndDateInputState } from '../states/service-end-date-input-state';
import { ServicePaymentAmountInputState } from '../states/service-payment-amount-input-state';
import { ServicePaymentDatesInputState } from '../states/service-payment-dates-input-state';
import { ServiceMaterialDateInputState } from '../states/service-material-date-state';
import { ServiceMaterialHowBuyInputState } from '../states/service-material-how-buy-input-state';
import { ServiceStepsState } from '../states/service-steps-state';
import { ServiceStepsDescriptionState } from '../states/service-steps-description-state';
import { ServiceHoursState } from '../states/service-hours-state';
import { ServiceHoursDescriptionState } from '../states/service-hours-description-state';

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
  WAITING_SERVICE_CATEGORY = 'WAITING_SERVICE_CATEGORY',
  WAITING_SERVICE_ADDRESS = 'WAITING_SERVICE_ADDRESS',
  WAITING_SERVICE_ADDRESS_CONFIRMATION = 'WAITING_SERVICE_ADDRESS_CONFIRMATION',
  WAITING_SERVICE_DETAILS = 'WAITING_SERVICE_DETAILS',
  WAITING_SERVICE_DETAILS_CONFIRMATION = 'WAITING_SERVICE_DETAILS_CONFIRMATION',
  WAITING_SERVICE_START_DATE = 'WAITING_SERVICE_START_DATE',
  WAITING_SERVICE_START_DATE_CONFIRMATION = 'WAITING_SERVICE_START_DATE_CONFIRMATION',
  WAITING_SERVICE_END_DATE = 'WAITING_SERVICE_END_DATE',
  WAITING_SERVICE_END_DATE_CONFIRMATION = 'WAITING_SERVICE_END_DATE_CONFIRMATION',
  WAITING_SERVICE_PAYMENT_AMOUNT = 'WAITING_SERVICE_PAYMENT_AMOUNT',
  WAITING_SERVICE_PAYMENT_AMOUNT_CONFIRMATION = 'WAITING_SERVICE_PAYMENT_AMOUNT_CONFIRMATION',
  WAITING_SERVICE_PAYMENT_DATES = 'WAITING_SERVICE_PAYMENT_DATES',
  WAITING_SERVICE_PAYMENT_DATES_CONFIRMATION = 'WAITING_SERVICE_PAYMENT_DATES_CONFIRMATION',
  WAITING_SERVICE_MATERIAL_DATE = 'WAITING_SERVICE_MATERIAL_DATE',
  WAITING_SERVICE_MATERIAL_DATE_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_DATE_CONFIRMATION',
  WAITING_SERVICE_MATERIAL_HOW_BUY = 'WAITING_SERVICE_MATERIAL_HOW_BUY',
  WAITING_SERVICE_MATERIAL_HOW_BUY_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_HOW_BUY_CONFIRMATION',
  WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS = 'WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS',
  WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS_CONFIRMATION',
  WAITING_SERVICE_MATERIAL_WHERE = 'WAITING_SERVICE_MATERIAL_WHERE',
  WAITING_SERVICE_MATERIAL_WHERE_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_WHERE_CONFIRMATION',
  WAITING_SERVICE_MATERIAL_PAYBACK = 'WAITING_SERVICE_MATERIAL_PAYBACK',
  WAITING_SERVICE_MATERIAL_PAYBACK_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_PAYBACK_CONFIRMATION',
  WAITING_SERVICE_CONTRACT_CANCEL = 'WAITING_SERVICE_CONTRACT_CANCEL',
  WAITING_SERVICE_CONTRACT_CANCEL_CONFIRMATION = 'WAITING_SERVICE_CONTRACT_CANCEL_CONFIRMATION',
  WAITING_SERVICE_CONTRACT_CANCEL_DETAILS = 'WAITING_SERVICE_CONTRACT_CANCEL_DETAILS',
  WAITING_SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION = 'WAITING_SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION',
  WAITING_SERVICE_MATERIAL_HOW_MUCH = 'WAITING_SERVICE_MATERIAL_HOW_MUCH',
  WAITING_SERVICE_MATERIAL_HOW_MUCH_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_HOW_MUCH_CONFIRMATION',
  WAITING_SERVICE_STEPS = 'WAITING_SERVICE_STEPS',
  WAITING_SERVICE_STEPS_DESCRIPTION = 'WAITING_SERVICE_STEPS_DESCRIPTION',
  WAITING_SERVICE_HOURS = 'WAITING_SERVICE_HOURS',
  WAITING_SERVICE_HOURS_DESCRIPTION = 'WAITING_SERVICE_HOURS_DESCRIPTION',
}

export const getTicketStateProcessor: Record<TicketState, IMessageState> = {
  [TicketState.NONE]: null,
  [TicketState.FIRST_TICKET]: new FirstTicketConfirmationState(),
  [TicketState.SELECT_TICKET]: null,
  [TicketState.WAITING_OWNER_TYPE]: new TicketOwnerTypeInputState(),
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
    new CounterpartTaxpayerNumberInputState(),
  [TicketState.WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION]:
    new CounterpartTaxpayerNumberInputState(),
  [TicketState.WAITING_SERVICE_CATEGORY]: new TicketServiceCategoryState(),
  [TicketState.WAITING_SERVICE_ADDRESS]: new ServiceAddressInputState(),
  [TicketState.WAITING_SERVICE_ADDRESS_CONFIRMATION]:
    new ServiceAddressInputState(),
  [TicketState.WAITING_SERVICE_DETAILS]: new ServiceDetailsInputState(),
  [TicketState.WAITING_SERVICE_DETAILS_CONFIRMATION]:
    new ServiceDetailsInputState(),
  [TicketState.WAITING_SERVICE_STEPS]: new ServiceStepsState(),
  [TicketState.WAITING_SERVICE_STEPS_DESCRIPTION]:
    new ServiceStepsDescriptionState(),
  [TicketState.WAITING_SERVICE_START_DATE]: new ServiceStartDateInputState(),
  [TicketState.WAITING_SERVICE_START_DATE_CONFIRMATION]:
    new ServiceStartDateInputState(),
  [TicketState.WAITING_SERVICE_END_DATE]: new ServiceEndDateInputState(),
  [TicketState.WAITING_SERVICE_END_DATE_CONFIRMATION]:
    new ServiceEndDateInputState(),
  [TicketState.WAITING_SERVICE_HOURS]: new ServiceHoursState(),
  [TicketState.WAITING_SERVICE_HOURS_DESCRIPTION]: new ServiceHoursDescriptionState(),
  [TicketState.WAITING_SERVICE_PAYMENT_AMOUNT]:
    new ServicePaymentAmountInputState(),
  [TicketState.WAITING_SERVICE_PAYMENT_AMOUNT_CONFIRMATION]:
    new ServicePaymentAmountInputState(),
  [TicketState.WAITING_SERVICE_PAYMENT_DATES]:
    new ServicePaymentDatesInputState(),
  [TicketState.WAITING_SERVICE_PAYMENT_DATES_CONFIRMATION]:
    new ServicePaymentDatesInputState(),
  [TicketState.WAITING_SERVICE_MATERIAL_DATE]:
    new ServiceMaterialDateInputState(),
  [TicketState.WAITING_SERVICE_MATERIAL_DATE_CONFIRMATION]:
    new ServiceMaterialDateInputState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_BUY]:
    new ServiceMaterialHowBuyInputState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_BUY_CONFIRMATION]:
    new ServiceMaterialHowBuyInputState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS_CONFIRMATION]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_WHERE]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_WHERE_CONFIRMATION]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_PAYBACK]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_PAYBACK_CONFIRMATION]: null,
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL]: null,
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL_CONFIRMATION]: null,
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL_DETAILS]: null,
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH_CONFIRMATION]: null,

  [TicketState.CLOSED]: null,
};
