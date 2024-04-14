import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentEntityUpdated1713098851664 implements MigrationInterface {
    name = 'PaymentEntityUpdated1713098851664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "paid_date" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paid_date"`);
    }

}
