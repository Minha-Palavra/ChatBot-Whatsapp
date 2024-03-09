import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketEntity1710024193657 implements MigrationInterface {
    name = 'UpdatedTicketEntity1710024193657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_hours_description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_hours_description"`);
    }

}
