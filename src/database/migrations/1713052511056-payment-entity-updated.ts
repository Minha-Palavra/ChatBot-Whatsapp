import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentEntityUpdated1713052511056 implements MigrationInterface {
    name = 'PaymentEntityUpdated1713052511056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "paid" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "paid"`);
    }

}
