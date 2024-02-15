import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDecisionSlugUnique1694652427774 implements MigrationInterface {
  name = 'MakeDecisionSlugUnique1694652427774';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_3af6e5ac694064f79b824e58e6"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3af6e5ac694064f79b824e58e6" ON "decision" ("slug") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_3af6e5ac694064f79b824e58e6"`);
    await queryRunner.query(`CREATE INDEX "IDX_3af6e5ac694064f79b824e58e6" ON "decision" ("slug") `);
  }

}
