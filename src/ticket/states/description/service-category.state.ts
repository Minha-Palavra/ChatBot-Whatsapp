import { MessageState } from '../../../whatsapp/states/message-state';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../../whatsapp/entities/messages';
import { TicketEntity } from '../../entities/ticket.entity';

import { UserEntity } from '../../../user/entities/user.entity';
import { formatPhoneNumber } from '../../../shared/utils';
import { TicketState } from '../../entities/ticket-state.enum';
import { ServiceDescriptionState } from './service-description.state';

export class ServiceCategoryState extends MessageState {
  public prefix = 'SERVICE_CATEGORY';

  public async onStateBegin(
    phoneNumber: string,
    user?: UserEntity,
    ticket?: TicketEntity,
  ) {
    // Update the ticket state.
    await this.whatsAppService.ticketService.save({
      ...ticket,
      state: TicketState.SERVICE_CATEGORY,
    });

    const initialCategory = await this.whatsAppService.categoryService.findOne({
      where: { slug: 'root' },
    });

    ticket.category = initialCategory;

    await this.whatsAppService.ticketService.save({
      ...ticket,
      state: TicketState.SERVICE_CATEGORY,
    });

    await this.whatsAppService.sendCategoryOptions(
      phoneNumber,
      initialCategory,
    );
  }

  public async processMessages(value: ValueObject): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await this.userService.findOneByWhatsappId(contact.wa_id);
    const ticket: TicketEntity =
      await this.whatsAppService.ticketService.findUserNewestTicket(user);

    // If the user is not registered, do nothing.
    if (!user) {
      this.logger.error('User not found.');
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = formatPhoneNumber(message.from);

      if (
        message.type === 'text' &&
        ticket.state === TicketState.SERVICE_CATEGORY
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendCategoryOptions(
          phoneNumber,
          ticket.category,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (
        message.type !== 'interactive' ||
        ticket.state !== TicketState.SERVICE_CATEGORY
      ) {
        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await this.whatsAppService.sendCategoryOptions(
          phoneNumber,
          ticket.category,
        );

        continue;
      }

      const availableOptions =
        await this.whatsAppService.categoryService.fillChildren(
          ticket.category,
        );

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        this.logger.error('Failed to get selected option from message.');
        continue;
      }

      if (selectedOption === 'previous-category') {
        ticket.category = await this.whatsAppService.categoryService.findOne({
          where: { id: ticket.category.id },
          relations: ['parent'],
        });

        if (!ticket.category.parent) {
          this.logger.error(`${ticket.category.slug} has no parent category.`);

          await this.whatsAppService.sendMessage(
            phoneNumber,
            messages.INVALID_OPTION(),
          );

          await this.whatsAppService.sendCategoryOptions(
            phoneNumber,
            ticket.category,
          );
          continue;
        }

        ticket.category = await this.whatsAppService.categoryService.findOne({
          where: { id: ticket.category.parent.id },
        });

        await this.whatsAppService.ticketService.save(ticket);
        await this.whatsAppService.sendCategoryOptions(
          phoneNumber,
          ticket.category,
        );

        continue;
      }

      const isValid = await this.isValidCategory(
        selectedOption,
        availableOptions,
      );

      if (!isValid) {
        this.logger.error(
          `${selectedOption} is not a valid option. of ${ticket.category.slug}.`,
        );

        await this.whatsAppService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );
        await this.whatsAppService.sendCategoryOptions(
          phoneNumber,
          ticket.category,
        );
        continue;
      }

      ticket.category = availableOptions.children.find(
        (child) => child.slug === selectedOption,
      );

      await this.whatsAppService.ticketService.save({
        ...ticket,
        state: TicketState.SERVICE_CATEGORY,
      });

      const wasOptionsSent = await this.whatsAppService.sendCategoryOptions(
        phoneNumber,
        ticket.category,
      );

      // If the user reached the end of the decision tree, then send a message. and move to the next state.
      if (wasOptionsSent) {
        continue;
      }

      this.nextState = new ServiceDescriptionState();
      this.nextState.whatsAppService = this.whatsAppService;
      this.nextState.logger = this.logger;
      this.nextState.userService = this.userService;

      // go to the next state.
      await this.toNextState(phoneNumber, user, ticket);
    }
  }
}
