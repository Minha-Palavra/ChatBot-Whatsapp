import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);
}
