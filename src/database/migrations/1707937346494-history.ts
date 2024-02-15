import { MigrationInterface, QueryRunner } from "typeorm";

export class History1707937346494 implements MigrationInterface {
    name = 'History1707937346494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."history_direction_enum" AS ENUM('INCOMING', 'OUTGOING')`);
        await queryRunner.query(`CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "message" json NOT NULL, "direction" "public"."history_direction_enum" NOT NULL, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "full_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "full_name"`);
        await queryRunner.query(`DROP TABLE "history"`);
        await queryRunner.query(`DROP TYPE "public"."history_direction_enum"`);
    }

}
