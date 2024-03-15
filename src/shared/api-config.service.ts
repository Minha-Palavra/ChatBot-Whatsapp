import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

import { SnakeNamingStrategy } from '../database/strategies/snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(@Inject(ConfigService) private service: ConfigService) {}

  public get appConfig() {
    return {
      port: this.getString('PORT', '8080'),
    };
  }

  public get chatGPTConfig() {
    return {
      apiKey: this.getString('OPENAI_API_KEY'),
    };
  }

  public get isDocumentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION', true);
  }

  public get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  public get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  public get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  public get nodeEnv(): string {
    return this.getString('NODE_ENV') || 'development';
  }

  public get postgresConfig(): TypeOrmModuleOptions {
    const entities = [
      path.join(__dirname, '/../**/*.entity{.ts,.js}'),
      path.join(__dirname, '/../**/*.view-entity{.ts,.js}'),
    ];

    const migrations = [
      path.join(__dirname, '/../database/migrations/*{.ts,.js}'),
    ];

    const subscribers = [path.join(__dirname, '/src/**/*.subscriber{.ts,.js}')];

    return {
      type: 'postgres',
      host: this.getString('DB_HOST') || 'localhost',
      port: this.getNumber('DB_PORT') || 5432,
      database: this.getString('DB_DATABASE') || 'postgres',
      username: this.getString('DB_USERNAME') || 'postgres',
      password: this.getString('DB_PASSWORD') || 'postgres',
      dropSchema: true, //this.isTest,
      keepConnectionAlive: !this.isTest,
      logging: this.getBoolean('ENABLE_ORM_LOGS', false),
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
      entities,
      migrations,
      subscribers,
    };
  }

  private getBoolean(key: string, defaultValue: boolean): boolean {
    return this.service.get<boolean>(key, defaultValue);
  }

  private getNumber(key: string, defaultValue = 0): number {
    return this.service.get<number>(key, defaultValue);
  }

  private getString(key: string, defaultValue = ''): string {
    return this.service.get<string>(key, defaultValue).replace(/\\n/g, '\n');
  }
}
