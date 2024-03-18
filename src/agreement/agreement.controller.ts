import { Controller, Get } from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { AgreementCreationPayload } from './types/agreement-creation-payload';
import { OwnerType } from '../ticket/entities/owner-type';

@Controller('agreement')
export class AgreementController {
  constructor(private readonly agreementService: AgreementService) {}

  @Get()
  async generateAgreement() {
    const payload: AgreementCreationPayload = {
      ownerType: OwnerType.SERVICE_PROVIDER,
      provider: {
        name: 'Provider ABC',
        taxpayerNumber: '123456789',
        phoneNumber: '123-456-7890',
        email: 'contact@providerabc.com',
        address: '1234 Provider St, Business City',
      },
      customer: {
        name: 'Customer XYZ',
        taxpayerNumber: '987654321',
        phoneNumber: '098-765-4321',
        email: 'customer@customerxyz.com',
        address: '4321 Customer Ave, Market Town',
      },
      service: {
        description: 'Comprehensive maintenance service',
        address: '4321 Customer Ave, Market Town',
        startDate: '2024-01-10',
        endDate: '2024-01-15',
        price: 5000,
        deliveryDetails: 'All tools and parts will be provided by Provider ABC',
        hasWorkingHours: true,
        workingHoursDetails: '9 AM to 5 PM, Monday to Friday',
      },
      paymentMethod: {
        description: 'Monthly installments over one year',
        isPaymentInInstallments: true,
        installments: 12,
        installmentsDetails: 'Equal payments, due by the 5th of each month',
        hasAnEntranceFee: true,
        entranceFeeDetails: '10% of total cost due upfront',
        paymentDates: '2024-02-05, 2024-03-05, ... , 2025-01-05',
      },
      materials: {
        isPartOfContract: true,
        description: 'Spare parts for machinery maintenance',
        requiredBudgetsCount: '3',
        howWillBeBought: 'Purchased directly by the provider',
        whoWillBuy: OwnerType.CUSTOMER,
        whoWillPay: OwnerType.CUSTOMER,
        hasAnPredictedPrice: true,
        predictedPrice: '2000',
        whenWillBeDelivered: '2024-01-08',
        whereWillBeDelivered: '4321 Customer Ave, Market Town',
        hasPayback: true,
        paybackDetails: 'Full refund within 30 days in case of non-use',
      },
      warranty: {
        hasWarranty: true,
        warrantyPeriod: '1 year',
        warrantyDetails: 'Covers labor and parts for all services rendered',
      },
      policies: {
        hasLateDeliveryFee: true,
        lateDeliveryFeeDetails: '5% of total cost for each day of delay',
        hasPaymentDelayFee: true,
        paymentDelayFeeDetails:
          'Interest of 1.5% per month on overdue payments',
        hasTerminationClause: true,
        terminationReasons: 'Breach of contract, non-payment',
        terminationDetails: 'Either party may terminate with 30 days notice',
        hasTerminationFee: true,
        terminationFeeDetails: '25% of the remaining contract value',
        disputeResolutionCourt: 'Commercial Court of Business City',
      },
    };

    return await this.agreementService.generateAgreement(payload);
  }
}
