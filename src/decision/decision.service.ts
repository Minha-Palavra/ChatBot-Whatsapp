import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { DecisionEntity } from './decision.entity';
import {
  MinhaPalavraSeedData,
  MinhaPalavraSeedType,
} from './minhapalavra.seed';
import slugify from 'slugify';

@Injectable()
export class DecisionService {
  private readonly logger = new Logger(DecisionService.name);
  constructor(
    @InjectRepository(DecisionEntity)
    private readonly repository: TreeRepository<DecisionEntity>,
  ) {
    this.seed();
  }

  async seed() {
    const roots = await this.repository.findRoots();
    if (roots.length > 1) this.logger.error('more than one root found');
    if (roots.length === 1) {
      this.logger.log('db already seeded');
      return;
    }

    this.logger.warn('seeding db');
    await this.seedRecursive(MinhaPalavraSeedData, null);
    this.logger.warn('db seeded successfully');
  }

  async seedRecursive(
    seed: Partial<MinhaPalavraSeedType>,
    parent: DecisionEntity,
  ) {
    if (!seed.slug) seed.slug = slugify(seed.title, { lower: true });
    const entity = await this.repository.save({
      title: seed.title,
      slug: seed.slug,
      parent: parent,
    });
    if (seed.children) {
      for (const child of seed.children) {
        await this.seedRecursive(child, entity);
      }
    }
  }

  // create(data: Partial<WebhookObject>, direction: MessageDirection) {
  //     return this.repository.save({
  //         message: data,
  //         direction: direction,
  //     });
  // }
}
