import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentEntityUpdated1713050527999 implements MigrationInterface {
    name = 'PaymentEntityUpdated1713050527999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "due_date" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "qr_code_base64" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "qr_code_image_url" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "bacen_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "bacen_url"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "qr_code_image_url"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "qr_code_base64"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "due_date"`);
    }

}
