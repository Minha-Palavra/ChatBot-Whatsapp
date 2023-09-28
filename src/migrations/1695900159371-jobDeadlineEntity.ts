import { MigrationInterface, QueryRunner } from "typeorm";

export class JobDeadlineEntity1695900159371 implements MigrationInterface {
    name = 'JobDeadlineEntity1695900159371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "deadline" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "deadline"`);
    }

}
