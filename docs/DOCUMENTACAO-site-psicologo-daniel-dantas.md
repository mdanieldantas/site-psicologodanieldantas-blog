# Documentação do Projeto – Landing Page Daniel Dantas

---

## 1. OBJETIVOS PRINCIPAIS DO SITE

- **Apresentação Profissional:** Destacar o trabalho, experiência e diferenciais do psicólogo Daniel Dantas.
- **Captação de Leads:** Facilitar o contato de potenciais clientes por meio de formulários e botões de ação.
- **Educação e Autoridade:** Oferecer conteúdo relevante sobre psicologia, saúde mental e autoconhecimento.
- **Acessibilidade e Usabilidade:** Garantir navegação intuitiva, responsiva e acessível em todos os dispositivos.
- **SEO e Performance:** Otimizar para mecanismos de busca, carregamento rápido e boas práticas técnicas.

---

## 2. ARQUITETURA DA INFORMAÇÃO

- **Home:** Apresentação, diferenciais, serviços, depoimentos, chamada para ação.
- **Sobre:** Perfil profissional, formação, missão e valores.
- **Serviços:** Descrição detalhada dos atendimentos e especialidades.
- **Conteúdo/Blog:** Artigos, dicas e materiais educativos.
- **Contato:** Formulário, WhatsApp, localização e redes sociais.
- **Política de Privacidade:** Informações legais e de uso de dados.
- **Páginas Especiais:** Em construção, Sitemap, Robots.txt, Google Site Verification

---

## 3. DESIGN SYSTEM

- **Cores:**
  - Primária: tons suaves e acolhedores (ex: azul, verde, bege)
  - Secundária: tons neutros para contraste (cinza, branco, preto)
- **Tipografia:**
  - Títulos: fonte moderna, legível e com peso
  - Corpo: fonte limpa, tamanho confortável para leitura
- **Componentes UI:**
  - Botões (primário, secundário, WhatsApp)
  - Cards de serviço
  - Formulários acessíveis
  - Seções com imagens e textos
  - Accordion, Alert, Badge, Breadcrumb, Carousel, Chart, Dialog, Drawer, Dropdown, etc.
- **Ícones e Ilustrações:**
  - Ícones de fácil compreensão
  - Imagens otimizadas e ilustrativas
- **Responsividade:**
  - Layout adaptável para mobile, tablet e desktop
- **Acessibilidade:**
  - Contraste adequado, navegação por teclado, labels em formulários

---

## 4. ARQUITETURA DE PASTAS E ARQUIVOS

```
c:
└── DevDriverRepo
    └── 1.3-landing-page-daniel-dantas-versão
        ├── app/
        │   ├── globals.css
        │   ├── google-site-verification.tsx
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── robots.ts
        │   ├── schema-markup.tsx
        │   ├── sitemap.ts
        │   ├── em-construcao/
        │   │   └── page.tsx
        │   └── politica-de-privacidade/
        │       └── page.tsx
        ├── components/
        │   ├── analytics-event-tracker.tsx
        │   ├── analytics.tsx
        │   ├── challenges-section.tsx
        │   ├── contact-form.tsx
        │   ├── cookie-consent.tsx
        │   ├── lazy-image.tsx
        │   ├── lazy-map.tsx
        │   ├── script-loader.tsx
        │   ├── simple-chatbot.tsx
        │   ├── theme-provider.tsx
        │   ├── touch-friendly-button.tsx
        │   ├── wave-transition.tsx
        │   ├── whatsapp-button.tsx
        │   └── ui/
        │       ├── accordion.tsx
        │       ├── alert-dialog.tsx
        │       ├── alert.tsx
        │       ├── aspect-ratio.tsx
        │       ├── avatar.tsx
        │       ├── badge.tsx
        │       ├── breadcrumb.tsx
        │       ├── button.tsx
        │       ├── calendar.tsx
        │       ├── card.tsx
        │       ├── carousel.tsx
        │       ├── chart.tsx
        │       ├── checkbox.tsx
        │       ├── collapsible.tsx
        │       ├── command.tsx
        │       ├── context-menu.tsx
        │       ├── dialog.tsx
        │       ├── drawer.tsx
        │       ├── dropdown-menu.tsx
        │       ├── form.tsx
        │       ├── hover-card.tsx
        │       ├── input-otp.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       ├── menubar.tsx
        │       ├── navigation-menu.tsx
        │       ├── pagination.tsx
        │       ├── popover.tsx
        │       └── ...
        ├── hooks/
        │   ├── use-mobile.tsx
        │   └── use-toast.ts
        ├── lib/
        │   └── utils.ts
        ├── public/
        │   ├── acp-image-rogers-2.png
        │   ├── Ansiedade-e-Estresse-image.png
        │   ├── atendimento-online-image.png
        │   ├── Autoconhecimento-e-Crescimento-Pessoal-image.png
        │   ├── Daniel-Dantas-logo-footer-correta.png
        │   ├── Depressao-e-Tristeza-Profunda-image.png
        │   ├── Desenvolvimento-de-Habilidades-Sociais-image.png
        │   ├── Dificuldades-de-Autoaceitacao-e-Autoestima-image.png
        │   ├── Dificuldades-em-Relacionamentos.png
        │   ├── Duvidas-e-Crises-Existenciais-image.png
        │   ├── Focalização-conectando-se-image-blog.png
        │   ├── focalizacao-imagem.png
        │   ├── foto-psicologo-daniel-dantas.png
        │   ├── hero-sofa.png
        │   ├── importância-da-empatia-image-blog.png
        │   ├── Mindfulness-e-autorregulação-image-blog.png
        │   ├── mindfulness-imagem.png
        │   ├── navbar-logo-horizontal-navbar.png
        │   ├── placeholder-logo.png
        │   ├── placeholder-logo.svg
        │   ├── placeholder-user.jpg
        │   ├── placeholder.jpg
        │   ├── placeholder.svg
        │   ├── Regulacao-Emocional-image.png
        │   ├── site-layout-image-correta.png
        │   ├── Transicoes-de-Vida-e-Mudancas-image.png
        │   └── Traumas-e-Experiencias-Dificeis-image.png
        ├── styles/
        │   └── globals.css
        ├── components.json
        ├── middleware.ts
        ├── next.config.mjs
        ├── package.json
        ├── pnpm-lock.yaml
        ├── postcss.config.mjs
        ├── tailwind.config.ts
        └── tsconfig.json
```

---

## 5. BOAS PRÁTICAS ADOTADAS

- **UX:** Navegação clara, CTAs visíveis, feedback visual, acessibilidade.
- **SEO:** URLs amigáveis, sitemap, robots.txt, schema markup, imagens otimizadas, meta tags.
- **Código Limpo:** Componentização, reutilização, tipagem forte (TypeScript), separação de responsabilidades, nomes descritivos, comentários claros.

---

## 6. RECOMENDAÇÕES PARA RECRIAÇÃO

- Siga a estrutura de pastas e arquivos apresentada.
- Utilize o Design System para manter consistência visual.
- Priorize acessibilidade e responsividade.
- Implemente as rotas e componentes conforme a arquitetura da informação.
- Mantenha as boas práticas de SEO e código limpo.
- Consulte os arquivos de configuração para dependências e ajustes de build.

---

## 7. COPY E TEXTOS DO SITE

### Cabeçalho / Menu
- Início
- Sobre
- Serviços
- FAQ
- Blog
- Contato
- Agendar Consulta

### Hero Section
**Título:**  
Psicólogo Daniel Dantas

**Subtítulo:**  
Psicólogo Clínico Online - Criando um espaço de acolhimento e transformação para sua jornada de autoconhecimento, onde quer que você esteja.

**Botão:**  
Vamos conversar?

### Sobre Mim
**Título:**  
Sobre Daniel Dantas

**Texto:**  
Sabe aquela sensação de que o que a gente sente é tão grande que as palavras parecem pequenas demais? Ou, às vezes, uma dor que a gente carrega, mas que ainda não encontrou um nome?

*Algumas dores não cabem em palavras. Outras precisam ser nomeadas para serem curadas.*

Essa frase me acompanha porque acredito muito no poder do espaço terapêutico para transformar o que sentimos, seja a ansiedade que aperta o peito, a angústia que tira o sono, ou qualquer outra dificuldade que esteja sentindo.

Meu nome é Daniel Dantas, sou psicólogo clínico humanista, pós-graduado em Saúde Mental, Psicopatologia e Atenção Psicossocial. Minha prática clínica se apoia na Abordagem Centrada na Pessoa e Focalização, nas quais tenho formação, e nas práticas de Mindfulness. Como psicólogo, caminhei por diferentes lugares. Desde trabalhos com grupos, contextos de violação de direitos humanos, saúde coletiva entre outros. Cada um desses encontros, vivências e formações me fez ser o profissional que sou hoje, com um olhar mais sensível para cada história, com carinho e muito respeito.

Dar o primeiro passo nem sempre é fácil, mas pode ser o início de uma grande transformação. Se você está considerando buscar um espaço para você, te convido a entrar em contato. Ficarei feliz em te receber para conversarmos.

### Conheça Meu Trabalho
**Título:**  
Conheça Meu Trabalho

**Texto:**  
Neste vídeo, compartilho minha jornada como psicólogo e apresento as abordagens terapêuticas que fundamentam meu trabalho: a Abordagem Centrada na Pessoa, a Focalização e o Mindfulness. Explico como estas técnicas se complementam para criar um processo terapêutico integrado e personalizado.

- Descubra como a integração de diferentes abordagens pode potencializar seu processo terapêutico.
- Entenda como podemos trabalhar juntos em sua jornada de autoconhecimento e bem-estar.

**Botão:**  
Vamos iniciar sua jornada terapêutica?

### Desafios que Podemos Enfrentar Juntos
**Título:**  
Desafios que Podemos Enfrentar Juntos

**Texto:**  
Independentemente de onde você esteja, alguns desafios são universais. Estou aqui para te acompanhar nessa jornada.

#### Exemplos de desafios (cards/carrossel):
- **Ansiedade e Estresse:**  
  Ajudar você a identificar as causas da ansiedade e do estresse, promovendo autoconhecimento e técnicas de regulação emocional através da Focalização e da ACP.
- **Regulação Emocional:**  
  Ensinar técnicas de Focalização para que você possa se conectar com suas emoções e aprender a regulá-las de forma saudável.
- **Traumas e Experiências Difíceis:**  
  Auxiliar no processo de elaboração e superação de traumas, utilizando técnicas de Focalização para acessar e integrar experiências dolorosas de forma segura e gradual.
- **Depressão e Tristeza Profunda:**  
  Oferecer um espaço de escuta ativa e empatia para que você possa explorar suas emoções e encontrar novas perspectivas para lidar com a depressão e a tristeza.
- **Dificuldades em Relacionamentos:**  
  Trabalhar questões como comunicação, conflitos e conexão emocional, ajudando você a construir relacionamentos mais saudáveis e autênticos.
- **Autoconhecimento e Crescimento Pessoal:**  
  Facilitar o processo de autoconhecimento, ajudando você a se conectar com suas emoções, valores e objetivos, promovendo um crescimento pessoal significativo.
- **Dúvidas e Crises Existenciais:**  
  Ajudar você a explorar questões existenciais, como sentido da vida, propósito e identidade, promovendo uma maior clareza e direcionamento.
- **Dificuldades de Autoaceitação e Autoestima:**  
  Trabalhar a autoaceitação e a construção de uma autoestima saudável, através de um processo de escuta ativa e validação das suas experiências.
- **Transições de Vida e Mudanças:**  
  Acompanhar você em momentos de transição, como mudanças profissionais, lutos ou novos ciclos de vida, ajudando a encontrar equilíbrio e significado nessas fases.
- **Desenvolvimento de Habilidades Sociais:**  
  Ajudar você a desenvolver habilidades sociais e emocionais, como empatia, assertividade e comunicação, para melhorar suas interações pessoais e profissionais.

### Serviços
**Título:**  
Serviços

**Texto:**  
Ofereço atendimento personalizado para ajudar você a encontrar equilíbrio e bem-estar.

#### Psicoterapia Online
A terapia online elimina barreiras geográficas e oferece a mesma qualidade e profundidade do atendimento presencial. No conforto do seu espaço, podemos estabelecer uma conexão significativa e trabalhar questões importantes para seu bem-estar e desenvolvimento pessoal - independentemente da distância.
- Sessões por videochamada em plataformas seguras
- Flexibilidade de horários e localização
- Mesmo acolhimento e eficácia da terapia presencial

**Botão:**  
Agendar primeira sessão

### Demandas Atendidas
**Título:**  
Eu posso te ajudar na travessia de demandas como:

**Texto:**  
Utilizando a Abordagem Centrada na Pessoa (ACP) e a Focalização, ofereço um espaço seguro e acolhedor para que você possa explorar suas emoções, superar desafios e encontrar caminhos para uma vida mais equilibrada e significativa.

### Outros Serviços
- **Psicoterapia Individual:**  
  Atendimento individual focado em autoconhecimento, superação de desafios emocionais e promoção da saúde mental. Utilizo técnicas como a Abordagem Centrada na Pessoa (ACP) e Focalização para ajudar você a acessar e integrar suas experiências corporais e emocionais, promovendo um crescimento pessoal saudável e construtivo.
- **Grupos Psicoterapêuticos:**  
  Oficinas e grupos terapêuticos para práticas de regulação emocional e autoconhecimento. Integro técnicas de Focalização e ACP para ajudar os participantes a explorarem seu 'Sentido Sentido' e encontrarem insights profundos para suas questões.
- **Atendimento Comunitário:**  
  Trabalho com comunidades vulneráveis, promovendo saúde mental e direitos humanos. Utilizo abordagens como a Abordagem Centrada na Pessoa e Focalização para ajudar indivíduos a se conectarem com suas experiências corporais e emocionais, promovendo resiliência e bem-estar.
- **Workshops e Palestras:**  
  Palestras e workshops sobre temas como saúde mental, técnicas meditativas e bem-estar. Incluo práticas de Focalização e ACP para ajudar os participantes a explorarem seu 'Sentido Sentido' e encontrarem novas perspectivas para suas vidas.

### Blog Florescer Humano
**Título:**  
Blog Florescer Humano

**Texto:**  
Artigos, reflexões e ferramentas práticas para apoiar seu bem-estar emocional, onde quer que você esteja.

#### Exemplos de posts:
- **A importância da empatia na terapia humanista**  
  Explorando como a empatia genuína forma a base da relação terapêutica na abordagem centrada na pessoa de Carl Rogers...
- **Focalização: conectando-se com a sabedoria do corpo**  
  Como a técnica de Focalização desenvolvida por Eugene Gendlin pode nos ajudar a acessar conhecimentos implícitos através das sensações corporais...
- **Mindfulness e autorregulação emocional**  
  Práticas de atenção plena que podem ajudar no processo de regulação das emoções e redução do estresse no dia a dia...

### FAQ – Perguntas Frequentes
- **Como funciona a psicoterapia individual?**  
  A psicoterapia individual é um processo de autoconhecimento e desenvolvimento pessoal, onde trabalhamos juntos para identificar e superar desafios emocionais, comportamentais e relacionais. As sessões são semanais e têm duração de 50 minutos.
- **Qual é a sua abordagem terapêutica?**  
  Minha abordagem é baseada na Abordagem Centrada na Pessoa (ACP), que valoriza a empatia, a escuta ativa e o respeito pela singularidade de cada indivíduo. Também utilizo técnicas de Focalização para ajudar no processo de autoconhecimento e regulação emocional.
- **Você atende online?**  
  Sim, ofereço atendimentos online para maior comodidade e acessibilidade. As sessões são realizadas por plataformas seguras e confiáveis.
- **Quanto tempo dura o processo terapêutico?**  
  A duração do processo terapêutico varia conforme as necessidades e objetivos de cada pessoa. Alguns processos podem durar alguns meses, enquanto outros podem se estender por mais tempo. O importante é respeitar o tempo e o ritmo de cada indivíduo.
- **Como agendar uma consulta?**  
  Você pode agendar uma consulta através do formulário de contato neste site, por telefone ou WhatsApp. Após o contato inicial, agendaremos um horário que seja conveniente para você.

**Botão:**  
Ainda tem dúvidas? Entre em contato

### Contato
**Título:**  
Entre em Contato

**Texto:**  
Agende uma consulta ou tire suas dúvidas.

**Formulário:**  
Estou aqui para te ouvir e auxiliar em sua jornada

**Informações de Contato:**
- Telefone: +55 (85) 98601-3431
- E-mail: contatomarcosdgomes@gmail.com
- Endereço: Brazil, Fortaleza-CE

**Redes Sociais:**  
Facebook, Instagram, YouTube

### Footer
Psicoterapia humanizada e acolhedora para ajudar você em sua jornada de autoconhecimento e bem-estar emocional.

**Links Rápidos:**  
- Início
- Sobre
- Serviços
- FAQ
- Blog
- Contato
- Política de Privacidade

### Política de Privacidade
**Título:**  
Política de Privacidade

**Trechos principais:**
- Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nosso site. Ao acessar e utilizar este site, você concorda com os termos descritos abaixo.
- Podemos coletar informações pessoais, como nome, e-mail e número de telefone, quando você preenche formulários em nosso site. Também coletamos informações de navegação, como endereço IP, tipo de navegador e páginas acessadas, para melhorar sua experiência.
- As informações coletadas são utilizadas para:
  - Entrar em contato com você para responder a solicitações.
  - Melhorar nossos serviços e sua experiência no site.
  - Enviar comunicações relacionadas aos nossos serviços, caso você tenha consentido.
- Não compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei ou para proteger nossos direitos legais.
- Utilizamos cookies para melhorar sua experiência de navegação. Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar algumas funcionalidades do site.
- Adotamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração ou divulgação.
- Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise esta página regularmente para se manter informado sobre nossas práticas.
- Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail contatomarcosdgomes@gmail.com ou pelo telefone +55 (85) 98601-3431.

### Página em Construção
**Título:**  
Página em Construção

**Texto:**  
Esta página está em construção, mas o conteúdo estará disponível em breve. Enquanto isso, você pode visitar nossa página inicial para conhecer mais sobre nossos serviços de psicoterapia.

**Botão:**  
Voltar para a página inicial

**Frase motivacional:**  
"O crescimento é um processo. Dê tempo a si mesmo."

---

## 8. INTEGRAÇÕES GOOGLE E MAPAS

### Google Site Verification
- **Arquivo:** `app/google-site-verification.tsx`
- **Função:** Gera a tag de verificação do Google Search Console para comprovar a propriedade do domínio.
- **Como funciona:**
  - O arquivo exporta um componente React que insere a meta tag de verificação no `<head>` do site.
  - Exemplo de uso: `<GoogleSiteVerification />` dentro do layout principal.
- **Importância:** Essencial para SEO, indexação e acesso a ferramentas do Google Search Console.

### Google Analytics e Google Tag Manager
- **Arquivos:**
  - `components/analytics.tsx`
  - `components/analytics-event-tracker.tsx`
  - `components/cookie-consent.tsx`
- **Função:**
  - `analytics.tsx`: Insere o script do Google Analytics/Tag Manager no site.
  - `analytics-event-tracker.tsx`: Permite rastrear eventos personalizados (ex: cliques em botões, formulários).
  - `cookie-consent.tsx`: Exibe o banner de consentimento de cookies e só ativa o Analytics após o consentimento do usuário, em conformidade com LGPD/GDPR.
- **Como funciona:**
  - O script do Google Analytics é carregado de forma assíncrona.
  - O consentimento é salvo no localStorage e, se aceito, o Analytics é ativado.
  - Eventos importantes (ex: envio de formulário, clique em CTA) podem ser rastreados via `analytics-event-tracker.tsx`.
- **Boas práticas:**
  - Nunca ative scripts de rastreamento sem consentimento.
  - Sempre documente o ID do Google Analytics/Tag Manager utilizado.

### Google Maps / Mapa Interativo
- **Arquivo:** `components/lazy-map.tsx`
- **Função:** Carrega o mapa de localização de forma otimizada (lazy loading), evitando impacto na performance inicial do site.
- **Como funciona:**
  - O componente só carrega o mapa (ex: Google Maps embed ou outro serviço) quando o usuário rola até a seção de contato.
  - Pode ser customizado para aceitar diferentes endereços ou coordenadas.
- **Boas práticas:**
  - Sempre utilize lazy loading para mapas.
  - Garanta acessibilidade (ex: texto alternativo, navegação por teclado).
  - Não exponha chaves de API sensíveis no frontend.

### Outras Integrações Google
- **Arquivo:** `app/schema-markup.tsx`
- **Função:** Gera marcação de dados estruturados (Schema.org/JSON-LD) para SEO avançado, facilitando rich snippets no Google.
- **Arquivo:** `app/robots.ts`, `app/sitemap.ts`
- **Função:**
  - `robots.ts`: Gera o arquivo robots.txt dinamicamente, controlando o acesso dos robôs de busca.
  - `sitemap.ts`: Gera o sitemap.xml do site, fundamental para indexação no Google.

### Resumo de Boas Práticas para Integrações
- Sempre documente onde e como cada integração é feita.
- Garanta consentimento do usuário antes de ativar rastreadores.
- Utilize lazy loading para recursos pesados (mapas, vídeos, etc).
- Mantenha IDs, chaves e configurações sensíveis fora do código público (use variáveis de ambiente quando necessário).
- Teste as integrações em ambiente de produção e monitore erros via Google Search Console e Google Analytics.
