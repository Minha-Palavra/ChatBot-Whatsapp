import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketEntity1709910539388 implements MigrationInterface {
    name = 'UpdatedTicketEntity1709910539388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "decision" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_fa4cbd6abf1215054f13c27df5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3af6e5ac694064f79b824e58e6" ON "decision" ("slug") `);
        await queryRunner.query(`CREATE TABLE "decision_parent_decision" ("decision_id_1" uuid NOT NULL, "decision_id_2" uuid NOT NULL, CONSTRAINT "PK_d041341c59e06a03d84c6cb7ca3" PRIMARY KEY ("decision_id_1", "decision_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53ee55af2cf4a72b83e0d56ff7" ON "decision_parent_decision" ("decision_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_627df7528dccd1b2d777862712" ON "decision_parent_decision" ("decision_id_2") `);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum" RENAME TO "ticket_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'CLOSED', 'FIRST_TICKET', 'SELECT_TICKET', 'WAITING_OWNER_TYPE', 'WAITING_COUNTERPART_NAME', 'WAITING_COUNTERPART_NAME_CONFIRMATION', 'WAITING_COUNTERPART_TAXPAYER_NUMBER', 'WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_PHONE_NUMBER', 'WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_EMAIL', 'WAITING_COUNTERPART_EMAIL_CONFIRMATION', 'WAITING_COUNTERPART_ADDRESS', 'WAITING_COUNTERPART_ADDRESS_CONFIRMATION', 'WAITING_SERVICE_CATEGORY')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum" USING "state"::"text"::"public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d" FOREIGN KEY ("category_id") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" ADD CONSTRAINT "FK_53ee55af2cf4a72b83e0d56ff76" FOREIGN KEY ("decision_id_1") REFERENCES "decision"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" ADD CONSTRAINT "FK_627df7528dccd1b2d7778627123" FOREIGN KEY ("decision_id_2") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" DROP CONSTRAINT "FK_627df7528dccd1b2d7778627123"`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" DROP CONSTRAINT "FK_53ee55af2cf4a72b83e0d56ff76"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d"`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum_old" AS ENUM('NONE', 'CLOSED', 'FIRST_TICKET', 'SELECT_TICKET', 'WAITING_OWNER_TYPE', 'WAITING_COUNTERPART_NAME', 'WAITING_COUNTERPART_NAME_CONFIRMATION', 'WAITING_COUNTERPART_TAXPAYER_NUMBER', 'WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_PHONE_NUMBER', 'WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_EMAIL', 'WAITING_COUNTERPART_EMAIL_CONFIRMATION', 'WAITING_COUNTERPART_ADDRESS', 'WAITING_COUNTERPART_ADDRESS_CONFIRMATION')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum_old" USING "state"::"text"::"public"."ticket_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum_old" RENAME TO "ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "category_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_627df7528dccd1b2d777862712"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53ee55af2cf4a72b83e0d56ff7"`);
        await queryRunner.query(`DROP TABLE "decision_parent_decision"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3af6e5ac694064f79b824e58e6"`);
        await queryRunner.query(`DROP TABLE "decision"`);
    }

}
