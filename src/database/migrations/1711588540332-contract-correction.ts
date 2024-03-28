import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractCorrection1711588540332 implements MigrationInterface {
    name = 'ContractCorrection1711588540332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "contract_correction" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "contract_correction"`);
    }

}
