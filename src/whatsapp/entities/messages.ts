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
};
