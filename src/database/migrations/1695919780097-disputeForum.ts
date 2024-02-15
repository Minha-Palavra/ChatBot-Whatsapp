import { MigrationInterface, QueryRunner } from 'typeorm';

export class DisputeForum1695919780097 implements MigrationInterface {
  name = 'DisputeForum1695919780097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" ADD "dispute_forum" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "dispute_forum"`);
  }

}
