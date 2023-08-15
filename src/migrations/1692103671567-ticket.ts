import { MigrationInterface, QueryRunner } from "typeorm";

export class Ticket1692103671567 implements MigrationInterface {
    name = 'Ticket1692103671567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "number" TO "phonenumber"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_81e762f957fa9a13524029a3b7f" TO "UQ_c1756d987198666d8b02af03439"`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "decision_id" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_368610dc3312f9b91e9ace40354" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_8e4f69be7c3bdac64f160ae4082" FOREIGN KEY ("decision_id") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_8e4f69be7c3bdac64f160ae4082"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_368610dc3312f9b91e9ace40354"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME CONSTRAINT "UQ_c1756d987198666d8b02af03439" TO "UQ_81e762f957fa9a13524029a3b7f"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "phonenumber" TO "number"`);
    }
}
