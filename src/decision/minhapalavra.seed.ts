export class MinhaPalavraSeedType {
  title: string;
  slug: string;
  children: Partial<MinhaPalavraSeedType>[];
}

export const MinhaPalavraSeedData: MinhaPalavraSeedType = {
  title: 'Bem-vindo ao MinhaPalavra!',
  slug: 'bem-vindo',
  children: [
    {
      title: 'Assistência técnica',
      slug: 'assistencia-tecnica',
      children: [
        {
          title: 'Aparelhos Eletrônicos',
          children: [
            {
              title: 'Aparelho de Som',
              slug: 'assistencia-tecnica/aparelho-de-som',
            },
            {
              title: 'Aquecedor a Gás',
              slug: 'assistencia-tecnica/aquecedor-a-gas',
            },
            {
              title: 'Ar Condicionado',
              slug: 'assistencia-tecnica/ar-condicionado',
            },
            {
              title: 'Câmera',
              slug: 'assistencia-tecnica/camera',
            },
            {
              title: 'DVD / Blu-Ray',
              slug: 'assistencia-tecnica/dvd-blu-ray',
            },
            {
              title: 'Home Theater',
              slug: 'assistencia-tecnica/home-theater',
            },
            {
              title: 'Televisão',
              slug: 'assistencia-tecnica/televisao',
            },
            {
              title: 'Video Game',
              slug: 'assistencia-tecnica/video-game',
            },
          ],
        },
        {
          title: 'Eletrodomésticos',
          children: [
            {
              title: 'Adega Climatizada',
              slug: 'assistencia-tecnica/adega-climatizada',
            },
            {
              title: 'Fogão e Cooktop',
              slug: 'assistencia-tecnica/fogao-e-cooktop',
            },
            {
              title: 'Geladeira e Freezer',
              slug: 'assistencia-tecnica/geladeira-e-freezer',
            },
            {
              title: 'Lava Louça',
              slug: 'assistencia-tecnica/lava-louca',
            },
            {
              title: 'Máquina de Costura',
              slug: 'assistencia-tecnica/maquina-de-costura',
            },
            {
              title: 'Máquina de Lavar',
              slug: 'assistencia-tecnica/lava-roupa',
            },
            {
              title: 'Microondas',
              slug: 'assistencia-tecnica/micro-ondas',
            },
            {
              title: 'Secadora de Roupas',
              slug: 'assistencia-tecnica/secadora-de-roupas',
            },
          ],
        },
        {
          title: 'Informática e Telefonia',
          children: [
            {
              title: 'Cabeamento e Redes',
              slug: 'assistencia-tecnica/cabeamento-e-redes',
            },
            {
              title: 'Celular',
              slug: 'assistencia-tecnica/celular',
            },
            {
              title: 'Computador Desktop',
              slug: 'assistencia-tecnica/computador-desktop',
            },
            {
              title: 'Fone de Ouvido',
              slug: 'assistencia-tecnica/fone-de-ouvido',
            },
            {
              title: 'Impressora',
              slug: 'assistencia-tecnica/impressora',
            },
            {
              title: 'Notebook',
              slug: 'assistencia-tecnica/notebooks-e-laptops',
            },
            {
              title: 'Tablet',
              slug: 'assistencia-tecnica/tablet',
            },
            {
              title: 'Telefone Fixo',
              slug: 'assistencia-tecnica/telefone-nao-celular',
            },
            {
              title: 'Telefonia PABX',
              slug: 'assistencia-tecnica/telefonia-pabx',
            },
          ],
        },
        {
          title: 'Relógio e Smartwatch',
          children: [
            {
              title: 'Relógio',
              slug: 'assistencia-tecnica/relogios',
            },
            {
              title: 'Smartwatch',
              slug: 'assistencia-tecnica/smartwatch',
            },
            {
              title: 'Venda de Aparelhos Quebrados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-quebrados',
            },
            {
              title: 'Venda de Aparelhos Usados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-usados',
            },
          ],
        },
        {
          title: 'Venda de Aparelhos Usados',
          children: [
            {
              title: 'Venda de Aparelhos Quebrados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-quebrados',
            },
            {
              title: 'Venda de Aparelhos Usados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-usados',
            },
          ],
        },
      ],
    },
    {
      title: 'Aulas',
      slug: 'aulas',
      children: [
        {
          title: 'Acadêmicos',
          children: [
            {
              title: 'Concursos',
              slug: 'aulas/concursos',
            },
            {
              title: 'Escolares e Reforço',
              slug: 'aulas/escolares-e-reforco',
            },
            {
              title: 'Educação Especial',
              slug: 'aulas/educacao-especial',
            },
            {
              title: 'Ensino Superior',
              slug: 'aulas/ensino-superior',
            },
            {
              title: 'Ensino Profissionalizante',
              slug: 'aulas/ensino-profissionalizante',
            },
            {
              title: 'Idiomas',
              slug: 'aulas/idiomas',
            },
            {
              title: 'Moda',
              slug: 'aulas/moda',
            },
            {
              title: 'Pré-Vestibular',
              slug: 'aulas/pre-vestibular',
            },
            {
              title: 'Saúde',
              slug: 'aulas/saude',
            },
            {
              title: 'Tarefas',
              slug: 'aulas/tarefas',
            },
          ],
        },
        {
          title: 'Artes e Entretenimento',
          children: [
            {
              title: 'Artes',
              slug: 'aulas/artes',
            },
            {
              title: 'Artesanato',
              slug: 'aulas/artesanato',
            },
            {
              title: 'Beleza',
              slug: 'aulas/beleza',
            },
            {
              title: 'Bem-Estar',
              slug: 'aulas/bem-estar',
            },
            {
              title: 'Circo',
              slug: 'aulas/circo',
            },
            {
              title: 'Fotografia',
              slug: 'aulas/fotografia',
            },
            {
              title: 'Moda',
              slug: 'aulas/moda',
            },
            {
              title: 'Música',
              slug: 'aulas/musica',
            },
            {
              title: 'Paisagismo',
              slug: 'aulas/paisagismo',
            },
            {
              title: 'TV e Teatro',
              slug: 'aulas/tv-e-teatro',
            },
          ],
        },
        {
          title: 'Esportes',
          children: [
            {
              title: 'Dança',
              slug: 'aulas/danca',
            },
            {
              title: 'Esportes',
              slug: 'aulas/esportes',
            },
            {
              title: 'Jogos',
              slug: 'aulas/jogos',
            },
            {
              title: 'Lazer',
              slug: 'aulas/lazer',
            },
            {
              title: 'Luta',
              slug: 'aulas/luta',
            },
          ],
        },
        {
          title: 'Tecnologia',
          children: [
            {
              title: 'Desenvolvimento Web',
              slug: 'aulas/desenvolvimento-web',
            },
            {
              title: 'Esportes Eletrônicos',
              slug: 'aulas/esportes-eletronicos',
            },
            {
              title: 'Informática',
              slug: 'aulas/informatica',
            },
            {
              title: 'Marketing Digital',
              slug: 'aulas/marketing-digital',
            },
          ],
        },
      ],
    },
    {
      title: 'Autos',
      slug: 'automoveis',
      children: [
        {
          title: 'Auto Elétrica',
          children: [
            {
              title: 'Alarme automotivo',
              slug: 'automoveis/alarme',
            },
            {
              title: 'Ar condicionado',
              slug: 'automoveis/ar-condicionado-automotivo',
            },
            {
              title: 'Auto elétrico',
              slug: 'automoveis/auto-eletrico',
            },
            {
              title: 'Som automotivo',
              slug: 'automoveis/som-automotivo',
            },
          ],
        },
        {
          title: 'Funilaria e Pintura',
          children: [
            {
              title: 'Funilaria',
              slug: 'automoveis/funilaria-automotiva',
            },
            {
              title: 'Higienização e Polimento',
              slug: 'automoveis/higienizacao-e-polimento',
            },
            {
              title: 'Martelinho de Ouro',
              slug: 'automoveis/martelinho-de-ouro',
            },
            {
              title: 'Pintura',
              slug: 'automoveis/pintura',
            },
          ],
        },
        {
          title: 'Vidraçaria Automotiva',
          children: [
            {
              title: 'Insulfilm',
              slug: 'automoveis/insulfilm',
            },
            {
              title: 'Vidraçaria Automotiva',
              slug: 'automoveis/vidracaria-automotiva',
            },
          ],
        },
        {
          title: 'Mecânica',

          children: [
            {
              title: 'Borracharia',
              slug: 'automoveis/borracharia',
            },
            {
              title: 'Guincho',
              slug: 'automoveis/guincho',
            },
            {
              title: 'Mecânica Geral',
              slug: 'automoveis/mecanica-geral',
            },
          ],
        },
        {
          title: 'Venda de Automóveis',

          children: [
            {
              title: 'Venda de Automóveis',
              slug: 'automoveis/venda-de-automoveis',
            },
          ],
        },
      ],
    },
    {
      title: 'Consultoria',
      slug: 'consultoria',
      children: [
        {
          title: 'Mídia',

          children: [
            {
              title: 'Assessoria de Imprensa',
              slug: 'consultoria/assessoria-de-imprensa',
            },
            {
              title: 'Escrita e Conteúdo',
              slug: 'consultoria/escrita-e-conteudo',
            },
            {
              title: 'Pesquisa em Geral',
              slug: 'consultoria/pesquisas-em-geral',
            },
            {
              title: 'Produção de Conteúdo',
              slug: 'consultoria/producao-padronizacao-e-revisao-de-conteudo',
            },
            {
              title: 'Tradutores',
              slug: 'consultoria/traducao',
            },
          ],
        },
        {
          title: 'Negócios',
          children: [
            {
              title: 'Administração de Imóveis',
              slug: 'consultoria/administracao-de-imoveis',
            },
            {
              title: 'Assessor de Investimentos',
              slug: 'consultoria/assessor-de-investimentos',
            },
            {
              title: 'Auxílio administrativo',
              slug: 'consultoria/auxilio-administrativo',
            },
            {
              title: 'Contador',
              slug: 'consultoria/contador',
            },
            {
              title: 'Corretor',
              slug: 'consultoria/corretor',
            },
            {
              title: 'Despachante',
              slug: 'consultoria/despachante',
            },
            {
              title: 'Digitalizar documentos',
              slug: 'consultoria/digitacao-e-digitalizacao-de-documentos',
            },
            {
              title: 'Economia e Finanças',
              slug: 'consultoria/economia-e-financas',
            },
            {
              title: 'Recrutamento e Seleção',
              slug: 'consultoria/recrutamento-e-selecao',
            },
            {
              title: 'Segurança do trabalho',
              slug: 'consultoria/seguranca-do-trabalho',
            },
          ],
        },
        {
          title: 'Jurídico',
          children: [
            {
              title: 'Advogado',
              slug: 'consultoria/advogado',
            },
            {
              title: 'Mediação de Conflitos',
              slug: 'consultoria/mediacao-de-conflitos',
            },
            {
              title: 'Testamento e Planejamento Patrimonial',
              slug: 'consultoria/testamento-e-planejamento-patrimonial',
            },
          ],
        },
        {
          title: 'Pessoal',
          children: [
            {
              title: 'Consultor pessoal',
              slug: 'consultoria/consultor-pessoal',
            },
            {
              title: 'Consultoria especializada',
              slug: 'consultoria/consultoria-especializada',
            },
            {
              title: 'Detetive particular',
              slug: 'consultoria/detetive-particular',
            },
            {
              title: 'Guia de Turismo',
              slug: 'consultoria/guia-de-turismo',
            },
          ],
        },
      ],
    },
    {
      title: 'Design e Tecnologia',
      slug: 'design-e-tecnologia',
      children: [
        {
          title: 'Tecnologia',
          children: [
            {
              title: 'Apps para smartphone',
              slug: '/design-e-tecnologia/aplicativos-para-celular-e-redes-sociais',
            },
            {
              title: 'Desenvolvimento de games',
              slug: 'design-e-tecnologia/desenvolvimento-de-games',
            },
            {
              title: 'Desenvolvimento de sites',
              slug: 'design-e-tecnologia/desenvolvimento-de-sites-e-sistemas',
            },
            {
              title: 'Marketing digital',
              slug: 'design-e-tecnologia/marketing-online',
            },
            {
              title: 'UI design',
              slug: 'design-e-tecnologia/ux-ui-design',
            },
          ],
        },
        {
          title: 'Gráfica',
          children: [
            {
              title: 'Convites',
              slug: 'design-e-tecnologia/convites',
            },
            {
              title: 'Criação de logos',
              slug: 'design-e-tecnologia/criacao-de-logos',
            },
            {
              title: 'Criação de marcas',
              slug: 'design-e-tecnologia/criacao-de-marca',
            },
            {
              title: 'Diagramador',
              slug: 'design-e-tecnologia/diagramador',
            },
            {
              title: 'Materiais promocionais',
              slug: 'design-e-tecnologia/materiais-promocionais',
            },
            {
              title: 'Produção gráfica',
              slug: 'design-e-tecnologia/producao-grafica',
            },
          ],
        },
        {
          title: 'Áudio / Visual',
          children: [
            {
              title: 'Animação motion',
              slug: 'design-e-tecnologia/animacao-motion',
            },
            {
              title: 'Áudio e Vídeo',
              slug: 'design-e-tecnologia/audio-e-video',
            },
            {
              title: 'Edição de fotos',
              slug: 'design-e-tecnologia/edicao-de-fotos',
            },
            {
              title: 'Fotografia',
              slug: 'eventos/fotografia',
            },
            {
              title: 'Ilustração',
              slug: 'design-e-tecnologia/ilustracao',
            },
            {
              title: 'Modelagem 2D e 3D',
              slug: 'design-e-tecnologia/autocad-e-modelagem-3d',
            },
            {
              title: 'Restauração de Fotos',
              slug: 'design-e-tecnologia/restauracao-de-fotos',
            },
            {
              title: 'Web Design',
              slug: 'design-e-tecnologia/web-design',
            },
          ],
        },
      ],
    },
    {
      title: 'Eventos',
      slug: 'eventos',
      children: [
        {
          title: 'Equipe e Suporte',
          children: [
            {
              title: 'Assessor de eventos',
              slug: 'eventos/assessor-de-eventos',
            },
            {
              title: 'Carros de casamento',
              slug: 'eventos/carros-de-casamento',
            },
            {
              title: 'Celebrantes',
              slug: 'eventos/celebrantes',
            },
            {
              title: 'Equipamento para festas',
              slug: 'eventos/equipamentos-para-festas',
            },
            {
              title: 'Garçons e copeiras',
              slug: 'eventos/garcons-e-copeiras',
            },
            {
              title: 'Local para eventos',
              slug: 'eventos/local-para-eventos',
            },
            {
              title: 'Manobrista',
              slug: 'eventos/manobrista',
            },
            {
              title: 'Organização de Eventos',
              slug: 'eventos/organizacao-de-eventos',
            },
            {
              title: 'Recepcionistas',
              slug: 'eventos/recepcionistas-e-cerimonialistas',
            },
            {
              title: 'Seguranças',
              slug: 'eventos/seguranca',
            },
          ],
        },
        {
          title: 'Comes e bebes',
          children: [
            {
              title: 'Bartender',
              slug: 'eventos/bartenders',
            },
            {
              title: 'Buffet completo',
              slug: 'eventos/buffet-completo',
            },
            {
              title: 'Chocolateiro',
              slug: 'eventos/chocolateiro',
            },
            {
              title: 'Churrasqueiro',
              slug: 'eventos/churrasqueiro',
            },
            {
              title: 'Confeiteira',
              slug: 'eventos/confeitaria',
            },
          ],
        },
        {
          title: 'Música e animação',
          children: [
            {
              title: 'Animação de festas',
              slug: 'eventos/animacao-de-festas',
            },
            {
              title: 'Bandas e cantores',
              slug: 'eventos/bandas-e-cantores',
            },
            {
              title: 'DJs',
              slug: 'eventos/djs',
            },
            {
              title: 'Ônibus Balada',
              slug: 'eventos/onibus-balada',
            },
          ],
        },
        {
          title: 'Serviços Complementares',
          children: [
            {
              title: 'Brindes e lembrancinhas',
              slug: 'eventos/brindes-e-lembrancinhas',
            },
            {
              title: 'Convites',
              slug: 'design-e-tecnologia/convites',
            },
            {
              title: 'Decoração',
              slug: 'eventos/decoracao',
            },
            {
              title: 'Edição de vídeos',
              slug: 'eventos/gravacao-de-videos',
            },
            {
              title: 'Fotografia',
              slug: 'eventos/fotografia',
            },
            {
              title: 'Florista',
              slug: 'eventos/florista',
            },
          ],
        },
      ],
    },
    {
      title: 'Moda e beleza',
      slug: 'moda-e-beleza',
      children: [
        {
          title: 'Beleza',
          children: [
            {
              title: 'Bronzeamento',
              slug: 'moda-e-beleza/bronzeamento',
            },
            {
              title: 'Depilação',
              slug: 'moda-e-beleza/depilacao',
            },
            {
              title: 'Design de sobrancelhas',
              slug: 'moda-e-beleza/designer-de-sobrancelhas',
            },
            {
              title: 'Designer de cílios',
              slug: 'moda-e-beleza/designer-de-cilios',
            },
            {
              title: 'Esteticistas',
              slug: 'moda-e-beleza/esteticista',
            },
            {
              title: 'Manicure e pedicure',
              slug: 'moda-e-beleza/manicure-e-pedicure',
            },
            {
              title: 'Maquiadores',
              slug: 'moda-e-beleza/maquiadores',
            },
            {
              title: 'Micropigmentador',
              slug: 'moda-e-beleza/micropigmentador',
            },
            {
              title: 'Podólogo',
              slug: 'moda-e-beleza/podologo',
            },
          ],
        },
        {
          title: 'Cabelo',
          children: [
            {
              title: 'Cabeleireiros',
              slug: 'moda-e-beleza/cabeleireiros',
            },
            {
              title: 'Barbeiros',
              slug: 'moda-e-beleza/barbeiro',
            },
          ],
        },
        {
          title: 'Estilo',
          children: [
            {
              title: 'Alfaiate',
              slug: 'moda-e-beleza/alfaiate',
            },
            {
              title: 'Corte e costura',
              slug: 'moda-e-beleza/corte-e-costura',
            },
            {
              title: 'Personal stylist',
              slug: 'moda-e-beleza/personal-stylist',
            },
            {
              title: 'Sapateiro',
              slug: 'moda-e-beleza/sapateiro',
            },
            {
              title: 'Visagista',
              slug: 'moda-e-beleza/visagista',
            },
          ],
        },
        {
          title: 'Artes e Magia',

          children: [
            {
              title: 'Artesanato',
              slug: 'moda-e-beleza/artesanato',
            },
            {
              title: 'Esotérico',
              slug: 'moda-e-beleza/esoterico',
            },
          ],
        },
      ],
    },
    {
      title: 'Reformas e reparos',
      slug: 'reformas-e-reparos',
      children: [
        {
          title: 'Aluguel de Maquinário',
          children: [
            {
              title: 'Aluguel de maquinário',
              slug: 'reformas-e-reparos/aluguel-de-maquinario',
            },
          ],
        },
        {
          title: 'Construção',
          children: [
            {
              title: 'Arquitetos',
              slug: 'reformas-e-reparos/arquiteto',
            },
            {
              title: 'Design de Interiores',
              slug: 'reformas-e-reparos/design-de-interiores',
            },
            {
              title: 'Empreiteiro',
              slug: 'reformas-e-reparos/empreiteiro',
            },
            {
              title: 'Engenheiro',
              slug: 'reformas-e-reparos/engenheiro',
            },
            {
              title: 'Limpeza pós obra',
              slug: 'reformas-e-reparos/limpeza-pos-obra',
            },
            {
              title: 'Marmoraria e Granitos',
              slug: 'reformas-e-reparos/marmoraria-e-granitos',
            },
            {
              title: 'Pedreiro',
              slug: 'reformas-e-reparos/pedreiro',
            },
            {
              title: 'Poço Artesiano',
              slug: 'reformas-e-reparos/poco-artesiano',
            },
            {
              title: 'Remoção de Entulho',
              slug: 'reformas-e-reparos/remocao-de-entulho',
            },
          ],
        },
        {
          title: 'Instalação',
          children: [
            {
              title: 'Antenista',
              slug: 'reformas-e-reparos/antenista',
            },
            {
              title: 'Automação residencial',
              slug: 'reformas-e-reparos/automacao-residencial',
            },
            {
              title: 'Instalação de eletrônicos',
              slug: 'reformas-e-reparos/instalacao-de-eletronicos',
            },
            {
              title: 'Instalador tv digital',
              slug: 'reformas-e-reparos/antenista',
            },
            {
              title: 'Segurança eletrônica',
              slug: 'reformas-e-reparos/seguranca-eletronica',
            },
            {
              title: 'Toldos e Coberturas',
              slug: 'reformas-e-reparos/toldos-e-coberturas',
            },
          ],
        },
        {
          title: 'Reformas e Reparos',
          children: [
            {
              title: 'Encanador',
              slug: 'reformas-e-reparos/encanador',
            },
            {
              title: 'Eletricista',
              slug: 'reformas-e-reparos/eletricista',
            },
            {
              title: 'Gás',
              slug: 'reformas-e-reparos/gas',
            },
            {
              title: 'Gesso e drywall',
              slug: 'reformas-e-reparos/gesso-e-drywall',
            },
            {
              title: 'Pavimentação',
              slug: 'reformas-e-reparos/pavimentacao',
            },
            {
              title: 'Pintor',
              slug: 'reformas-e-reparos/pintor',
            },
            {
              title: 'Serralheria e solda',
              slug: 'reformas-e-reparos/serralheria-e-solda',
            },
            {
              title: 'Vidraceiro',
              slug: 'reformas-e-reparos/vidraceiro',
            },
          ],
        },
        {
          title: 'Serviços Gerais',
          children: [
            {
              title: 'Chaveiro',
              slug: 'reformas-e-reparos/chaveiro',
            },
            {
              title: 'Dedetizador',
              slug: 'reformas-e-reparos/dedetizador',
            },
            {
              title: 'Desentupidor',
              slug: 'reformas-e-reparos/desentupidor',
            },
            {
              title: 'Desinfecção',
              slug: 'reformas-e-reparos/desinfeccao',
            },
            {
              title: 'Impermeabilizador',
              slug: 'reformas-e-reparos/impermeabilizador',
            },
            {
              title: 'Marceneiro',
              slug: 'reformas-e-reparos/marceneiro',
            },
            {
              title: 'Marido de Aluguel',
              slug: 'reformas-e-reparos/marido-de-aluguel',
            },
            {
              title: 'Mudanças e Carretos',
              slug: 'reformas-e-reparos/mudancas-e-carretos',
            },
            {
              title: 'Tapeceiro',
              slug: 'reformas-e-reparos/tapeceiro',
            },
          ],
        },
        {
          title: 'Para Casa',
          children: [
            {
              title: 'Banheira',
              slug: 'reformas-e-reparos/banheira',
            },
            {
              title: 'Coifas e Exaustores',
              slug: 'reformas-e-reparos/coifas-e-exaustores',
            },
            {
              title: 'Decorador',
              slug: 'reformas-e-reparos/decorador',
            },
            {
              title: 'Instalador de Papel de Parede',
              slug: 'reformas-e-reparos/instalacao-de-papel-de-parede',
            },
            {
              title: 'Jardinagem',
              slug: 'reformas-e-reparos/jardinagem',
            },
            {
              title: 'Montador de Móveis',
              slug: 'reformas-e-reparos/montador-de-moveis',
            },
            {
              title: 'Paisagista',
              slug: 'reformas-e-reparos/paisagista',
            },
            {
              title: 'Piscina',
              slug: 'reformas-e-reparos/piscina',
            },
            {
              title: 'Redes de Proteção',
              slug: 'reformas-e-reparos/redes-de-protecao',
            },
          ],
        },
      ],
    },
    {
      title: 'Saúde',
      slug: 'saude',
      children: [
        {
          title: 'Biomedicina Estética',
          children: [
            {
              title: 'Biomedicina Estética',
              slug: 'saude/biomedicina-estetica',
            },
            {
              title: 'Remoção de Tatuagem',
              slug: 'saude/remocao-de-tatuagem',
            },
          ],
        },
        {
          title: 'Para o Corpo',
          children: [
            {
              title: 'Cozinheira',
              slug: 'familia/cozinheira',
            },
            {
              title: 'Dentista',
              slug: 'saude/dentista',
            },
            {
              title: 'Fisioterapeuta',
              slug: 'saude/fisioterapeuta',
            },
            {
              title: 'Fonoaudiólogo',
              slug: 'saude/fonoaudiologo',
            },
            {
              title: 'Médico',
              slug: 'saude/medico',
            },
            {
              title: 'Nutricionista',
              slug: 'saude/nutricionista',
            },
            {
              title: 'Quiropraxia',
              slug: 'saude/quiropraxia',
            },
            {
              title: 'Terapias Alternativas',
              slug: 'saude/terapias-alternativas',
            },
            {
              title: 'Terapia Ocupacional',
              slug: 'saude/terapia-ocupacional',
            },
          ],
        },
        {
          title: 'Para a Mente',
          children: [
            {
              title: 'Aconselhamento Conjugal e Familiar',
              slug: 'saude/aconselhamento-conjugal-e-familiar',
            },
            {
              title: 'Coach',
              slug: 'saude/coach',
            },
            {
              title: 'Doula',
              slug: 'saude/doula',
            },
            {
              title: 'Psicanalista',
              slug: 'saude/psicanalista',
            },
            {
              title: 'Psicólogo',
              slug: 'saude/psicologo',
            },
          ],
        },
        {
          title: 'Para a Família',
          children: [
            {
              title: 'Cuidador de Pessoas',
              slug: 'saude/cuidador-de-pessoas',
            },
            {
              title: 'Enfermeira',
              slug: 'saude/enfermeira',
            },
          ],
        },
      ],
    },
    {
      title: 'Serviços Domésticos',
      slug: 'familia',
      children: [
        {
          title: 'Para a Casa',

          children: [
            {
              title: 'Diarista',
              slug: 'familia/diarista',
            },
            {
              title: 'Limpeza de Piscina',
              slug: 'familia/limpeza-de-piscina',
            },
            {
              title: 'Passadeira',
              slug: 'familia/passadeira',
            },
            {
              title: 'Tapeceiro',
              slug: 'reformas-e-reparos/tapeceiro',
            },
            {
              title: 'Lavadeira',
              slug: 'familia/lavadeira',
            },
            {
              title: 'Personal shopper',
              slug: 'familia/personal-shopper',
            },
          ],
        },
        {
          title: 'Para a Família',

          children: [
            {
              title: 'Babá',
              slug: 'familia/baba',
            },
            {
              title: 'Cozinheira',
              slug: 'familia/cozinheira',
            },
            {
              title: 'Entregador',
              slug: 'familia/entregador',
            },
            {
              title: 'Motorista',
              slug: 'familia/motorista',
            },
            {
              title: 'Personal Organizer',
              slug: 'familia/personal-organizer',
            },
            {
              title: 'Segurança Particular',
              slug: 'familia/seguranca-particular',
            },
          ],
        },
        {
          title: 'Para os Pets',
          children: [
            {
              title: 'Adestrador de Cães',
              slug: 'familia/adestrador-de-caes',
            },
            {
              title: 'Passeador de Cães',
              slug: 'familia/passeador-de-caes',
            },
            {
              title: 'Serviços para Pets',
              slug: 'familia/servicos-para-pets',
            },
          ],
        },
      ],
    },
  ],
};
