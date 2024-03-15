import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class CategoryState extends MessageState {
  public async processMessages(
    value: ValueObject,
    context: IMessageProcessingContext,
  ): Promise<void> {
    const contact = value.contacts[0];

    // Get the user from the database.
    const user = await context.userService.findOneByWhatsappId(contact.wa_id);
    const ticket: TicketEntity =
      await context.whatsappService.ticketService.findUserNewestTicket(user);

    // If the user is not registered, do nothing.
    if (!user) {
      context.logger.error('User not found.');
      return;
    }

    // Iterate over the messages.
    for (const message of value.messages) {
      const phoneNumber = this.formatPhoneNumber(message.from);

      if (message.type === 'text') {
        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.INVALID_OPTION(),
        );

        await context.whatsappService.sendCategoryOptions(
          phoneNumber,
          ticket.category,
        );

        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
        continue;
      }

      const availableOptions =
        await context.whatsappService.categoryService.fillChildren(
          ticket.category,
        );

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        context.logger.error('Failed to get selected option from message.');
        continue;
      }

      if (selectedOption === 'previous-category') {
        ticket.category = await context.whatsappService.categoryService.findOne(
          {
            where: { id: ticket.category.id },
            relations: ['parent'],
          },
        );

        if (!ticket.category.parent) {
          context.logger.error(
            `${ticket.category.slug} has no parent category.`,
          );
          await context.whatsappService.sendMessage(
            phoneNumber,
            'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
          );

          await context.whatsappService.sendCategoryOptions(
            phoneNumber,
            ticket.category,
          );
          continue;
        }

        ticket.category = await context.whatsappService.categoryService.findOne(
          {
            where: { id: ticket.category.parent.id },
          },
        );

        await context.whatsappService.ticketService.save(ticket);
        await context.whatsappService.sendCategoryOptions(
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
        context.logger.error(
          `${selectedOption} is not a valid option. of ${ticket.category.slug}.`,
        );

        await context.whatsappService.sendMessage(
          phoneNumber,
          'Esta não é uma opção válida neste momento. Por favor, selecione uma opção válida.',
        );
        await context.whatsappService.sendCategoryOptions(
          phoneNumber,
          ticket.category,
        );
        continue;
      }

      const category = availableOptions.children.find(
        (child) => child.slug === selectedOption,
      );

      ticket.category = category;

      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_SERVICE_CATEGORY,
      });

      const wasOptionsSent = await context.whatsappService.sendCategoryOptions(
        phoneNumber,
        ticket.category,
      );

      // If the user reached the end of the decision tree, then send a message. and move to the next state.
      if (wasOptionsSent) {
        continue;
      }

      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_SERVICE_DETAILS,
      });

      // TODO: Send the address confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.,
      // );

      await context.whatsappService.sendMessage(
        phoneNumber,
        messages.SERVICE_DETAILS_REQUEST(),
      );
    }
  }
}
