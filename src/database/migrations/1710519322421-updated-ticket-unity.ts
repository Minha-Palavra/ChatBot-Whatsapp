import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketUnity1710519322421 implements MigrationInterface {
    name = 'UpdatedTicketUnity1710519322421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."conversation_status_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "payload" json NOT NULL, "status" "public"."conversation_status_enum" NOT NULL, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TYPE "public"."conversation_status_enum"`);
    }

}
