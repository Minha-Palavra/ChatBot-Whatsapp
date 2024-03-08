import { Injectable, Logger } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import {
  minhaPalavraSeedData,
  MinhaPalavraSeedType,
} from './minhapalavra.seed';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {
    this.seed();
  }

  private async seed() {
    const root = await this.repository.findOne({
      where: { slug: 'root' },
    });

    if (root) {
      this.logger.log('Database already seeded.');
      return;
    }

    this.logger.warn('Seeding database...');

    await this.seedRecursive(minhaPalavraSeedData, null);
    this.logger.warn('Database seeded successfully.');
  }

  private async seedRecursive(
    seed: Partial<MinhaPalavraSeedType>,
    parent: CategoryEntity,
  ): Promise<CategoryEntity> {
    if (!seed.slug) {
      seed.slug = slugify(seed.title, { lower: true });
    }

    let entity = new CategoryEntity();
    entity.title = seed.title;
    entity.slug = seed.slug;
    entity.description = seed.description;

    {
      const node = await this.repository.findOne({
        where: { slug: seed.slug },
      });
      if (node) {
        entity = node;
      }
    }

    if (parent) {
      entity.parent = entity.parent || [];
      parent.children = parent.children || [];

      // check if parent already exists
      if (entity.parent.find((p) => p.id === parent.id) === undefined)
        entity.parent.push(parent);

      // check if child already exists
      if (parent.children.find((c) => c.id === entity.id) === undefined)
        parent.children.push(entity);

      // check circular reference
      if (entity.parent.find((p) => p.id === entity.id) !== undefined)
        entity.parent = entity.parent.filter((p) => p.id !== entity.id);
      if (parent.children.find((c) => c.id === parent.id) !== undefined)
        parent.children = parent.children.filter((c) => c.id !== parent.id);

      await this.repository.save(parent);
    }
    await this.repository.save(entity);

    if (seed.children) {
      for (const child of seed.children) {
        this.logger.log(`Added the ${child.title} category.`);
        await this.seedRecursive(child, entity);
      }
    }

    return entity;
  }

  public async findOne(
    options: FindOneOptions<CategoryEntity>,
  ): Promise<CategoryEntity> {
    return this.repository.findOne(options);
  }

  public async fillChildren(
    decision: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    let decisionEntity: CategoryEntity;

    if (decision.slug && (decision.id === undefined || decision.id === null)) {
      decisionEntity = await this.repository.findOne({
        where: [{ slug: decision.slug }],
      });
    } else {
      decisionEntity = decision as CategoryEntity;
    }

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
