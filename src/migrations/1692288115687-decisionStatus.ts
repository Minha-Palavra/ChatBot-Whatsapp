import { MigrationInterface, QueryRunner } from 'typeorm';

export class DecisionStatus1692288115687 implements MigrationInterface {
  name = 'DecisionStatus1692288115687';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "state"`);
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'INPROGRESS', 'CHOSING', 'FINISHED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "state" "public"."ticket_state_enum" NOT NULL DEFAULT 'NONE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "state"`);
    await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "state" character varying NOT NULL DEFAULT 'NONE'`,
    );
  }
}
