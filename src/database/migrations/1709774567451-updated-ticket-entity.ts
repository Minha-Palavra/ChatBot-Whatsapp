import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketEntity1709774567451 implements MigrationInterface {
    name = 'UpdatedTicketEntity1709774567451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "counterpart_taxpayer_number" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "counterpart_phone_number" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "counterpart_email" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "counterpart_address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "counterpart_address"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "counterpart_email"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "counterpart_phone_number"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "counterpart_taxpayer_number"`);
    }

}
