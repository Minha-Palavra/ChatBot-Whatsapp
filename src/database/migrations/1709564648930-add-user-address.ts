import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAddress1709564648930 implements MigrationInterface {
    name = 'AddUserAddress1709564648930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    }

}
