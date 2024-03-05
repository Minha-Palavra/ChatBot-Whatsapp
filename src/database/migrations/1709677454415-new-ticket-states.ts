import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTicketStates1709677454415 implements MigrationInterface {
    name = 'NewTicketStates1709677454415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ticket_owner_type_enum" AS ENUM('NONE', 'SERVICE_PROVIDER', 'CUSTOMER')`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "owner_type" "public"."ticket_owner_type_enum" NOT NULL DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum" RENAME TO "ticket_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'CLOSED', 'FIRST_TICKET', 'SELECT_TICKET', 'WAITING_OWNER_TYPE', 'WAITING_COUNTERPART_NAME', 'WAITING_COUNTERPART_NAME_CONFIRMATION', 'WAITING_COUNTERPART_TAXPAYER_NUMBER', 'WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_PHONE', 'WAITING_COUNTERPART_PHONE_CONFIRMATION', 'WAITING_COUNTERPART_EMAIL', 'WAITING_COUNTERPART_EMAIL_CONFIRMATION', 'WAITING_COUNTERPART_ADDRESS', 'WAITING_COUNTERPART_ADDRESS_CONFIRMATION')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum" USING "state"::"text"::"public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum_old" AS ENUM('NONE', 'CLOSED', 'FIRST_TICKET', 'SELECT_TICKET', 'WAITING_OWNER_TYPE')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum_old" USING "state"::"text"::"public"."ticket_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum_old" RENAME TO "ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "owner_type"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_owner_type_enum"`);
    }

}
