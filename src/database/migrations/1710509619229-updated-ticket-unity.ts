import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketUnity1710509619229 implements MigrationInterface {
    name = 'UpdatedTicketUnity1710509619229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "order_id" character varying NOT NULL, "payer_phone" character varying NOT NULL, "transaction_id" character varying, "status" character varying, "emv" character varying, "used" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "who_will_buy_material" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "who_will_buy_material"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
