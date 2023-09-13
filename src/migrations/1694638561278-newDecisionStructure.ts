import { MigrationInterface, QueryRunner } from "typeorm";

export class NewDecisionStructure1694638561278 implements MigrationInterface {
    name = 'NewDecisionStructure1694638561278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "decision_children_decision" ("decision_id_1" uuid NOT NULL, "decision_id_2" uuid NOT NULL, CONSTRAINT "PK_0df1dbb07e3e1f36ef1d79ab191" PRIMARY KEY ("decision_id_1", "decision_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3f9484cfd0a08e981c82d44fc3" ON "decision_children_decision" ("decision_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_69a8b54280428a33a2465f1935" ON "decision_children_decision" ("decision_id_2") `);
        await queryRunner.query(`ALTER TABLE "decision_children_decision" ADD CONSTRAINT "FK_3f9484cfd0a08e981c82d44fc3d" FOREIGN KEY ("decision_id_1") REFERENCES "decision"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "decision_children_decision" ADD CONSTRAINT "FK_69a8b54280428a33a2465f19350" FOREIGN KEY ("decision_id_2") REFERENCES "decision"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_children_decision" DROP CONSTRAINT "FK_69a8b54280428a33a2465f19350"`);
        await queryRunner.query(`ALTER TABLE "decision_children_decision" DROP CONSTRAINT "FK_3f9484cfd0a08e981c82d44fc3d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69a8b54280428a33a2465f1935"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f9484cfd0a08e981c82d44fc3"`);
        await queryRunner.query(`DROP TABLE "decision_children_decision"`);
    }

}
