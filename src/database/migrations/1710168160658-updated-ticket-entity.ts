import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketEntity1710168160658 implements MigrationInterface {
    name = 'UpdatedTicketEntity1710168160658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_payment_method_description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_payment_method_description"`);
    }

}
