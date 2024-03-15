import { Controller, Get } from '@nestjs/common';
import { ContractService } from './contract.service';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  async testProposal() {
    const response = await this.contractService.generateProposal(
      'Produção Gráfica', //category
      '2 pasteis de queijo e um caldo de cana gelado', //description
      'bitcoin, a ser pago em 12 parcelas iguais, sem juros.', //payment
      'Matheus', //userName
      '12345678901', //userPhoneNumber
      'contact@matheusmartins.com', //userEmail
      '779.336.380-90', //userTaxpayerNumber
      'Meste dos Magos', //clientNome
      '1234567890', //clientPhoneNumber
      'cliente@example.com', //clientEmail
      '272.409.380-18', // clientTaxpayerNumber
      '1 ano', //deadline
      '34213414123', //disputeForum
      'email@gmail.com',
      '779.336.380-90',
      'blablabla',
      '34213414123',
      'email@gmail.com',
      '779.336.380-90',
      '1 ano',
      'BSB',
      'total',
      '2 anos',
    );

    return response;
  }
}
