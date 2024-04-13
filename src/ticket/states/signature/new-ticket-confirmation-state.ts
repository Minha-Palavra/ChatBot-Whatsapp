// import { MessageState } from '../../../whatsapp/states/message-state';
// import { ValueObject } from 'whatsapp/build/types/webhooks';
// import { messages } from '../../../whatsapp/entities/messages';
// import { prefix } from '../../../whatsapp/entities/prefix';
// import { TicketState } from '../../entities/ticket-state.enum';
// import { formatPhoneNumber } from '../../../shared/utils';
// import { UserEntity } from '../../../user/entities/user.entity';
// import { TicketEntity } from '../../entities/ticket.entity';
//
// export class NewTicketConfirmationState extends MessageState {
//   public prefix = 'NEW_TICKET';
//
//   public async onStateBegin(
//     phoneNumber: string,
//     user?: UserEntity,
//     ticket?: TicketEntity,
//   ) {}
//
//   public async processMessages(value: ValueObject): Promise<void> {
//     const contact = value.contacts[0];
//
//     // Get the user from the database.
//     const user = await this.userService.findOneByWhatsappId(contact.wa_id);
//
//     // If the user is not registered, do nothing.
//     if (!user) {
//       this.logger.error('User not found.');
//       return;
//     }
//
//     // Iterate over the messages.
//     for (const message of value.messages) {
//       const phoneNumber = formatPhoneNumber(message.from);
//
//       if (message.type === 'text') {
//         // await this.whatsAppService.sendMessage(
//         //   phoneNumber,
//         //   messages.INVALID_OPTION(),
//         // );
//
//         await this.whatsAppService.sendConfirmationOptions(
//           phoneNumber,
//           messages.NEW_TICKET_CONFIRMATION(),
//           prefix.NEW_TICKET,
//           true,
//         );
//
//         continue;
//       }
//
//       // If the message is not interactive, do nothing.
//       if (message.type !== 'interactive') {
//         continue;
//       }
//
//       const selectedOption = this.getSelectedOptionFromMessage(message);
//
//       if (!selectedOption) {
//         this.logger.error('Failed to get selected option from message.');
//         continue;
//       }
//
//       // Check if the selected option is valid.
//       if (!this.optionHasValidPrefix(selectedOption, prefix.NEW_TICKET)) {
//         this.logger.error(
//           `${selectedOption} is not a valid option for ${prefix.NEW_TICKET}.`,
//         );
//
//         await this.whatsAppService.sendConfirmationOptions(
//           phoneNumber,
//           messages.NEW_TICKET_CONFIRMATION(),
//           prefix.NEW_TICKET,
//           true,
//         );
//
//         continue;
//       }
//
//       if (selectedOption === `${prefix.NEW_TICKET}-NO`) {
//         await this.onStateBegin(phoneNumber, user, ticket);
//         await this.whatsAppService.ticketService.create({
//           owner: user,
//           state: TicketState.WAITING_OWNER_TYPE,
//         });
//
//         await this.whatsAppService.sendMessage(
//           phoneNumber,
//           messages.TICKET_START(),
//         );
//
//         // TODO: Go to next state.
//         await this.whatsAppService.sendContractPartyOptions(
//           phoneNumber,
//           messages.TICKET_OWNER_TYPE_REQUEST(),
//           prefix.TICKET_OWNER_TYPE,
//         );
//       } else if (selectedOption === `${prefix.NEW_TICKET}-YES`) {
//       } else {
//       }
//     }
//   }
// }
