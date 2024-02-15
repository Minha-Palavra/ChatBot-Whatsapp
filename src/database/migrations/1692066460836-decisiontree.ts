import { MigrationInterface, QueryRunner } from 'typeorm';

export class Decisiontree1692066460836 implements MigrationInterface {
  name = 'Decisiontree1692066460836';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "decision" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "slug" character varying NOT NULL, "nsleft" integer NOT NULL DEFAULT '1', "nsright" integer NOT NULL DEFAULT '2', "parent_id" uuid, CONSTRAINT "UQ_3af6e5ac694064f79b824e58e64" UNIQUE ("slug"), CONSTRAINT "PK_fa4cbd6abf1215054f13c27df5a" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "decision" ADD CONSTRAINT "FK_9c3c1489804d1284cc6e1f28306" FOREIGN KEY ("parent_id") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "decision" DROP CONSTRAINT "FK_9c3c1489804d1284cc6e1f28306"`);
    await queryRunner.query(`DROP TABLE "decision"`);
  }
}
