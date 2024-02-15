import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewDecisionStructure1694636890155 implements MigrationInterface {
  name = 'NewDecisionStructure1694636890155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "decision" DROP CONSTRAINT "FK_9c3c1489804d1284cc6e1f28306"`);
    await queryRunner.query(`ALTER TABLE "decision" DROP COLUMN "nsleft"`);
    await queryRunner.query(`ALTER TABLE "decision" DROP COLUMN "nsright"`);
    await queryRunner.query(`ALTER TABLE "decision" DROP COLUMN "parent_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "decision" ADD "parent_id" uuid`);
    await queryRunner.query(`ALTER TABLE "decision" ADD "nsright" integer NOT NULL DEFAULT '2'`);
    await queryRunner.query(`ALTER TABLE "decision" ADD "nsleft" integer NOT NULL DEFAULT '1'`);
    await queryRunner.query(`ALTER TABLE "decision" ADD CONSTRAINT "FK_9c3c1489804d1284cc6e1f28306" FOREIGN KEY ("parent_id") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
