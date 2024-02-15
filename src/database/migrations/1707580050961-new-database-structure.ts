import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewDatabaseStructure1707580050961 implements MigrationInterface {
  name = 'NewDatabaseStructure1707580050961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "whatsapp_id" character varying NOT NULL, "email" character varying, "phone_number" character varying NOT NULL, "taxpayer_number" character varying, CONSTRAINT "UQ_f557cc5b81d045e6ca99d0e57f1" UNIQUE ("whatsapp_id"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "UQ_9cc963ba8740ea93e6f0a7da415" UNIQUE ("taxpayer_number"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TYPE "public"."ticket_status_enum" AS ENUM('NONE', 'OPEN', 'CLOSED')`);
    await queryRunner.query(`CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."ticket_status_enum" NOT NULL DEFAULT 'NONE', "owner_id" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_eb16ef58c3c71cf333b9cc106f0" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_eb16ef58c3c71cf333b9cc106f0"`);
    await queryRunner.query(`DROP TABLE "ticket"`);
    await queryRunner.query(`DROP TYPE "public"."ticket_status_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }

}
