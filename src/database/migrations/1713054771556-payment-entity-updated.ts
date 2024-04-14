import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentEntityUpdated1713054771556 implements MigrationInterface {
    name = 'PaymentEntityUpdated1713054771556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "ticket_id" uuid`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "UQ_5ece7eeb26834cf5bdd45df1da0" UNIQUE ("ticket_id")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_5ece7eeb26834cf5bdd45df1da0" FOREIGN KEY ("ticket_id") REFERENCES "ticket"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_5ece7eeb26834cf5bdd45df1da0"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_5ece7eeb26834cf5bdd45df1da0"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "ticket_id"`);
    }

}
