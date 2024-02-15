import { MigrationInterface, QueryRunner } from 'typeorm';

export class JobDeadline1695734103755 implements MigrationInterface {
  name = 'JobDeadline1695734103755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum" RENAME TO "ticket_state_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'INPROGRESS', 'CHOSING', 'FINISHED', 'NAME', 'TAXPAYER_NUMBER', 'EMAIL', 'JOB_DESCRIPTION', 'PAYMENT_METHOD', 'PAYMENT_AMOUNT', 'CLIENT_PHONE_NUMBER', 'CLIENT_NAME', 'CLIENT_TAXPAYER_NUMBER', 'CLIENT_EMAIL', 'CLIENT_RECIEVE', 'CLIENT_APPROVAL', 'PROPOSAL', 'SERVICE_DEADLINE')`);
    await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum" USING "state"::"text"::"public"."ticket_state_enum"`);
    await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
    await queryRunner.query(`DROP TYPE "public"."ticket_state_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum_old" AS ENUM('CHOSING', 'CLIENT_APPROVAL', 'CLIENT_EMAIL', 'CLIENT_NAME', 'CLIENT_PHONE_NUMBER', 'CLIENT_RECIEVE', 'CLIENT_TAXPAYER_NUMBER', 'EMAIL', 'FINISHED', 'INPROGRESS', 'JOB_DESCRIPTION', 'NAME', 'NONE', 'PAYMENT_AMOUNT', 'PAYMENT_METHOD', 'PROPOSAL', 'TAXPAYER_NUMBER')`);
    await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum_old" USING "state"::"text"::"public"."ticket_state_enum_old"`);
    await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
    await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum_old" RENAME TO "ticket_state_enum"`);
  }

}
