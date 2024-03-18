import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppController } from './app.controller';
import { HistoryModule } from './history/history.module';
import { ApiConfigService } from './shared/api-config.service';
import { SharedModule } from './shared/shared.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { CategoryModule } from './category/category.module';
import { ContractModule } from './contract/contract.module';
import { ConversationModule } from './conversation/conversation.module';
import { AgreementModule } from './agreement/agreement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options provided');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    WhatsappModule,
    TicketModule,
    UserModule,
    HistoryModule,
    // PaymentModule,
    CategoryModule,
    ContractModule,
    ConversationModule,
    AgreementModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
