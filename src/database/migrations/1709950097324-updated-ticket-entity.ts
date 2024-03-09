import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketEntity1709950097324 implements MigrationInterface {
    name = 'UpdatedTicketEntity1709950097324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cb73208f151aa71cdd78f662d7" ON "category" ("slug") `);
        await queryRunner.query(`CREATE TABLE "category_parent_category" ("category_id_1" uuid NOT NULL, "category_id_2" uuid NOT NULL, CONSTRAINT "PK_f69d02ee35b0cbe26d2408a367c" PRIMARY KEY ("category_id_1", "category_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8dc6699781311b9710188688af" ON "category_parent_category" ("category_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf616908cc95d8febecbdd8113" ON "category_parent_category" ("category_id_2") `);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_parent_category" ADD CONSTRAINT "FK_8dc6699781311b9710188688afb" FOREIGN KEY ("category_id_1") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_parent_category" ADD CONSTRAINT "FK_bf616908cc95d8febecbdd81134" FOREIGN KEY ("category_id_2") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_parent_category" DROP CONSTRAINT "FK_bf616908cc95d8febecbdd81134"`);
        await queryRunner.query(`ALTER TABLE "category_parent_category" DROP CONSTRAINT "FK_8dc6699781311b9710188688afb"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf616908cc95d8febecbdd8113"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8dc6699781311b9710188688af"`);
        await queryRunner.query(`DROP TABLE "category_parent_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb73208f151aa71cdd78f662d7"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d" FOREIGN KEY ("category_id") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
