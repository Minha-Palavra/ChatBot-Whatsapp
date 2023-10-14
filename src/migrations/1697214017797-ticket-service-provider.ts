import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketServiceProvider1697214017797 implements MigrationInterface {
    name = 'TicketServiceProvider1697214017797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_provider_id" uuid`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_db234b03c2a6f67aa04d3cefa92" FOREIGN KEY ("service_provider_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_db234b03c2a6f67aa04d3cefa92"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_provider_id"`);
    }

}
