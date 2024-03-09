export type MinhaPalavraSeedType = {
  title: string;
  slug: string;
  description?: string;
  children: Partial<MinhaPalavraSeedType>[];
};

export const minhaPalavraSeedData: MinhaPalavraSeedType = {
  title: 'Bem-vindo ao MinhaPalavra!',
  slug: 'root',
  description:
    'Navegue por nossas categorias e escolha aquela que melhor representa o serviço que você deseja.',
  children: [
    {
      title: 'Construção Civil',
      slug: 'construcao-civil',
      description: 'Encontre profissionais para sua obra.',
      children: [
        {
          title: 'Mestre de Obras',
          slug: 'mestre-de-obras',
          description: 'Profissional responsável pela obra.',
        },
        {
          title: 'Carpinteiro',
          slug: 'carpinteiro',
          description: 'Profissional que trabalha com madeira.',
        },
        {
          title: 'Encarregado',
          slug: 'encarregado',
          description: 'Profissional responsável pela equipe.',
        },
        {
          title: 'Pedreiro',
          slug: 'pedreiro',
          description: 'Profissional que trabalha com alvenaria.',
        },
        {
          title: 'Armador',
          slug: 'armador',
          description: 'Profissional que trabalha com ferro.',
        },
        {
          title: 'Serralheiro',
          slug: 'serralheiro',
          description: 'Profissional que trabalha com metal.',
        },
        {
          title: 'Servente',
          slug: 'servente',
          description: 'Profissional que auxilia na obra.',
        },
        {
          title: 'Encanador',
          slug: 'encanador',
          description: 'Profissional que trabalha com tubulações.',
        },
        {
          title: 'Eletricista',
          slug: 'eletricista',
          description: 'Profissional que trabalha com instalações elétricas.',
        },
        {
          title: 'Pintor',
          slug: 'pintor',
          description: 'Profissional que trabalha com pintura.',
        },
        {
          title: 'Gesseiro',
          slug: 'Gesseiro',
          description: 'Profissional que trabalha com gesso.',
        },
        {
          title: 'Outros',
          slug: 'outros',
          description: 'Outros profissionais da construção civil.',
        },
      ],
    },
  ],
};
