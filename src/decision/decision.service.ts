import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { DecisionEntity } from './decision.entity';
import {
  MinhaPalavraSeedData,
  MinhaPalavraSeedType,
} from './minhapalavra.seed';
import slugify from 'slugify';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import e from 'express';

@Injectable()
export class DecisionService {
  private readonly logger = new Logger(DecisionService.name);
  constructor(
    @InjectRepository(DecisionEntity)
    private readonly repository: Repository<DecisionEntity>,
  ) {
    this.seed();
  }

  async seed() {
    //const roots = await this.repository.findRoots();
    const root = await this.repository.findOne({
      where: { slug: 'bem-vindo' },
    });
    if (root) {
      this.logger.log('db already seeded');
      return;
    }
    this.logger.warn('seeding db');
    // await this.seedRecursive(MinhaPalavraSeedData, );
    await this.seedRecursive(MinhaPalavraSeedData, null);
    this.logger.warn('db seeded successfully');
  }

  async seedRecursive(
    seed: Partial<MinhaPalavraSeedType>,
    parent: DecisionEntity,
  ): Promise<DecisionEntity> {
    if (!seed.slug) seed.slug = slugify(seed.title, { lower: true });
    const entity = new DecisionEntity();
    entity.title = seed.title;
    entity.slug = seed.slug;
    entity.description = seed.description;

    if (parent) {
      entity.parent = entity.parent || [];
      parent.children = parent.children || [];

      entity.parent.push(parent);
      parent.children.push(entity);

      await this.repository.save(parent);
    }
    await this.repository.save(entity);

    if (seed.children) {
      for (const child of seed.children) {
        console.log('child', child.title);
        await this.seedRecursive(child, entity);
      }
    }

    return entity;

    // const entity = await this.repository.save({
    //   title: seed.title,
    //   slug: seed.slug,
    //   description: seed.description,
    //   parent: parent,
    // });
    // entity.children = [];
    // if (seed.children) {
    //   for (const child of seed.children) {
    //     entity.children.push(await this.seedRecursive(child, entity));
    //   }
    //   //await this.repository.save(entity);
    // }
    // return entity;
  }

  async findOne(
    options: FindOneOptions<DecisionEntity>,
  ): Promise<DecisionEntity> {
    return this.repository.findOne(options);
  }

  async fillChildren(
    decision: Partial<DecisionEntity>,
  ): Promise<DecisionEntity> {
    let decisionEntity: DecisionEntity;
    if (decision.slug && (decision.id === undefined || decision.id === null))
      decisionEntity = await this.repository.findOne({
        where: [{ slug: decision.slug }],
      });
    else decisionEntity = decision as DecisionEntity;

    decisionEntity.children = await this.repository.find({
      where: {
        parent: {
          id: decisionEntity.id,
        },
      },
    });
    return decisionEntity;
  }
}
