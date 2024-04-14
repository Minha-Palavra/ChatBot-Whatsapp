import { OwnerType } from '../../ticket/entities/owner-type';

export const messages = {
  INVALID_OPTION: () => {
    return 'Desculpe, essa opção não é válida atualmente. Vamos tentar novamente.';
  },
  INVALID_TAXPAYER_NUMBER: () => {
    return 'Este não é um CPF ou CNPJ válido.\n\nPor favor, digite um CPF ou CNPJ válido.';
  },
  INVALID_PHONE_NUMBER: () => {
    return 'Este não é um número de telefone válido. Por favor, digite um número de telefone válido.';
  },
  INVALID_EMAIL: () => {
    return 'Este não é um e-mail válido. Por favor, digite um e-mail válido.';
  },
  WELCOME: () => {
    return `*Bem-vindo ao Minha Palavra!*`;
  },
  DATA_PRIVACY: () => {
    return `Sei que estou participando do período de teste do Minha Palavra, uma inovadora plataforma destinada a facilitar e reforçar os acordos cotidianos.\n\nApesar de não ter isoladamente valor jurídico, ajuda as partes a deixarem seus acordos mais claros e fortalecidos. Ressaltamos que de forma alguma o Minha Palavra se responsabiliza pelos acordos firmados.\n\nDurante esta fase beta, informamos que não podemos nos responsabilizar também por eventuais erros ou instabilidades que possam ocorrer na plataforma.\n\nSolicitaremos os endereços de e-mail dos participantes com o objetivo de realizar futuras pesquisas. Ressaltamos que todos os dados coletados estão protegidos e tratados conforme as diretrizes da Lei Geral de Proteção de Dados (LGPD).\n\nQualquer dúvida ou comentário favor enviar e-mail para *adm@minhapalavra.net*. Obrigado`;
  },
  DATA_PRIVACY_ACCEPTED: () => {
    return 'Certo, vamos continuar!';
  },
  USER_FULL_NAME_REQUEST: () => {
    return 'Qual é o seu nome completo?';
  },
  USER_FULL_NAME_CONFIRMATION_REQUEST: (name: string) => {
    return `O seu nome completo é *${name}?*`;
  },
  USER_TAXPAYER_NUMBER_REQUEST: () => {
    return 'Qual é o seu CPF ou CNPJ?';
  },
  USER_TAXPAYER_NUMBER_CONFIRMATION_REQUEST: (taxpayerNumber: string) => {
    return `O ${taxpayerNumber.length === 14 ? 'CPF' : 'CNPJ'} *${taxpayerNumber}*, está correto?`;
  },
  USER_EMAIL_REQUEST: () => {
    return 'Qual é o seu e-mail?';
  },
  USER_EMAIL_CONFIRMATION_REQUEST: (email: string) => {
    return `O seu e-mail é *${email}*?`;
  },
  USER_PHONE_NUMBER_REQUEST: () => {
    return 'Agora precisaremos do seu número de telefone. Por favor, digite o seu número de telefone.';
  },
  USER_PHONE_NUMBER_CONFIRMATION_REQUEST: (phoneNumber: string) => {
    return `O número *${phoneNumber}*, está correto?`;
  },
  USER_ADDRESS_REQUEST: () => 'Qual é o seu endereço?',
  USER_ADDRESS_CONFIRMATION_REQUEST: (address: string) => {
    return `O seu endereço é *${address}*?`;
  },
  REGISTRATION_COMPLETE: () => {
    return 'Obrigado por se registrar! Agora você pode já começar a usar o Minha Palavra.';
  },
  FIRST_TICKET: () => {
    return 'Deseja fazer o seu primeiro contrato?';
  },
  TICKET_START: () => {
    return 'Certo, precisaremos de algumas informações para gerar o seu contrato.';
  },
  TICKET_OWNER_TYPE_REQUEST: () => {
    return 'Você é o contratante ou o contratado?';
  },
  COUNTERPART_NAME_REQUEST: function (owner: OwnerType) {
    return `Qual é o nome do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`;
  },
  COUNTERPART_NAME_CONFIRMATION_REQUEST: (
    owner: OwnerType,
    counterpartName,
  ) => {
    return `O nome do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, *${counterpartName}* está correto?`;
  },
  COUNTERPART_TAXPAYER_NUMBER_REQUEST: (owner: OwnerType) => {
    return `Qual é o CPF ou CNPJ do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`;
  },
  COUNTERPART_TAXPAYER_NUMBER_CONFIRMATION_REQUEST: (
    owner: OwnerType,
    taxpayerNumber: string,
  ) => {
    return `O ${taxpayerNumber.length === 14 ? 'CPF' : 'CNPJ'} *${taxpayerNumber}* do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`;
  },
  COUNTERPART_PHONE_NUMBER_REQUEST: (owner: OwnerType) => {
    return `Qual é o telefone  com DDD do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`;
  },
  COUNTERPART_PHONE_NUMBER_CONFIRMATION_REQUEST: (
    owner: OwnerType,
    phoneNumber: string,
  ) => {
    return `O telefone *${phoneNumber}* do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`;
  },
  COUNTERPART_EMAIL_REQUEST: (owner: OwnerType) => {
    return `Qual é o e-mail do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`;
  },
  COUNTERPART_EMAIL_CONFIRMATION_REQUEST: (owner: OwnerType, email: string) => {
    return `O e-mail *${email}* do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`;
  },
  COUNTERPART_ADDRESS_REQUEST: (owner: OwnerType) => {
    return `Qual é o endereço do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}?`;
  },
  COUNTERPART_ADDRESS_CONFIRMATION_REQUEST: (
    owner: OwnerType,
    address: string,
  ) => {
    return `O endereço *${address}* do ${owner === OwnerType.CUSTOMER ? 'contratado' : 'contratante'}, está correto?`;
  },
  // TODO:
  SERVICE_CATEGORY_REQUEST: () => 'Qual é a categoria do serviço?',
  SERVICE_ADDRESS_REQUEST: () => {
    return 'Qual é o endereço para a realização do serviço ou atividade comercial?';
  },
  SERVICE_ADDRESS_CONFIRMATION_REQUEST: (serviceAddress: string) => {
    return `O endereço, ${serviceAddress}, está correto?`;
  },
  SERVICE_DESCRIPTION_REQUEST: () => {
    return 'Descreva com detalhes o que está sendo oferecido.';
  },
  SERVICE_DESCRIPTION_CONFIRMATION_REQUEST: () => {
    return 'A descrição está correta?';
  },
  SERVICE_START_DATE_REQUEST: () =>
    'Quando será iniciado o serviço ou a compra do produto?',
  SERVICE_START_DATE_CONFIRMATION_REQUEST: (serviceStartDate: string) => {
    return `A data ${serviceStartDate}, está correta?`;
  },
  SERVICE_END_DATE_REQUEST: () => {
    return 'Quando será concluído o serviço ou a entrega do produto?';
  },
  SERVICE_END_DATE_CONFIRMATION_REQUEST: (serviceStartDate: string) => {
    return `A data ${serviceStartDate}, está correta?`;
  },
  SERVICE_HAS_STEPS_REQUEST: () => {
    return 'Existe números de etapas no processo?';
  },
  SERVICE_STEPS_DESCRIPTION_REQUEST: () => {
    return `Descreva as etapas do processo.`;
  },
  SERVICE_HAS_WORK_HOURS_REQUEST: () => {
    return `Gostaria de definir os horários?`;
  },
  SERVICE_STEPS_DESCRIPTION_CONFIRMATION_REQUEST: () => {
    return `As etapas do processo estão corretas?`;
  },
  SERVICE_WORK_HOURS_DESCRIPTION_REQUEST: () => {
    return `Descreva os horários`;
  },
  SERVICE_WORK_HOURS_DESCRIPTION_CONFIRMATION_REQUEST: () => {
    return `Os horários estão corretos?`;
  },
  //
  PAYMENT_AMOUNT_REQUEST: () => 'Qual o valor total do pagamento?',
  PAYMENT_AMOUNT_CONFIRMATION_REQUEST: (servicePaymentAmount: string) =>
    `O valor total ${servicePaymentAmount}, está correto?`,
  PAYMENT_DUE_DATES_REQUEST: () => 'Quais são as datas de pagamento?',
  SERVICE_PAYMENT_DATES_CONFIRMATION_REQUEST: (servicePaymentDates: string) =>
    `As datas de pagamento ${servicePaymentDates}, estão corretas?`,

  PAYMENT_METHOD_REQUEST: () => `Qual a forma de pagamento?`,
  IN_CASH_PAYMENT_METHOD_REQUEST: () => `Qual a forma de pagamento a vista?`,
  IN_INSTALLMENTS_PAYMENT_METHOD_REQUEST: () =>
    `Qual a forma de pagamento parcelado?`,
  INSTALLMENT_COUNT_CONFIRMATION_REQUEST: (
    servicePaymentMethodInstallmentCount: string,
  ) =>
    `O número de parcelas é ${servicePaymentMethodInstallmentCount}, está correto?`,
  INSTALLMENT_COUNT_REQUEST: () => `Quantas parcelas?`,
  OTHER_IN_INSTALLMENTS_PAYMENT_METHOD_REQUEST: () =>
    `Descreva a forma de pagamento parcelado`,
  OTHER_IN_INSTALLMENTS_PAYMENT_METHOD_CONFIRMATION_REQUEST: (
    servicePaymentMethodDescription: string,
  ) =>
    `A forma de pagamento parcelado é ${servicePaymentMethodDescription}, está correto?`,
  OTHER_IN_CASH_PAYMENT_METHOD_REQUEST: () =>
    `Descreva a forma de pagamento a vista`,
  OTHER_IN_CASH_PAYMENT_METHOD_CONFIRMATION_REQUEST: (
    servicePaymentMethodDescription: string,
  ) =>
    `A forma de pagamento a vista é ${servicePaymentMethodDescription}, está correto?`,
  OTHER_PAYMENT_METHOD_CONFIRMATION_REQUEST: (
    servicePaymentMethodDescription: string,
  ) =>
    `A forma de pagamento é ${servicePaymentMethodDescription}, está correto?`,
  OTHER_PAYMENT_METHOD_REQUEST: () => `Descreva a forma de pagamento`,
  MATERIALS_DELIVERY_SCHEDULE_REQUEST: () => `Qual o prazo de entrega?`,
  MATERIALS_DELIVERY_SCHEDULE_CONFIRMATION_REQUEST: (
    serviceMaterialDate: string,
  ) => `O prazo de entrega ${serviceMaterialDate}, está correto?`,
  HOW_MATERIALS_WILL_BE_BOUGHT_REQUEST: () => {
    return `Como será feita a compra do material?`;
  },
  HOW_MATERIALS_WILL_BE_BOUGHT_CONFIRMATION_REQUEST: () => {
    return `Como será feita a compra do material, está correto?`;
  },
  WHERE_MATERIALS_WILL_BE_DELIVERED_REQUEST: () => {
    return `Onde será entrega do material?`;
  },
  WHERE_MATERIALS_WILL_BE_DELIVERED_CONFIRMATION_REQUEST: (
    serviceMaterialWhere: string,
  ) => {
    return `O endereço ${serviceMaterialWhere}, para entrega do material está correto?`;
  },
  HOW_MANY_BUDGETS_BEFORE_BUY_MATERIALS_REQUEST: () => {
    return `Quantos orçamentos serão necessários?`;
  },
  HOW_MANY_BUDGETS_BEFORE_BUY_MATERIALS_CONFIRMATION_REQUEST: function (
    budgetsCount: string,
  ) {
    return `Serão necessários ${budgetsCount} orçamentos, está correto?`;
  },

  MATERIALS_ARE_PART_OF_CONTRACT_REQUEST: () => {
    return `O material faz parte do contrato?`;
  },
  MATERIALS_WHO_WILL_BUY_REQUEST: () => {
    return `Quem irá comprar o material?`;
  },
  MATERIALS_HAVE_PRE_DETERMINED_VALUE_CONFIRMATION_REQUEST: () => {
    return `O valor pré determinado dos materiais, está correto?`;
  },
  MATERIALS_HAVE_PRE_DETERMINED_VALUE_REQUEST: () => {
    return `Qual é o valor pré determinado?`;
  },
  MATERIALS_WHO_WILL_PAY_REQUEST: () => {
    return `Quem irá pagar pelo material?`;
  },
  MATERIALS_ARE_REFUNDABLE_CONFIRMATION_REQUEST: (
    serviceMaterialPayback: string,
  ) => `O reembolso será feito ${serviceMaterialPayback}, está correto?`,
  MATERIALS_ARE_REFUNDABLE_REQUEST: () => {
    return `Como será feito o reembolso?`;
  },
  HAS_MATERIALS_PURCHASE_DETAILS_REQUEST: () => {
    return `Gostaria de detalhar como irá acontecer a compra dos materiais?`;
  },
  MATERIALS_PURCHASE_DETAILS_DESCRIPTION_REQUEST: () => {
    return `Descreva como irá acontecer a compra dos materiais`;
  },
  MATERIALS_PURCHASE_DETAILS_DESCRIPTION_CONFIRMATION_REQUEST: () => {
    return `Os detalhes da compra dos materiais estão corretos?`;
  },
  HAS_PAYMENT_FEE_REQUEST: () => {
    return `Existirá multa prevista por atraso de pagamento?`;
  },
  PAYMENT_FEE_REQUEST: () => {
    return `Descreva a multa prevista por atraso de pagamento`;
  },
  PAYMENT_FEE_CONFIRMATION_REQUEST: (contractHasMoreDescription: string) => {
    return `A multa prevista por atraso de pagamento é ${contractHasMoreDescription}, está correta?`;
  },
  HAS_DEADLINE_FEE_REQUEST: () => {
    return `Existirá multa prevista por atraso na entrega?`;
  },
  DEADLINE_FEE_REQUEST: () => {
    return `Descreva a multa prevista por atraso na entrega`;
  },
  DEADLINE_FEE_CONFIRMATION_REQUEST: (
    contractHasDeadlineMoreDescription: string,
  ) => {
    return `A multa prevista por atraso na entrega é ${contractHasDeadlineMoreDescription}, está correta?`;
  },
  SERVICE_DELIVERY_REQUEST: () => {
    return `Como será registrada a conclusão do serviço ou venda?`;
  },
  SERVICE_DELIVERY_CONFIRMATION_REQUEST: () => {
    return `A forma de registro da entrega está correta?`;
  },
  HAS_CANCELLATION_FEE_REQUEST: () => {
    return `Terá penalidade caso de cancelamento do contrato?`;
  },
  CANCELLATION_FEE_REQUEST: () => {
    return `Descreva a penalidade de cancelamento`;
  },
  CANCELLATION_FEE_CONFIRMATION_REQUEST: (
    contractHasCancellationMoreDescription: string,
  ) =>
    `A penalidade de cancelamento é ${contractHasCancellationMoreDescription}, está correta?`,
  WHAT_IS_CONTRACT_CANCELLATION_REQUEST: function () {
    return `O que será considerado um cancelamento de contrato?\nDescreva os detalhes do cancelamento.`;
  },
  WHAT_IS_CONTRACT_CANCELLATION_CONFIRMATION_REQUEST: (
    serviceContractCancel: string,
  ) => {
    return `O cancelamento de contrato será considerado ${serviceContractCancel}, está correto?`;
  },
  WHAT_IS_CONTRACT_CANCELLATION_DETAILS_REQUEST: () => {
    return `Descreva em detalhes as práticas exigidas para o cancelamento de contratos em andamento, seja de serviços ou vendas. Inclua também como devem ser realizadas as avaliações da qualidade do que é oferecido.`;
  },
  WHAT_IS_CONTRACT_CANCELLATION_DETAILS_CONFIRMATION_REQUEST: () => {
    return `As práticas exigidas para cancelamentos do contrato está correta?`;
  },
  SERVICE_CONTRACT_CANCEL_DETAILS_REQUEST: () =>
    `Descreva em detalhes as práticas exigidas para o cancelamento de contratos em andamento, seja de serviços ou vendas. Inclua também como devem ser realizadas as avaliações da qualidade do que é oferecido.`,
  SERVICE_CONTRACT_CANCEL_DETAILS_CONFIRMATION_REQUEST: () =>
    `As práticas exigidas para cancelamentos do contrato está correta?`,
  SERVICE_MATERIAL_HOW_MUCH_REQUEST: () => `Tem valor pré determinado?`,
  SERVICE_MATERIAL_HOW_MUCH_CONFIRMATION_REQUEST: (
    serviceMaterialHowMuch: any,
  ) => `O valor pré determinado é ${serviceMaterialHowMuch}, está correto?`,
  WARRANTY_TYPE_REQUEST: () => `Gostaria de incluir garantia?`,
  SERVICE_WARRANTY_CONFIRMATION_REQUEST: () => `A garantia está correta?`,
  WARRANTY_REQUEST: () => {
    return `Descreva a garantia e prazos de garantia`;
  },
  WARRANTY_DESCRIPTION_CONFIRMATION_REQUEST: () => {
    return `A garantia e prazos de garantia estão corretos?`;
  },
  JUDICIAL_RESOLUTION_REQUEST: () => {
    return `Em caso de desacordo, qual o foro escolhido para a resolução de conflitos? (idealmente, na cidade onde foi firmada o acordo)`;
  },
  JUDICIAL_RESOLUTION_CONFIRMATION_REQUEST: (judicialResolution: string) => {
    return `O foro escolhido é ${judicialResolution}, está correto?`;
  },
  GENERATING_CONTRACT() {
    return `Por favor aguarde estamos analisando todas as informações e gerando seu contrato.`;
  },
  UPDATING_CONTRACT() {
    return `Por favor aguarde estamos analisando todas as informações e atualizando seu contrato.`;
  },
  CONTRACT_APPROVAL_REQUEST: () =>
    `O contrato está correto? Deseja aprovar, assinar e enviar para a contraparte?`,
  CONTRACT_SIGNATURE_REQUEST: (name: string) =>
    `O ${name} enviou um contrato para vocês para que possam oficializar o acordo. Por favor, revise e assine o contrato.`,
  CONTRACT_HAS_SENT_TO_COUNTERPART: (counterpartName: string) =>
    `O contrato foi enviado para ${counterpartName}. Por favor, aguarde a assinatura.`,
  COUNTERPART_SIGNATURE_REQUEST: () => `Deseja assinar o contrato?`,
  CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_REQUEST: () =>
    `Com qual parte do contrato você não concorda? Descreva`,
  CONTRACT_HAS_REJECTED_BY_COUNTERPART_DESCRIPTION_CONFIRMATION_REQUEST: () =>
    `Você descreveu corretamente o que não concorda?`,
  CONTRACT_CORRECTION_BY_OWNER_REQUEST: () => `O que deseja alterar?`,
  CONTRACT_REFUSAL_REASON_REQUEST: (
    contractHasRejectedByCounterpartDescription: string,
  ) =>
    `O contrato foi recusado pela contraparte. O motivo foi: ${contractHasRejectedByCounterpartDescription}.`,
  CONTRACT_CORRECTION_BY_OWNER_CONFIRMATION_REQUEST: () =>
    `As alterações estão corretas?`,
  CONTRACT_WAS_SIGNED: () =>
    `O contrato foi assinado por ambas as partes. Agora o contrato está oficializado.`,
  NEW_TICKET_CONFIRMATION: () => `Deseja criar um novo contrato?`,
  NO_NEW_TICKET: () => `Certo, obrigado!`,
  WAITING_PAYMENT() {
    return 'Efetue o pagamento para continuar.';
  },
  WAS_PAID() {
    return 'Recebemos o pagamento.';
  },
};
