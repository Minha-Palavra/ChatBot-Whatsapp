import { MigrationInterface, QueryRunner } from 'typeorm';
import { Start1692045053250 } from './1692045053250-start';
import { AddMessageDirectionToHistory1692045587413 } from './1692045587413-AddMessageDirectionToHistory';
import { Decisiontree1692066460836 } from './1692066460836-decisiontree';
import { Decisiontree1692069153617 } from './1692069153617-decisiontree';
import { Decisiontree1692069627192 } from './1692069627192-decisiontree';
import { Decisiontree1692070058351 } from './1692070058351-decisiontree';
import { Ticket1692103671567 } from './1692103671567-ticket';
import { SlugIndex1692219775793 } from './1692219775793-slugIndex';
import { DecisionStatus1692288115687 } from './1692288115687-decisionStatus';
import { TicketAndUserData1693546233221 } from './1693546233221-ticketAndUserData';
import { NewDecisionStructure1694636890155 } from './1694636890155-newDecisionStructure';
import { NewDecisionStructure1694639429232 } from './1694639429232-newDecisionStructure';
import { MakeDecisionSlugUnique1694652427774 } from './1694652427774-makeDecisionSlugUnique';
import { PluralizeParent1694654194993 } from './1694654194993-pluralizeParent';
import { PluralizeParent1694654194994 } from './1694654194994-pluralizeParent2';
import { TicketStateEnum1695121292816 } from './1695121292816-ticketStateEnum';
import { JobDeadline1695734103755 } from './1695734103755-jobDeadline';
import { JobDeadlineEntity1695900159371 } from './1695900159371-jobDeadlineEntity';
import { JobDeadline1695905719550 } from './1695905719550-jobDeadline';
import { DisputeForum1695919780097 } from './1695919780097-disputeForum';
import { TicketOwnerEnum1697309241567 } from './1697309241567-ticket-owner-enum';
import { Counterpart1697392990443 } from './1697392990443-counterpart';
import { DropClient1697393667131 } from './1697393667131-drop-client';
import { TicketStateContext1697403185943 } from './1697403185943-ticket-state-context';

export class ClearDatabase1707578817771 implements MigrationInterface {
  name = 'ClearDatabase1707578817771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await new TicketStateContext1697403185943().down(queryRunner);
    await new DropClient1697393667131().down(queryRunner);
    await new Counterpart1697392990443().down(queryRunner);
    await new TicketOwnerEnum1697309241567().down(queryRunner);
    await new DisputeForum1695919780097().down(queryRunner);
    await new JobDeadline1695905719550().down(queryRunner);
    await new JobDeadlineEntity1695900159371().down(queryRunner);
    await new JobDeadline1695734103755().down(queryRunner);
    await new TicketStateEnum1695121292816().down(queryRunner);
    await new PluralizeParent1694654194994().down(queryRunner);
    await new PluralizeParent1694654194993().down(queryRunner);
    await new MakeDecisionSlugUnique1694652427774().down(queryRunner);
    await new NewDecisionStructure1694639429232().down(queryRunner);
    await new NewDecisionStructure1694636890155().down(queryRunner);
    await new TicketAndUserData1693546233221().down(queryRunner);
    await new DecisionStatus1692288115687().down(queryRunner);
    await new SlugIndex1692219775793().down(queryRunner);
    await new Ticket1692103671567().down(queryRunner);
    await new Decisiontree1692070058351().down(queryRunner);
    await new Decisiontree1692069627192().down(queryRunner);
    await new Decisiontree1692069153617().down(queryRunner);
    await new Decisiontree1692066460836().down(queryRunner);
    await new AddMessageDirectionToHistory1692045587413().down(queryRunner);
    await new Start1692045053250().down(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await new Start1692045053250().up(queryRunner);
    await new AddMessageDirectionToHistory1692045587413().up(queryRunner);
    await new Decisiontree1692066460836().up(queryRunner);
    await new Decisiontree1692069153617().up(queryRunner);
    await new Decisiontree1692069627192().up(queryRunner);
    await new Decisiontree1692070058351().up(queryRunner);
    await new Ticket1692103671567().up(queryRunner);
    await new SlugIndex1692219775793().up(queryRunner);
    await new DecisionStatus1692288115687().up(queryRunner);
    await new TicketAndUserData1693546233221().up(queryRunner);
    await new NewDecisionStructure1694636890155().up(queryRunner);
    await new NewDecisionStructure1694639429232().up(queryRunner);
    await new MakeDecisionSlugUnique1694652427774().up(queryRunner);
    await new PluralizeParent1694654194993().up(queryRunner);
    await new PluralizeParent1694654194994().up(queryRunner);
    await new TicketStateEnum1695121292816().up(queryRunner);
    await new JobDeadline1695734103755().up(queryRunner);
    await new JobDeadlineEntity1695900159371().up(queryRunner);
    await new JobDeadline1695905719550().up(queryRunner);
    await new DisputeForum1695919780097().up(queryRunner);
    await new TicketOwnerEnum1697309241567().up(queryRunner);
    await new Counterpart1697392990443().up(queryRunner);
    await new DropClient1697393667131().up(queryRunner);
    await new TicketStateContext1697403185943().up(queryRunner);
  }
}
