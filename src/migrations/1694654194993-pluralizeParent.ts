import { MigrationInterface, QueryRunner } from "typeorm";

export class PluralizeParent1694654194993 implements MigrationInterface {
    name = 'PluralizeParent1694654194993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "decision_parents_decision" ("decision_id_1" uuid NOT NULL, "decision_id_2" uuid NOT NULL, CONSTRAINT "PK_455d425a86c1dab0617a74564c9" PRIMARY KEY ("decision_id_1", "decision_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad4f5419a6c66f2c4926300b06" ON "decision_parents_decision" ("decision_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2e5e16b8e204dba8dd7173ec1" ON "decision_parents_decision" ("decision_id_2") `);
        await queryRunner.query(`ALTER TABLE "decision_parents_decision" ADD CONSTRAINT "FK_ad4f5419a6c66f2c4926300b065" FOREIGN KEY ("decision_id_1") REFERENCES "decision"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "decision_parents_decision" ADD CONSTRAINT "FK_f2e5e16b8e204dba8dd7173ec12" FOREIGN KEY ("decision_id_2") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_parents_decision" DROP CONSTRAINT "FK_f2e5e16b8e204dba8dd7173ec12"`);
        await queryRunner.query(`ALTER TABLE "decision_parents_decision" DROP CONSTRAINT "FK_ad4f5419a6c66f2c4926300b065"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2e5e16b8e204dba8dd7173ec1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad4f5419a6c66f2c4926300b06"`);
        await queryRunner.query(`DROP TABLE "decision_parents_decision"`);
    }

}
