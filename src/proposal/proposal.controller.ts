import { Controller, Get } from '@nestjs/common';
import { ProposalService } from './proposal.service';

@Controller('proposal')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get()
  async testProposal() {
    const response = await this.proposalService.generateProposal(
      'Produção Gráfica', //category
      '2 pasteis de queijo e um caldo de cana gelado', //description
      'bitcoin, a ser pago em 12 parcelas iguais, sem juros.', //payment
      'Matheus', //userName
      '12345678901', //userPhoneNumber
      'contact@matheusmartins.com', //userEmail
      '035.439.381-26', //userTaxpayerNumber
      'Meste dos Magos', //clientNome
      '1234567890', //clientPhoneNumber
      'cliente@example.com', //clientEmail
      '272.409.380-18', // clientTaxpayerNumber
    );

    return response;
  }
}
