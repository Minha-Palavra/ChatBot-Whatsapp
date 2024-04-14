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
      description: 'Faça contratos personalizados.',
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
          slug: 'gesseiro',
          description: 'Profissional que trabalha com gesso.',
        },
        {
          title: 'Outros',
          slug: 'outros',
          description: 'Outros profissionais da construção civil.',
        },
      ],
    },
    {
      title: 'Vendedor(a)',
      slug: 'vendedor',
      description: 'Faça contratos personalizados.',
      children: [
        {
          title: 'Roupas, Calçados e Acessórios',
          slug: 'roupas-calcados-acessorios',
          description: 'Especialistas em vendas de moda e acessórios variados.',
        },
        {
          title: 'Eletroeletrônicos',
          slug: 'eletroeletronicos',
          description:
            'Profissionais na venda de dispositivos e equipamentos eletrônicos.',
        },
        {
          title: 'Livros, filmes, músicas e jogos',
          slug: 'livros-filmes-musicas-jogos',
          description:
            'Venda de produtos culturais como livros, filmes, músicas e jogos.',
        },
        {
          title: 'Perfumaria e cosméticos',
          slug: 'perfumaria-cosmeticos',
          description:
            'Profissionais especializados na venda de perfumes e cosméticos.',
        },
        {
          title: 'Alimentos, bebidas e suplementos',
          slug: 'alimentos-bebidas-suplementos',
          description:
            'Venda de alimentos, bebidas e suplementos nutricionais.',
        },
        {
          title: 'Bicicletas, patinetes e similares',
          slug: 'bicicletas-patinetes-similares',
          description:
            'Especialistas em vendas de bicicletas, patinetes e equipamentos similares.',
        },
        {
          title: 'Produtos clínicos e hospitalares',
          slug: 'produtos-clinicos-hospitalares',
          description:
            'Venda de produtos utilizados em ambientes clínicos e hospitalares.',
        },
        {
          title: 'Materiais de construção civil',
          slug: 'materiais-de-construcao-civil',
          description:
            'Especialistas em vendas de materiais para construção civil.',
        },
        {
          title: 'Materiais escolares',
          slug: 'materiais-escolares',
          description: 'Venda de produtos e materiais escolares.',
        },
        {
          title: 'Móveis e objetos',
          slug: 'moveis-objetos',
          description:
            'Profissionais que comercializam móveis e objetos decorativos.',
        },
        {
          title: 'Cama, mesa e banho',
          slug: 'cama-mesa-banho',
          description: 'Venda de produtos para cama, mesa e banho.',
        },
        {
          title: 'Outros',
          slug: 'outros-vendedores',
          description:
            'Outros profissionais especializados em vendas diversas.',
        },
      ],
    },
  ],
};
