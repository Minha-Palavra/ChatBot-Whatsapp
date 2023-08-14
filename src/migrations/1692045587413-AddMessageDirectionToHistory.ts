import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageDirectionToHistory1692045587413 implements MigrationInterface {
    name = 'AddMessageDirectionToHistory1692045587413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."history_direction_enum" AS ENUM('INCOMING', 'OUTGOING')`);
        await queryRunner.query(`ALTER TABLE "history" ADD "direction" "public"."history_direction_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "direction"`);
        await queryRunner.query(`DROP TYPE "public"."history_direction_enum"`);
    }

}
