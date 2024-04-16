import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedCategoryEntity1713300910960 implements MigrationInterface {
    name = 'UpdatedCategoryEntity1713300910960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "has_material_flow" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "has_material_flow"`);
    }

}
