import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../shared/entities/abstract.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AgreementCreationPayload } from '../agreement/types/agreement-creation-payload';

enum ConversationStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

type UserCreationPayload = {
  whatsappId: string;
  name: string;
  taxpayerNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
};

@Entity({ name: 'conversation' })
export class ConversationEntity extends AbstractEntity {
  // @ApiProperty()
  // @Column({ nullable: true })
  // owner: UserEntity;

  @ApiProperty()
  @Column({ type: 'json' })
  payload: UserCreationPayload | AgreementCreationPayload;

  @ApiProperty({ enum: ConversationStatus })
  @Column({ type: 'enum', enum: ConversationStatus, nullable: false })
  status: ConversationStatus;
}
