import { MigrationInterface, QueryRunner } from "typeorm";

export class Decisiontree1692070058351 implements MigrationInterface {
    name = 'Decisiontree1692070058351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision" DROP CONSTRAINT "UQ_3af6e5ac694064f79b824e58e64"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision" ADD CONSTRAINT "UQ_3af6e5ac694064f79b824e58e64" UNIQUE ("slug")`);
    }

}
