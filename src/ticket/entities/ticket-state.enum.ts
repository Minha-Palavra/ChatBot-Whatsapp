export enum TicketState {
  NONE = 'NONE',
  NEW_TICKET = 'NEW_TICKET',
  FIRST_TICKET = 'FIRST_TICKET',
  PAID_TICKET = 'PAID_TICKET',
  SELECT_TICKET = 'SELECT_TICKET',
  //
  OWNER_TYPE = 'OWNER_TYPE',
  //
  COUNTERPART_NAME = 'COUNTERPART_NAME',
  COUNTERPART_NAME_CONFIRMATION = 'COUNTERPART_NAME_CONFIRMATION',
  //
  COUNTERPART_TAXPAYER_NUMBER = 'COUNTERPART_TAXPAYER_NUMBER',
  COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION = 'COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION',
  //
  COUNTERPART_PHONE_NUMBER = 'COUNTERPART_PHONE_NUMBER',
  COUNTERPART_PHONE_NUMBER_CONFIRMATION = 'COUNTERPART_PHONE_NUMBER_CONFIRMATION',
  //
  COUNTERPART_EMAIL = 'COUNTERPART_EMAIL',
  COUNTERPART_EMAIL_CONFIRMATION = 'COUNTERPART_EMAIL_CONFIRMATION',
  //
  COUNTERPART_ADDRESS = 'COUNTERPART_ADDRESS',
  COUNTERPART_ADDRESS_CONFIRMATION = 'COUNTERPART_ADDRESS_CONFIRMATION',
  //
  SERVICE_CATEGORY = 'SERVICE_CATEGORY',
  SERVICE_DESCRIPTION = 'SERVICE_DESCRIPTION',
  SERVICE_DESCRIPTION_CONFIRMATION = 'SERVICE_DESCRIPTION_CONFIRMATION',
  //
  SERVICE_HAS_STEPS = 'SERVICE_HAS_STEPS',
  SERVICE_STEPS_DESCRIPTION = 'SERVICE_STEPS_DESCRIPTION',
  SERVICE_STEPS_DESCRIPTION_CONFIRMATION = 'SERVICE_STEPS_DESCRIPTION_CONFIRMATION',
  //
  SERVICE_ADDRESS = 'SERVICE_ADDRESS',
  SERVICE_ADDRESS_CONFIRMATION = 'SERVICE_ADDRESS_CONFIRMATION',
  //
  SERVICE_START_DATE = 'SERVICE_START_DATE',
  SERVICE_START_DATE_CONFIRMATION = 'SERVICE_START_DATE_CONFIRMATION',
  //
  SERVICE_END_DATE = 'SERVICE_END_DATE',
  SERVICE_END_DATE_CONFIRMATION = 'SERVICE_END_DATE_CONFIRMATION',
  //
  SERVICE_HAS_WORK_HOURS = 'SERVICE_HAS_WORK_HOURS',
  SERVICE_WORK_HOURS_DESCRIPTION = 'SERVICE_WORK_HOURS_DESCRIPTION',
  SERVICE_WORK_HOURS_DESCRIPTION_CONFIRMATION = 'SERVICE_WORK_HOURS_DESCRIPTION_CONFIRMATION',
  // TODO:
  PAYMENT_AMOUNT = 'PAYMENT_AMOUNT',
  PAYMENT_AMOUNT_CONFIRMATION = 'PAYMENT_AMOUNT_CONFIRMATION',
  //
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  //
  IN_CASH_PAYMENT_METHOD = 'IN_CASH_PAYMENT_METHOD',
  //
  IN_INSTALLMENTS_PAYMENT_METHOD = 'IN_INSTALLMENTS_PAYMENT_METHOD',
  //
  OTHER_IN_INSTALLMENTS_PAYMENT_METHOD_DESCRIPTION = 'OTHER_IN_INSTALLMENT_PAYMENT_METHOD_DESCRIPTION',
  OTHER_IN_INSTALLMENTS_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION = 'OTHER_IN_INSTALLMENT_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION',
  //
  OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION = 'OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION',
  OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION = 'OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION',
  //
  OTHER_PAYMENT_METHOD_DESCRIPTION = 'OTHER_PAYMENT_METHOD_DESCRIPTION',
  OTHER_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION = 'OTHER_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION',
  //
  INSTALLMENT_COUNT = 'INSTALLMENT_COUNT',
  INSTALLMENT_COUNT_CONFIRMATION = 'INSTALLMENT_COUNT_CONFIRMATION',
  //
  PAYMENT_DUE_DATES = 'PAYMENT_DUE_DATES',
  PAYMENT_DUE_DATES_CONFIRMATION = 'PAYMENT_DUE_DATES_CONFIRMATION',
  //
  MATERIALS_ARE_PART_OF_CONTRACT = 'MATERIALS_ARE_PART_OF_CONTRACT',
  //
  WHO_WILL_BUY_MATERIALS = 'WHO_WILL_BUY_MATERIALS',
  //
  HOW_MATERIALS_WILL_BE_BOUGHT = 'HOW_MATERIALS_WILL_BE_BOUGHT',
  HOW_MATERIALS_WILL_BE_BOUGHT_CONFIRMATION = 'HOW_MATERIALS_WILL_BE_BOUGHT_CONFIRMATION',
  //
  MATERIALS_HAVE_PRE_DETERMINED_VALUE = 'MATERIALS_HAVE_PRE_DETERMINED_VALUE',
  MATERIALS_HAVE_PRE_DETERMINED_VALUE_CONFIRMATION = 'MATERIALS_HAVE_PRE_DETERMINED_VALUE_CONFIRMATION',
  //
  WHO_WILL_PAY_MATERIALS = 'WHO_WILL_PAY_MATERIALS',
  //
  HAS_MATERIALS_PURCHASE_DETAILS = 'HAS_MATERIALS_PURCHASE_DETAILS',
  MATERIALS_PURCHASE_DETAILS_DESCRIPTION = 'MATERIALS_PURCHASE_DETAILS_DESCRIPTION',
  MATERIALS_PURCHASE_DETAILS_DESCRIPTION_CONFIRMATION = 'MATERIALS_PURCHASE_DETAILS_DESCRIPTION_CONFIRMATION',

  //
  MATERIALS_DELIVERY_SCHEDULE = 'MATERIALS_DELIVERY_SCHEDULE',
  MATERIALS_DELIVERY_SCHEDULE_CONFIRMATION = 'MATERIALS_DELIVERY_SCHEDULE_CONFIRMATION',
  //
  HOW_MANY_BUDGETS_BEFORE_BUY_MATERIALS = 'MATERIALS_HOW_MUCH_BUDGETS',
  HOW_MANY_BUDGETS_BEFORE_BUY_MATERIALS_CONFIRMATION = 'MATERIALS_HOW_MUCH_BUDGETS_CONFIRMATION',
  //
  WHERE_MATERIALS_WILL_BE_DELIVERED = 'MATERIALS_WHERE',
  WHERE_MATERIALS_WILL_BE_DELIVERED_CONFIRMATION = 'MATERIALS_WHERE_CONFIRMATION',
  //
  MATERIALS_ARE_REFUNDABLE = 'MATERIALS_ARE_REFUNDABLE',
  MATERIALS_ARE_REFUNDABLE_CONFIRMATION = 'MATERIALS_ARE_REFUNDABLE_CONFIRMATION',
  //
  HAS_PAYMENT_FEE = 'HAS_PAYMENT_FEE',
  PAYMENT_FEE = 'PAYMENT_FEE',
  PAYMENT_FEE_CONFIRMATION = 'SERVICE_CONTRACT_HAS_MORE_DESCRIPTION_CONFIRMATION ',
  //
  HAS_DEADLINE_FEE = 'HAS_DEADLINE_FEE',
  DEADLINE_FEE = 'DEADLINE_FEE',
  DEADLINE_FEE_CONFIRMATION = 'DEADLINE_FEE_CONFIRMATION',
  //
  HAS_CANCELLATION_FEE = 'HAS_CANCELLATION_FEE',
  CANCELLATION_FEE = 'CANCELLATION_FEE',
  CANCELLATION_FEE_CONFIRMATION = 'CANCELLATION_FEE_CONFIRMATION',
  //
  WHAT_IS_CONTRACT_CANCELLATION = 'WHAT_IS_CONTRACT_CANCELLATION',
  WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION = 'WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION',
  //
  WHAT_IS_CONTRACT_CANCELLATION_DETAILS = 'WHAT_IS_CONTRACT_CANCELLATION_DETAILS',
  WHAT_IS_CONTRACT_CANCELLATION_DETAILS_CONFIRMATION = 'WHAT_IS_CONTRACT_CANCELLATION_DETAILS_CONFIRMATION',

  SERVICE_DELIVERY = 'SERVICE_DELIVERY',
  SERVICE_DELIVERY_CONFIRMATION = 'SERVICE_DELIVERY_CONFIRMATION',

  SERVICE_CONTRACT_APPROVAL_DESCRIPTION = 'SERVICE_CONTRACT_APPROVAL_DESCRIPTION',
  CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION = 'CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION',
  CONTRACT_HAS_REJECTED_BY_COUNTERPART_CONFIRMATION = 'CONTRACT_HAS_REJECTED_BY_COUNTERPART_CONFIRMATION',
  //
  CONTRACT_CORRECTION_BY_OWNER = 'CONTRACT_CORRECTION_BY_OWNER',
  CONTRACT_CORRECTION_BY_OWNER_CONFIRMATION = 'CONTRACT_CORRECTION_BY_OWNER_CONFIRMATION',
  //
  WARRANTY_TYPE = 'WARRANTY_TYPE',
  WARRANTY_DETAILS = 'WARRANTY_DETAILS',
  WARRANTY_DETAILS_CONFIRMATION = 'WARRANTY_DETAILS_CONFIRMATION',

  //
  JUDICIAL_RESOLUTION_DETAILS = 'JUDICIAL_RESOLUTION_DETAILS',
  JUDICIAL_RESOLUTION_DETAILS_CONFIRMATION = 'JUDICIAL_RESOLUTION_DETAILS_CONFIRMATION',
  //
  GENERATING_CONTRACT = 'GENERATING_CONTRACT',
  //
  OWNER_SIGNATURE = 'OWNER_SIGNATURE',
  COUNTERPART_SIGNATURE = 'COUNTERPART_SIGNATURE',
  UPDATING_CONTRACT = 'UPDATING_CONTRACT',
  CONTRACT_WAS_COMPLETED = 'CONTRACT_WAS_COMPLETED',
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  WAS_PAID = 'WAS_PAID',
  CREATE_TICKET_PIX_PAYMENT = 'CREATE_TICKET_PIX_PAYMENT',
}