import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  public async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: {
        email: email,
      },
    });

    if (user) return user;
  }

  public async findOneByPhoneNumber(phoneNumber: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (user) return user;
  }

  public async findOneByTaxpayerNumber(
    taxpayerNumber: string,
  ): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: {
        taxpayerNumber: taxpayerNumber,
      },
    });

    if (user) return user;
  }

  public async findOneByWhatsappId(whatsappId: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: {
        whatsappId: whatsappId,
      },
    });

    if (user) return user;
  }

  public async save(data: Partial<UserEntity>) {
    return this.repository.save(data);
  }
}
