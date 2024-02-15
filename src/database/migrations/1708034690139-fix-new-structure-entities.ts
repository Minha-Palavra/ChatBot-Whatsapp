import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNewStructureEntities1708034690139 implements MigrationInterface {
    name = 'FixNewStructureEntities1708034690139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "state" character varying NOT NULL DEFAULT 'REGISTRATION_INITIAL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "state"`);
    }

}
