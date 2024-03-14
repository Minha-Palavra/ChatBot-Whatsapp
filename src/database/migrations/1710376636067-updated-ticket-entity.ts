import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketEntity1710376636067 implements MigrationInterface {
    name = 'UpdatedTicketEntity1710376636067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_payment_method_installment_count" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_payment_method_installment_count"`);
    }

}
