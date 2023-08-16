import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { DecisionEntity } from './decision.entity';
import {
  MinhaPalavraSeedData,
  MinhaPalavraSeedType,
} from './minhapalavra.seed';
import slugify from 'slugify';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FindTreeOptions } from 'typeorm/find-options/FindTreeOptions';

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

  async findOne(
    options: FindOneOptions<DecisionEntity>,
  ): Promise<DecisionEntity> {
    return this.repository.findOne(options);
  }

  async findDescendants(
    decision: Partial<DecisionEntity>,
    options?: FindTreeOptions,
  ): Promise<DecisionEntity[]> {
    let decisionEntity: DecisionEntity;
    if (decision.id === undefined)
      decisionEntity = await this.repository.findOne({
        where: [{ id: decision.id }, { slug: decision.slug }],
      });
    else decisionEntity = decision as DecisionEntity;

    return this.repository.findDescendants(decisionEntity, options);
  }
}
