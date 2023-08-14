import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { ClientResponse } from '@sendgrid/client/src/response';
import { InternalServerErrorServerMisconfigurationException } from '../exceptions/internal-server-error-server-misconfiguration.exception';

@Injectable()
export class MailSenderService {
  mailService: MailService;
  private readonly logger = new Logger(MailSenderService.name);
  private isSetup = false;
  constructor(private readonly configService: ConfigService) {
    // Don't forget this one.
    // The apiKey is required to authenticate our
    // request to SendGrid API.
    const sendgridKey = configService.get<string>('SENDGRID_API_KEY');
    if (sendgridKey) {
      this.mailService = new MailService();
      this.mailService.setApiKey(sendgridKey);
      this.isSetup = true;
    } else
      this.logger.error('SendGrid API Key not found in environment variables');
  }

  async send(
    mail: MailDataRequired,
  ): Promise<[ClientResponse, NonNullable<unknown>]> {
    return this.mailService.send(mail);
  }

  async sendEmailVerification(
    user: {
      email: string;
    },
    returnUrl: string,
  ) {
    if (!this.isSetup)
      throw new InternalServerErrorServerMisconfigurationException(
        'SendGrid API Key not found in environment variables',
      );

    const hostFront = this.configService.get<string>(
      'HOST_FRONT_URL',
      'http://localhost:8080/verify-email',
    );

    const url = hostFront + returnUrl;

    const mail: MailDataRequired = {
      to: user.email,
      from: 'verifyemail@infinibrains.com', // todo: make it be configurable,
      subject: 'Verify your email',
      text: 'Verify your email',
      html: '<a href="' + url + '">Verify your email</a>',
    };

    await this.send(mail);
  }
}
