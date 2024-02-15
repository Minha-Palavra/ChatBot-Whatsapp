import { MigrationInterface, QueryRunner } from 'typeorm';

export class SlugIndex1692219775793 implements MigrationInterface {
  name = 'SlugIndex1692219775793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" ADD "state" character varying NOT NULL DEFAULT 'NONE'`);
    await queryRunner.query(`CREATE INDEX "IDX_3af6e5ac694064f79b824e58e6" ON "decision" ("slug") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_3af6e5ac694064f79b824e58e6"`);
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "state"`);
  }

}
