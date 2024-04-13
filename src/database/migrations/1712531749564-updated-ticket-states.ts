import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedTicketStates1712531749564 implements MigrationInterface {
  name = 'UpdatedTicketStates1712531749564';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket" ADD "what_is_contract_cancellation_details" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ticket" DROP COLUMN "what_is_contract_cancellation_details"`,
    );
  }
}
