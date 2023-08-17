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
  ): Promise<DecisionEntity> {
    if (!seed.slug) seed.slug = slugify(seed.title, { lower: true });
    const entity = await this.repository.save({
      title: seed.title,
      slug: seed.slug,
      parent: parent,
    });
    entity.children = [];
    if (seed.children) {
      for (const child of seed.children) {
        entity.children.push(await this.seedRecursive(child, entity));
      }
    }
    return entity;
  }

  async findOne(
    options: FindOneOptions<DecisionEntity>,
  ): Promise<DecisionEntity> {
    return this.repository.findOne(options);
  }

  async findImmediateDescendants(
    decision: Partial<DecisionEntity>,
  ): Promise<DecisionEntity[]> {
    let decisionEntity: DecisionEntity;
    if (decision.slug && (decision.id === undefined || decision.id === null))
      decisionEntity = await this.repository.findOne({
        where: [{ slug: decision.slug }],
      });
    else decisionEntity = decision as DecisionEntity;

    return this.repository.find({
      where: {
        parent: {
          id: decisionEntity.id,
        },
      },
    });
  }
}
