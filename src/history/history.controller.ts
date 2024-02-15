import { Controller, Logger } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(private readonly service: HistoryService) {}
}
