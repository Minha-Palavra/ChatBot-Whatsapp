import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractCorrection1711588078359 implements MigrationInterface {
    name = 'ContractCorrection1711588078359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "who_is_editing" character varying DEFAULT 'owner'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "who_is_editing"`);
    }

}
