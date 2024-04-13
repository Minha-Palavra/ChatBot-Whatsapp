import { TicketState } from './ticket-state.enum';
import { FirstTicketState } from '../states/others/first-ticket.state';
import { IMessageState } from '../../whatsapp/states/message-state.interface';
import { OwnerTypeState } from '../states/others/owner-type.state';
import { CounterpartNameState } from '../states/counterpart/counterpart-name.state';
import { CounterpartPhoneNumberState } from '../states/counterpart/counterpart-phone-number.state';
import { CounterpartEmailState } from '../states/counterpart/counterpart-email.state';
import { CounterpartAddressState } from '../states/counterpart/counterpart-address.state';
import { CounterpartTaxpayerNumberState } from '../states/counterpart/counterpart-taxpayer-number.state';
import { ServiceCategoryState } from '../states/description/service-category.state';
import { ServiceAddressState } from '../states/description/service-address.state';
import { ServiceStartDateState } from '../states/description/service-start-date.state';
import { ServiceEndDateState } from '../states/description/service-end-date.state';
import { ServiceDescriptionState } from '../states/description/service-description.state';
import { ServiceStepsDescriptionState } from '../states/description/service-steps-description.state';
import { ServiceHasStepsState } from '../states/description/service-has-steps.state';
import { ServiceHasWorkHoursState } from '../states/description/service-has-work-hours.state';
import { PaymentAmountState } from '../states/payment/payment-amount.state';
import { ServiceWorkHoursDescriptionState } from '../states/description/service-work-hours-description.state';
import { PaymentMethodState } from '../states/payment/payment-method.state';
import { OtherInCashPaymentMethodState } from '../states/payment/other-in-cash-payment-method.state';
import { OtherInInstallmentsPaymentMethodState } from '../states/payment/other-in-installments-payment-method.state';
import { OtherPaymentMethodState } from '../states/payment/other-payment-method.state';
import { InInstallmentsPaymentMethodState } from '../states/payment/in-installments-payment-method.state';
import { InCashPaymentMethodState } from '../states/payment/in-cash-payment-method.state';
import { PaymentDueDatesState } from '../states/payment/payment-due-dates.state';
import { InstallmentCountState } from '../states/payment/installment-count.state';
import { MaterialsArePartOfContractState } from '../states/material/materials-are-part-of-contract.state';
import { WhoWillBuyMaterialsState } from '../states/material/who-will-buy-materials.state';
import { HowMaterialsWillBeBoughtState } from '../states/material/how-materials-will-be-bought.state';
import { WhoWillPayMaterialsState } from '../states/material/who-will-pay-materials.state';
import { MaterialsHavePreDeterminedValueState } from '../states/material/materials-have-pre-determined-value.state';
import { WhereMaterialsWillBeDeliveredState } from '../states/material/where-materials-will-be-delivered.state';
import { HowManyBudgetsBeforeBuyMaterialsState } from '../states/material/how-many-budgets-before-buy-materials.state';
import { MaterialsPurchaseDetailsState } from '../states/material/materials-purchase-details.state';
import { MaterialsDeliveryScheduleState } from '../states/material/materials-delivery-schedule-state';
import { MaterialsAreRefundableState } from '../states/material/materials-are-refundable-state';
import { HasMaterialsPurchaseDetailsState } from '../states/material/has-materials-purchase-details.state';
import { HasPaymentFeeState } from '../states/fees/has-payment-fee-state';
import { PaymentFeeState } from '../states/fees/payment-fee-state';
import { HasDeadlineFeeState } from '../states/fees/has-deadline-fee-state';
import { DeadlineFeeState } from '../states/fees/deadline-fee.state';
import { HasCancellationFeeState } from '../states/fees/has-cancellation-fee.state';
import { CancellationFeeState } from '../states/fees/cancellation-fee.state';
import { ServiceDeliveryState } from '../states/fees/service-delivery.state';
import { WhatIsContractCancellationState } from '../states/fees/what-is-contract-cancellation.state';
import { WhatIsContractCancellationDetailsState } from '../states/fees/what-is-contract-cancellation-details.state';
import { WarrantyDetailsState } from '../states/warranty/warranty-details-state';
import { WarrantyTypeState } from '../states/warranty/warranty-type-state';
import { JudicialResolutionDetailsState } from '../states/warranty/judicial-resolution-details-state';
import { GeneratingContractState } from '../states/signature/generating-contract.state';
import { ContractCorrectionState } from '../states/signature/contract-correction-state';
import { OwnerSignatureState } from '../states/signature/owner-signature-state';
import { CounterpartSignatureState } from '../states/signature/counterpart-signature-state';
import { HasRejectedByCounterpartState } from '../states/signature/has-rejected-by-counterpart-state';
import { UpdatingContractState } from '../states/signature/updating-contract.state';
import { PaidTicketState } from '../states/others/paid-ticket.state';

export const getTicketStateProcessor: Record<TicketState, IMessageState> = {
  [TicketState.GENERATING_CONTRACT]: new GeneratingContractState(),
  //
  [TicketState.NONE]: null,
  //
  [TicketState.NEW_TICKET]: null,
  [TicketState.FIRST_TICKET]: new FirstTicketState(),
  [TicketState.SELECT_TICKET]: null,
  //
  [TicketState.OWNER_TYPE]: new OwnerTypeState(),
  //
  [TicketState.COUNTERPART_NAME]: new CounterpartNameState(),
  [TicketState.COUNTERPART_NAME_CONFIRMATION]: new CounterpartNameState(),
  //
  [TicketState.COUNTERPART_PHONE_NUMBER]: new CounterpartPhoneNumberState(),
  [TicketState.COUNTERPART_PHONE_NUMBER_CONFIRMATION]:
    new CounterpartPhoneNumberState(),
  //
  [TicketState.COUNTERPART_EMAIL]: new CounterpartEmailState(),
  [TicketState.COUNTERPART_EMAIL_CONFIRMATION]: new CounterpartEmailState(),
  //
  [TicketState.COUNTERPART_ADDRESS]: new CounterpartAddressState(),
  [TicketState.COUNTERPART_ADDRESS_CONFIRMATION]: new CounterpartAddressState(),
  //
  [TicketState.COUNTERPART_TAXPAYER_NUMBER]:
    new CounterpartTaxpayerNumberState(),
  [TicketState.COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION]:
    new CounterpartTaxpayerNumberState(),
  //
  [TicketState.SERVICE_CATEGORY]: new ServiceCategoryState(),
  //
  [TicketState.SERVICE_DESCRIPTION]: new ServiceDescriptionState(),
  [TicketState.SERVICE_DESCRIPTION_CONFIRMATION]: new ServiceDescriptionState(),
  //
  [TicketState.SERVICE_HAS_STEPS]: new ServiceHasStepsState(),
  //
  [TicketState.SERVICE_STEPS_DESCRIPTION]: new ServiceStepsDescriptionState(),
  [TicketState.SERVICE_STEPS_DESCRIPTION_CONFIRMATION]:
    new ServiceStepsDescriptionState(),
  //
  [TicketState.SERVICE_ADDRESS]: new ServiceAddressState(),
  [TicketState.SERVICE_ADDRESS_CONFIRMATION]: new ServiceAddressState(),
  //
  [TicketState.SERVICE_START_DATE]: new ServiceStartDateState(),
  [TicketState.SERVICE_START_DATE_CONFIRMATION]: new ServiceStartDateState(),
  //
  [TicketState.SERVICE_END_DATE]: new ServiceEndDateState(),
  [TicketState.SERVICE_END_DATE_CONFIRMATION]: new ServiceEndDateState(),
  //
  [TicketState.SERVICE_HAS_WORK_HOURS]: new ServiceHasWorkHoursState(),
  [TicketState.SERVICE_WORK_HOURS_DESCRIPTION]:
    new ServiceWorkHoursDescriptionState(),
  [TicketState.SERVICE_WORK_HOURS_DESCRIPTION_CONFIRMATION]:
    new ServiceWorkHoursDescriptionState(),
  //
  [TicketState.PAYMENT_AMOUNT]: new PaymentAmountState(),
  [TicketState.PAYMENT_AMOUNT_CONFIRMATION]: new PaymentAmountState(),
  //
  [TicketState.PAYMENT_METHOD]: new PaymentMethodState(),
  //
  [TicketState.IN_CASH_PAYMENT_METHOD]: new InCashPaymentMethodState(),
  //
  [TicketState.IN_INSTALLMENTS_PAYMENT_METHOD]:
    new InInstallmentsPaymentMethodState(),
  //
  [TicketState.OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION]:
    new OtherInCashPaymentMethodState(),
  [TicketState.OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION]:
    new OtherInCashPaymentMethodState(),
  //
  [TicketState.OTHER_IN_INSTALLMENTS_PAYMENT_METHOD_DESCRIPTION]:
    new OtherInInstallmentsPaymentMethodState(),
  [TicketState.OTHER_IN_INSTALLMENTS_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION]:
    new OtherInInstallmentsPaymentMethodState(),
  //
  [TicketState.OTHER_PAYMENT_METHOD_DESCRIPTION]: new OtherPaymentMethodState(),
  //
  [TicketState.OTHER_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION]:
    new OtherPaymentMethodState(),
  //
  [TicketState.PAYMENT_DUE_DATES]: new PaymentDueDatesState(),
  [TicketState.PAYMENT_DUE_DATES_CONFIRMATION]: new PaymentDueDatesState(),
  //
  [TicketState.INSTALLMENT_COUNT]: new InstallmentCountState(),
  [TicketState.INSTALLMENT_COUNT_CONFIRMATION]: new InstallmentCountState(),
  //
  [TicketState.MATERIALS_ARE_PART_OF_CONTRACT]:
    new MaterialsArePartOfContractState(),
  [TicketState.WHO_WILL_BUY_MATERIALS]: new WhoWillBuyMaterialsState(),
  //
  [TicketState.HOW_MATERIALS_WILL_BE_BOUGHT]:
    new HowMaterialsWillBeBoughtState(),
  [TicketState.HOW_MATERIALS_WILL_BE_BOUGHT_CONFIRMATION]:
    new HowMaterialsWillBeBoughtState(),
  //
  [TicketState.HOW_MANY_BUDGETS_BEFORE_BUY_MATERIALS]:
    new HowManyBudgetsBeforeBuyMaterialsState(),
  [TicketState.HOW_MANY_BUDGETS_BEFORE_BUY_MATERIALS_CONFIRMATION]:
    new HowManyBudgetsBeforeBuyMaterialsState(),
  //
  [TicketState.MATERIALS_HAVE_PRE_DETERMINED_VALUE]:
    new MaterialsHavePreDeterminedValueState(),
  [TicketState.MATERIALS_HAVE_PRE_DETERMINED_VALUE_CONFIRMATION]:
    new MaterialsHavePreDeterminedValueState(),
  //
  [TicketState.WHO_WILL_PAY_MATERIALS]: new WhoWillPayMaterialsState(),
  //
  [TicketState.MATERIALS_DELIVERY_SCHEDULE]:
    new MaterialsDeliveryScheduleState(),
  [TicketState.MATERIALS_DELIVERY_SCHEDULE_CONFIRMATION]:
    new MaterialsDeliveryScheduleState(),
  //
  [TicketState.WHERE_MATERIALS_WILL_BE_DELIVERED]:
    new WhereMaterialsWillBeDeliveredState(),
  [TicketState.WHERE_MATERIALS_WILL_BE_DELIVERED_CONFIRMATION]:
    new WhereMaterialsWillBeDeliveredState(),
  //
  [TicketState.MATERIALS_ARE_REFUNDABLE]: new MaterialsAreRefundableState(),
  [TicketState.MATERIALS_ARE_REFUNDABLE_CONFIRMATION]:
    new MaterialsAreRefundableState(),
  //
  [TicketState.HAS_MATERIALS_PURCHASE_DETAILS]:
    new HasMaterialsPurchaseDetailsState(),
  [TicketState.MATERIALS_PURCHASE_DETAILS_DESCRIPTION]:
    new MaterialsPurchaseDetailsState(),
  [TicketState.MATERIALS_PURCHASE_DETAILS_DESCRIPTION_CONFIRMATION]:
    new MaterialsPurchaseDetailsState(),
  //
  [TicketState.HAS_PAYMENT_FEE]: new HasPaymentFeeState(),
  [TicketState.PAYMENT_FEE]: new PaymentFeeState(),
  [TicketState.PAYMENT_FEE_CONFIRMATION]: new PaymentFeeState(),
  //
  [TicketState.HAS_DEADLINE_FEE]: new HasDeadlineFeeState(),
  [TicketState.DEADLINE_FEE]: new DeadlineFeeState(),
  [TicketState.DEADLINE_FEE_CONFIRMATION]: new DeadlineFeeState(),
  //
  [TicketState.SERVICE_DELIVERY]: new ServiceDeliveryState(),
  [TicketState.SERVICE_DELIVERY_CONFIRMATION]: new ServiceDeliveryState(),
  //
  [TicketState.HAS_CANCELLATION_FEE]: new HasCancellationFeeState(),
  [TicketState.CANCELLATION_FEE]: new CancellationFeeState(),
  [TicketState.CANCELLATION_FEE_CONFIRMATION]: new CancellationFeeState(),
  //
  [TicketState.WHAT_IS_CONTRACT_CANCELLATION]:
    new WhatIsContractCancellationState(),
  [TicketState.WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION]:
    new WhatIsContractCancellationState(),
  //
  [TicketState.WHAT_IS_CONTRACT_CANCELLATION_DETAILS]:
    new WhatIsContractCancellationDetailsState(),
  [TicketState.WHAT_IS_CONTRACT_CANCELLATION_DETAILS_CONFIRMATION]:
    new WhatIsContractCancellationDetailsState(),
  //
  [TicketState.WARRANTY_TYPE]: new WarrantyTypeState(),
  //
  [TicketState.WARRANTY_DETAILS]: new WarrantyDetailsState(),
  [TicketState.WARRANTY_DETAILS_CONFIRMATION]: new WarrantyDetailsState(),
  //
  [TicketState.JUDICIAL_RESOLUTION_DETAILS]:
    new JudicialResolutionDetailsState(),
  [TicketState.JUDICIAL_RESOLUTION_DETAILS_CONFIRMATION]:
    new JudicialResolutionDetailsState(),
  //
  [TicketState.OWNER_SIGNATURE]: new OwnerSignatureState(),
  [TicketState.COUNTERPART_SIGNATURE]: new CounterpartSignatureState(),
  //
  [TicketState.CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION]:
    new HasRejectedByCounterpartState(),
  [TicketState.CONTRACT_HAS_REJECTED_BY_COUNTERPART_CONFIRMATION]:
    new HasRejectedByCounterpartState(),
  //
  [TicketState.CONTRACT_CORRECTION_BY_OWNER]: new ContractCorrectionState(),
  [TicketState.CONTRACT_CORRECTION_BY_OWNER_CONFIRMATION]:
    new ContractCorrectionState(),
  //
  [TicketState.UPDATING_CONTRACT]: new UpdatingContractState(),
  //
  [TicketState.SERVICE_CONTRACT_APPROVAL_DESCRIPTION]: null,
  //
  [TicketState.PAID_TICKET]: new PaidTicketState(),
};
