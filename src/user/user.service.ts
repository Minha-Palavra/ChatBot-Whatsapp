import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  // create(data: Partial<WebhookObject>) {
  //   return this.repository.save({
  //     message: data,
  //     direction: direction,
  //   });
  // }
}
