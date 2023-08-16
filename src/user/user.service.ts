import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { WebhookObject } from 'whatsapp/build/types/webhooks';
import { FindOptionsRelations, Repository } from 'typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  async createOrFindOneByNumber(
    userPartial: Partial<UserEntity>,
    relations?: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity> {
    if (!userPartial.phonenumber)
      throw new InternalServerErrorException(
        'cannot find a user without a phone number',
      );
    const user = await this.repository.findOne({
      where: userPartial,
      relations: relations,
    });

    if (user) return user;

    return await this.repository.save(userPartial);
  }

  // create(data: Partial<WebhookObject>) {
  //   return this.repository.save({
  //     message: data,
  //     direction: direction,
  //   });
  // }
}
