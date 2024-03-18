import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from '../ticket/entities/ticket.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity]), UserModule],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
