import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Get()
  async sendContract() {
    await this.emailService.sendContract(
      'HelloWorld',
      'contact@matheusmartins.com',
    );
  }
}
