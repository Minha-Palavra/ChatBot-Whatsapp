import { MigrationInterface, QueryRunner } from "typeorm";

export class TicketEntity1713390036921 implements MigrationInterface {
    name = 'TicketEntity1713390036921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "confirmed_payment" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "confirmed_payment"`);
    }

}
