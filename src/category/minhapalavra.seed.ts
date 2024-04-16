export type MinhaPalavraSeedType = {
  title: string;
  slug: string;
  description?: string;
  children: Partial<MinhaPalavraSeedType>[];
  hasMaterialFlow?: boolean;
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
      description: 'Faça contratos personalizados.',
      hasMaterialFlow: true,
      children: [
        {
          title: 'Mestre de Obras',
          slug: 'mestre-de-obras',
          description: 'Profissional responsável pela obra.',
          hasMaterialFlow: true,
        },
        {
          title: 'Carpinteiro',
          slug: 'carpinteiro',
          description: 'Profissional que trabalha com madeira.',
          hasMaterialFlow: true,
        },
        {
          title: 'Encarregado',
          slug: 'encarregado',
          description: 'Profissional responsável pela equipe.',
          hasMaterialFlow: true,
        },
        {
          title: 'Pedreiro',
          slug: 'pedreiro',
          description: 'Profissional que trabalha com alvenaria.',
          hasMaterialFlow: true,
        },
        {
          title: 'Armador',
          slug: 'armador',
          description: 'Profissional que trabalha com ferro.',
          hasMaterialFlow: true,
        },
        {
          title: 'Serralheiro',
          slug: 'serralheiro',
          description: 'Profissional que trabalha com metal.',
          hasMaterialFlow: true,
        },
        {
          title: 'Servente',
          slug: 'servente',
          description: 'Profissional que auxilia na obra.',
          hasMaterialFlow: true,
        },
        {
          title: 'Encanador',
          slug: 'encanador',
          description: 'Profissional que trabalha com tubulações.',
          hasMaterialFlow: true,
        },
        {
          title: 'Eletricista',
          slug: 'eletricista',
          description: 'Profissional que trabalha com instalações elétricas.',
          hasMaterialFlow: true,
        },
        {
          title: 'Pintor',
          slug: 'pintor',
          description: 'Profissional que trabalha com pintura.',
          hasMaterialFlow: true,
        },
        {
          title: 'Gesseiro',
          slug: 'gesseiro',
          description: 'Profissional que trabalha com gesso.',
          hasMaterialFlow: true,
        },
        {
          title: 'Outros',
          slug: 'outros',
          description: 'Outros profissionais da construção civil.',
          hasMaterialFlow: true,
        },
      ],
    },
    {
      title: 'Vendedor(a)',
      slug: 'vendedor',
      description: 'Faça contratos personalizados.',
      hasMaterialFlow: false,
      children: [
        {
          title: 'Roupas, Calçados e Acessórios',
          slug: 'roupas-calcados-acessorios',
          description: 'Especialistas em vendas de moda e acessórios variados.',
          hasMaterialFlow: false,
        },
        {
          title: 'Eletroeletrônicos',
          slug: 'eletroeletronicos',
          description:
            'Profissionais na venda de dispositivos e equipamentos eletrônicos.',
          hasMaterialFlow: false,
        },
        {
          title: 'Livros, filmes, músicas e jogos',
          slug: 'livros-filmes-musicas-jogos',
          description:
            'Venda de produtos culturais como livros, filmes, músicas e jogos.',
          hasMaterialFlow: false,
        },
        {
          title: 'Perfumaria e cosméticos',
          slug: 'perfumaria-cosmeticos',
          description:
            'Profissionais especializados na venda de perfumes e cosméticos.',
          hasMaterialFlow: false,
        },
        {
          title: 'Alimentos, bebidas e suplementos',
          slug: 'alimentos-bebidas-suplementos',
          description:
            'Venda de alimentos, bebidas e suplementos nutricionais.',
          hasMaterialFlow: false,
        },
        {
          title: 'Produtos clínicos e hospitalares',
          slug: 'produtos-clinicos-hospitalares',
          description:
            'Venda de produtos utilizados em ambientes clínicos e hospitalares.',
          hasMaterialFlow: false,
        },
        {
          title: 'Materiais de construção civil',
          slug: 'materiais-de-construcao-civil',
          description:
            'Especialistas em vendas de materiais para construção civil.',
          hasMaterialFlow: false,
        },
        {
          title: 'Outros',
          slug: 'outros-vendedores',
          description:
            'Outros profissionais especializados em vendas diversas.',
          hasMaterialFlow: false,
        },
      ],
    },
  ],
};
