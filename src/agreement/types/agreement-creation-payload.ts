import { OwnerType } from '../../ticket/entities/owner-type';

export type AgreementCreationPayload = {
  ownerType: OwnerType;
  provider: {
    name: string;
    taxpayerNumber: string;
    phoneNumber: string;
    email: string;
    address: string;
  };
  customer?: {
    name?: string;
    taxpayerNumber?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
  };
  service?: {
    description?: string;
    address?: string;
    startDate?: string;
    endDate?: string;
    price?: number;
    deliveryDetails?: string;
    hasWorkingHours?: boolean;
    workingHoursDetails?: string;
  };
  paymentMethod?: {
    description?: string;
    isPaymentInInstallments?: boolean;
    installments?: number;
    installmentsDetails?: string;
    hasAnEntranceFee?: boolean;
    entranceFeeDetails?: string;
    paymentDates?: string;
  };
  materials?: {
    isPartOfContract?: boolean;
    description?: string;
    requiredBudgetsCount?: string;
    howWillBeBought?: string;
    whoWillBuy?: OwnerType;
    whoWillPay?: OwnerType;
    hasAnPredictedPrice?: boolean;
    predictedPrice?: string;
    whenWillBeDelivered?: string;
    whereWillBeDelivered?: string;
    hasPayback?: boolean;
    paybackDetails?: string;
  };
  warranty?: {
    hasWarranty?: boolean;
    warrantyPeriod?: string;
    warrantyDetails?: string;
  };
  policies?: {
    hasLateDeliveryFee?: boolean;
    lateDeliveryFeeDetails?: string;
    hasPaymentDelayFee?: boolean;
    paymentDelayFeeDetails?: string;
    hasTerminationClause?: boolean;
    terminationReasons?: string;
    terminationDetails?: string;
    hasTerminationFee?: boolean;
    terminationFeeDetails?: string;
    disputeResolutionCourt?: string;
  };
};
