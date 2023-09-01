import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketAndUserData1693546233221 implements MigrationInterface {
    name = 'TicketAndUserData1693546233221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fullname" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "taxpayer_number" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_9cc963ba8740ea93e6f0a7da415" UNIQUE ("taxpayer_number")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "payment_method" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "proporsal" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "accepted" boolean`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "client_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum" RENAME TO "ticket_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'INPROGRESS', 'CHOSING', 'FINISHED', 'NAME', 'TAXPAYER_NUMBER', 'EMAIL', 'JOB_DESCRIPTION', 'PAYMENT_METHOD', 'PAYMENT_AMOUNT', 'CLIENT_PHONE_NUMBER', 'CLIENT_NAME', 'CLIENT_TAXPAYER_NUMBER', 'CLIENT_EMAIL', 'CLIENT_APPROVAL', 'PROPOSAL')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum" USING "state"::"text"::"public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_7a25ca894de703bcc4610b6bb4e" FOREIGN KEY ("client_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_7a25ca894de703bcc4610b6bb4e"`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum_old" AS ENUM('NONE', 'INPROGRESS', 'CHOSING', 'FINISHED')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum_old" USING "state"::"text"::"public"."ticket_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum_old" RENAME TO "ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "client_id"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "accepted"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "proporsal"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "payment_method"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_9cc963ba8740ea93e6f0a7da415"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "taxpayer_number"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fullname"`);
    }

}
