import { OwnerType } from '../../ticket/entities/owner-type';

export const messages = {
  WELCOME: () => '*Bem-vindo ao Minha Palavra!*',
  DATA_PRIVACY: () =>
    'Tenho plena consciência de que estou participando do período de teste do *Minha Palavra*, uma inovadora plataforma destinada a facilitar e reforçar os acordos cotidianos. Durante esta fase beta, informants que não podemos nos responsabilizar por eventuais erros ou instabilidades que possam ocorrer na plataforma. Solicitaremos os endereços de e-mail dos participantes com o objetivo de realizar futuras pesquisas. Ressaltamos que todos os dados coletados estão protegidos e tratados conforme as diretrizes da *Lei Geral de Proteção de Dados (LGPD)*.',
  DATA_PRIVACY_ACCEPTED: () => 'Certo, vamos continuar!',
  USER_NAME_REQUEST: () => 'Qual é o seu nome?',
  USER_FULL_NAME_CONFIRMATION_REQUEST: (fullName: string) =>
    `O seu nome completo é ${fullName}?`,
  USER_PHONE_NUMBER_REQUEST: () =>
    'Agora precisamos do seu número de telefone. Por favor, digite o seu número de telefone.',
  USER_PHONE_NUMBER_CONFIRMATION_REQUEST: (phoneNumber: string) =>
    `O número ${phoneNumber}, está correto?`,
  USER_EMAIL_REQUEST: () => 'Qual é o seu e-mail?',
  USER_EMAIL_CONFIRMATION_REQUEST: (email: string) =>
    `O seu e-mail é ${email}?`,
  USER_TAXPAYER_NUMBER_REQUEST: () => 'Qual é o seu CPF/CPNJ?',
  USER_TAXPAYER_NUMBER_CONFIRMATION_REQUEST: (taxpayerNumber: string) =>
    `O ${taxpayerNumber.length === 14 ? 'CPF' : 'CPNJ'} ${taxpayerNumber}, está correto?`,
  USER_ADDRESS_REQUEST: () => 'Qual é o seu endereço?',
  USER_ADDRESS_CONFIRMATION_REQUEST: (address: string) =>
    `O seu endereço é ${address}?`,
  INVALID_OPTION: () =>
    'Desculpe, essa opção não é válida atualmente. Vamos tentar novamente.',
  INVALID_TAXPAYER_NUMBER: () =>
    'Este não é um CPF/CPNJ válido. Por favor, digite um CPF/CPNJ válido.',
  INVALID_PHONE_NUMBER: () =>
    'Este não é um número de telefone válido. Por favor, digite um número de telefone válido.',
  INVALID_EMAIL: () =>
    'Este não é um e-mail válido. Por favor, digite um e-mail válido.',
  REGISTRATION_COMPLETE: () =>
    'Obrigado por se registrar! Agora você pode começar a usar o Minha Palavra.',
  FIRST_TICKET_CONFIRMATION: () => 'Deseja fazer o primeiro contrato?',
  TICKET_START: () =>
    'Certo, precisaremos de algumas informações para gerar o contrato.',
  TICKET_OWNER_TYPE_REQUEST: () => 'Você é o contratante ou o contratado?',
  TICKET_OWNER_TYPE_CONFIRMATION_REQUEST: (ownerType: OwnerType) =>
    `Você é o ${ownerType}?`,
  COUNTERPART_NAME_REQUEST: (owner: OwnerType) =>
    `Qual é o nome do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`,
  COUNTERPART_NAME_CONFIRMATION_REQUEST: (owner: OwnerType, counterpartName) =>
    `O nome do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, ${counterpartName} está correto?`,
  COUNTERPART_TAXPAYER_NUMBER_REQUEST: (owner: OwnerType) =>
    `Qual é o CPF/CPNJ do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`,
  COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION_REQUEST: (
    owner: OwnerType,
    taxpayerNumber: string,
  ) =>
    `O ${taxpayerNumber.length === 14 ? 'CPF' : 'CPNJ'} ${taxpayerNumber} do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`,
  COUNTERPART_PHONE_NUMBER_REQUEST: (owner: OwnerType) =>
    `Qual é o telefone do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`,
  COUNTERPART_PHONE_NUMBER_CONFIRMATION_REQUEST: (
    owner: OwnerType,
    phoneNumber,
  ) =>
    `O telefone ${phoneNumber} do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`,
  COUNTERPART_EMAIL_REQUEST: (owner: OwnerType) =>
    `Qual é o e-mail do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`,
  COUNTERPART_EMAIL_CONFIRMATION_REQUEST: (owner: OwnerType, email) =>
    `O e-mail ${email} do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`,
  COUNTERPART_ADDRESS_REQUEST: (owner: OwnerType) =>
    `Qual é o endereço do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`,
  COUNTERPART_ADDRESS_CONFIRMATION_REQUEST: (owner: OwnerType, address) =>
    `O endereço ${address} do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`,
  SERVICE_CATEGORY_REQUEST: () => 'Qual é a categoria do serviço?',
  SERVICE_ADDRESS_REQUEST: () =>
    'Qual é o endereço para a prestação do serviço?',
  SERVICE_ADDRESS_CONFIRMATION_REQUEST: (serviceAddress: string) =>
    `O endereço, ${serviceAddress}, para a prestação do serviço está correto?`,
  SERVICE_DETAILS_REQUEST: () =>
    'Descreva o serviço que está sendo oferecido. Escreva todos os detalhes do serviço a ser prestado.',
  SERVICE_DETAILS_CONFIRMATION_REQUEST: () =>
    'A descrição do serviço está correta?',
  SERVICE_START_DATE_REQUEST: () => 'Quando será iniciado o serviço?',
  SERVICE_START_DATE_CONFIRMATION_REQUEST: (serviceStartDate: string) =>
    `A data ${serviceStartDate}, para início do serviço está correta?`,
  SERVICE_END_DATE_REQUEST: () => 'Quando será terminado do serviço?',
  SERVICE_END_DATE_CONFIRMATION_REQUEST: (serviceStartDate: string) =>
    `A data ${serviceStartDate}, para término do serviço está correta?`,
  SERVICE_PAYMENT_AMOUNT_REQUEST: () => 'Qual o valor total do pagamento?',
  SERVICE_PAYMENT_AMOUNT_CONFIRMATION_REQUEST: (servicePaymentAmount: string) =>
    `O valor total ${servicePaymentAmount}, está correto?`,
  SERVICE_PAYMENT_DATES_REQUEST: () => 'Quais são as datas de pagamento?',
  SERVICE_PAYMENT_DATES_CONFIRMATION_REQUEST: (servicePaymentDates: string) =>
    `As datas de pagamento ${servicePaymentDates}, estão corretas?`,
  SERVICE_MATERIAL_DATE_REQUEST: () => `Qual o prazo de
entrega?`,
  SERVICE_MATERIAL_DATE_CONFIRMATION_REQUEST: (serviceMaterialDate: string) =>
    `O prazo de entrega ${serviceMaterialDate}, está correto?`,
  SERVICE_MATERIAL_HOW_BUY_REQUEST: () => `Como será feita a
compra do material?`,
  SERVICE_MATERIAL_HOW_BUY_CONFIRMATION_REQUEST: (
    serviceMaterialHowBuy: string,
  ) =>
    `A compra do material será feita ${serviceMaterialHowBuy}, está correto?`,
  SERVICE_MATERIAL_WHERE_REQUEST: () => `Onde será entrega do material?`,
  SERVICE_MATERIAL_WHERE_CONFIRMATION_REQUEST: (serviceMaterialWhere: string) =>
    `O endereço ${serviceMaterialWhere}, para entrega do material está correto?`,
  SERVICE_MATERIAL_HOW_MUCH_BUDGETS_REQUEST: () => `Quantos orçamentos
são necessários?`,
  SERVICE_MATERIAL_HOW_MUCH_BUDGETS_CONFIRMATION_REQUEST: (
    serviceMaterialHowMuchBudgets: string,
  ) =>
    `Serão necessários ${serviceMaterialHowMuchBudgets} orçamentos, está correto?`,
  SERVICE_CONTRACT_CANCEL_REQUEST: () =>
    `O que será considerado um cancelamento de contrato?\nDescreva os detalhes do cancelamento.`,
  SERVICE_CONTRACT_CANCEL_CONFIRMATION_REQUEST: (
    serviceContractCancel: string,
  ) =>
    `O cancelamento de contrato será considerado ${serviceContractCancel}, está correto?`,
  SERVICE_CONTRACT_CANCEL_DETAILS_REQUEST: () =>
    `Descreva em detalhes as práticas exigidas para cancelamentos de contratos em andamento do seu serviço prestado, bem como, como devem ser feitas as avaliações da qualidade dos serviços prestados.`,
  SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION_REQUEST: (
    serviceContractCancelDetails: string,
  ) =>
    `As práticas exigidas para cancelamentos de contratos em andamento do seu serviço prestado, bem como, como devem ser feitas as avaliações da qualidade dos serviços prestados, estão corretas?`,
  SERVICE_MATERIAL_HOW_MUCH_REQUEST: () => `Tem valor pré determinado?`,
  SERVICE_MATERIAL_HOW_MUCH_CONFIRMATION_REQUEST: (
    serviceMaterialHowMuch: any,
  ) => `O valor pré determinado é ${serviceMaterialHowMuch}, está correto?`,
  SERVICE_STEPS_REQUEST: () => 'Existe números de etapas no processo?',
  SERVICE_STEPS_DESCRIPTION_REQUEST: () => `Descreva as etapas do processo.`,
  SERVICE_HOURS_REQUEST: () => `Gostaria de definir os horários`,
  SERVICE_STEPS_DESCRIPTION_CONFIRMATION_REQUEST: () =>
    `As etapas do processo estão corretas?`,
  SERVICE_HOURS_DESCRIPTION_REQUEST: () => `Descreva os horários`,
  SERVICE_HOURS_DESCRIPTION_CONFIRMATION_REQUEST: () =>
    `Os horários estão corretos?`,
};
