import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { FirstTicketConfirmationState } from '../states/first-ticket-confirmation-state';
import { TicketOwnerTypeInputState } from '../states/ticket-owner-type-input-state';
import { CounterpartNameInputState } from '../states/counterpart-name-input-state';
import { CounterpartPhoneNumberInputState } from '../states/counterpart-phone-number-input-state';
import { CounterpartEmailInputState } from '../states/counterpart-email-input-state';
import { CounterpartAddressInputState } from '../states/counterpart-address-input-state';
import { CounterpartTaxpayerNumberInputState } from '../states/counterpart-taxpayer-number-input-state';
import { ServiceCategoryState } from '../states/service-category-state';
import { ServiceAddressInputState } from '../states/service-address-input-state';
import { ServiceDetailsState } from '../states/service-details-state';
import { ServiceStartDateInputState } from '../states/service-start-date-input-state';
import { ServiceEndDateInputState } from '../states/service-end-date-input-state';
import { ServicePaymentAmountInputState } from '../states/service-payment-amount-input-state';
import { ServicePaymentDatesState } from '../states/service-payment-dates-state';
import { MaterialArrivalDateState } from '../states/material-arrival-date-state';
import { ServiceMaterialHowBuyInputState } from '../states/service-material-how-buy-input-state';
import { ServiceStepsState } from '../states/service-steps-state';
import { ServiceStepsDescriptionState } from '../states/service-steps-description-state';
import { ServiceHoursState } from '../states/service-hours-state';
import { ServiceHoursDescriptionState } from '../states/service-hours-description-state';
import { ServicePaymentMethodState } from '../states/service-payment-method-state';
import { ServiceInInstallmentsPaymentMethodState } from '../states/service-in-installments-payment-method-state';
import { ServiceInCashPaymentMethodState } from '../states/service-in-cash-payment-method-state';
import { ServicePaymentInInstallmentsCountState } from '../states/service-payment-in-installments-count-state';
import { PaymentInInstallmentsOtherMethodState } from '../states/payment-in-installments-other-method-state';
import { PaymentInCashOtherMethodState } from '../states/payment-in-cash-other-method-state';
import { PaymentOtherMethodState } from '../states/service-other-payment-method-state';
import { MaterialIsPartOfContractState } from '../states/material-is-part-of-contract-state';
import { MaterialsWhoWillBuyState } from '../states/materials-who-will-buy-state';
import { MaterialHowManyBudgetsState } from '../states/material-how-many-budgets-state';
import { MaterialPreDeterminedValueState } from '../states/material-pre-determined-value-state';
import { MaterialsWhoWillPayState } from '../states/materials-who-will-pay-state';
import { MaterialWhereToArrivalState } from '../states/material-where-to-arrival-state';
import { MaterialPaybackState } from '../states/material-payback-state';
import { MaterialDetailsState } from '../states/material-details-state';
import { MaterialDetailsDescriptionState } from '../states/material-details-description-state';
import { ContractHasMoreState } from '../states/contract-has-more-state';
import { ContractHasMoreDescriptionState } from '../states/contract-has-more-description-state';
import { ContractHasDeadlineMoreState } from '../states/contract-has-deadline-more-state';
import { ContractHasDeadlineMoreDescriptionState } from '../states/contract-has-deadline-more-description-state';
import { ServiceDeliveryDescriptionState } from '../states/service-delivery-description-state';
import { ContractHasCancellationMoreDescriptionState } from '../states/contract-has-cancelation-more-description-state';
import { ContractHasCancellationMoreState } from '../states/contract-has-cancelation-more-state';
import { ContractWhatIsCancellationState } from '../states/contract-what-is-cancellation-state';
import { ServiceWarrantyState } from '../states/service-warranty-state';
import { WarrantyDetailsState } from '../states/warranty-details-state';
import { ContractJudicialState } from '../states/contract-judicial-state';
import { ContractApprovalState } from '../states/contract-approval-state';

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
  WAITING_SERVICE_PAYMENT_METHOD = 'WAITING_SERVICE_PAYMENT_METHOD',
  WAITING_SERVICE_PAYMENT_IN_INSTALLMENTS_METHOD = 'WAITING_SERVICE_PAYMENT_IN_INSTALLMENTS_METHOD',
  WAITING_SERVICE_PAYMENT_IN_CASH_METHOD = 'WAITING_SERVICE_PAYMENT_IN_CASH_METHOD',
  WAITING_SERVICE_PAYMENT_OTHERS_METHOD = 'WAITING_SERVICE_PAYMENT_OTHERS_METHOD',
  WAITING_SERVICE_PAYMENT_OTHER_METHOD_CONFIRMATION = 'WAITING_SERVICE_PAYMENT_OTHER_METHOD_CONFIRMATION',
  WAITING_PAYMENT_INSTALLMENT_COUNT = 'WAITING_PAYMENT_INSTALLMENT_COUNT',
  WAITING_PAYMENT_INSTALLMENT_COUNT_CONFIRMATION = 'WAITING_PAYMENT_INSTALLMENT_COUNT_CONFIRMATION',
  WAITING_PAYMENT_IN_INSTALLMENT_OTHER_METHOD_CONFIRMATION = 'WAITING_PAYMENT_IN_INSTALLMENT_OTHER_METHOD_CONFIRMATION',
  WAITING_PAYMENT_IN_INSTALLMENT_OTHER_METHOD = 'WAITING_PAYMENT_IN_INSTALLMENT_OTHER_METHOD',
  WAITING_PAYMENT_IN_CASH_OTHER_METHOD = 'WAITING_PAYMENT_IN_CASH_OTHER_METHOD',
  WAITING_PAYMENT_IN_CASH_OTHER_METHOD_CONFIRMATION = 'WAITING_PAYMENT_IN_CASH_OTHER_METHOD_CONFIRMATION',
  WAITING_MATERIAL_IS_PART_OF_CONTRACT = 'WAITING_MATERIAL_IS_PART_OF_CONTRACT',
  WAITING_SERVICE_MATERIAL_WHO_BUY = 'WAITING_SERVICE_MATERIAL_WHO_BUY',
  WAITING_SERVICE_MATERIAL_PRE_DETERMINED_VALUE_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_PRE_DETERMINED_VALUE_CONFIRMATION',
  WAITING_SERVICE_MATERIAL_PRE_DETERMINED_VALUE = 'WAITING_SERVICE_MATERIAL_PRE_DETERMINED_VALUE',
  WAITING_SERVICE_MATERIAL_HOW_PAY = 'WAITING_SERVICE_MATERIAL_HOW_PAY',
  WAITING_SERVICE_MATERIAL_DETAILS = 'WAITING_SERVICE_MATERIAL_DETAILS',
  WAITING_SERVICE_MATERIAL_DETAILS_DESCRIPTION = 'WAITING_SERVICE_MATERIAL_DETAILS_DESCRIPTION',
  WAITING_SERVICE_MATERIAL_DETAILS_CONFIRMATION = 'WAITING_SERVICE_MATERIAL_DETAILS_CONFIRMATION',
  WAITING_SERVICE_CONTRACT_HAS_MORE = 'WAITING_SERVICE_CONTRACT_HAS_MORE',
  WAITING_SERVICE_CONTRACT_HAS_MORE_DESCRIPTION = 'WAITING_SERVICE_CONTRACT_HAS_MORE_DESCRIPTION',
  WAITING_SERVICE_CONTRACT_HAS_MORE_DESCRIPTION_CONFIRMATION = 'WAITING_SERVICE_CONTRACT_HAS_MORE_DESCRIPTION_CONFIRMATION ',
  WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE = 'WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE',
  WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION = 'WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION',
  WAITING_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_CONFIRMATION = 'WAITING_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_CONFIRMATION',
  WAITING_SERVICE_DELIVERY = 'WAITING_SERVICE_DELIVERY',
  WAITING_SERVICE_DELIVERY_CONFIRMATION = 'WAITING_SERVICE_DELIVERY_CONFIRMATION',
  WAITING_SERVICE_CONTRACT_HAS_CANCELLATION_MORE = 'WAITING_SERVICE_CONTRACT_HAS_CANCELLATION_MORE',
  WAITING_SERVICE_CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION = 'WAITING_SERVICE_CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION',
  WAITING_CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION_CONFIRMATION = 'WAITING_CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION_CONFIRMATION',
  WAITING_WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION = 'WAITING_WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION',
  WAITING_WHAT_IS_CONTRACT_CANCELLATION = 'WAITING_WHAT_IS_CONTRACT_CANCELLATION',
  WAITING_SERVICE_WARRANTY = 'WAITING_SERVICE_WARRANTY',
  WAITING_SERVICE_WARRANTY_DESCRIPTION_CONFIRMATION = 'WAITING_SERVICE_WARRANTY_DESCRIPTION_CONFIRMATION',
  WAITING_SERVICE_WARRANTY_DESCRIPTION = 'WAITING_SERVICE_WARRANTY_DESCRIPTION',
  WAITING_SERVICE_JUDICIAL_RESOLUTION = 'WAITING_SERVICE_JUDICIAL_RESOLUTION',
  WAITING_SERVICE_JUDICIAL_RESOLUTION_CONFIRMATION = 'WAITING_SERVICE_JUDICIAL_RESOLUTION_CONFIRMATION',
  WAITING_CONTRACT_APPROVAL = 'WAITING_CONTRACT_APPROVAL',
  WAITING_SERVICE_CONTRACT_APPROVAL_DESCRIPTION = 'WAITING_SERVICE_CONTRACT_APPROVAL_DESCRIPTION',
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
  [TicketState.WAITING_SERVICE_CATEGORY]: new ServiceCategoryState(),
  [TicketState.WAITING_SERVICE_ADDRESS]: new ServiceAddressInputState(),
  [TicketState.WAITING_SERVICE_ADDRESS_CONFIRMATION]:
    new ServiceAddressInputState(),
  [TicketState.WAITING_SERVICE_DETAILS]: new ServiceDetailsState(),
  [TicketState.WAITING_SERVICE_DETAILS_CONFIRMATION]: new ServiceDetailsState(),
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
  [TicketState.WAITING_SERVICE_HOURS_DESCRIPTION]:
    new ServiceHoursDescriptionState(),
  [TicketState.WAITING_SERVICE_PAYMENT_AMOUNT]:
    new ServicePaymentAmountInputState(),
  [TicketState.WAITING_SERVICE_PAYMENT_AMOUNT_CONFIRMATION]:
    new ServicePaymentAmountInputState(),
  [TicketState.WAITING_SERVICE_PAYMENT_METHOD]: new ServicePaymentMethodState(),
  [TicketState.WAITING_SERVICE_PAYMENT_IN_INSTALLMENTS_METHOD]:
    new ServiceInInstallmentsPaymentMethodState(),
  [TicketState.WAITING_SERVICE_PAYMENT_IN_CASH_METHOD]:
    new ServiceInCashPaymentMethodState(),
  [TicketState.WAITING_SERVICE_PAYMENT_OTHERS_METHOD]:
    new PaymentOtherMethodState(),
  [TicketState.WAITING_SERVICE_PAYMENT_OTHER_METHOD_CONFIRMATION]:
    new PaymentOtherMethodState(),
  [TicketState.WAITING_PAYMENT_IN_CASH_OTHER_METHOD]:
    new PaymentInCashOtherMethodState(),
  [TicketState.WAITING_PAYMENT_IN_CASH_OTHER_METHOD_CONFIRMATION]:
    new PaymentInCashOtherMethodState(),
  [TicketState.WAITING_PAYMENT_IN_INSTALLMENT_OTHER_METHOD]:
    new PaymentInInstallmentsOtherMethodState(),
  [TicketState.WAITING_PAYMENT_IN_INSTALLMENT_OTHER_METHOD_CONFIRMATION]:
    new PaymentInInstallmentsOtherMethodState(),
  [TicketState.WAITING_SERVICE_PAYMENT_DATES]: new ServicePaymentDatesState(),
  [TicketState.WAITING_SERVICE_PAYMENT_DATES_CONFIRMATION]:
    new ServicePaymentDatesState(),
  [TicketState.WAITING_PAYMENT_INSTALLMENT_COUNT]:
    new ServicePaymentInInstallmentsCountState(),
  [TicketState.WAITING_PAYMENT_INSTALLMENT_COUNT_CONFIRMATION]:
    new ServicePaymentInInstallmentsCountState(),
  [TicketState.WAITING_SERVICE_MATERIAL_WHO_BUY]:
    new MaterialsWhoWillBuyState(),
  [TicketState.WAITING_SERVICE_MATERIAL_DATE]: new MaterialArrivalDateState(),
  [TicketState.WAITING_SERVICE_MATERIAL_DATE_CONFIRMATION]:
    new MaterialArrivalDateState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_BUY]:
    new ServiceMaterialHowBuyInputState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_BUY_CONFIRMATION]:
    new ServiceMaterialHowBuyInputState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS]:
    new MaterialHowManyBudgetsState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS_CONFIRMATION]:
    new MaterialHowManyBudgetsState(),
  [TicketState.WAITING_SERVICE_MATERIAL_PRE_DETERMINED_VALUE]:
    new MaterialPreDeterminedValueState(),
  [TicketState.WAITING_SERVICE_MATERIAL_PRE_DETERMINED_VALUE_CONFIRMATION]:
    new MaterialPreDeterminedValueState(),
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_PAY]:
    new MaterialsWhoWillPayState(),
  [TicketState.WAITING_SERVICE_MATERIAL_WHERE]:
    new MaterialWhereToArrivalState(),
  [TicketState.WAITING_SERVICE_MATERIAL_WHERE_CONFIRMATION]:
    new MaterialWhereToArrivalState(),
  [TicketState.WAITING_SERVICE_MATERIAL_PAYBACK]: new MaterialPaybackState(),
  [TicketState.WAITING_SERVICE_MATERIAL_PAYBACK_CONFIRMATION]:
    new MaterialPaybackState(),
  [TicketState.WAITING_SERVICE_MATERIAL_DETAILS]: new MaterialDetailsState(),
  [TicketState.WAITING_SERVICE_MATERIAL_DETAILS_DESCRIPTION]:
    new MaterialDetailsDescriptionState(),
  [TicketState.WAITING_SERVICE_MATERIAL_DETAILS_CONFIRMATION]:
    new MaterialDetailsDescriptionState(),
  [TicketState.WAITING_SERVICE_CONTRACT_HAS_MORE]: new ContractHasMoreState(),
  [TicketState.WAITING_SERVICE_CONTRACT_HAS_MORE_DESCRIPTION]:
    new ContractHasMoreDescriptionState(),
  [TicketState.WAITING_SERVICE_CONTRACT_HAS_MORE_DESCRIPTION_CONFIRMATION]:
    new ContractHasMoreDescriptionState(),
  [TicketState.WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE]:
    new ContractHasDeadlineMoreState(),
  [TicketState.WAITING_SERVICE_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION]:
    new ContractHasDeadlineMoreDescriptionState(),
  [TicketState.WAITING_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_CONFIRMATION]:
    new ContractHasDeadlineMoreDescriptionState(),
  [TicketState.WAITING_SERVICE_DELIVERY]: new ServiceDeliveryDescriptionState(),
  [TicketState.WAITING_SERVICE_DELIVERY_CONFIRMATION]:
    new ServiceDeliveryDescriptionState(),
  [TicketState.WAITING_SERVICE_CONTRACT_HAS_CANCELLATION_MORE]:
    new ContractHasCancellationMoreState(),
  [TicketState.WAITING_SERVICE_CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION]:
    new ContractHasCancellationMoreDescriptionState(),
  [TicketState.WAITING_CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION_CONFIRMATION]:
    new ContractHasCancellationMoreDescriptionState(),
  [TicketState.WAITING_WHAT_IS_CONTRACT_CANCELLATION]:
    new ContractWhatIsCancellationState(),
  [TicketState.WAITING_WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION]:
    new ContractWhatIsCancellationState(),
  [TicketState.WAITING_SERVICE_WARRANTY]: new ServiceWarrantyState(),
  [TicketState.WAITING_SERVICE_WARRANTY_DESCRIPTION]:
    new WarrantyDetailsState(),
  [TicketState.WAITING_SERVICE_WARRANTY_DESCRIPTION_CONFIRMATION]:
    new WarrantyDetailsState(),
  [TicketState.WAITING_SERVICE_JUDICIAL_RESOLUTION]:
    new ContractJudicialState(),
  [TicketState.WAITING_SERVICE_JUDICIAL_RESOLUTION_CONFIRMATION]:
    new ContractJudicialState(),
  [TicketState.WAITING_CONTRACT_APPROVAL]: new ContractApprovalState(),
  [TicketState.WAITING_SERVICE_CONTRACT_APPROVAL_DESCRIPTION]: new ContractApprovalState(),
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL]: null,
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL_CONFIRMATION]: null,
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL_DETAILS]: null,
  [TicketState.WAITING_SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH]: null,
  [TicketState.WAITING_SERVICE_MATERIAL_HOW_MUCH_CONFIRMATION]: null,
  [TicketState.WAITING_MATERIAL_IS_PART_OF_CONTRACT]:
    new MaterialIsPartOfContractState(),
  [TicketState.CLOSED]: null,
};
