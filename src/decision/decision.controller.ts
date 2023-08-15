import { Controller } from '@nestjs/common';
import { DecisionService } from './decision.service';

@Controller('decision')
export class DecisionController {
  constructor(private readonly service: DecisionService) {}
}
