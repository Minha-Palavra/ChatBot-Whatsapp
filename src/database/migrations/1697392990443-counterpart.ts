import { MigrationInterface, QueryRunner } from 'typeorm';

export class Counterpart1697392990443 implements MigrationInterface {
  name = 'Counterpart1697392990443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" ADD "counterpart_id" uuid`);
    await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_4f117652d787b8298fbe9775534" FOREIGN KEY ("counterpart_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_4f117652d787b8298fbe9775534"`);
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "counterpart_id"`);
  }

}
