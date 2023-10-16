export class MinhaPalavraSeedType {
  title: string;
  slug: string;
  description?: string;
  children: Partial<MinhaPalavraSeedType>[];
}

export const MinhaPalavraSeedData: MinhaPalavraSeedType = {
  title: 'Bem-vindo ao MinhaPalavra!',
  slug: 'bem-vindo',
  description:
    'Navegue por nossas categorias e escolha aquela que melhor representa o serviço que você deseja.',
  children: [
    {
      title: 'Assistência técnica',
      slug: 'assistencia-tecnica',
      description: 'Selecione o serviço que melhor descreve o que faz.',
      children: [
        {
          title: 'Aparelhos Eletrônicos',
          description:
            'Manutenção e reparo de dispositivos eletrônicos domésticos. Mantenha seus dispositivos em perfeito funcionamento com assistência profissional.',
          children: [
            {
              title: 'Aparelho de Som',
              slug: 'assistencia-tecnica/aparelho-de-som',
              description:
                'Repare e otimize seu sistema de som com especialistas qualificados.',
            },
            {
              title: 'Aquecedor a Gás',
              slug: 'assistencia-tecnica/aquecedor-a-gas',
              description:
                'Garanta o funcionamento seguro e eficiente do seu aquecedor a gás com serviços técnicos especializados.',
            },
            {
              title: 'Ar Condicionado',
              slug: 'assistencia-tecnica/ar-condicionado',
              description:
                'Mantenha-se fresco com reparos e manutenção de ar condicionado por profissionais treinados.',
            },
            {
              title: 'Câmera',
              slug: 'assistencia-tecnica/camera',
              description:
                'Capture momentos perfeitamente com a assistência técnica de câmeras por especialistas no ramo.',
            },
            {
              title: 'DVD / Blu-Ray',
              slug: 'assistencia-tecnica/dvd-blu-ray',
              description:
                'Corrija problemas de reprodução e obtenha o melhor do seu dispositivo com serviços técnicos especializados.',
            },
            {
              title: 'Home Theater',
              slug: 'assistencia-tecnica/home-theater',
              description:
                'Aprimore sua experiência audiovisual com assistência para sistemas de home theater.',
            },
            {
              title: 'Televisão',
              slug: 'assistencia-tecnica/televisao',
              description:
                'Resolva problemas de imagem, som e conectividade com a assistência técnica especializada para televisões.',
            },
            {
              title: 'Video Game',
              slug: 'assistencia-tecnica/video-game',
              description:
                'Mantenha seu entretenimento em movimento com reparos e otimizações para consoles de videogame.',
            },
          ],
        },
        {
          title: 'Eletrodomésticos',
          description:
            'Reparo e manutenção de eletrodomésticos para assegurar o funcionamento eficaz e prolongar a vida útil dos seus aparelhos. Encontre especialistas capacitados para cuidar de todos os seus dispositivos domésticos.',
          children: [
            {
              title: 'Adega Climatizada',
              slug: 'assistencia-tecnica/adega-climatizada',
              description:
                'Garanta a temperatura ideal para seus vinhos com a assistência especializada para adegas climatizadas.',
            },
            {
              title: 'Fogão e Cooktop',
              slug: 'assistencia-tecnica/fogao-e-cooktop',
              description:
                'Manutenção e reparos para fogões e cooktops, garantindo a segurança e eficiência durante o cozimento.',
            },
            {
              title: 'Geladeira e Freezer',
              slug: 'assistencia-tecnica/geladeira-e-freezer',
              description:
                'Serviços de reparo para geladeiras e freezers, mantendo seus alimentos frescos e bem conservados.',
            },
            {
              title: 'Lava Louça',
              slug: 'assistencia-tecnica/lava-louca',
              description:
                'Mantenha sua lava-louças funcionando com eficiência com a ajuda de técnicos especializados.',
            },
            {
              title: 'Máquina de Costura',
              slug: 'assistencia-tecnica/maquina-de-costura',
              description:
                'Serviços técnicos para máquinas de costura, assegurando costuras precisas e desempenho otimizado.',
            },
            {
              title: 'Máquina de Lavar',
              slug: 'assistencia-tecnica/lava-roupa',
              description:
                'Reparos e manutenção para máquinas de lavar roupas, garantindo limpeza eficiente e cuidado com suas peças.',
            },
            {
              title: 'Microondas',
              slug: 'assistencia-tecnica/micro-ondas',
              description:
                'Assistência para micro-ondas, garantindo aquecimento e cozimento adequado dos alimentos.',
            },
            {
              title: 'Secadora de Roupas',
              slug: 'assistencia-tecnica/secadora-de-roupas',
              description:
                'Serviços de manutenção e reparo para secadoras de roupas, proporcionando roupas secas e prontas em menos tempo.',
            },
          ],
        },
        {
          title: 'Informática e Telefonia',
          description:
            'Serviços de reparo e manutenção especializados para dispositivos informáticos e de telecomunicações. Assegure o bom funcionamento e prolongue a vida útil dos seus dispositivos com profissionais capacitados.',
          children: [
            {
              title: 'Cabeamento e Redes',
              slug: 'assistencia-tecnica/cabeamento-e-redes',
              description:
                'Soluções em cabeamento estruturado e serviços de redes para garantir a conexão eficiente dos seus dispositivos.',
            },
            {
              title: 'Celular',
              slug: 'assistencia-tecnica/celular',
              description:
                'Reparos e manutenções para smartphones, incluindo troca de telas, baterias e outros componentes vitais.',
            },
            {
              title: 'Computador Desktop',
              slug: 'assistencia-tecnica/computador-desktop',
              description:
                'Manutenção e reparos para computadores desktop, assegurando performance e estabilidade.',
            },
            {
              title: 'Fone de Ouvido',
              slug: 'assistencia-tecnica/fone-de-ouvido',
              description:
                'Serviços para fones de ouvido, garantindo uma experiência sonora impecável.',
            },
            {
              title: 'Impressora',
              slug: 'assistencia-tecnica/impressora',
              description:
                'Manutenção e reparos para impressoras, garantindo impressões de alta qualidade.',
            },
            {
              title: 'Notebook',
              slug: 'assistencia-tecnica/notebooks-e-laptops',
              description:
                'Serviços especializados para notebooks e laptops, incluindo upgrades e reparos em hardware.',
            },
            {
              title: 'Tablet',
              slug: 'assistencia-tecnica/tablet',
              description:
                'Assistência técnica para tablets de diversas marcas, garantindo desempenho e usabilidade.',
            },
            {
              title: 'Telefone Fixo',
              slug: 'assistencia-tecnica/telefone-nao-celular',
              description:
                'Reparos e manutenções para telefones fixos, garantindo comunicações claras e sem interrupções.',
            },
            {
              title: 'Telefonia PABX',
              slug: 'assistencia-tecnica/telefonia-pabx',
              description:
                'Serviços especializados para sistemas de telefonia PABX, garantindo comunicações empresariais eficientes.',
            },
          ],
        },
        {
          title: 'Relógio e Smartwatch',
          description:
            'Serviços de assistência técnica especializados para relógios tradicionais e smartwatches. Explore uma gama de serviços, desde reparos a vendas de aparelhos usados.',
          children: [
            {
              title: 'Relógio',
              slug: 'assistencia-tecnica/relogios',
              description:
                'Reparos, restaurações e manutenções para relógios de todas as marcas e estilos, assegurando precisão e durabilidade.',
            },
            {
              title: 'Smartwatch',
              slug: 'assistencia-tecnica/smartwatch',
              description:
                'Assistência técnica especializada para smartwatches, incluindo trocas de tela, atualizações de software e outros reparos vitais.',
            },
            {
              title: 'Venda de Aparelhos Quebrados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-quebrados',
              description:
                'Compre e venda aparelhos quebrados ou danificados, uma solução sustentável e econômica.',
            },
            {
              title: 'Venda de Aparelhos Usados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-usados',
              description:
                'Explore a venda e compra de aparelhos usados em boas condições, garantindo valor e qualidade.',
            },
          ],
        },
        {
          title: 'Venda de Aparelhos Usados',
          description:
            'Encontre soluções sustentáveis ao adquirir ou vender dispositivos eletrônicos usados. Uma opção econômica que promove a reutilização e reduz o desperdício.',
          children: [
            {
              title: 'Venda de Aparelhos Quebrados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-quebrados',
              description:
                'Uma oportunidade para adquirir ou vender dispositivos danificados que podem ser restaurados ou usados para peças de reposição.',
            },
            {
              title: 'Venda de Aparelhos Usados',
              slug: 'assistencia-tecnica/venda-de-aparelhos-usados',
              description:
                'Compra e venda de dispositivos eletrônicos usados em boas condições, uma alternativa mais acessível e ecológica.',
            },
          ],
        },
      ],
    },
    {
      title: 'Aulas',
      slug: 'aulas',
      description:
        'Selecione o tipo de aulas que se adequa melhor ao que ensina.',
      children: [
        {
          title: 'Acadêmicos',
          description:
            'Aulas especializadas para impulsionar sua jornada educacional, desde reforços escolares até preparação para exames avançados.',
          children: [
            {
              title: 'Concursos',
              slug: 'aulas/concursos',
              description:
                'Prepare-se para concursos públicos com instrutores especializados e materiais atualizados.',
            },
            {
              title: 'Escolares e Reforço',
              slug: 'aulas/escolares-e-reforco',
              description:
                'Oferecemos suporte educacional personalizado para estudantes que buscam melhorar seu desempenho escolar.',
            },
            {
              title: 'Educação Especial',
              slug: 'aulas/educacao-especial',
              description:
                'Aulas projetadas para atender às necessidades de alunos com demandas educacionais especiais.',
            },
            {
              title: 'Ensino Superior',
              slug: 'aulas/ensino-superior',
              description:
                'Assistência acadêmica para estudantes de graduação e pós-graduação em diversas disciplinas.',
            },
            {
              title: 'Ensino Profissionalizante',
              slug: 'aulas/ensino-profissionalizante',
              description:
                'Cursos voltados para habilidades profissionais e técnicas em variados setores do mercado.',
            },
            {
              title: 'Idiomas',
              slug: 'aulas/idiomas',
              description:
                'Aprenda um novo idioma ou aperfeiçoe suas habilidades linguísticas com instrutores nativos e experientes.',
            },
            {
              title: 'Moda',
              slug: 'aulas/moda',
              description:
                'Descubra o mundo da moda, desde design até técnicas de costura, com profissionais do setor.',
            },
            {
              title: 'Pré-Vestibular',
              slug: 'aulas/pre-vestibular',
              description:
                'Prepare-se para os vestibulares com aulas focadas e materiais de estudo atualizados.',
            },
            {
              title: 'Saúde',
              slug: 'aulas/saude',
              description:
                'Aulas direcionadas para profissionais da saúde ou para quem busca aprender mais sobre o tema.',
            },
            {
              title: 'Tarefas',
              slug: 'aulas/tarefas',
              description:
                'Suporte para realização de tarefas escolares, garantindo a compreensão e a qualidade do aprendizado.',
            },
          ],
        },
        {
          title: 'Artes e Entretenimento',
          description:
            'Mergulhe no mundo das artes e entretenimento com uma variedade de cursos que abrangem desde técnicas tradicionais até as mais contemporâneas. Desperte sua criatividade, aprimore suas habilidades ou simplesmente explore novos hobbies com nossos instrutores especializados.',
          children: [
            {
              title: 'Artes',
              slug: 'aulas/artes',
              description:
                'Explore o universo das artes visuais, aprendendo sobre pintura, escultura, desenho e outras formas de expressão artística.',
            },
            {
              title: 'Artesanato',
              slug: 'aulas/artesanato',
              description:
                'Aprenda a criar peças únicas e personalizadas, explorando diferentes técnicas e materiais no mundo do artesanato.',
            },
            {
              title: 'Beleza',
              slug: 'aulas/beleza',
              description:
                'Aprimore suas habilidades em maquiagem, penteados e outras técnicas de beleza com profissionais do setor.',
            },
            {
              title: 'Bem-Estar',
              slug: 'aulas/bem-estar',
              description:
                'Descubra práticas de relaxamento, meditação e bem-estar para equilibrar corpo e mente.',
            },
            {
              title: 'Circo',
              slug: 'aulas/circo',
              description:
                'Explore o fascinante mundo do circo, aprendendo acrobacias, malabarismo e outras habilidades circenses.',
            },
            {
              title: 'Fotografia',
              slug: 'aulas/fotografia',
              description:
                'Domine a arte da fotografia, explorando técnicas de iluminação, composição e edição para capturar imagens impressionantes.',
            },
            {
              title: 'Moda',
              slug: 'aulas/moda',
              description:
                'Mergulhe no universo da moda, desde design até técnicas de costura, com instrutores experientes no setor.',
            },
            {
              title: 'Música',
              slug: 'aulas/musica',
              description:
                'Aprenda a tocar um instrumento, aprimore sua voz ou explore a teoria musical com especialistas na área.',
            },
            {
              title: 'Paisagismo',
              slug: 'aulas/paisagismo',
              description:
                'Entenda os princípios do paisagismo e aprenda a projetar e cuidar de espaços verdes, sejam jardins, parques ou áreas urbanas.',
            },
            {
              title: 'TV e Teatro',
              slug: 'aulas/tv-e-teatro',
              description:
                'Desenvolva suas habilidades de atuação, direção e produção para brilhar nos palcos ou nas telas.',
            },
          ],
        },
        {
          title: 'Esportes',
          description:
            'Desperte seu potencial atlético e descubra novas paixões com nossa gama diversificada de cursos esportivos. Independentemente de ser um iniciante ou um atleta avançado, há algo para todos em nosso catálogo.',
          children: [
            {
              title: 'Dança',
              slug: 'aulas/danca',
              description:
                'Movimente-se ao ritmo de diversos estilos de dança, desde o ballet clássico até estilos contemporâneos. Ideal para quem busca expressão corporal, fitness e diversão.',
            },
            {
              title: 'Esportes',
              slug: 'aulas/esportes',
              description:
                'Aprimore suas habilidades esportivas, aprendendo técnicas, estratégias e fundamentos de diversos esportes com instrutores qualificados.',
            },
            {
              title: 'Jogos',
              slug: 'aulas/jogos',
              description:
                'Explore a estratégia e a técnica por trás dos jogos populares, desenvolvendo habilidades de raciocínio, coordenação e trabalho em equipe.',
            },
            {
              title: 'Lazer',
              slug: 'aulas/lazer',
              description:
                'Descubra atividades recreativas para relaxar, divertir-se e aproveitar seu tempo livre de maneira saudável e produtiva.',
            },
            {
              title: 'Luta',
              slug: 'aulas/luta',
              description:
                'Aprenda as artes marciais, desde técnicas de defesa pessoal até disciplinas tradicionais, sob a orientação de mestres experientes.',
            },
          ],
        },
        {
          title: 'Tecnologia',
          description:
            'Aprofunde-se no mundo digital e mantenha-se atualizado com as tendências tecnológicas emergentes. Nossos cursos são projetados para equipar você com habilidades essenciais no ambiente tecnológico em rápida evolução.',
          children: [
            {
              title: 'Desenvolvimento Web',
              slug: 'aulas/desenvolvimento-web',
              description:
                'Desvende os segredos da construção de sites e aplicações web. Aprenda linguagens de programação, design responsivo e técnicas avançadas para criar experiências online envolventes.',
            },
            {
              title: 'Esportes Eletrônicos',
              slug: 'aulas/esportes-eletronicos',
              description:
                'Mergulhe no competitivo mundo dos e-sports. Entenda estratégias de jogos populares, melhore seu desempenho e descubra como se tornar um profissional no cenário de esportes eletrônicos.',
            },
            {
              title: 'Informática',
              slug: 'aulas/informatica',
              description:
                'Desenvolva habilidades essenciais em informática, desde o uso básico do computador até softwares avançados. Ideal para quem deseja melhorar a eficiência no trabalho ou no dia a dia.',
            },
            {
              title: 'Marketing Digital',
              slug: 'aulas/marketing-digital',
              description:
                'Aprenda a construir e otimizar campanhas de marketing online. Explore ferramentas e estratégias para atingir seu público-alvo e aumentar o engajamento na era digital.',
            },
          ],
        },
      ],
    },
    {
      title: 'Autos',
      slug: 'automoveis',
      description:
        'Selecione aqui o que melhor descreve o serviço ou venda de veículos, peças e acessórios que você realiza.',
      children: [
        {
          title: 'Auto Elétrica',
          description:
            'Oferecemos serviços elétricos completos para seu automóvel. Nossa equipe está pronta para diagnosticar e resolver qualquer desafio elétrico que seu veículo possa enfrentar.',
          children: [
            {
              title: 'Alarme automotivo',
              slug: 'automoveis/alarme',
              description:
                'Proteja seu veículo com nossos sistemas de alarme de última geração. Oferecemos instalação e manutenção, garantindo a segurança do seu automóvel.',
            },
            {
              title: 'Ar condicionado',
              slug: 'automoveis/ar-condicionado-automotivo',
              description:
                'Mantenha-se fresco no verão e aquecido no inverno. Nossos serviços de ar condicionado garantem que o sistema de seu veículo esteja em perfeitas condições durante todo o ano.',
            },
            {
              title: 'Auto elétrico',
              slug: 'automoveis/auto-eletrico',
              description:
                'Desde pequenas falhas elétricas até grandes reparos, nossos especialistas estão aqui para garantir que seu veículo funcione perfeitamente.',
            },
            {
              title: 'Som automotivo',
              slug: 'automoveis/som-automotivo',
              description:
                'Eleve sua experiência de condução com sistemas de som de alta qualidade. Seja para atualizações ou reparos, temos as soluções que você precisa.',
            },
            {
              title: 'Motos',
              slug: 'automoveis/motos',
              description: 'Oferecemos serviços especializados para motos.',
            },
          ],
        },
        {
          title: 'Funilaria e Pintura',
          description:
            'Restaure a aparência e a integridade de seu veículo com nossos serviços especializados de funilaria e pintura. Da correção de pequenas mossas a repinturas completas, temos as habilidades e equipamentos necessários para fazer seu carro parecer novo novamente.',
          children: [
            {
              title: 'Funilaria',
              slug: 'automoveis/funilaria-automotiva',
              description:
                'Reparos especializados em danos à carroceria, desde arranhões superficiais até danos mais significativos. Nossa equipe de funileiros é treinada para restaurar a forma e função originais de seu veículo.',
            },
            {
              title: 'Higienização e Polimento',
              slug: 'automoveis/higienizacao-e-polimento',
              description:
                'Rejuvenesça a aparência do seu carro com nossos serviços de higienização e polimento. Removemos manchas, sujeiras e arranhões, proporcionando um brilho duradouro ao seu veículo.',
            },
            {
              title: 'Martelinho de Ouro',
              slug: 'automoveis/martelinho-de-ouro',
              description:
                'O método de reparo de pequenos amassados sem a necessidade de pintura. Ideal para corrigir mossas sem danificar a pintura original do veículo.',
            },
            {
              title: 'Pintura',
              slug: 'automoveis/pintura',
              description:
                'Seja para correção de arranhões ou uma repintura completa, nossos profissionais utilizam tintas de alta qualidade e técnicas avançadas para garantir um acabamento impecável.',
            },
          ],
        },
        {
          title: 'Vidraçaria Automotiva',
          description:
            'Oferecemos soluções especializadas para cuidados e serviços relacionados a vidros automotivos. Seja para estética ou segurança, nossos profissionais estão prontos para atender suas necessidades.',
          children: [
            {
              title: 'Insulfilm',
              slug: 'automoveis/insulfilm',
              description:
                'Proporcione mais conforto, segurança e privacidade ao seu veículo com a aplicação de películas (insulfilm) de alta qualidade. Nossos produtos ajudam a reduzir a entrada de calor e protegem contra raios UV, além de agregar valor estético ao seu carro.',
            },
            {
              title: 'Vidraçaria Automotiva',
              slug: 'automoveis/vidracaria-automotiva',
              description:
                'Oferecemos uma variedade de serviços relacionados a vidros automotivos, incluindo reparo de trincas, substituição de vidros quebrados e instalação de novos vidros. Conte com nossa expertise para garantir a segurança e visibilidade ideal em seu veículo.',
            },
          ],
        },
        {
          title: 'Mecânica',
          description:
            'Oferecemos uma ampla gama de serviços mecânicos para manter seu veículo em perfeitas condições de funcionamento. De pequenos ajustes a reparos mais complexos, nossa equipe de profissionais altamente treinados está pronta para atendê-lo.',
          children: [
            {
              title: 'Borracharia',
              slug: 'automoveis/borracharia',
              description:
                'Se você enfrenta problemas com pneus furados ou desgastados, nossa borracharia é o lugar certo. Com equipamentos de ponta e profissionais qualificados, garantimos reparos rápidos e eficientes para que você possa voltar à estrada em segurança.',
            },
            {
              title: 'Guincho',
              slug: 'automoveis/guincho',
              description:
                'Emergências acontecem, e quando ocorrem, nosso serviço de guincho está à disposição para garantir que seu veículo seja transportado com segurança e eficiência. Seja um problema mecânico, um acidente ou qualquer outra situação, conte conosco para auxiliá-lo.',
            },
            {
              title: 'Mecânica Geral',
              slug: 'automoveis/mecanica-geral',
              description:
                'De revisões rotineiras a diagnósticos detalhados, nossa mecânica geral cobre todas as necessidades do seu veículo. Nossos mecânicos são especializados em uma variedade de marcas e modelos, garantindo um serviço de alta qualidade independentemente do seu tipo de carro.',
            },
          ],
        },
        {
          title: 'Venda de Automóveis',
          description:
            'Temos os melhores automóveis, motos, peças e acessórios para você.',
          children: [
            {
              title: 'Venda de Automóveis',
              slug: 'automoveis/venda-de-automoveis',
              description:
                'Temos os melhores automóveis, motos, peças e acessórios para você.',
            },
          ],
        },
      ],
    },
    {
      title: 'Especialistas',
      slug: 'especialistas',
      description:
        'Selecione entre os especialistas o que melhor se enquadra nos serviços que deseja.',
      children: [
        {
          title: 'Marketing',
          description:
            'Serviços relacionados à produção, gerenciamento e disseminação de conteúdo em várias plataformas.',
          children: [
            {
              title: 'Assessoria de Imprensa',
              slug: 'especialistas/assessoria-de-imprensa',
              description:
                'Gerenciamento e promoção da imagem de indivíduos ou organizações para a mídia, incluindo a gestão de comunicados de imprensa e relações com jornalistas.',
            },
            {
              title: 'Escrita e Conteúdo',
              slug: 'especialistas/escrita-e-conteudo',
              description:
                'Criação e redação de textos para diferentes finalidades, incluindo conteúdo web, marketing, editoriais e mais.',
            },
            {
              title: 'Pesquisa em Geral',
              slug: 'especialistas/pesquisas-em-geral',
              description:
                'Realização de estudos e análises em diversas áreas, coletando e interpretando dados para fornecer insights e informações.',
            },
            {
              title: 'Produção de Conteúdo',
              slug: 'especialistas/producao-padronizacao-e-revisao-de-conteudo',
              description:
                'Elaboração, padronização e revisão de materiais para publicação, garantindo clareza, precisão e consistência.',
            },
            {
              title: 'Tradutores',
              slug: 'especialistas/traducao',
              description:
                'Conversão de textos de um idioma para outro, mantendo a essência, contexto e tonalidade do conteúdo original.',
            },
          ],
        },
        {
          title: 'Negócios',
          description:
            'Serviços especializados para auxiliar empresas e indivíduos em diversos aspectos de seus negócios e finanças.',
          children: [
            {
              title: 'Administração de Imóveis',
              slug: 'especialistas/administracao-de-imoveis',
              description:
                'Gestão de propriedades imobiliárias, incluindo locação, manutenção, e assuntos relacionados ao aluguel e venda.',
            },
            {
              title: 'Assessor de Investimentos',
              slug: 'especialistas/assessor-de-investimentos',
              description:
                'Especialista em orientar sobre investimentos, ajudando a definir a melhor estratégia para alocação de recursos.',
            },
            {
              title: 'Auxílio administrativo',
              slug: 'especialistas/auxilio-administrativo',
              description:
                'Suporte em tarefas administrativas gerais, como organização, planejamento e outras atividades de escritório.',
            },
            {
              title: 'Contador',
              slug: 'especialistas/contador',
              description:
                'Profissional especializado em contabilidade, encarregado de gerenciar e auditar as finanças de uma empresa ou indivíduo.',
            },
            {
              title: 'Corretor',
              slug: 'especialistas/corretor',
              description:
                'Especialista em intermediar a compra, venda ou aluguel de propriedades ou outros ativos, como ações.',
            },
            {
              title: 'Despachante',
              slug: 'especialistas/despachante',
              description:
                'Profissional que trata da expedição ou despacho de documentos e realizações de serviços burocráticos.',
            },
            {
              title: 'Digitalizar documentos',
              slug: 'especialistas/digitacao-e-digitalizacao-de-documentos',
              description:
                'Serviço de transformação de documentos físicos em formato digital, além de digitação e organização de arquivos.',
            },
            {
              title: 'Economia e Finanças',
              slug: 'especialistas/economia-e-financas',
              description:
                'Assessoria em questões econômicas e financeiras, abrangendo análise de mercado, planejamento financeiro e mais.',
            },
            {
              title: 'Recrutamento e Seleção',
              slug: 'especialistas/recrutamento-e-selecao',
              description:
                'Processo de atração, seleção e integração de profissionais para preencher vagas em uma organização.',
            },
            {
              title: 'Segurança do trabalho',
              slug: 'especialistas/seguranca-do-trabalho',
              description:
                'Serviços focados em garantir um ambiente de trabalho seguro, prevenindo acidentes e doenças ocupacionais.',
            },
          ],
        },
        {
          title: 'Advocatício',
          description:
            'Serviços relacionados ao campo legal, focados em proporcionar assistência e orientação jurídica.',
          children: [
            {
              title: 'Advogado',
              slug: 'especialistas/advogado',
              description:
                'Profissional do direito, habilitado a representar e defender os interesses de indivíduos ou entidades em questões legais.',
            },
            {
              title: 'Mediação de Conflitos',
              slug: 'especialistas/mediacao-de-conflitos',
              description:
                'Processo em que uma terceira parte neutra auxilia as partes envolvidas a chegar a um acordo ou solução para um conflito.',
            },
            {
              title: 'Testamento e Planejamento Patrimonial',
              slug: 'especialistas/testamento-e-planejamento-patrimonial',
              description:
                'Orientação e elaboração de documentos legais para planejar a distribuição de ativos após a morte e organizar questões patrimoniais.',
            },
            {
              title: 'Detetive particular',
              slug: 'especialistas/detetive-particular',
              description:
                'Profissional especializado na investigação e obtenção de informações confidenciais de caráter pessoal ou corporativo.',
            },
          ],
        },
        {
          title: 'Consultoria e Turismo',
          description:
            'Serviços personalizados voltados para atender necessidades individuais e específicas.',
          children: [
            {
              title: 'Consultor pessoal',
              slug: 'especialistas/consultor-pessoal',
              description:
                'Profissional dedicado a orientar indivíduos em decisões pessoais, carreira ou outras consultas individuais.',
            },
            {
              title: 'Consultoria especializada',
              slug: 'especialistas/consultoria-especializada',
              description:
                'Assessoria em áreas específicas, oferecendo soluções e orientações baseadas em expertise e conhecimento especializado.',
            },
            {
              title: 'Guia de Turismo',
              slug: 'especialistas/guia-de-turismo',
              description:
                'Especialista em conduzir e apresentar locais turísticos, proporcionando experiências enriquecedoras aos visitantes.',
            },
          ],
        },
      ],
    },
    {
      title: 'Design e Tecnologia',
      slug: 'design-e-tecnologia',
      description:
        'Selecione aqui o que melhor descreve o serviço que irá prestar.',
      children: [
        {
          title: 'Áudio, Design e Vídeo',
          description:
            'Oferecemos produções em Audio, Video e Web e App Design.',
          children: [
            {
              title: 'Animação motion',
              slug: 'design-e-tecnologia/animacao-motion',
              description:
                'Animações fluidas e envolventes para promover sua mensagem de forma dinâmica.',
            },
            {
              title: 'Áudio e Vídeo',
              slug: 'design-e-tecnologia/audio-e-video',
              description:
                'Produção e edição de áudio e vídeo de alta qualidade para projetos comerciais ou pessoais.',
            },
            {
              title: 'Edição de fotos',
              slug: 'design-e-tecnologia/edicao-de-fotos',
              description:
                'Realce e otimize suas imagens com nossos serviços de edição de fotos profissionais.',
            },
            {
              title: 'Fotografia',
              slug: 'eventos/fotografia',
              description:
                'Capturando momentos especiais através da lente, seja para eventos ou projetos comerciais.',
            },
            {
              title: 'Ilustração',
              slug: 'design-e-tecnologia/ilustracao',
              description:
                'Ilustrações personalizadas que dão vida às suas ideias e narrativas.',
            },
            {
              title: 'Modelagem 2D e 3D',
              slug: 'design-e-tecnologia/autocad-e-modelagem-3d',
              description:
                'Transforme suas ideias em modelos detalhados 2D ou representações tridimensionais realísticas.',
            },
            {
              title: 'Restauração de Fotos',
              slug: 'design-e-tecnologia/restauracao-de-fotos',
              description:
                'Reviva memórias preciosas restaurando e preservando fotos antigas ou danificadas.',
            },
            {
              title: 'Web Design',
              slug: 'design-e-tecnologia/web-design',
              description:
                'Designs de sites responsivos que garantem uma experiência de usuário excepcional em todas as plataformas.',
            },
          ],
        },
        {
          title: 'Materiais Gráficos',
          description:
            'Soluções gráficas completas para todas as suas necessidades visuais.',
          children: [
            {
              title: 'Convites',
              slug: 'design-e-tecnologia/convites',
              description:
                'Convites personalizados para todos os tipos de eventos, refletindo o estilo e a personalidade da sua celebração.',
            },
            {
              title: 'Criação de logos',
              slug: 'design-e-tecnologia/criacao-de-logos',
              description:
                'Designs de logos únicos que representam a identidade e os valores da sua marca.',
            },
            {
              title: 'Criação de marcas',
              slug: 'design-e-tecnologia/criacao-de-marca',
              description:
                'Desenvolvimento de identidades de marca que se destacam e deixam uma impressão duradoura.',
            },
            {
              title: 'Diagramador',
              slug: 'design-e-tecnologia/diagramador',
              description:
                'Layouts estruturados e organizados para publicações, livros e mais, garantindo legibilidade e estética.',
            },
            {
              title: 'Materiais promocionais',
              slug: 'design-e-tecnologia/materiais-promocionais',
              description:
                'Materiais de marketing visualmente atraentes para promover sua marca ou evento.',
            },
            {
              title: 'Produção gráfica',
              slug: 'design-e-tecnologia/producao-grafica',
              description:
                'Produção gráfica de alta qualidade para todos os seus materiais impressos, desde cartões de visita até banners.',
            },
          ],
        },
        {
          title: 'Tecnologia',
          description:
            'Desenvolvimento e programação de plataformas Web, Webapps e apps, marketing digital e UI design.',
          children: [
            {
              title: 'Apps para smartphone',
              slug: 'design-e-tecnologia/aplicativos-para-celular-e-redes-sociais',
              description:
                'Aplicativos móveis personalizados para todas as plataformas.',
            },
            {
              title: 'Desenvolvimento de games',
              slug: 'design-e-tecnologia/desenvolvimento-de-games',
              description:
                'Criação de jogos interativos e envolventes para diversas plataformas.',
            },
            {
              title: 'Desenvolvimento de sites',
              slug: 'design-e-tecnologia/desenvolvimento-de-sites-e-sistemas',
              description:
                'Websites responsivos e otimizados para sua presença online.',
            },
            {
              title: 'Marketing digital',
              slug: 'design-e-tecnologia/marketing-online',
              description:
                'Estratégias digitais para ampliar sua visibilidade online.',
            },
            {
              title: 'UI design',
              slug: 'design-e-tecnologia/ux-ui-design',
              description: 'Interfaces intuitivas e esteticamente agradáveis.',
            },
          ],
        },
      ],
    },
    {
      title: 'Eventos',
      slug: 'eventos',
      description:
        'Selecione aqui o que melhor descreve o serviço que irá prestar.',
      children: [
        {
          title: 'Equipe e Suporte',
          description:
            'Conte com uma equipe especializada para garantir a execução perfeita do seu evento.',
          children: [
            {
              title: 'Assessor de eventos',
              slug: 'eventos/assessor-de-eventos',
              description:
                'Especialistas dedicados para coordenar, planejar e executar seu evento sem falhas.',
            },
            {
              title: 'Carros de casamento',
              slug: 'eventos/carros-de-casamento',
              description:
                'Garanta uma chegada elegante e inesquecível com nossa seleção de veículos de luxo.',
            },
            {
              title: 'Celebrantes',
              slug: 'eventos/celebrantes',
              description:
                'Profissionais capacitados para oficializar e tornar seu evento ainda mais especial.',
            },
            {
              title: 'Equipamento para festas',
              slug: 'eventos/equipamentos-para-festas',
              description:
                'Equipamentos modernos para garantir que seu evento seja um sucesso, do som à iluminação.',
            },
            {
              title: 'Garçons e copeiras',
              slug: 'eventos/garcons-e-copeiras',
              description:
                'Equipe treinada para servir seus convidados com eficiência e cordialidade.',
            },
            {
              title: 'Local para eventos',
              slug: 'eventos/local-para-eventos',
              description:
                'Locais incríveis que se adaptam a qualquer tipo de evento, do íntimo ao grandioso.',
            },
            {
              title: 'Manobrista',
              slug: 'eventos/manobrista',
              description:
                'Serviço de valet para garantir a comodidade e segurança dos veículos dos seus convidados.',
            },
            {
              title: 'Organização de Eventos',
              slug: 'eventos/organizacao-de-eventos',
              description:
                'Deixe todos os detalhes do seu evento nas mãos de especialistas.',
            },
            {
              title: 'Recepcionistas',
              slug: 'eventos/recepcionistas-e-cerimonialistas',
              description:
                'Receba seus convidados com elegância e profissionalismo.',
            },
            {
              title: 'Seguranças',
              slug: 'eventos/seguranca',
              description:
                'Mantenha seu evento seguro com nossa equipe de segurança treinada.',
            },
          ],
        },
        {
          title: 'Comes e bebes',
          description:
            'Delicie seus convidados com opções gastronômicas de alta qualidade e sabor inesquecível.',
          children: [
            {
              title: 'Bartender',
              slug: 'eventos/bartenders',
              description:
                'Coquetéis personalizados e serviço de bar premium para animar seu evento.',
            },
            {
              title: 'Buffet completo',
              slug: 'eventos/buffet-completo',
              description:
                'Uma variedade de pratos deliciosos e opções de menu para satisfazer todos os paladares.',
            },
            {
              title: 'Chocolateiro',
              slug: 'eventos/chocolateiro',
              description:
                'Criações de chocolate artesanais e sofisticadas, perfeitas para adoçar seu evento.',
            },
            {
              title: 'Churrasqueiro',
              slug: 'eventos/churrasqueiro',
              description:
                'Carne assada à perfeição, garantindo um churrasco saboroso e inesquecível.',
            },
            {
              title: 'Confeiteira',
              slug: 'eventos/confeitaria',
              description:
                'Bolos, doces e sobremesas personalizados que encantam tanto pelo sabor quanto pela aparência.',
            },
          ],
        },
        {
          title: 'Música e animação',
          description:
            'Eleve a atmosfera do seu evento com entretenimento musical e animações vibrantes.',
          children: [
            {
              title: 'Animação de festas',
              slug: 'eventos/animacao-de-festas',
              description:
                'Entretenimento vibrante e dinâmico para garantir que seus convidados se divirtam ao máximo.',
            },
            {
              title: 'Bandas e cantores',
              slug: 'eventos/bandas-e-cantores',
              description:
                'Música ao vivo de alta qualidade, desde solos acústicos a bandas completas para embalar seu evento.',
            },
            {
              title: 'DJs',
              slug: 'eventos/djs',
              description:
                'Sets musicais personalizados, garantindo a trilha sonora perfeita para sua festa ou evento.',
            },
            {
              title: 'Ônibus Balada',
              slug: 'eventos/onibus-balada',
              description:
                'A festa móvel que leva seus convidados a uma experiência inesquecível, combinando transporte e entretenimento.',
            },
          ],
        },
        {
          title: 'Serviços Complementares',
          description:
            'Uma variedade de serviços adicionais para tornar seu evento ainda mais especial e memorável.',
          children: [
            {
              title: 'Brindes e lembrancinhas',
              slug: 'eventos/brindes-e-lembrancinhas',
              description:
                'Ofereça aos seus convidados lembranças personalizadas que capturam a essência do seu evento.',
            },
            {
              title: 'Convites',
              slug: 'design-e-tecnologia/convites',
              description:
                'Crie convites exclusivos que deixarão uma primeira impressão duradoura em seus convidados.',
            },
            {
              title: 'Decoração',
              slug: 'eventos/decoracao',
              description:
                'Transforme seu espaço com decorações que refletem o tema e o tom do seu evento.',
            },
            {
              title: 'Edição de vídeos',
              slug: 'eventos/gravacao-de-videos',
              description:
                'Capture e edite momentos especiais para criar memórias em vídeo que durarão a vida toda.',
            },
            {
              title: 'Fotografia',
              slug: 'eventos/fotografia',
              description:
                'Eternize os momentos mais preciosos do seu evento com fotografia profissional.',
            },
            {
              title: 'Florista',
              slug: 'eventos/florista',
              description:
                'Adicione um toque de natureza ao seu evento com arranjos florais personalizados.',
            },
          ],
        },
        {
          title: 'Locação',
          description: 'Telões, Leds, Sinalizadores e Iluminação.',
        },
      ],
    },
    {
      title: 'Moda e beleza',
      description:
        'Selecione entre as opções o que mais se encaixa no serviço que realiza.',
      slug: 'moda-e-beleza',
      children: [
        {
          title: 'Beleza',
          description:
            'Serviços especializados focados em realçar e celebrar sua beleza natural.',
          children: [
            {
              title: 'Bronzeamento',
              slug: 'moda-e-beleza/bronzeamento',
              description:
                'Obtenha um brilho dourado saudável com nossas opções de bronzeamento.',
            },
            {
              title: 'Depilação',
              slug: 'moda-e-beleza/depilacao',
              description:
                'Remoção suave e eficaz de pelos indesejados para uma pele mais lisa e macia.',
            },
            {
              title: 'Design de sobrancelhas',
              slug: 'moda-e-beleza/designer-de-sobrancelhas',
              description:
                'Defina e destaque suas sobrancelhas com profissionais especializados.',
            },
            {
              title: 'Designer de cílios',
              slug: 'moda-e-beleza/designer-de-cilios',
              description:
                'Realce seus olhos com extensões de cílios personalizadas e lifting.',
            },
            {
              title: 'Esteticistas',
              slug: 'moda-e-beleza/esteticista',
              description:
                'Tratamentos de pele sob medida para revitalizar e rejuvenescer seu rosto e corpo.',
            },
            {
              title: 'Manicure e pedicure',
              slug: 'moda-e-beleza/manicure-e-pedicure',
              description:
                'Mime suas mãos e pés com cuidados especializados e esmaltação profissional.',
            },
            {
              title: 'Maquiadores',
              slug: 'moda-e-beleza/maquiadores',
              description:
                'Transforme seu visual com maquiagens personalizadas para todas as ocasiões.',
            },
            {
              title: 'Micropigmentador',
              slug: 'moda-e-beleza/micropigmentador',
              description:
                'Técnicas de pigmentação para realçar sobrancelhas, lábios e outras áreas do rosto.',
            },
            {
              title: 'Podólogo',
              slug: 'moda-e-beleza/podologo',
              description:
                'Cuidados especializados para a saúde e bem-estar dos seus pés.',
            },
          ],
        },
        {
          title: 'Cabelo',
          description:
            'Explore a arte da transformação capilar e renove seu visual com profissionais altamente qualificados.',
          children: [
            {
              title: 'Cabeleireiros',
              slug: 'moda-e-beleza/cabeleireiros',
              description:
                'Profissionais dedicados a cortes, colorações e estilizações, prontos para dar uma nova vida aos seus cabelos.',
            },
            {
              title: 'Barbeiros',
              slug: 'moda-e-beleza/barbeiro',
              description:
                'Mestres em cortes e estilos masculinos, garantindo uma aparência impecável para barbas e cabelos.',
            },
          ],
        },
        {
          title: 'Estilo',
          description: 'Moda, corte e costura, locações e muito mais.',
          children: [
            {
              title: 'Alfaiate',
              slug: 'moda-e-beleza/alfaiate',
              description:
                'Artesãos especializados em ajustar e criar vestimentas sob medida, garantindo um ajuste perfeito e personalizado.',
            },
            {
              title: 'Corte e costura',
              slug: 'moda-e-beleza/corte-e-costura',
              description:
                'Profissionais que transformam tecidos em peças únicas, fazendo ajustes, reparos ou criando roupas do zero.',
            },
            {
              title: 'Personal stylist',
              slug: 'moda-e-beleza/personal-stylist',
              description:
                'Especialistas em moda que o ajudam a definir seu estilo, escolher roupas que favoreçam e criar uma imagem impactante.',
            },
            {
              title: 'Sapateiro',
              slug: 'moda-e-beleza/sapateiro',
              description:
                'Mestres no reparo e fabricação de calçados, garantindo que seus sapatos durem mais e se ajustem perfeitamente.',
            },
            {
              title: 'Visagista',
              slug: 'moda-e-beleza/visagista',
              description:
                'Especialistas em analisar a harmonia e estética do rosto para criar looks que destacam suas melhores características.',
            },
            {
              title: 'Locações',
              description: 'Locação de vestidos, trajes finos e fantasias.',
            },
          ],
        },
        {
          title: 'Artes e Bem Estar',
          description:
            'Selecione aqui o que melhor se enquadra nos serviços que realiza.',
          children: [
            {
              title: 'Artes e Alternativos',
              description: 'Serviços Artesanais e Tratamentos Alternativos.',
              children: [
                {
                  title: 'Artesanato',
                  slug: 'moda-e-beleza/artesanato',
                  description: 'Artesanatos e manufaturados.',
                },
                {
                  title: 'Tratamentos Alternativos',
                  slug: 'moda-e-beleza/esoterico',
                  description:
                    'Seviços Holísticos, práticas diferenciadas, reike, relaxamento e massagens.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Reformas e reparos',
      slug: 'reformas-e-reparos',
      description:
        'Selecione aqui o serviço que corresponde a sua especialidade.',
      children: [
        {
          title: 'Aluguel de Maquinário',
          description:
            'Alugue equipamentos e maquinários necessários para seus projetos de construção ou reforma.',
          children: [
            {
              title: 'Aluguel de maquinário',
              slug: 'reformas-e-reparos/aluguel-de-maquinario',
              description:
                'Oferecemos uma ampla gama de máquinas e ferramentas para ajudar em seu projeto.',
            },
          ],
        },
        {
          title: 'Construção',
          description:
            'Serviços abrangentes relacionados à construção, do planejamento à conclusão.',
          children: [
            {
              title: 'Arquitetos',
              slug: 'reformas-e-reparos/arquiteto',
              description:
                'Profissionais que projetam, planejam e ajudam a supervisar a construção de edifícios.',
            },
            {
              title: 'Design de Interiores',
              slug: 'reformas-e-reparos/design-de-interiores',
              description:
                'Especialistas em transformar espaços internos, garantindo estética e funcionalidade.',
            },
            {
              title: 'Empreiteiro',
              slug: 'reformas-e-reparos/empreiteiro',
              description:
                'Profissionais que gerenciam e supervisionam projetos de construção.',
            },
            {
              title: 'Engenheiro',
              slug: 'reformas-e-reparos/engenheiro',
              description:
                'Especialistas em aplicar princípios científicos e matemáticos para projetar e implementar estruturas e sistemas.',
            },
            {
              title: 'Limpeza pós obra',
              slug: 'reformas-e-reparos/limpeza-pos-obra',
              description:
                'Serviços dedicados à limpeza após a conclusão de obras, removendo resíduos e deixando o espaço pronto para uso.',
            },
            {
              title: 'Marmoraria e Granitos',
              slug: 'reformas-e-reparos/marmoraria-e-granitos',
              description:
                'Especialistas em trabalhar com mármore e granito, oferecendo soluções estéticas e duráveis.',
            },
            {
              title: 'Pedreiro',
              slug: 'reformas-e-reparos/pedreiro',
              description:
                'Profissionais capacitados para construir, reformar e finalizar estruturas em alvenaria.',
            },
            {
              title: 'Poço Artesiano',
              slug: 'reformas-e-reparos/poco-artesiano',
              description:
                'Serviços de perfuração e manutenção de poços artesianos para captação de água subterrânea.',
            },
            {
              title: 'Remoção de Entulho',
              slug: 'reformas-e-reparos/remocao-de-entulho',
              description:
                'Profissionais especializados na remoção e descarte adequado de resíduos de construção.',
            },
          ],
        },
        {
          title: 'Instalação',
          description:
            'Profissionais especializados em instalações diversas, garantindo a correta montagem e funcionamento de seus equipamentos e dispositivos.',
          children: [
            {
              title: 'Antenista',
              slug: 'reformas-e-reparos/antenista',
              description:
                'Especialistas em instalar e ajustar antenas para melhor recepção de sinal.',
            },
            {
              title: 'Automação residencial',
              slug: 'reformas-e-reparos/automacao-residencial',
              description:
                'Profissionais que implementam sistemas automatizados em residências, facilitando o controle de dispositivos e sistemas.',
            },
            {
              title: 'Instalação de eletrônicos',
              slug: 'reformas-e-reparos/instalacao-de-eletronicos',
              description:
                'Especialistas em instalar e configurar diversos tipos de equipamentos eletrônicos.',
            },
            {
              title: 'Instalador tv digital',
              slug: 'reformas-e-reparos/antenista',
              description:
                'Profissionais especializados na instalação de antenas de TV digital, garantindo melhor qualidade de imagem e som.',
            },
            {
              title: 'Segurança eletrônica',
              slug: 'reformas-e-reparos/seguranca-eletronica',
              description:
                'Especialistas em sistemas de segurança, como câmeras, alarmes e sensores.',
            },
            {
              title: 'Toldos e Coberturas',
              slug: 'reformas-e-reparos/toldos-e-coberturas',
              description:
                'Profissionais dedicados à instalação de toldos e coberturas, oferecendo soluções para áreas externas.',
            },
          ],
        },
        {
          title: 'Reformas e Reparos',
          description:
            'Selecione aqui o serviço que corresponde a sua especialidade.',
          children: [
            {
              title: 'Encanador',
              slug: 'reformas-e-reparos/encanador',
              description:
                'Especialistas em sistemas de encanamento, solucionando problemas como vazamentos e instalações.',
            },
            {
              title: 'Eletricista',
              slug: 'reformas-e-reparos/eletricista',
              description:
                'Profissionais capacitados para lidar com instalações elétricas e problemas relacionados.',
            },
            {
              title: 'Gás',
              slug: 'reformas-e-reparos/gas',
              description:
                'Especialistas em sistemas de gás, desde a instalação até a detecção e correção de vazamentos.',
            },
            {
              title: 'Gesso e drywall',
              slug: 'reformas-e-reparos/gesso-e-drywall',
              description:
                'Profissionais habilidosos em trabalhar com gesso e drywall, oferecendo soluções estéticas e práticas para seu espaço.',
            },
            {
              title: 'Pavimentação',
              slug: 'reformas-e-reparos/pavimentacao',
              description:
                'Especialistas em pavimentar áreas, seja com asfalto, concreto ou outros materiais.',
            },
            {
              title: 'Pintor',
              slug: 'reformas-e-reparos/pintor',
              description:
                'Profissionais dedicados a pintar e repintar espaços, garantindo um acabamento de qualidade.',
            },
            {
              title: 'Serralheria e solda',
              slug: 'reformas-e-reparos/serralheria-e-solda',
              description:
                'Especialistas em trabalhar com metais, desde a criação de estruturas até reparos e soldagens.',
            },
            {
              title: 'Vidraceiro',
              slug: 'reformas-e-reparos/vidraceiro',
              description:
                'Profissionais qualificados para instalar, reparar e substituir vidros em diferentes estruturas.',
            },
          ],
        },
        {
          title: 'Serviços Gerais',
          description:
            'Variedade de serviços essenciais para atender às suas necessidades domésticas e comerciais.',
          children: [
            {
              title: 'Chaveiro',
              slug: 'reformas-e-reparos/chaveiro',
              description:
                'Profissionais especializados em abrir, consertar e fazer chaves, além de instalações de fechaduras.',
            },
            {
              title: 'Dedetizador',
              slug: 'reformas-e-reparos/dedetizador',
              description:
                'Serviços de controle de pragas, garantindo um ambiente limpo e livre de infestações.',
            },
            {
              title: 'Desentupidor',
              slug: 'reformas-e-reparos/desentupidor',
              description:
                'Especialistas em desobstruir e limpar encanamentos, evitando danos e inconvenientes.',
            },
            {
              title: 'Desinfecção',
              slug: 'reformas-e-reparos/desinfeccao',
              description:
                'Procedimentos para eliminar microrganismos e garantir um ambiente seguro e higienizado.',
            },
            {
              title: 'Impermeabilizador',
              slug: 'reformas-e-reparos/impermeabilizador',
              description:
                'Técnicas especializadas para proteger superfícies contra infiltrações e umidade.',
            },
            {
              title: 'Marceneiro',
              slug: 'reformas-e-reparos/marceneiro',
              description:
                'Profissionais habilitados para criar, reparar e instalar peças de madeira sob medida.',
            },
            {
              title: 'Marido de Aluguel',
              slug: 'reformas-e-reparos/marido-de-aluguel',
              description:
                'Serviços variados de manutenção doméstica, desde pequenos reparos até instalações.',
            },
            {
              title: 'Mudanças e Carretos',
              slug: 'reformas-e-reparos/mudancas-e-carretos',
              description:
                'Soluções para transporte de bens e objetos, garantindo segurança e eficiência durante a mudança.',
            },
            {
              title: 'Tapeceiro',
              slug: 'reformas-e-reparos/tapeceiro',
              description:
                'Especialistas em reparar e fabricar móveis estofados, oferecendo renovação e conforto.',
            },
          ],
        },
        {
          title: 'Para Casa',
          description:
            'Serviços especializados para melhorar e manter sua casa em perfeitas condições.',
          children: [
            {
              title: 'Banheira',
              slug: 'reformas-e-reparos/banheira',
              description:
                'Instalação, manutenção e reparo de banheiras, garantindo um momento relaxante e seguro.',
            },
            {
              title: 'Coifas e Exaustores',
              slug: 'reformas-e-reparos/coifas-e-exaustores',
              description:
                'Especialistas em instalação e manutenção de coifas e exaustores, assegurando uma ventilação eficaz.',
            },
            {
              title: 'Decorador',
              slug: 'reformas-e-reparos/decorador',
              description:
                'Profissionais dedicados a embelezar e otimizar espaços através de técnicas de decoração.',
            },
            {
              title: 'Instalador de Papel de Parede',
              slug: 'reformas-e-reparos/instalacao-de-papel-de-parede',
              description:
                'Serviços de aplicação de papel de parede, renovando e estilizando ambientes internos.',
            },
            {
              title: 'Jardinagem',
              slug: 'reformas-e-reparos/jardinagem',
              description:
                'Cuidados e manutenção de áreas verdes, plantas e jardins, proporcionando um ambiente agradável.',
            },
            {
              title: 'Montador de Móveis',
              slug: 'reformas-e-reparos/montador-de-moveis',
              description:
                'Especialistas em montagem, desmontagem e reparo de móveis, garantindo durabilidade e estabilidade.',
            },
            {
              title: 'Paisagista',
              slug: 'reformas-e-reparos/paisagista',
              description:
                'Design e planejamento de áreas externas, visando a estética e harmonia com a natureza.',
            },
            {
              title: 'Piscina',
              slug: 'reformas-e-reparos/piscina',
              description:
                'Manutenção, limpeza e instalação de piscinas, assegurando um lazer seguro e prazeroso.',
            },
            {
              title: 'Redes de Proteção',
              slug: 'reformas-e-reparos/redes-de-protecao',
              description:
                'Instalação de redes de proteção em janelas, sacadas e áreas de risco, proporcionando segurança.',
            },
          ],
        },
      ],
    },
    {
      title: 'Saúde',
      slug: 'saude',
      description:
        'Selecione aqui o serviço que melhor corresponde a sua especialidade.',
      children: [
        {
          title: 'Biomedicina Estética',
          description:
            'Tratamentos estéticos avançados e procedimentos de beleza conduzidos por profissionais biomédicos.',
          children: [
            {
              title: 'Biomedicina Estética',
              slug: 'saude/biomedicina-estetica',
              description:
                'Procedimentos estéticos não cirúrgicos que visam melhorar a aparência e saúde da pele.',
            },
            {
              title: 'Remoção de Tatuagem',
              slug: 'saude/remocao-de-tatuagem',
              description:
                'Procedimentos especializados para remover ou atenuar tatuagens através de tecnologias avançadas.',
            },
          ],
        },
        {
          title: 'Para o Corpo',
          description: 'Dentistas, Médicos e Especialidades.',
          children: [
            {
              title: 'Cozinheira',
              slug: 'familia/cozinheira',
              description:
                'Profissionais capacitados para preparar refeições saborosas e saudáveis para você e sua família.',
            },
            {
              title: 'Dentista',
              slug: 'saude/dentista',
              description:
                'Especialistas em saúde bucal, prontos para diagnosticar, prevenir e tratar problemas dentários.',
            },
            {
              title: 'Fisioterapeuta',
              slug: 'saude/fisioterapeuta',
              description:
                'Cuidados e tratamentos para reabilitação física, promovendo a melhoria da qualidade de vida.',
            },
            {
              title: 'Fonoaudiólogo',
              slug: 'saude/fonoaudiologo',
              description:
                'Profissionais focados em tratar e prevenir distúrbios da comunicação humana.',
            },
            {
              title: 'Médico',
              slug: 'saude/medico',
              description:
                'Especialistas em diagnóstico, tratamento e prevenção de doenças e condições de saúde.',
            },
            {
              title: 'Nutricionista',
              slug: 'saude/nutricionista',
              description:
                'Orientações e planos alimentares personalizados, visando a saúde e o bem-estar.',
            },
            {
              title: 'Quiropraxia',
              slug: 'saude/quiropraxia',
              description:
                'Técnicas manuais para ajuste e alinhamento da coluna, aliviando dores e melhorando a mobilidade.',
            },
            {
              title: 'Terapias Alternativas',
              slug: 'saude/terapias-alternativas',
              description:
                'Diversas abordagens terapêuticas complementares para equilíbrio físico e mental.',
            },
            {
              title: 'Terapia Ocupacional',
              slug: 'saude/terapia-ocupacional',
              description:
                'Atividades e técnicas que visam a reabilitação e adaptação para a realização de tarefas diárias.',
            },
          ],
        },
        {
          title: 'Para a Mente',
          description:
            'Serviços especializados voltados para a saúde mental, bem-estar emocional e desenvolvimento pessoal.',
          children: [
            {
              title: 'Aconselhamento Conjugal e Familiar',
              slug: 'saude/aconselhamento-conjugal-e-familiar',
              description:
                'Orientações e apoio para casais e famílias, buscando fortalecer vínculos e resolver conflitos.',
            },
            {
              title: 'Coach',
              slug: 'saude/coach',
              description:
                'Profissionais dedicados ao desenvolvimento pessoal, ajudando a estabelecer e atingir metas na vida pessoal e profissional.',
            },
            {
              title: 'Doula',
              slug: 'saude/doula',
              description:
                'Acompanhamento e suporte a gestantes durante a gravidez, parto e pós-parto, promovendo conforto e segurança.',
            },
            {
              title: 'Psicanalista',
              slug: 'saude/psicanalista',
              description:
                'Especialistas em psicanálise, abordagem terapêutica voltada para a compreensão do inconsciente e dos processos mentais.',
            },
            {
              title: 'Psicólogo',
              slug: 'saude/psicologo',
              description:
                'Profissionais treinados para atender, diagnosticar e tratar questões emocionais e comportamentais.',
            },
          ],
        },
        {
          title: 'Para a Família',
          description:
            'Serviços especializados voltados para o cuidado e bem-estar da família.',
          children: [
            {
              title: 'Cuidador de Pessoas',
              slug: 'saude/cuidador-de-pessoas',
              description:
                'Profissionais dedicados ao cuidado de pessoas, especialmente idosos, crianças ou indivíduos com necessidades especiais, proporcionando assistência e companhia.',
            },
            {
              title: 'Enfermeira',
              slug: 'saude/enfermeira',
              description:
                'Profissionais da saúde treinados para prestar cuidados de enfermagem, administrar medicamentos, e monitorar a saúde de pacientes.',
            },
          ],
        },
      ],
    },
    {
      title: 'Serviços Domésticos',
      slug: 'familia',
      description:
        'Selecione aqui o serviço que melhor descreve as suas funções e habilidades.',
      children: [
        {
          title: 'Para a Casa',
          description:
            'Serviços especializados para manutenção, limpeza e melhoria da sua casa.',
          children: [
            {
              title: 'Diarista',
              slug: 'familia/diarista',
              description:
                'Profissionais especializados em limpeza e organização da casa de forma periódica.',
            },
            {
              title: 'Limpeza de Piscina',
              slug: 'familia/limpeza-de-piscina',
              description:
                'Especialistas em manter sua piscina limpa, segura e pronta para uso.',
            },
            {
              title: 'Passadeira',
              slug: 'familia/passadeira',
              description:
                'Profissionais dedicados a passar e cuidar das suas roupas, garantindo que elas estejam prontas para uso.',
            },
            {
              title: 'Tapeceiro',
              slug: 'reformas-e-reparos/tapeceiro',
              description:
                'Especialistas em reparar, restaurar e criar estofados para móveis, proporcionando uma nova vida a sofás, poltronas e mais.',
            },
            {
              title: 'Lavadeira',
              slug: 'familia/lavadeira',
              description:
                'Profissionais especializados em lavar, secar e cuidar das suas roupas com eficiência.',
            },
            {
              title: 'Personal shopper',
              slug: 'familia/personal-shopper',
              description:
                'Especialistas dedicados a ajudar nas suas decisões de compra, seja para roupas, móveis ou outras necessidades, garantindo as melhores escolhas de acordo com seu estilo e orçamento.',
            },
          ],
        },
        {
          title: 'Para a Família',
          description:
            'Serviços especializados para atender às necessidades e conveniências da sua família.',
          children: [
            {
              title: 'Babá',
              slug: 'familia/baba',
              description:
                'Profissionais treinados e dedicados a cuidar das crianças, proporcionando segurança e conforto para os pais.',
            },
            {
              title: 'Cozinheira',
              slug: 'familia/cozinheira',
              description:
                'Especialistas em culinária prontos para preparar refeições saborosas e nutritivas para a família.',
            },
            {
              title: 'Entregador',
              slug: 'familia/entregador',
              description:
                'Profissionais rápidos e confiáveis para entregar ou buscar itens conforme a sua necessidade.',
            },
            {
              title: 'Motorista',
              slug: 'familia/motorista',
              description:
                'Condutores experientes para transportar você ou sua família com segurança, seja para compromissos diários ou viagens especiais.',
            },
            {
              title: 'Personal Organizer',
              slug: 'familia/personal-organizer',
              description:
                'Especialistas em organização prontos para otimizar espaços, organizar objetos e transformar a atmosfera da sua casa.',
            },
            {
              title: 'Segurança Particular',
              slug: 'familia/seguranca-particular',
              description:
                'Profissionais treinados para garantir a segurança e proteção da sua família e propriedade.',
            },
          ],
        },
        {
          title: 'Para os Pets',
          description:
            'Cuidados dedicados ao bem-estar e cuidado dos seus animais de estimação.',
          children: [
            {
              title: 'Adestrador de Cães',
              slug: 'familia/adestrador-de-caes',
              description:
                'Profissionais especializados em treinar e educar cães, melhorando o comportamento e reforçando comandos.',
            },
            {
              title: 'Passeador de Cães',
              slug: 'familia/passeador-de-caes',
              description:
                'Especialistas em caminhadas com cães, garantindo que seu pet tenha exercícios regulares e momentos de diversão ao ar livre.',
            },
            {
              title: 'Cuidados para Pets',
              slug: 'familia/servicos-para-pets',
              description: 'Veterinários, Banho & Tosa e Outros.',
            },
          ],
        },
      ],
    },
  ],
};
