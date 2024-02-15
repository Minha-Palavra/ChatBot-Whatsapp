import { MigrationInterface, QueryRunner } from 'typeorm';

export class TicketOwnerEnum1697309241567 implements MigrationInterface {
  name = 'TicketOwnerEnum1697309241567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_owner_enum" AS ENUM('NONE', 'SERVICE_PROVIDER', 'CUSTOMER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "owner" "public"."ticket_owner_enum" NOT NULL DEFAULT 'NONE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "owner"`);
    await queryRunner.query(`DROP TYPE "public"."ticket_owner_enum"`);
  }
}
