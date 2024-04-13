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

  public async findOne(
    options: FindOneOptions<CategoryEntity>,
  ): Promise<CategoryEntity> {
    return this.repository.findOne(options);
  }

  public async fillChildren(
    category: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    let decisionEntity: CategoryEntity;

    if (category.slug && (category.id === undefined || category.id === null)) {
      decisionEntity = await this.repository.findOne({
        where: [{ slug: category.slug }],
      });
    } else {
      decisionEntity = category as CategoryEntity;
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
    const entity = await this.repository.save({
      title: seed.title,
      slug: seed.slug,
      description: seed.description,
      parent: parent,
    });

    entity.children = [];
    if (seed.children) {
      for (const child of seed.children) {
        const childEntity = await this.seedRecursive(child, entity);
        entity.children.push(childEntity);
      }

      await this.repository.save(entity);
    }

    return entity;
  }
}
