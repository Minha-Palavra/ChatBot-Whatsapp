import { MigrationInterface, QueryRunner } from "typeorm";

export class Decisiontree1692069627192 implements MigrationInterface {
    name = 'Decisiontree1692069627192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision" ALTER COLUMN "description" SET NOT NULL`);
    }

}
