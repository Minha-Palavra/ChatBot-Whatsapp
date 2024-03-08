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
        },
        {
          title: 'Carpinteiro',
          slug: 'carpinteiro',
        },
        {
          title: 'Encarregado',
          slug: 'encarregado',
        },
        {
          title: 'Pedreiro',
          slug: 'pedreiro',
        },
        {
          title: 'Armador',
          slug: 'armador',
        },
        {
          title: 'Serralheiro',
          slug: 'serralheiro',
        },
        {
          title: 'Servente',
          slug: 'servente',
        },
        {
          title: 'Encanador',
          slug: 'encanador',
        },
        {
          title: 'Eletricista',
          slug: 'eletricista',
        },
        {
          title: 'Pintor',
          slug: 'pintor',
        },
        {
          title: 'Gesseiro',
          slug: 'Gesseiro',
        },
        {
          title: 'Outros',
          slug: 'outros',
        },
      ],
    },
  ],
};
