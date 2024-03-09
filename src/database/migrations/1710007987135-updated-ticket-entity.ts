import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTicketEntity1710007987135 implements MigrationInterface {
    name = 'UpdatedTicketEntity1710007987135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_address" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_details" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_start_date" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_end_date" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_payment_amount" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_payment_dates" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_material_date" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_material_how_buy" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_material_payback" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_material_how_much_budgets" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_material_where" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_contract_cancel" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_contract_cancel_details" character varying`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "service_material_how_much" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum" RENAME TO "ticket_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum" AS ENUM('NONE', 'CLOSED', 'FIRST_TICKET', 'SELECT_TICKET', 'WAITING_OWNER_TYPE', 'WAITING_COUNTERPART_NAME', 'WAITING_COUNTERPART_NAME_CONFIRMATION', 'WAITING_COUNTERPART_TAXPAYER_NUMBER', 'WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_PHONE_NUMBER', 'WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_EMAIL', 'WAITING_COUNTERPART_EMAIL_CONFIRMATION', 'WAITING_COUNTERPART_ADDRESS', 'WAITING_COUNTERPART_ADDRESS_CONFIRMATION', 'WAITING_SERVICE_CATEGORY', 'WAITING_SERVICE_ADDRESS', 'WAITING_SERVICE_ADDRESS_CONFIRMATION', 'WAITING_SERVICE_DETAILS', 'WAITING_SERVICE_DETAILS_CONFIRMATION', 'WAITING_SERVICE_START_DATE', 'WAITING_SERVICE_START_DATE_CONFIRMATION', 'WAITING_SERVICE_END_DATE', 'WAITING_SERVICE_END_DATE_CONFIRMATION', 'WAITING_SERVICE_PAYMENT_AMOUNT', 'WAITING_SERVICE_PAYMENT_AMOUNT_CONFIRMATION', 'WAITING_SERVICE_PAYMENT_DATES', 'WAITING_SERVICE_PAYMENT_DATES_CONFIRMATION', 'WAITING_SERVICE_MATERIAL_DATE', 'WAITING_SERVICE_MATERIAL_DATE_CONFIRMATION', 'WAITING_SERVICE_MATERIAL_HOW_BUY', 'WAITING_SERVICE_MATERIAL_HOW_BUY_CONFIRMATION', 'WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS', 'WAITING_SERVICE_MATERIAL_HOW_MUCH_BUDGETS_CONFIRMATION', 'WAITING_SERVICE_MATERIAL_WHERE', 'WAITING_SERVICE_MATERIAL_WHERE_CONFIRMATION', 'WAITING_SERVICE_MATERIAL_PAYBACK', 'WAITING_SERVICE_MATERIAL_PAYBACK_CONFIRMATION', 'WAITING_SERVICE_CONTRACT_CANCEL', 'WAITING_SERVICE_CONTRACT_CANCEL_CONFIRMATION', 'WAITING_SERVICE_CONTRACT_CANCEL_DETAILS', 'WAITING_SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION', 'WAITING_SERVICE_MATERIAL_HOW_MUCH', 'WAITING_SERVICE_MATERIAL_HOW_MUCH_CONFIRMATION')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum" USING "state"::"text"::"public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ticket_state_enum_old" AS ENUM('NONE', 'CLOSED', 'FIRST_TICKET', 'SELECT_TICKET', 'WAITING_OWNER_TYPE', 'WAITING_COUNTERPART_NAME', 'WAITING_COUNTERPART_NAME_CONFIRMATION', 'WAITING_COUNTERPART_TAXPAYER_NUMBER', 'WAITING_COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_PHONE_NUMBER', 'WAITING_COUNTERPART_PHONE_NUMBER_CONFIRMATION', 'WAITING_COUNTERPART_EMAIL', 'WAITING_COUNTERPART_EMAIL_CONFIRMATION', 'WAITING_COUNTERPART_ADDRESS', 'WAITING_COUNTERPART_ADDRESS_CONFIRMATION', 'WAITING_SERVICE_CATEGORY')`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" TYPE "public"."ticket_state_enum_old" USING "state"::"text"::"public"."ticket_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "state" SET DEFAULT 'NONE'`);
        await queryRunner.query(`DROP TYPE "public"."ticket_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ticket_state_enum_old" RENAME TO "ticket_state_enum"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_material_how_much"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_contract_cancel_details"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_contract_cancel"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_material_where"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_material_how_much_budgets"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_material_payback"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_material_how_buy"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_material_date"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_payment_dates"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_payment_amount"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_end_date"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_start_date"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_details"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "service_address"`);
    }

}
