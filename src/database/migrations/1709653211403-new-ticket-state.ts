import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTicketState1709653211403 implements MigrationInterface {
    name = 'NewTicketState1709653211403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" RENAME COLUMN "status" TO "state"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_status_enum" RENAME TO "ticket_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum" RENAME TO "ticket_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'CLOSED', 'FIRST_TICKET', 'SELECT_TICKET')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum" USING "state"::"text"::"public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum_old" AS ENUM('NONE', 'OPEN', 'CLOSED')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum_old" USING "state"::"text"::"public"."ticket_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum_old" RENAME TO "ticket_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum" RENAME TO "ticket_status_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" RENAME COLUMN "state" TO "status"`);
    }

}
