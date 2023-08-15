import { MigrationInterface, QueryRunner } from "typeorm";

export class Decisiontree1692069153617 implements MigrationInterface {
    name = 'Decisiontree1692069153617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "number" character varying NOT NULL, CONSTRAINT "UQ_81e762f957fa9a13524029a3b7f" UNIQUE ("number"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "decision" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "decision" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "decision" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "decision" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "decision" ADD "text" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
