import { ValueObject } from 'whatsapp/build/types/webhooks';
import { IMessageProcessingContext } from './message-processing-context.interface';

export interface IMessageState {
  processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void>;
}
