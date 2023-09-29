import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HistoryService } from '../history/history.service';
import { ValueObject, WebhookObject } from 'whatsapp/build/types/webhooks';
import { ConfigService } from '@nestjs/config';
import { MessageDirection } from '../history/history.entity';
import { UserService } from '../user/user.service';
import { TicketService } from '../ticket/ticket.service';
import { TicketEntity, TicketState } from '../ticket/ticket.entity';
import { InteractiveObject } from 'whatsapp/src/types/messages';
import { phone } from 'phone';
import { DecisionService } from '../decision/decision.service';
import { DecisionEntity } from '../decision/decision.entity';
import { InteractiveTypesEnum } from 'whatsapp/src/types/enums';
import { UserEntity } from 'src/user/user.entity';
import { ProposalService } from 'src/proposal/proposal.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const WhatsApp = require('whatsapp');

@Injectable()
export class WhatsappService {
  wa = new WhatsApp(this.configService.get('WA_PHONE_NUMBER_ID'));
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    public historyService: HistoryService,
    private configService: ConfigService,
    private userService: UserService,
    private ticketService: TicketService,
    private decisionService: DecisionService,
    private proposalService: ProposalService,
  ) {}

  async checkWebhookMinimumRequirements(body: WebhookObject) {
    if (body.object !== 'whatsapp_business_account') {
      console.error('object is not whatsapp_business_account: ' + body.object);
      throw new UnprocessableEntityException({
        message: 'object is not whatsapp_business_account',
      });
    }
  }

  async saveMessage(body: WebhookObject) {
    await this.historyService.create(body, MessageDirection.INCOMING);
  }

  async handleWebhook(body: WebhookObject) {
    this.logger.log('Message Arrived: ' + JSON.stringify(body));

    await this.checkWebhookMinimumRequirements(body);
    await this.saveMessage(body);

    let isMessage = false;
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages') {
          this.logger.error('field is not messages: ' + change.field);
          continue;
        }
        const value = change.value;
        if (value.messaging_product !== 'whatsapp') {
          this.logger.error(
            'messaging_product is not whatsapp: ' + value.messaging_product,
          );
          continue;
        }
        if (value.statuses) {
          this.logger.error('status message arrived. not processed');
          continue;
        }
        if (value.contacts === undefined || value.contacts.length !== 1) {
          this.logger.error(
            'contacts.length is not 1: ' + value.contacts.length,
          );
          continue;
        }
        if (value.messages && value.messages.length !== 0) {
          isMessage = true;
          await this.processMessages(value);
        }
      }
    }

    if (isMessage) this.logger.log(JSON.stringify(body));

    return 'ok';
  }

  clampString(str: string, max: number): string {
    if (!str) return '.';
    return str.length > max ? str.substr(0, max - 4) + '...' : str;
  }

  private async genarateInteractiveObjectFromDecision(
    root: Partial<DecisionEntity>,
  ): Promise<InteractiveObject> {
    let decision = await this.decisionService.findOne({
      where: [{ slug: root.slug }, { id: root.id }],
      relations: ['parent'],
    });

    decision = await this.decisionService.fillChildren(decision);

    if (!decision.children || decision.children.length === 0) return null;

    const interactive: InteractiveObject = {
      action: {
        button: 'Escolha',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sections: [{ rows: [] }],
      },
      type: InteractiveTypesEnum.List,
      body: {
        text: this.clampString(decision.description, 1024),
      },
      header: {
        type: 'text',
        text: this.clampString(decision.title, 60),
      },
      footer: {
        text: this.clampString('Escolha uma opção', 60),
      },
    };
    if (decision.children.length > 0) {
      for (const child of decision.children) {
        interactive.action.sections[0].rows.push({
          title: this.clampString(child.title, 24),
          id: this.clampString(child.slug, 200),
          description: this.clampString(child.description, 72),
        });
      }

      if (decision.parent) {
        if (interactive.action.sections[0].rows.length < 9) {
          interactive.action.sections[0].rows.push({
            title: this.clampString('Voltar', 24),
            id: 'previous-category',
            description: this.clampString(
              'Voltar para a categoria anterior',
              72,
            ),
          });
        }
      }
    }
    return interactive;
  }

  private async cancelTicket(phoneNumber: string, ticket: TicketEntity) {
    ticket.state = TicketState.Finished;

    await this.ticketService.save(ticket);
    await this.sendMessage(
      phoneNumber,
      'O ticket foi cancelado com sucesso. Obrigado por usar o nosso serviço.',
    );
  }

  private async processMessages(value: ValueObject) {
    if (!this.isValidContact(value)) {
      this.logger.error("value doesn't have a valid contact.");
      return;
    }

    const contact = value.contacts[0];
    const messages = value.messages;

    for (const message of messages) {
      if (
        message.type !== 'text' &&
        message.type !== 'interactive' &&
        message.type !== 'button'
      ) {
        this.logger.error(
          `${message.type} is not a text or a interactive message.`,
        );

        continue;
      }

      const user = await this.getUserFromMessage(contact, message);
      const phoneNumber = this.formatPhoneNumber(message.from);

      if (!user) {
        this.logger.error('Failed to get or create user from the message.');
        return;
      }

      let ticket;

      // CUSTOMER.
      ticket = await this.findCustomerNewestTicket(user);
      // Customer has a ticket and the ticket is not finished.
      if (ticket && ticket.state !== TicketState.Finished) {
        if (ticket.state === TicketState.ClientRecieve) {
          if (message.type === 'text') {
            await this.sendTemplate(
              user.phonenumber,
              'envio_de_contrato_minha_palavra',
            );
            continue;
          }

          const optionsPrefix = 'customer-approval';
          const customer = await this.getCustomerFromTicket(ticket);

          ticket.state = TicketState.ClientApproval;

          await this.ticketService.save(ticket);

          await this.sendMessage(
            customer.phonenumber,
            `Ola, ${ticket.client.fullname}!
            O seu prestador de serviço ${ticket.user.fullname}, enviou uma proposta para você.
            `,
          );
          await this.sendMessage(ticket.client.phonenumber, ticket.proporsal);
          await this.sendConfirmationOptions(
            ticket.client.phonenumber,
            'Você aceita a proposta?',
            optionsPrefix,
            false,
          );
          continue;
        }
        // The ticket is waiting for the customer to accept or decline the proposal.
        if (ticket.state === TicketState.ClientApproval) {
          const optionsPrefix = 'customer-approval';
          const serviceProvider = await this.getServiceProviderFromTicket(
            ticket,
          );
          const customer = await this.getCustomerFromTicket(ticket);
          // Customer has trying to interact with the ticket by text.
          if (message.type === 'text') {
            await this.sendProposalToCustomer(ticket);
            continue;
          }

          // Customer has trying to interact with the ticket by an interactive message.
          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }
          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              'Você aceita a proposta?',
              optionsPrefix,
              false,
            );
            continue;
          }

          await this.sendMessage(
            customer.phonenumber,
            'Certo. Informaremos ao prestador de serviço.',
          );

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            ticket.accepted = false;
            ticket.state = TicketState.Finished;

            await this.ticketService.save(ticket);

            await this.sendMessage(
              serviceProvider.phonenumber,
              'Infelizmente o cliente não aceitou a sua proposta.',
            );
            continue;
          }

          ticket.accepted = true;
          ticket.state = TicketState.Finished;

          await this.ticketService.save(ticket);
          await this.sendMessage(
            serviceProvider.phonenumber,
            'Parabéns! O cliente aceitou a sua proposta.',
          );
          continue;
        }
        continue;
      }

      // SERVICE PROVIDER.
      ticket = await this.findServiceProviderNewestTicket(user);
      // Service provider has a ticket and the ticket is not finished.
      if (ticket && ticket.state !== TicketState.Finished) {
        if (ticket.state === TicketState.LGPD) {
          const optionsPrefix = 'initial-message';

          if (message.type === 'text') {
            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.sendConfirmationOptions(
              phoneNumber,
              'Podemos continuar?',
              optionsPrefix,
              false,
            );
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              'Podemos continuar?',
              optionsPrefix,
              false,
            );
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }
          ticket.state = TicketState.Chosing;
          await this.ticketService.save(ticket);
          await this.sendCategoryOptions(phoneNumber, ticket.decision);
          continue;
        }

        // Service provider is chosing an category option.
        if (ticket.state === TicketState.Chosing) {
          // If the message is not interactive, menas that user is not chosing an category option.
          if (message.type !== 'interactive') {
            this.logger.error(
              `${message.type} is not valid when user is chosing an category option.`,
            );

            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.sendCategoryOptions(phoneNumber, ticket.decision);
            continue;
          }

          const availableOptions = await this.decisionService.fillChildren(
            ticket.decision,
          );

          const selectedOption = this.getSelectedOptionFromMessage(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (selectedOption === 'previous-category') {
            ticket.decision = await this.decisionService.findOne({
              where: { id: ticket.decision.id },
              relations: ['parent'],
            });

            if (!ticket.decision.parent) {
              this.logger.error(
                `${ticket.decision.slug} has no parent category.`,
              );
              await this.sendMessage(
                phoneNumber,
                'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
              );
              await this.sendCategoryOptions(phoneNumber, ticket.decision);
              continue;
            }
            ticket.decision = await this.decisionService.findOne({
              where: { id: ticket.decision.parent.id },
            });
            await this.ticketService.save(ticket);
            await this.sendCategoryOptions(phoneNumber, ticket.decision);
            continue;
          }

          const isValid = await this.isValidCategoryOption(
            selectedOption,
            availableOptions,
          );

          if (!isValid) {
            this.logger.error(
              `${selectedOption} is not a valid option. of ${ticket.decision.slug}.`,
            );

            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.sendCategoryOptions(phoneNumber, ticket.decision);
            continue;
          }

          const category = availableOptions.children.find(
            (child) => child.slug === selectedOption,
          );

          ticket.decision = category;
          await this.ticketService.save(ticket);

          const wasOptionsSent = await this.sendCategoryOptions(
            phoneNumber,
            ticket.decision,
          );

          // If the user reached the end of the decision tree, then send a message. and move to the next state.
          if (!wasOptionsSent) {
            await this.sendMessage(
              phoneNumber,
              'Chegou no fim da arvore de decisão.',
            );

            await this.requestServiceProviderName(phoneNumber, ticket);
            continue;
          }
        }

        if (ticket.state === TicketState.Name) {
          const optionsPrefix = 'service-provider-name';

          const serviceProvider = await this.getServiceProviderFromTicket(
            ticket,
          );

          if (message.type === 'text') {
            const fullName = message.text.body;

            user.fullname = fullName;

            await this.userService.save(user);
            await this.sendConfirmationOptions(
              phoneNumber,
              `O seu nome completo é ${fullName}?`,
              optionsPrefix,
            );
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              `O seu nome completo é ${serviceProvider.fullname}?`,
              optionsPrefix,
            );
            continue;
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            user.fullname = null;

            await this.userService.save(user);
            await this.requestServiceProviderName(phoneNumber, ticket);
            continue;
          }

          await this.requestServiceProviderTaxpayerNumber(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.TaxpayerNumber) {
          const optionsPrefix = 'service-provider-taxpayer-number';

          const serviceProvider = await this.getServiceProviderFromTicket(
            ticket,
          );

          if (message.type === 'text') {
            const taxpayerNumber = message.text.body.replace(/\D/g, '');

            if (!this.isValidTaxpayerNumber(taxpayerNumber)) {
              await this.sendMessage(
                phoneNumber,
                'Este não é um CPF/CPNJ válido. Por favor, digite um CPF/CPNJ válido.',
              );
              await this.requestServiceProviderTaxpayerNumber(
                phoneNumber,
                ticket,
              );
              continue;
            }

            user.taxpayerNumber = this.formatTaxpayerNumber(taxpayerNumber);

            await this.userService.save(user);
            await this.sendConfirmationOptions(
              phoneNumber,
              `O ${
                taxpayerNumber.length === 11 ? 'CPF' : 'CPNJ'
              } ${this.formatTaxpayerNumber(taxpayerNumber)}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              `O ${
                serviceProvider.taxpayerNumber.length === 11 ? 'CPF' : 'CPNJ'
              } ${serviceProvider.taxpayerNumber}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            user.taxpayerNumber = null;

            await this.userService.save(user);
            await this.requestServiceProviderTaxpayerNumber(
              phoneNumber,
              ticket,
            );
            continue;
          }

          await this.requestServiceProviderEmail(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.Email) {
          const optionsPrefix = 'service-provider-email';

          const serviceProvider = await this.getServiceProviderFromTicket(
            ticket,
          );

          if (message.type === 'text') {
            const email = message.text.body;

            if (!this.isValidEmail(email)) {
              await this.sendMessage(
                phoneNumber,
                'Este não é um email válido. Por favor, digite um email válido.',
              );
              await this.requestServiceProviderEmail(phoneNumber, ticket);
              continue;
            }

            user.email = email;

            await this.userService.save(user);
            await this.sendConfirmationOptions(
              phoneNumber,
              `O email ${email}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              `O email ${serviceProvider.email}, está correto?`,
              optionsPrefix,
            );
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            user.email = null;

            await this.userService.save(user);
            await this.requestServiceProviderEmail(phoneNumber, ticket);
            continue;
          }

          await this.requestServiceDescription(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.JobDescription) {
          if (message.type !== 'text') {
            this.logger.error(`${message.type} is not a text message.`);

            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.requestServiceDescription(phoneNumber, ticket);
            continue;
          }

          const description = message.text.body;

          ticket.description = description;

          await this.ticketService.save(ticket);
          await this.requestServiceDeadline(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.ServiceDeadline) {
          if (message.type !== 'text') {
            this.logger.error(`${message.type} is not a text message.`);

            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.requestServiceDeadline(phoneNumber, ticket);
            continue;
          }

          const deadline = message.text.body;

          ticket.deadline = deadline;

          await this.ticketService.save(ticket);
          await this.requestPaymentMethod(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.PaymentMethod) {
          if (message.type !== 'text') {
            this.logger.error(`${message.type} is not a text message.`);

            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.requestPaymentMethod(phoneNumber, ticket);
            continue;
          }

          const paymentMethod = message.text.body;

          ticket.paymentMethod = paymentMethod;

          await this.ticketService.save(ticket);
          await this.requestJurisdictionInDispute(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.JurisdictionInDispute) {
          if (message.type !== 'text') {
            this.logger.error(`${message.type} is not a text message.`);

            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.requestJurisdictionInDispute(phoneNumber, ticket);
            continue;
          }

          const disputeForum = message.text.body;

          ticket.disputeForum = disputeForum;

          await this.ticketService.save(ticket);
          await this.requestCustomerPhoneNumber(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.ClientPhoneNumber) {
          const optionsPrefix = 'customer-phone-number';

          if (message.type === 'text') {
            let customerPhoneNumber = message.text.body.replace(/\D/g, '');

            if (!this.isValidPhoneNumber(customerPhoneNumber)) {
              await this.sendMessage(
                phoneNumber,
                'Este não é um número de telefone válido. Por favor, digite um número de telefone válido.',
              );
              await this.requestCustomerPhoneNumber(phoneNumber, ticket);
              continue;
            }
            customerPhoneNumber = this.formatPhoneNumber(customerPhoneNumber);
            const client = await this.userService.createOrFindOneByNumber({
              phonenumber: customerPhoneNumber,
            });

            ticket.client = client;

            await this.ticketService.save(ticket);
            await this.sendConfirmationOptions(
              phoneNumber,
              `O número de telefone do cliente é ${customerPhoneNumber}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);
          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            const customer = await this.getCustomerFromTicket(ticket);

            await this.sendConfirmationOptions(
              phoneNumber,
              `O número de telefone do cliente é ${customer.phonenumber}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            ticket.client = null;

            await this.ticketService.save(ticket);
            await this.requestCustomerPhoneNumber(phoneNumber, ticket);
            continue;
          }

          await this.requestCustomerName(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.ClientName) {
          const optionsPrefix = 'customer-name';

          const customer = await this.userService.findOne({
            where: { id: ticket.client.id },
          });

          if (message.type === 'text') {
            const fullName = message.text.body;

            customer.fullname = fullName;

            await this.userService.save(customer);
            await this.sendConfirmationOptions(
              phoneNumber,
              `O nome do cliente é ${fullName}, está correto?`,
              optionsPrefix,
            );

            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              `O nome do cliente é ${customer.fullname}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            customer.fullname = null;

            await this.userService.save(customer);
            await this.requestCustomerName(phoneNumber, ticket);

            continue;
          }

          await this.requestCustomerTaxpayerNumber(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.ClientTaxpayerNumber) {
          const optionsPrefix = 'customer-taxpayer-number';

          const customer = await this.userService.findOne({
            where: { id: ticket.client.id },
          });

          if (message.type === 'text') {
            const taxpayerNumber = message.text.body.replace(/\D/g, '');

            if (!this.isValidTaxpayerNumber(taxpayerNumber)) {
              await this.sendMessage(
                phoneNumber,
                'Este não é um CPF ou CPNJ válido. Por favor, digite um CPF ou CPNJ válido.',
              );
              await this.requestCustomerTaxpayerNumber(phoneNumber, ticket);
              continue;
            }

            customer.taxpayerNumber = this.formatTaxpayerNumber(taxpayerNumber);

            await this.userService.save(customer);
            await this.sendConfirmationOptions(
              phoneNumber,
              `O ${
                taxpayerNumber.length === 11 ? 'CPF' : 'CPNJ'
              } ${this.formatTaxpayerNumber(taxpayerNumber)}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              `O ${customer.taxpayerNumber.length === 11 ? 'CPF' : 'CPNJ'} ${
                customer.taxpayerNumber
              }, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            customer.taxpayerNumber = null;

            await this.userService.save(customer);
            await this.requestCustomerTaxpayerNumber(phoneNumber, ticket);
            continue;
          }

          await this.requestCustomerEmail(phoneNumber, ticket);
          continue;
        }

        if (ticket.state === TicketState.ClientEmail) {
          const optionsPrefix = 'customer-email';

          const customer = await this.userService.findOne({
            where: { id: ticket.client.id },
          });

          if (message.type === 'text') {
            const email = message.text.body;

            if (!this.isValidEmail(email)) {
              await this.sendMessage(
                phoneNumber,
                'Este não é um email válido. Por favor, digite um email válido.',
              );
              await this.requestCustomerEmail(phoneNumber, ticket);
              continue;
            }

            customer.email = email;

            await this.userService.save(customer);
            await this.sendConfirmationOptions(
              phoneNumber,
              `O email ${email}, está correto?`,
              optionsPrefix,
            );
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendConfirmationOptions(
              phoneNumber,
              `O email ${customer.email}, está correto?`,
              optionsPrefix,
            );
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            customer.email = null;

            await this.userService.save(customer);
            await this.requestCustomerEmail(phoneNumber, ticket);
            continue;
          }

          await this.generateProposal(ticket);
          continue;
        }

        if (ticket.state === TicketState.Proporsal) {
          const optionsPrefix = 'service-provider-proporsal';

          if (!(message.type === 'interactive')) {
            this.logger.error(
              `${message.type} is not valid when user is chosing an category option.`,
            );

            await this.sendMessage(
              phoneNumber,
              'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
            );
            await this.requestProporsalApprovalFromServiceProvider(ticket);
            continue;
          }

          const selectedOption = this.getSelectedConfirmationOption(message);

          if (!selectedOption) {
            this.logger.error('Failed to get selected option from message.');
            continue;
          }

          if (!this.confirmatioOptionHasPrefix(selectedOption, optionsPrefix)) {
            this.logger.error(
              `${selectedOption} is not a valid option for ${optionsPrefix}.`,
            );

            await this.sendMessage(phoneNumber, 'Está e a proposta:');
            await this.sendMessage(phoneNumber, ticket.proporsal);
            await this.sendConfirmationOptions(
              phoneNumber,
              'A proposta está correta? Podemos enviar para o cliente?',
              optionsPrefix,
            );
            continue;
          }

          if (selectedOption === `${optionsPrefix}-cancel`) {
            await this.cancelTicket(phoneNumber, ticket);
            continue;
          }

          if (selectedOption === `${optionsPrefix}-no`) {
            //await this.generateProposal(user, client, ticket);
            //TODO reestart the ticket.
            await this.sendMessage(
              user.phonenumber,
              'Tudo bem, vamos começar de novo.',
            );

            const initialDecision = await this.decisionService.findOne({
              where: { slug: 'bem-vindo' },
            });

            ticket.decision = initialDecision;
            ticket.state = TicketState.Chosing;
            ticket.description = null;
            ticket.paymentMethod = null;
            ticket.paymentAmount = null;
            ticket.proporsal = null;
            ticket.client = null;
            await this.ticketService.save(ticket);
            continue;
          }

          await this.sendProposalToCustomer(ticket);
          await this.sendMessage(
            phoneNumber,
            'Enviamos a proposta para o cliente, por favor aguarde que este responda.',
          );
          continue;
        }

        if (
          ticket.state === TicketState.ClientRecieve ||
          ticket.state === TicketState.ClientApproval
        ) {
          if (message.type !== 'text') {
            this.logger.error(`${message.type} is not a text message.`);
          }

          await this.sendMessage(
            phoneNumber,
            'Por favor, aguarde a resposta do cliente.',
          );

          continue;
        }

        continue;
      }

      // If the user has no ticket or the newest ticket is finished, then create one.
      ticket = await this.createTicketForUser(user);
      // Send the category options.
      //await this.sendCategoryOptions(phoneNumber, ticket.decision);
      await this.sendInitialMessage(phoneNumber, ticket.decision);
      continue;
    }
  }

  private async createTicketForUser(user: UserEntity): Promise<TicketEntity> {
    const initialDecision = await this.decisionService.findOne({
      where: { slug: 'bem-vindo' },
    });

    return await this.ticketService.create({
      user: user,
      decision: initialDecision,
      state: TicketState.LGPD,
    });
  }

  private async findServiceProviderNewestTicket(
    user: UserEntity,
  ): Promise<TicketEntity | null> {
    return await this.ticketService.findOne({
      where: { user: { id: user.id } },
      order: { updatedAt: 'DESC' },
      relations: { decision: true, client: true, user: true },
    });
  }

  private async findCustomerNewestTicket(
    user: UserEntity,
  ): Promise<TicketEntity | null> {
    return await this.ticketService.findOne({
      where: { client: { id: user.id } },
      order: { updatedAt: 'DESC' },
      relations: { decision: true, client: true, user: true },
    });
  }

  private async getUserFromMessage(
    contact: any,
    message: any,
  ): Promise<UserEntity> {
    if (message && message.from) {
      const phoneNumber = this.formatPhoneNumber(message.from);
      if (phoneNumber) {
        return await this.userService.createOrFindOneByNumber({
          phonenumber: phoneNumber,
        });
      } else return null;
    } else return null;
  }

  private async getServiceProviderFromTicket(
    ticket: TicketEntity,
  ): Promise<UserEntity> {
    return await this.userService.findOne({
      where: { id: ticket.user.id },
    });
  }

  private async getCustomerFromTicket(
    ticket: TicketEntity,
  ): Promise<UserEntity | null> {
    return await this.userService.findOne({
      where: { id: ticket.client.id },
    });
  }

  private async generateProposal(ticket: TicketEntity) {
    const serviceProvider = await this.getServiceProviderFromTicket(ticket);
    const customer = await this.getCustomerFromTicket(ticket);

    await this.sendMessage(
      serviceProvider.phonenumber,
      'Estamos gerando a proposta para você. Por favor, aguarde.',
    );

    const proporsal = await this.proposalService.generateProposal(
      ticket.decision.title,
      ticket.description,
      ticket.paymentMethod,
      serviceProvider.fullname,
      serviceProvider.phonenumber,
      serviceProvider.email,
      serviceProvider.taxpayerNumber,
      customer.fullname,
      customer.phonenumber,
      customer.email,
      customer.taxpayerNumber,
      ticket.deadline,
      ticket.disputeForum,
    );

    ticket.proporsal = proporsal;
    ticket.state = TicketState.Proporsal;

    await this.ticketService.save(ticket);
    await this.requestProporsalApprovalFromServiceProvider(ticket);
  }

  private async generateConfirmationOptions(
    message: string,
    optionsPrefix: string,
    cancel = true,
  ): Promise<InteractiveObject> {
    const interactive: InteractiveObject = {
      action: {
        buttons: [],
      },
      type: InteractiveTypesEnum.Button,
      body: {
        text: message,
      },
    };

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${optionsPrefix}-yes`,
        title: 'Sim',
      },
    });

    interactive.action.buttons.push({
      type: 'reply',
      reply: {
        id: `${optionsPrefix}-no`,
        title: 'Não',
      },
    });
    if (cancel) {
      interactive.action.buttons.push({
        type: 'reply',
        reply: {
          id: `${optionsPrefix}-cancel`,
          title: 'Cancelar',
        },
      });
    }
    return interactive;
  }

  private async sendConfirmationOptions(
    phoneNumber: string,
    message: string,
    optionsPrefix: string,
    cancel = true,
  ) {
    // Generate the confirmation options using the preffix.
    const confirmation = await this.generateConfirmationOptions(
      message,
      optionsPrefix,
      cancel,
    );

    const messageSent = await this.wa.messages.interactive(
      confirmation,
      phoneNumber,
    );

    this.logger.log(
      `${messageSent.statusCode()} ${messageSent.responseBodyToJSON()}`,
    );

    return true;
  }

  private confirmatioOptionHasPrefix(option: string, prefix: string): boolean {
    if (
      option === `${prefix}-yes` ||
      option === `${prefix}-no` ||
      option === `${prefix}-cancel`
    ) {
      return true;
    }
    return false;
  }

  private getSelectedOptionFromMessage(message: any): string | null {
    const interaction: any = message.interactive;

    if ('list_reply' in interaction) {
      return interaction.list_reply.id;
    } else {
      this.logger.error('message.interactive.type is not ListReplyObject');
      return null;
    }
  }

  private getSelectedConfirmationOption(message: any): string | null {
    const interactive: any = message.interactive;

    if ('type' in interactive && interactive.type === 'button_reply') {
      return interactive.button_reply.id;
    }
  }

  private async requestServiceProviderName(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.Name;
    ticket = await this.ticketService.save(ticket);

    this.sendMessage(phoneNumber, 'Qual é o seu nome?');
  }

  private async requestServiceProviderTaxpayerNumber(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.TaxpayerNumber;
    ticket = await this.ticketService.save(ticket);

    this.sendMessage(phoneNumber, 'Qual é o seu CPF/CPNJ?');
  }

  private async requestServiceProviderEmail(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.Email;
    ticket = await this.ticketService.save(ticket);

    this.sendMessage(phoneNumber, 'Qual é o seu email?');
  }

  private async requestCustomerPhoneNumber(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.ClientPhoneNumber;
    ticket = await this.ticketService.save(ticket);

    this.sendMessage(
      phoneNumber,
      'Qual é o número de telefone do seu cliente?',
    );
  }

  private async requestCustomerName(phoneNumber: string, ticket: TicketEntity) {
    ticket.state = TicketState.ClientName;
    ticket = await this.ticketService.save(ticket);

    this.sendMessage(phoneNumber, 'Qual é o nome do seu cliente?');
  }

  private async requestCustomerTaxpayerNumber(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.ClientTaxpayerNumber;
    ticket = await this.ticketService.save(ticket);

    this.sendMessage(phoneNumber, 'Qual é o seu CPF/CPNJ do seu cliente?');
  }

  private async requestCustomerEmail(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.ClientEmail;
    ticket = await this.ticketService.save(ticket);

    this.sendMessage(phoneNumber, 'Qual é o email do cliente?');
  }

  private async requestJurisdictionInDispute(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.JurisdictionInDispute; // Novo estado correspondente à etapa de definição da comarca.
    ticket = await this.ticketService.save(ticket);

    await this.sendMessage(
      phoneNumber,
      'Em caso de disputa, qual comarca será usada para o juizado?',
    );
  }

  /************************************************************************************************************************************************************************************************/

  private async requestServiceDescription(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.JobDescription;
    ticket = await this.ticketService.save(ticket);

    await this.sendMessage(
      phoneNumber,
      'Descreva em detalhes o serviço que irá prestar.',
    );
  }

  private async requestServiceDeadline(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.ServiceDeadline; // Novo estado correspondente à etapa de definição do prazo.
    ticket = await this.ticketService.save(ticket);

    await this.sendMessage(
      phoneNumber,
      'Qual o prazo para a prestação do serviço?',
    );
  }

  private async requestPaymentMethod(
    phoneNumber: string,
    ticket: TicketEntity,
  ) {
    ticket.state = TicketState.PaymentMethod;
    ticket = await this.ticketService.save(ticket);

    await this.sendMessage(phoneNumber, '*Metodo de Pagemento:*');
    await this.sendMessage(
      phoneNumber,
      'Responda a perguntas que fazem sentido ao seu contrato como:',
    );
    await this.sendMessage(
      phoneNumber,
      `• Qual é o valor?
      • Qual é a forma de Pagamento? 
      • É possível pagar à vista ou parcelar?
      • Em caso de parcelamento, em quantas vezes pode ser feito? 
      • Qual é a data estipulada para os pagamentos?
      • Há juros? Explique como funciona.
      • Há multa em caso de atraso ou cancelamento do serviço?
      • Qual é a multa em caso de atraso ou cancelamento do serviço?`,
    );
  }

  private async requestProporsalApprovalFromServiceProvider(
    ticket: TicketEntity,
  ) {
    const optionsPrefix = 'service-provider-proporsal';
    const serviceProvider = await this.getServiceProviderFromTicket(ticket);
    await this.sendMessage(serviceProvider.phonenumber, 'Está e a proposta:');
    await this.sendMessage(serviceProvider.phonenumber, ticket.proporsal);
    await this.sendConfirmationOptions(
      serviceProvider.phonenumber,
      'A proposta está correta? Podemos enviar para o cliente?',
      optionsPrefix,
    );
  }

  private async sendMessage(phoneNumber: string, message: string) {
    const sentMessage = await this.wa.messages.text(
      { body: message },
      phoneNumber,
    );
    this.logger.log(
      `${sentMessage.statusCode()}: ${JSON.stringify(
        sentMessage.responseBodyToJSON(),
      )}`,
    );
  }

  /************************************************************************************************************************************************************************************************/

  private async sendTemplate(
    phoneNumber: string,
    name: string,
    parameters?: any,
  ) {
    try {
      const sentMessage = await this.wa.messages.template(
        {
          namespace: '55fac29d_e030_40c0_8215_ce4ec00c3623',
          name: name,
          language: {
            code: 'pt_BR',
          },
          // parameters: parameters,
        },

        phoneNumber,
      );
      // this.logger.log(JSON.stringify(sentMessage));
      this.logger.log(
        `${sentMessage.statusCode()}: ${JSON.stringify(
          sentMessage.responseBodyToJSON(),
        )}`,
      );
    } catch (error) {
      throw error;
    }
  }

  /************************************************************************************************************************************************************************************************/

  private async sendProposalToCustomer(ticket: TicketEntity) {
    const optionsPrefix = 'customer-approval';

    const customer = await this.getCustomerFromTicket(ticket);

    ticket.state = TicketState.ClientRecieve;

    await this.ticketService.save(ticket);
    await this.sendTemplate(
      customer.phonenumber,
      'envio_de_contrato_minha_palavra',
    );

    // await this.sendMessage(
    //   customer.phonenumber,
    //   `Ola, ${ticket.client.fullname}!
    //   O seu prestador de serviço ${ticket.user.fullname}, enviou uma proposta para você.
    //   `,
    // );
    // await this.sendMessage(ticket.client.phonenumber, ticket.proporsal);
    // await this.sendConfirmationOptions(
    //   ticket.client.phonenumber,
    //   'Você aceita a proposta?',
    //   optionsPrefix,
    // );
  }

  private async sendInitialMessage(
    phoneNumber: string,
    decision: DecisionEntity,
  ) {
    const optionsPrefix = 'initial-message';
    await this.sendMessage(phoneNumber, '*Bem-vindo ao MinhaPalavra!*');
    await this.sendMessage(
      phoneNumber,
      'Estou ciente de estar participando do teste para o surgimento do MINHA PALAVRA. Uma plataforma que irá colaborar para fortalecer os acordos do dia-a-dia. Nesta fase beta teste não nos responsabilizamos por erros ou instabilidades da plataforma. Os emails serão solicitados para pesquisas futuras. Seus dados estão sob as leis de LGPD.',
    );
    await this.sendConfirmationOptions(
      phoneNumber,
      'Podemos continuar?',
      optionsPrefix,
      false,
    );
  }

  private async sendCategoryOptions(
    phoneNumber: string,
    decision: DecisionEntity,
  ): Promise<boolean> {
    const optionList = await this.genarateInteractiveObjectFromDecision(
      decision,
    );

    if (!optionList) {
      return false;
    }
    this.logger.log(JSON.stringify(optionList));
    const message = await this.wa.messages.interactive(optionList, phoneNumber);

    this.logger.log(`${message.statusCode()} ${message.responseBodyToJSON()}`);

    return true;
  }

  private async isValidCategoryOption(
    selectedOption: string,
    options: DecisionEntity,
  ): Promise<boolean> {
    return !!options.children.find((child) => child.slug === selectedOption);
  }

  private isValidContact(value: ValueObject): boolean {
    return !(
      value.contacts === undefined ||
      value.contacts === null ||
      value.contacts.length !== 1
    );
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    if (!phone(phoneNumber, { country: 'BR' }).isValid) {
      return phone(`+55${phoneNumber}`, { country: 'BR' }).isValid;
    }

    return true;
  }

  private formatPhoneNumber(phoneNumber: string): string | null {
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

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  private isValidTaxpayerNumber(taxpayerNumber: string): boolean {
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

  private formatTaxpayerNumber(taxpayerNumber: string): string {
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
