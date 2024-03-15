import { ValueObject } from 'whatsapp/build/types/webhooks';
import { IMessageProcessingContext } from './message-processing-context.interface';

export interface IMessageState {
  previousState?: IMessageState;
  nextState?: IMessageState;

  onStateBegin(): Promise<void>;

  onStateEnd(): Promise<void>;

  processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void>;
}
