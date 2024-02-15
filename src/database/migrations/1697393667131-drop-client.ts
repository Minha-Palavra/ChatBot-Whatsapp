import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropClient1697393667131 implements MigrationInterface {
  name = 'DropClient1697393667131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_7a25ca894de703bcc4610b6bb4e"`);
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "client_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" ADD "client_id" uuid`);
    await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_7a25ca894de703bcc4610b6bb4e" FOREIGN KEY ("client_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
