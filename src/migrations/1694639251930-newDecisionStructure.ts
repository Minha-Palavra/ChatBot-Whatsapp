import { MigrationInterface, QueryRunner } from "typeorm";

export class NewDecisionStructure1694639251930 implements MigrationInterface {
    name = 'NewDecisionStructure1694639251930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "fullname" character varying, "taxpayer_number" character varying, "email" character varying, "phonenumber" character varying NOT NULL, CONSTRAINT "UQ_9cc963ba8740ea93e6f0a7da415" UNIQUE ("taxpayer_number"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_c1756d987198666d8b02af03439" UNIQUE ("phonenumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'INPROGRESS', 'CHOSING', 'FINISHED', 'NAME', 'TAXPAYER_NUMBER', 'EMAIL', 'JOB_DESCRIPTION', 'PAYMENT_METHOD', 'PAYMENT_AMOUNT', 'CLIENT_PHONE_NUMBER', 'CLIENT_NAME', 'CLIENT_TAXPAYER_NUMBER', 'CLIENT_EMAIL', 'CLIENT_APPROVAL', 'PROPOSAL')`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" "public"."ticket_state_enum" NOT NULL DEFAULT 'NONE', "description" character varying, "payment_method" character varying, "proporsal" character varying, "accepted" boolean, "user_id" uuid, "decision_id" uuid, "client_id" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "decision" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_fa4cbd6abf1215054f13c27df5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3af6e5ac694064f79b824e58e6" ON "decision" ("slug") `);
        await queryRunner.query(`CREATE TYPE "public"."history_direction_enum" AS ENUM('INCOMING', 'OUTGOING')`);
        await queryRunner.query(`CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "message" json NOT NULL, "direction" "public"."history_direction_enum" NOT NULL, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "decision_parent_decision" ("decision_id_1" uuid NOT NULL, "decision_id_2" uuid NOT NULL, CONSTRAINT "PK_d041341c59e06a03d84c6cb7ca3" PRIMARY KEY ("decision_id_1", "decision_id_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_53ee55af2cf4a72b83e0d56ff7" ON "decision_parent_decision" ("decision_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_627df7528dccd1b2d777862712" ON "decision_parent_decision" ("decision_id_2") `);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_368610dc3312f9b91e9ace40354" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_8e4f69be7c3bdac64f160ae4082" FOREIGN KEY ("decision_id") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_7a25ca894de703bcc4610b6bb4e" FOREIGN KEY ("client_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" ADD CONSTRAINT "FK_53ee55af2cf4a72b83e0d56ff76" FOREIGN KEY ("decision_id_1") REFERENCES "decision"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" ADD CONSTRAINT "FK_627df7528dccd1b2d7778627123" FOREIGN KEY ("decision_id_2") REFERENCES "decision"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" DROP CONSTRAINT "FK_627df7528dccd1b2d7778627123"`);
        await queryRunner.query(`ALTER TABLE "decision_parent_decision" DROP CONSTRAINT "FK_53ee55af2cf4a72b83e0d56ff76"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_7a25ca894de703bcc4610b6bb4e"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_8e4f69be7c3bdac64f160ae4082"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_368610dc3312f9b91e9ace40354"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_627df7528dccd1b2d777862712"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_53ee55af2cf4a72b83e0d56ff7"`);
        await queryRunner.query(`DROP TABLE "decision_parent_decision"`);
        await queryRunner.query(`DROP TABLE "history"`);
        await queryRunner.query(`DROP TYPE "public"."history_direction_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3af6e5ac694064f79b824e58e6"`);
        await queryRunner.query(`DROP TABLE "decision"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
