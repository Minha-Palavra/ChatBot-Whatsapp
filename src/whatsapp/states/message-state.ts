import phone from 'phone';
import { MessagesObject, ValueObject } from 'whatsapp/build/types/webhooks';
import { IMessageProcessingContext } from './message-processing-context.interface';
import { IMessageState } from './message-state.interface';

export abstract class MessageState implements IMessageState {
  public abstract processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void>;
  protected optionHasPrefix(option: string, prefix: string): boolean {
    return (
      option === `${prefix}-yes` ||
      option === `${prefix}-no` ||
      option === `${prefix}-cancel`
    );
  }
  protected getSelectedOptionFromMessage(
    message: MessagesObject,
  ): string | null {
    const interaction: any = message.interactive;

    if ('list_reply' in interaction) {
      return interaction.list_reply.id;
    } else {
      return null;
    }
  }

  protected isValidPhoneNumber(phoneNumber: string): boolean {
    if (!phone(phoneNumber, { country: 'BR' }).isValid) {
      return phone(`+55${phoneNumber}`, { country: 'BR' }).isValid;
    }

    return true;
  }

  protected formatPhoneNumber(phoneNumber: string): string | null {
    const options = {
      country: 'BR',
      validateMobilePrefix: true,
    };
    let number = phone(phoneNumber, options);

    if (number.isValid) {
      if (number.isValid && number.phoneNumber.length === 13) {
        number = phone(
          number.phoneNumber.slice(0, 5) + '9' + number.phoneNumber.slice(5),
          options,
        );
      }
      return number.phoneNumber.replace(/\D/g, '');
    }

    if (!number.isValid) {
      number = phone(phoneNumber); // try without country code
      if (number.isValid) {
        return number.phoneNumber.replace(/\D/g, '');
      }
    }
    return null;
  }

  protected isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  protected isValidTaxpayerNumber(taxpayerNumber: string): boolean {
    const numbers = taxpayerNumber.replace(/\D/g, '');

    if (numbers.length !== 11 && numbers.length !== 14) {
      return false;
    }

    if (new Set(numbers.split('')).size === 1) {
      return false;
    }

    if (numbers.length === 11) {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += Number(numbers.charAt(i)) * (10 - i);
      }
      let remaining = sum % 11 < 2 ? 0 : 11 - (sum % 11);

      if (remaining !== Number(numbers.charAt(9))) {
        return false;
      }

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += Number(numbers.charAt(i)) * (11 - i);
      }
      remaining = sum % 11 < 2 ? 0 : 11 - (sum % 11);

      if (remaining !== Number(numbers.charAt(10))) {
        return false;
      }

      return true;
    }

    if (numbers.length === 14) {
      const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

      const calculateDigit = (numbers: string, weights: number[]) => {
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
          sum += Number(numbers[i]) * weights[i];
        }
        const remaining = sum % 11;
        return remaining < 2 ? 0 : 11 - remaining;
      };

      if (
        Number(numbers.charAt(12)) !==
        calculateDigit(numbers.substr(0, 12), weights1)
      ) {
        return false;
      }

      if (
        Number(numbers.charAt(13)) !==
        calculateDigit(numbers.substr(0, 13), weights2)
      ) {
        return false;
      }

      return true;
    }

    return false;
  }

  protected formatTaxpayerNumber(taxpayerNumber: string): string {
    if (taxpayerNumber.length === 11) {
      return taxpayerNumber.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4',
      );
    } else {
      return taxpayerNumber.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5',
      );
    }
  }
}
