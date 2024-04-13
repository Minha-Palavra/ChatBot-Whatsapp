import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1712444489430 implements MigrationInterface {
  name = 'Initial1712444489430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "whatsapp_id" character varying NOT NULL, "full_name" character varying, "taxpayer_number" character varying, "email" character varying, "phone_number" character varying NOT NULL, "address" character varying, "state" character varying NOT NULL DEFAULT 'REGISTRATION_INITIAL', CONSTRAINT "UQ_f557cc5b81d045e6ca99d0e57f1" UNIQUE ("whatsapp_id"), CONSTRAINT "UQ_9cc963ba8740ea93e6f0a7da415" UNIQUE ("taxpayer_number"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'NEW_TICKET', 'FIRST_TICKET', 'SELECT_TICKET', 'OWNER_TYPE', 'COUNTERPART_NAME', 'COUNTERPART_NAME_CONFIRMATION', 'COUNTERPART_TAXPAYER_NUMBER', 'COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION', 'COUNTERPART_PHONE_NUMBER', 'COUNTERPART_PHONE_NUMBER_CONFIRMATION', 'COUNTERPART_EMAIL', 'COUNTERPART_EMAIL_CONFIRMATION', 'COUNTERPART_ADDRESS', 'COUNTERPART_ADDRESS_CONFIRMATION', 'SERVICE_CATEGORY', 'SERVICE_DESCRIPTION', 'SERVICE_DESCRIPTION_CONFIRMATION', 'SERVICE_HAS_STEPS', 'SERVICE_STEPS_DESCRIPTION', 'SERVICE_STEPS_DESCRIPTION_CONFIRMATION', 'SERVICE_ADDRESS', 'SERVICE_ADDRESS_CONFIRMATION', 'SERVICE_START_DATE', 'SERVICE_START_DATE_CONFIRMATION', 'SERVICE_END_DATE', 'SERVICE_END_DATE_CONFIRMATION', 'SERVICE_HAS_WORK_HOURS', 'SERVICE_WORK_HOURS_DESCRIPTION', 'SERVICE_WORK_HOURS_DESCRIPTION_CONFIRMATION', 'PAYMENT_AMOUNT', 'PAYMENT_AMOUNT_CONFIRMATION', 'PAYMENT_METHOD', 'IN_CASH_PAYMENT_METHOD', 'IN_INSTALLMENTS_PAYMENT_METHOD', 'OTHER_IN_INSTALLMENT_PAYMENT_METHOD_DESCRIPTION', 'OTHER_IN_INSTALLMENT_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION', 'OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION', 'OTHER_IN_CASH_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION', 'OTHER_PAYMENT_METHOD_DESCRIPTION', 'OTHER_PAYMENT_METHOD_DESCRIPTION_CONFIRMATION', 'INSTALLMENT_COUNT', 'INSTALLMENT_COUNT_CONFIRMATION', 'PAYMENT_DUE_DATES', 'PAYMENT_DUE_DATES_CONFIRMATION', 'MATERIALS_ARE_PART_OF_CONTRACT', 'WHO_WILL_BUY_MATERIALS', 'HOW_MATERIALS_WILL_BE_BOUGHT', 'HOW_MATERIALS_WILL_BE_BOUGHT_CONFIRMATION', 'MATERIALS_HAVE_PRE_DETERMINED_VALUE', 'MATERIALS_HAVE_PRE_DETERMINED_VALUE_CONFIRMATION', 'WHO_WILL_PAY_MATERIALS', 'HAS_MATERIALS_PURCHASE_DETAILS', 'MATERIALS_PURCHASE_DETAILS_DESCRIPTION', 'MATERIALS_PURCHASE_DETAILS_DESCRIPTION_CONFIRMATION', 'MATERIALS_HOW_MUCH', 'MATERIALS_HOW_MUCH_CONFIRMATION', 'MATERIALS_DELIVERY_SCHEDULE', 'MATERIALS_DELIVERY_SCHEDULE_CONFIRMATION', 'MATERIALS_HOW_MUCH_BUDGETS', 'MATERIALS_HOW_MUCH_BUDGETS_CONFIRMATION', 'MATERIALS_WHERE', 'MATERIALS_WHERE_CONFIRMATION', 'MATERIALS_ARE_REFUNDABLE', 'MATERIALS_ARE_REFUNDABLE_CONFIRMATION', 'SERVICE_CONTRACT_CANCEL', 'SERVICE_CONTRACT_CANCEL_CONFIRMATION', 'SERVICE_CONTRACT_CANCEL_DETAILS', 'SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION', 'SERVICE_CONTRACT_HAS_MORE', 'SERVICE_CONTRACT_HAS_MORE_DESCRIPTION', 'SERVICE_CONTRACT_HAS_MORE_DESCRIPTION_CONFIRMATION ', 'SERVICE_CONTRACT_HAS_DEADLINE_MORE', 'SERVICE_CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION', 'CONTRACT_HAS_DEADLINE_MORE_DESCRIPTION_CONFIRMATION', 'SERVICE_DELIVERY', 'SERVICE_DELIVERY_CONFIRMATION', 'SERVICE_CONTRACT_HAS_CANCELLATION_MORE', 'SERVICE_CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION', 'CONTRACT_HAS_CANCELLATION_MORE_DESCRIPTION_CONFIRMATION', 'WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION', 'WHAT_IS_CONTRACT_CANCELLATION', 'SERVICE_CONTRACT_APPROVAL_DESCRIPTION', 'CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION', 'CONTRACT_HAS_REJECTED_BY_COUNTERPART_CONFIRMATION', 'CONTRACT_CORRECTION_BY_OWNER', 'CONTRACT_CORRECTION_BY_OWNER_CONFIRMATION', 'SERVICE_HAS_WARRANTY', 'SERVICE_WARRANTY_TYPE', 'SERVICE_WARRANTY_DETAILS', 'SERVICE_WARRANTY_DETAILS_CONFIRMATION', 'SERVICE_JUDICIAL_RESOLUTION_DETAILS', 'SERVICE_JUDICIAL_RESOLUTION_DETAILS_CONFIRMATION', 'OWNER_SIGNATURE', 'COUNTERPART_SIGNATURE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_status_enum" AS ENUM('NONE', 'OPEN', 'CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_awaiting_response_from_enum" AS ENUM('NONE', 'OWNER', 'COUNTERTPART')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_owner_type_enum" AS ENUM('NONE', 'SERVICE_PROVIDER', 'CUSTOMER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_who_will_buy_the_materials_enum" AS ENUM('NONE', 'OWNER', 'COUNTERTPART')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ticket_who_will_pay_for_the_materials_enum" AS ENUM('NONE', 'OWNER', 'COUNTERTPART')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" "public"."ticket_state_enum" NOT NULL DEFAULT 'NONE', "status" "public"."ticket_status_enum" NOT NULL DEFAULT 'NONE', "awaiting_response_from" "public"."ticket_awaiting_response_from_enum" NOT NULL DEFAULT 'NONE', "owner_type" "public"."ticket_owner_type_enum" NOT NULL DEFAULT 'NONE', "counterpart_name" character varying, "counterpart_taxpayer_number" character varying, "counterpart_phone_number" character varying, "counterpart_email" character varying, "counterpart_address" character varying, "service_address" character varying, "service_description" character varying, "service_steps_description" character varying, "service_start_date" character varying, "service_end_date" character varying, "payment_amount" character varying, "payment_due_dates" character varying, "materials_delivery_schedule" character varying, "how_materials_will_be_bought" character varying, "materia_are_refundable_state" character varying, "how_many_budges_before_buy_materials" character varying, "where_materials_will_be_delivered" character varying, "service_contract_cancel" character varying, "service_contract_cancel_details" character varying, "service_material_how_much" character varying, "service_work_hours_description" character varying, "payment_method_description" character varying, "installment_count" character varying, "material_is_part_of_contract" boolean, "who_will_buy_the_materials" "public"."ticket_who_will_buy_the_materials_enum" NOT NULL DEFAULT 'NONE', "who_will_pay_for_the_materials" "public"."ticket_who_will_pay_for_the_materials_enum" NOT NULL DEFAULT 'NONE', "materials_pre_determined_value" character varying, "materials_purchase_details" character varying, "contract_has_more_description" character varying, "contract_has_deadline_more_description" character varying, "service_delivery_description" character varying, "contract_has_cancellation_more_description" character varying, "what_is_contract_cancellation" character varying, "service_warranty" character varying, "warranty_description" character varying, "judicial_resolution" character varying, "signed_by_owner" boolean, "signed_by_owner_at" TIMESTAMP, "signed_by_counterpart" boolean, "signed_by_counterpart_at" TIMESTAMP, "contract" character varying, "contract_has_rejected_by_counterpart_description" character varying, "who_is_editing" character varying DEFAULT 'owner', "contract_correction" character varying, "category_id" uuid, "owner_id" uuid, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cb73208f151aa71cdd78f662d7" ON "category" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conversation_status_enum" AS ENUM('OPEN', 'CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "payload" json NOT NULL, "status" "public"."conversation_status_enum" NOT NULL, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."history_direction_enum" AS ENUM('INCOMING', 'OUTGOING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "message" json NOT NULL, "direction" "public"."history_direction_enum" NOT NULL, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "order_id" character varying NOT NULL, "payer_phone" character varying NOT NULL, "transaction_id" character varying, "status" character varying, "emv" character varying, "used" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category_parent_category" ("category_id_1" uuid NOT NULL, "category_id_2" uuid NOT NULL, CONSTRAINT "PK_f69d02ee35b0cbe26d2408a367c" PRIMARY KEY ("category_id_1", "category_id_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8dc6699781311b9710188688af" ON "category_parent_category" ("category_id_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bf616908cc95d8febecbdd8113" ON "category_parent_category" ("category_id_2") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD CONSTRAINT "FK_eb16ef58c3c71cf333b9cc106f0" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parent_category" ADD CONSTRAINT "FK_8dc6699781311b9710188688afb" FOREIGN KEY ("category_id_1") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parent_category" ADD CONSTRAINT "FK_bf616908cc95d8febecbdd81134" FOREIGN KEY ("category_id_2") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_parent_category" DROP CONSTRAINT "FK_bf616908cc95d8febecbdd81134"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category_parent_category" DROP CONSTRAINT "FK_8dc6699781311b9710188688afb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" DROP CONSTRAINT "FK_eb16ef58c3c71cf333b9cc106f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket" DROP CONSTRAINT "FK_41d5bc6539e69677fb5f54fd80d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bf616908cc95d8febecbdd8113"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8dc6699781311b9710188688af"`,
    );
    await queryRunner.query(`DROP TABLE "category_parent_category"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TABLE "history"`);
    await queryRunner.query(`DROP TYPE "public"."history_direction_enum"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TYPE "public"."conversation_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cb73208f151aa71cdd78f662d7"`,
    );
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "ticket"`);
    await queryRunner.query(
      `DROP TYPE "public"."ticket_who_will_pay_for_the_materials_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."ticket_who_will_buy_the_materials_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."ticket_owner_type_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."ticket_awaiting_response_from_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."ticket_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
