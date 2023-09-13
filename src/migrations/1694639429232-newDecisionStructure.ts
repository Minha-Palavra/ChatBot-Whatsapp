import { MigrationInterface, QueryRunner } from "typeorm";

export class NewDecisionStructure1694639429232 implements MigrationInterface {
    name = 'NewDecisionStructure1694639429232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "decision_parent_decision" ("decision_id_1" uuid NOT NULL, "decision_id_2" uuid NOT NULL, CONSTRAINT "PK_d041341c59e06a03d84c6cb7ca3" PRIMARY KEY ("decision_id_1", "decision_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53ee55af2cf4a72b83e0d56ff7" ON "decision_parent_decision" ("decision_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_627df7528dccd1b2d777862712" ON "decision_parent_decision" ("decision_id_2") `);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" ADD CONSTRAINT "FK_53ee55af2cf4a72b83e0d56ff76" FOREIGN KEY ("decision_id_1") REFERENCES "decision"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" ADD CONSTRAINT "FK_627df7528dccd1b2d7778627123" FOREIGN KEY ("decision_id_2") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" DROP CONSTRAINT "FK_627df7528dccd1b2d7778627123"`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" DROP CONSTRAINT "FK_53ee55af2cf4a72b83e0d56ff76"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_627df7528dccd1b2d777862712"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53ee55af2cf4a72b83e0d56ff7"`);
        await queryRunner.query(`DROP TABLE "decision_parent_decision"`);
    }

}
