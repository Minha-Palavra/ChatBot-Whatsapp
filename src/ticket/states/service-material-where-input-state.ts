import { MessageState } from '../../whatsapp/states/message-state';
import { IMessageProcessingContext } from '../../whatsapp/states/message-processing-context.interface';
import { ValueObject } from 'whatsapp/build/types/webhooks';
import { messages } from '../../whatsapp/entities/messages';
import { prefix } from '../../whatsapp/entities/prefix';
import { TicketEntity } from '../entities/ticket.entity';
import { TicketState } from '../entities/ticket-state';

export class ServiceMaterialWhereInputState extends MessageState {
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
        const serviceMaterialWhere = message.text.body;

        ticket.serviceMaterialWhere = serviceMaterialWhere;

        // Update the user state.
        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_MATERIAL_WHERE_CONFIRMATION,
        });

        // Send the confirmation options.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_MATERIAL_WHERE_CONFIRMATION_REQUEST(
            ticket.serviceMaterialWhere,
          ),
          prefix.SERVICE_MATERIAL_WHERE,
          false,
        );
        continue;
      }

      // If the message is not interactive, do nothing.
      if (message.type !== 'interactive') {
        continue;
      }

      const selectedOption = this.getSelectedOptionFromMessage(message);

      if (!selectedOption) {
        context.logger.error('Failed to get selected option from message.');
        continue;
      }

      // Check if the selected option is valid.
      if (!this.optionHasPrefix(selectedOption, prefix.SERVICE_MATERIAL_WHERE)) {
        context.logger.error(
          `${selectedOption} is not a valid option for ${prefix.SERVICE_MATERIAL_WHERE}.`,
        );

        // Send the confirmation options again.
        await context.whatsappService.sendConfirmationOptions(
          phoneNumber,
          messages.SERVICE_MATERIAL_WHERE_CONFIRMATION_REQUEST(
            ticket.serviceMaterialWhere,
          ),
          prefix.SERVICE_MATERIAL_WHERE,
          false,
        );

        continue;
      }

      if (selectedOption === `${prefix.SERVICE_MATERIAL_WHERE}-no`) {
        // TODO: Go to previous state.
        ticket.serviceMaterialWhere = null;

        await context.whatsappService.ticketService.save({
          ...ticket,
          state: TicketState.WAITING_SERVICE_MATERIAL_WHERE,
        });

        await context.whatsappService.sendMessage(
          phoneNumber,
          messages.SERVICE_MATERIAL_WHERE_REQUEST(),
        );

        continue;
      }

      // Save the user.
      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_SERVICE_CATEGORY,
      });

      // TODO: Send the name confirmation success message.
      // await context.whatsappService.sendMessage(
      //   phoneNumber,
      //   messages.userPhoneNumberConfirmationSuccess,
      // );

      const initialCategory =
        await context.whatsappService.categoryService.findOne({
          where: { slug: 'root' },
        });

      ticket.category = initialCategory;

      await context.whatsappService.ticketService.save({
        ...ticket,
        state: TicketState.WAITING_SERVICE_CATEGORY,
      });

      await context.whatsappService.sendCategoryOptions(
        phoneNumber,
        initialCategory,
      );
    }
  }
}
