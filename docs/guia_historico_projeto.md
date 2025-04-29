# Guia e Histórico do Projeto: Blog Florescer Humano

**Data:** 29-04-2025 <!-- Data da Última Atualização -->

## 1. Visão Geral e Objetivos

Este documento serve como um guia rápido e histórico do desenvolvimento do módulo do blog "Florescer Humano" dentro do site principal do Psicólogo Daniel Dantas.

## 1. Resumo do Projeto

*   **Objetivo Principal:** Implementar um blog (`/blogflorescerhumano`) focado em psicologia humanista, autoconhecimento e bem-estar, integrado ao site existente `psicologodanieldantas.com`.
*   **Problema:** Criar um espaço dedicado para conteúdo aprofundado, distinto da landing page principal, mas mantendo a coesão visual e de navegação.
*   **Tecnologias Principais:**
    *   **Frontend:** Next.js 15+ (App Router), React, TypeScript, Tailwind CSS.
    *   **Backend/CMS:** Supabase (Banco de Dados PostgreSQL, potencialmente Auth).
    *   **Comentários:** Giscus (integrado com GitHub Discussions).
    *   **Documentação:** Markdown (`docs/doc-integracao-psidanieldantas-florescerhumano.md`).

## 2. Histórico de Desenvolvimento

*   **Progresso (29-04-2025):**
    *   **Cancelamento de Inscrição da Newsletter (Unsubscribe):** [IMPLEMENTAÇÃO] - 29-04-2025 - Implementado fluxo completo de descadastro da newsletter:
        * Adicionada coluna `unsubscribe_token` na tabela `newsletter_assinantes`.
        * Gerado token único de descadastro para cada novo assinante.
        * Link de cancelamento incluído no rodapé dos e-mails de confirmação.
        * Criada página `/blogflorescerhumano/cancelar-newsletter` com validação de token, confirmação visual do e-mail e botão de cancelamento.
        * Implementada Server Action para processar o descadastro, atualizar o status para `cancelado` e invalidar tokens.
        * Ajustada a constraint do banco para permitir o status `cancelado` em `status_confirmacao`.
        * Testado: após cancelar, o usuário não recebe mais e-mails.
    *   **Ajuste de Código para React 19/Next.js 15:** [CORREÇÃO] - 29-04-2025 - Refatorado o formulário de cancelamento para usar `useActionState` (React 19) e corrigidas importações de hooks (`useActionState` de `react`, `useFormStatus` de `react-dom`).
    *   **Segurança e Boas Práticas:** [REVISÃO] - 29-04-2025 - Revisado o fluxo de newsletter para garantir que apenas usuários com `status_confirmacao = 'confirmado'` recebam e-mails. Confirmado que tokens de confirmação e descadastro são sempre invalidados após uso.

*   **Progresso (28-04-2025):**
    *   **Avisos Next.js 15 (`params`/`searchParams`):** [INVESTIGAÇÃO/NOTA] - 28-04-2025 - Investigados avisos no console do Next.js 15.2.4 (`params`/`searchParams` 'should be awaited') nas páginas de categoria (`categorias/page.tsx`) e categoria específica (`[categoria]/page.tsx`). Tentativas de refatoração (mudança na forma de acesso às props, tipagem na assinatura, variáveis intermediárias) não eliminaram os avisos. Decidido manter a versão atual e ignorar os avisos, pois não impactam a funcionalidade.
    *   **Paginação na Página de Categorias:** [IMPLEMENTAÇÃO] - 28-04-2025 - Adicionada lógica de paginação completa à página de listagem de categorias (`/blogflorescerhumano/categorias/page.tsx`), incluindo busca de contagem total, range na busca principal e uso do componente `PaginationControls`.
    *   **Organização de Assets:** [IMPLEMENTAÇÃO] - 28-04-2025 - Movidos arquivos de imagem da raiz de `public/` para subpastas dedicadas (`public/psicologodanieldantas/` e `public/blogflorescerhumano/`). Atualizadas todas as referências `src` nos componentes e páginas relevantes (`lazy-image.tsx`, `AboutSection.tsx`, `BlogPreviewSection.tsx`, `Footer.tsx`, `HeroSection.tsx`, `Header.tsx`, `ServicesSection.tsx`, `page.tsx`, `schema-markup.tsx`) para apontar para os novos caminhos.
    *   **Paginação na Página de Busca:** [IMPLEMENTAÇÃO/CORREÇÃO] - 28-04-2025 - Adicionada paginação à página de resultados de busca (`/blogflorescerhumano/buscar/page.tsx`) com limite de 6 artigos por página. Isso incluiu:
        *   Criação do componente reutilizável `PaginationControls.tsx`.
        *   Modificação da função RPC `search_articles_paginated` no Supabase para aceitar `page_limit` e `page_offset` e retornar `{ articles: [...], totalCount: number }`.
        *   Ajuste da página `buscar/page.tsx` para ler o parâmetro `page` da URL, calcular `offset`, chamar a RPC correta e passar os dados para `PaginationControls`.
        *   Correção de erros de tipo TypeScript relacionados à função RPC, que envolveu:
            *   Regeneração dos tipos Supabase (`npx supabase gen types ...`).
            *   Correção manual do tipo de retorno (`Returns`) da função `search_articles_paginated` no arquivo `types/supabase.ts` para refletir a estrutura correta, pois a geração automática resultou em `Returns: Json`.
    *   **Remoção de Campo de Busca Duplicado:** [CORREÇÃO] - 28-04-2025 - Removida a instância duplicada do componente `SearchForm` da página `/blogflorescerhumano/buscar/page.tsx`, mantendo apenas o campo de busca presente no layout geral (header).
    *   **Ajustes no Cabeçalho do Blog (`BlogHeader.tsx`):** [IMPLEMENTAÇÃO] - 28-04-2025 - Realizadas modificações no layout do cabeçalho do blog:
        *   Links de navegação principais ("Categorias", "Artigos", etc.) foram centralizados.
        *   Adicionado um botão "Site Psi Daniel Dantas" linkando para a home (`/`).
        *   Adicionado um ícone de lupa (Search) linkando para a página de busca do blog (`/blogflorescerhumano/buscar`).
        *   A lupa e o botão "Site Psi Daniel Dantas" foram agrupados e alinhados à direita do cabeçalho, com a lupa posicionada à esquerda do botão.

*   **Progresso (26-04-2025):**
    *   **Schema Markup (Artigo):** [IMPLEMENTAÇÃO] - 26-04-2025 - Adicionado JSON-LD Schema Markup do tipo `BlogPosting` dinamicamente na página de artigo (`.../[slug]/page.tsx`), buscando dados como título, resumo, imagem, autor, etc.
    *   **Paginação na Página de Tags:** [IMPLEMENTAÇÃO] - 26-04-2025 - Adicionada paginação à página de listagem de artigos por tag (`/tags/[slug]/page.tsx`). Isso incluiu:
        *   Importar e utilizar o componente `PaginationControls`.
        *   Ajustar a função da página para receber `searchParams`.
        *   Implementar uma query para buscar a contagem total de artigos para a tag.
        *   Modificar a query principal para usar `.range()` com base nos parâmetros de página.
        *   Calcular o total de páginas e passar as props corretas (`totalPages`, `currentPage`, `basePath`) para `PaginationControls`.
    *   **Verificação Página de Categorias:** [VERIFICAÇÃO] - 26-04-2025 - Confirmado que a página de listagem de categorias (`app/blogflorescerhumano/categorias/page.tsx`) já estava implementada.
    *   **Busca de Imagens:** Refatorado `app/blogflorescerhumano/[categoria]/[slug]/page.tsx` para carregar imagens de capa da pasta `public/blogflorescerhumano/` em vez do Supabase Storage.
    *   **Tipagem Supabase:** Verificado e confirmado o uso correto dos tipos gerados (`types/supabase.ts`).
    *   **Geração de Tipos:** Atualizado o arquivo `types/supabase.ts` usando `npx supabase gen types typescript --linked`.
    *   **Exibição e Link de Tags:** Confirmado que as tags são exibidas e linkadas corretamente na página do artigo (`.../[slug]/page.tsx`) e que os links apontam corretamente para a página de tag correspondente (`/blogflorescerhumano/tags/[slug]`).
    *   **Correção de Queries Supabase:** [CORREÇÃO] - 26-04-2025 - Corrigido o arquivo `lib/supabase/queries.ts`. As funções foram atualizadas para usar nomes corretos de tabelas/colunas (`artigos`, `categorias`, `status`), tipos (`Database`) e a instância correta do cliente Supabase (`supabaseServer`). O arquivo agora contém funções reutilizáveis funcionais para buscas comuns no banco de dados (ex: `getAllCategorias`, `getPublishedArtigos`).

*   **Progresso (25-04-2025):** <!-- Data da Última Atualização -->
    *   **Componente `ShareButtons.tsx`:**
        *   Refinamento visual concluído.
        *   Ícones de Gmail e Instagram substituídos por imagens PNG customizadas.
        *   Ordem dos botões ajustada.
        *   Integração de `react-tooltip`.
    *   **Organização de Assets (`public/`):**
        *   Criada estrutura de pastas para blog (`public/blogflorescerhumano/`).
        *   Criada estrutura de pastas para site principal (`public/psicologodanieldantas/`).
    *   **Refatoração do Layout do Blog:**
        *   Header e Footer extraídos do `layout.tsx` para componentes dedicados (`BlogHeader.tsx`, `BlogFooter.tsx`).
        *   Componentes movidos para a pasta correta: `app/blogflorescerhumano/components/`.
    *   **Inserção e Visualização de Artigos:**
        *   Artigos podem ser inseridos via Supabase Table Editor.
        *   Artigos são listados na página `/blogflorescerhumano/artigos` com paginação.
        *   Artigos individuais são exibidos corretamente na rota dinâmica `/blogflorescerhumano/[categoria]/[slug]`.
    *   **Newsletter (Formulário e Backend):** [IMPLEMENTAÇÃO/DEPURAÇÃO] - 28-04-2025 -
        *   Instalados `react-hook-form` e `zod` para validação e controle do formulário.
        *   Criado o componente `NewsletterBlogForm.tsx` com integração ao backend via Server Action (`useActionState`).
        *   Criada a Server Action `subscribeToNewsletter` para validação, verificação de duplicidade e inserção no Supabase.
        *   Ajustadas as políticas RLS no Supabase para permitir apenas inserção pública (role `anon`) e bloquear leitura pública.
        *   Corrigidos problemas de importação (`useActionState` de `react` e `useFormStatus` de `react-dom`).
        *   Refinada a lógica para evitar erro de chave duplicada e exibir mensagem amigável quando o e-mail já está cadastrado.
        *   Adicionados logs detalhados para depuração do fluxo de verificação e inserção.
        *   Próximos passos: implementar double opt-in (confirmação por e-mail), refinar feedback ao usuário e documentar o fluxo final.
    *   **Newsletter (Double Opt-In - Progresso e Pendências):** [ATUALIZAÇÃO] - 28-04-2025 -
        *   Fluxo double opt-in implementado: cadastro salva e-mail como 'pendente', gera token e envia link de confirmação por e-mail usando Resend.
        *   Página de confirmação criada (`/blogflorescerhumano/confirmar-newsletter`) para validar token e atualizar status para 'confirmado'.
        *   Feedback do formulário aprimorado: mensagens específicas para e-mails pendentes, já confirmados ou aguardando confirmação.
        *   Documentação do fluxo e código já atualizada neste guia.
        *   **Pendências para completar a newsletter:**
            *   Finalizar configuração e validação do domínio de envio no painel do Resend (adicionar registros DNS e verificar domínio).
            *   Testar entregabilidade real dos e-mails (inclusive fora do ambiente localhost).
            *   Personalizar layout do e-mail de confirmação (HTML/CSS, logo, assinatura, etc).
            *   Implementar opção de reenvio do e-mail de confirmação para e-mails pendentes.
            *   Testar o fluxo completo: inscrição, confirmação, reenvio, mensagens e etapas.
            *   Revisar e documentar o fluxo final para produção (prints, exemplos, instruções).
            *   (Opcional) Monitorar entregabilidade e reputação dos e-mails no painel do Resend.

*   **Progresso (29-04-2025):**
    *   **Envio em Massa de E-mails da Newsletter:** [IMPLEMENTAÇÃO] - 29-04-2025 - Implementado e testado o script de envio em massa para todos os assinantes confirmados da newsletter, utilizando o Resend e o template oficial do projeto. O conteúdo do e-mail foi personalizado para ser mais humano, incluindo links para o blog, sessão de contato e orientações para melhorar a entregabilidade (ex: arrastar para a aba Principal do Gmail). O campo "from" foi padronizado para "Florescer Humano Blog <newsletter@no-reply.psicologodanieldantas.com>" em todos os envios.
    *   **Aprimoramento do Template de E-mail:** [MELHORIA] - 29-04-2025 - O template de e-mail foi revisado para incluir assinatura personalizada, links úteis e orientações para o usuário, tornando a comunicação mais clara e profissional.
    *   **Padronização dos Remetentes:** [MELHORIA] - 29-04-2025 - Todos os envios de e-mail (inscrição, confirmação, cancelamento e massa) agora utilizam o mesmo padrão de remetente, facilitando a identificação pelo usuário.
    *   **Ajuste dos Logs de Envio:** [MELHORIA] - 29-04-2025 - O script de envio em massa agora exibe apenas erros no terminal, tornando o uso mais limpo e seguro para produção.
    *   **Documentação de Uso:** [MELHORIA] - 29-04-2025 - O guia de uso da newsletter foi atualizado com exemplos práticos, melhores práticas de entregabilidade e instruções para execução dos scripts.

*   **Decisões de Arquitetura/Design Recentes:**
    *   **Padronização do Remetente de E-mails:** [DECISÃO] - 29-04-2025 - Definido que todos os envios de e-mail do projeto devem utilizar o formato "Florescer Humano Blog <newsletter@no-reply.psicologodanieldantas.com>" para reforçar a identidade do blog e facilitar o reconhecimento pelo usuário.
    *   **Separação de Scripts de Desenvolvimento:** [DECISÃO] - 29-04-2025 - Criada a pasta `dev-scripts/newsletter-scripts/` para armazenar scripts de envio e exemplos, garantindo que não sejam enviados para produção ou versionados no git.
    *   **Conteúdo Humanizado e Links Úteis:** [DECISÃO] - 29-04-2025 - Todos os e-mails em massa devem conter links para o blog, sessão de contato e orientações para melhorar a entregabilidade, além de uma assinatura pessoal.

*   **Desafios e Soluções:**
    *   **Avisos do Next.js 15 (`params`/`searchParams`):** [Não Resolvido/Ignorado] - 28-04-2025 - O Next.js 15.2.4 exibe avisos no console sobre `params` e `searchParams` precisarem ser 'awaited' em Server Components. Diversas abordagens de refatoração foram tentadas sem sucesso. A solução temporária é ignorar os avisos, pois a funcionalidade não está quebrada.
    *   **Atualização de Caminhos de Imagem:** [Resolvido] - 28-04-2025 - Garantir que *todas* as referências de imagem no código fossem atualizadas após mover os arquivos para as subpastas em `public/`. Foi necessário revisar múltiplos componentes e páginas.
    *   **Erros de Tipo na Paginação da Busca:** [Resolvido] - 28-04-2025 - Corrigidos erros de tipo ao implementar a paginação em `/blogflorescerhumano/buscar/page.tsx`. O problema principal era que os tipos gerados pelo Supabase não refletiam corretamente a estrutura de retorno da função RPC `search_articles_paginated` (retornando `Json` em vez de um objeto tipado). A solução envolveu regenerar os tipos e corrigir manualmente a definição `Returns` em `types/supabase.ts`.
    *   **Campo de Busca Duplicado:** [Resolvido] - 28-04-2025 - Removida a chamada duplicada do `SearchForm` na página de busca.
    *   **Erros de Tipo na Paginação de Tags:** [Resolvido] - 26-04-2025 - Corrigidos erros de tipo ao implementar a paginação em `/tags/[slug]/page.tsx`. Os problemas envolviam o nome incorreto da tabela de junção (`artigo_tags` vs `artigos_tags`) e as props esperadas pelo componente `PaginationControls` (`totalCount` vs `totalPages`, `basePath`).
    *   **Compatibilidade de Caminhos de Imagem:** [Resolvido/Recomendação] - 26-04-2025 - Discutido o uso de `/` vs `\` nos caminhos de imagem salvos no Supabase. Recomendado usar `/` para compatibilidade universal, embora `\` possa funcionar em desenvolvimento Windows.
    *   **Arquivo `lib/supabase/queries.ts` Desatualizado:** [Resolvido] - 26-04-2025 - O arquivo continha nomes de tabelas/colunas incorretos e não utilizava a instância `supabaseServer` corretamente. Foi corrigido para refletir o esquema atual do banco de dados e a configuração do projeto.
    *   **Erro na Página `/sobre`:** [Resolvido] - 25-04-2025 - O erro "The default export is not a React Component" foi corrigido.
    *   **Erro Interno React (`No lowest priority node found`):** [Resolvido/Não recorrente] - O erro transitório não ocorreu novamente.
    *   **Localização Incorreta de Componentes:** [Resolvido] - 25-04-2025 - Componentes do blog (`BlogHeader`, `BlogFooter`) foram inicialmente criados fora da pasta `app/blogflorescerhumano/` e movidos para o local correto (`app/blogflorescerhumano/components/`).
    *   **Artigo não listado:** [Resolvido] - 25-04-2025 - Um artigo não aparecia na listagem devido a um `slug` ausente na categoria associada. Corrigido no Supabase.
    *   **E-mails não entregues ou caindo em Promoções:** [Resolvido/Parcial] - 29-04-2025 - Ajustado o conteúdo dos e-mails para ser mais pessoal, adicionado orientações para o usuário e revisado o remetente. A entrega melhorou, mas a classificação em "Promoções" pode continuar ocorrendo devido a políticas do Gmail. Monitoramento contínuo recomendado.
    *   **Logs Expostos em Produção:** [Resolvido] - 29-04-2025 - Removidos logs detalhados de sucesso dos scripts de envio em massa, mantendo apenas logs de erro e um resumo final.
    *   **Variáveis de Ambiente em Scripts:** [Resolvido] - 29-04-2025 - Garantido o carregamento correto das variáveis do `.env.local` nos scripts de desenvolvimento usando o pacote `dotenv`.

*   **Atualizações de Dependências/Integrações:**
    *   **Adição do pacote `tsx`:** [ADICIONADO] - 29-04-2025 - Instalado o pacote `tsx` para facilitar a execução de scripts TypeScript no terminal sem necessidade de compilação prévia.
    *   **Adição do pacote `dotenv`:** [ADICIONADO] - 29-04-2025 - Instalado e utilizado para garantir o carregamento das variáveis de ambiente nos scripts de desenvolvimento.

## 3. Próximos Passos (Atualizados)

1.  **[Concluído] - 2025-04-29** - Implementar e documentar o envio em massa de e-mails da newsletter, com template humanizado e logs ajustados.
2.  **[Em Progresso] - 2025-04-29** - Implementar opção de reenvio do e-mail de confirmação para e-mails pendentes.
3.  **[Pendente]** - Monitorar entregabilidade e reputação dos e-mails no painel do Resend e ajustar conteúdo conforme necessário.
4.  **[Pendente]** - Finalizar personalização do layout dos e-mails de confirmação e cancelamento (HTML/CSS, logo, assinatura, etc).
5.  **[Pendente]** - Revisar e documentar o fluxo final da newsletter para produção (prints, exemplos, instruções).

## 4. Tarefas Pendentes (Priorizadas)

1.  **Funcionalidade de Newsletter:**
    *   **[Concluído] - 28-04-2025** - Criar componente de formulário de inscrição (`NewsletterBlogForm.tsx`) usando `react-hook-form` e `zod`.
    *   **[Concluído] - 28-04-2025** - Criar Server Action (`newsletterBlogActions.ts`) para receber email e validar.
    *   **[Concluído] - 29-04-2025** - Implementar lógica de backend na Server Action para salvar e-mails no Supabase (verificação de duplicidade e inserção inicial feita).
    *   **[Concluído] - 29-04-2025** - Adicionar o `NewsletterBlogForm` ao `BlogFooter.tsx`.
    *   **[Em Progresso] - 29-04-2025** - Considerar confirmação de e-mail (double opt-in). Isso envolve envio de email e API route de confirmação.
*   **Passo a passo para finalizar a newsletter (double opt-in):**
            1. **[Concluído] - 29-04-2025** - Finalizar configuração e validação do domínio de envio no painel do Resend (adicionar registros DNS e verificar domínio).
            2. **[Concluído] - 29-04-2025** - Testar entregabilidade real dos e-mails (inclusive fora do ambiente localhost).
            3. **[Em Progresso] - 29-04-2025** - Personalizar layout do e-mail de confirmação (HTML/CSS, logo, assinatura, etc).
            4. **[Pendente]** - Implementar opção de reenvio do e-mail de confirmação para e-mails pendentes.
            5. **[Pendente]** - Testar o fluxo completo: inscrição, confirmação, reenvio, mensagens e etapas.
            6. **[Pendente]** - Revisar e documentar o fluxo final para produção (prints, exemplos, instruções).
            7. **[Pendente]** - (Opcional) Monitorar entregabilidade e reputação dos e-mails no painel do Resend.
2.  **Revisar e Implementar RLS (Row Level Security):**
    *   **[Em Progresso] - 29-04-2025** - Analisar tabelas (`artigos`, `categorias`, `tags`, `newsletter_assinantes`, etc.).
    *   **[Pendente]** - Definir e aplicar políticas de segurança no Supabase para garantir que apenas dados públicos sejam acessíveis sem autenticação e que operações de escrita/atualização sejam restritas.
3.  **Finalizar SEO:**
    *   **[Em Progresso] - 29-04-2025** - Verificar e ajustar `sitemap.ts` para incluir todas as páginas relevantes (categorias, artigos, tags, etc.).
    *   **[Pendente]** - Verificar e ajustar `robots.ts`.
    *   **[Pendente]** - Garantir metadados dinâmicos (título, descrição, Open Graph) em todas as páginas que ainda não os possuem (ex: `/artigos`, `/tags`, `/materiais`, `/midias`).
4.  **Refinar Navegação (Footer):**
    *   **[Pendente]** - Revisar os links no `BlogFooter.tsx` e garantir que apontem para as seções corretas do blog ou do site principal, conforme apropriado.
5.  **Refatorar/Melhorar Página de Artigo (`/[categoria]/[slug]/page.tsx`):**
    *   **[Pendente]** - Analisar o código em busca de oportunidades de otimização, melhor legibilidade ou funcionalidades adicionais (ex: artigos relacionados, comentários - se planejado).
6.  **Páginas `/materiais` e `/midias`:**
    *   **[Pendente]** - Definir o conteúdo e a estrutura exata dessas páginas.
    *   **[Pendente]** - Implementar a busca de dados (se necessário) e a interface.
7.  **Página de Tags (`/tags/[slug]`):**
    *   **[Pendente]** - Verificar se a paginação está implementada e funcionando corretamente (similar à página de categorias).

## 5. Notas e Observações Gerais (Atualizadas)

*   **[NOTA] Avisos Next.js 15 (`params`/`searchParams`):** [NOTA] - 28-04-2025 - A versão 15.2.4 do Next.js exibe avisos no console de desenvolvimento sobre `params` e `searchParams` precisarem ser 'awaited' em Server Components. Após tentativas de refatoração sem sucesso, a decisão atual é ignorar esses avisos, pois a funcionalidade do site não está comprometida. Um downgrade foi considerado, mas descartado para evitar perda de recursos e potenciais novos problemas. Monitorar futuras atualizações do Next.js.
*   **[NOTA] Paginação:** Implementada nas páginas `/artigos`, `/tags/[slug]`, `/buscar`, `/blogflorescerhumano/categorias` e `/blogflorescerhumano/[categoria]/page.tsx`.
*   **[NOTA] Correção Manual de Tipos Supabase:** Foi necessário corrigir manualmente o tipo de retorno da RPC `search_articles_paginated` em `types/supabase.ts` após a geração automática. Estar ciente de que isso pode ser necessário para outras RPCs complexas.
*   **[NOTA] Abordagem Híbrida de Busca de Dados:** Decidiu-se por usar `lib/supabase/queries.ts` para buscas genéricas/reutilizáveis e manter buscas diretas nas páginas (`page.tsx`) para casos muito específicos ou dependentes de múltiplos parâmetros de rota.
*   **[NOTA] Página de Listagem de Categorias:** A página `app/blogflorescerhumano/categorias/page.tsx` já está implementada e funcional, buscando e exibindo as categorias com links.
*   **[CRUCIAL] Armazenamento de Imagens:** Imagens do blog agora são carregadas de `/public/blogflorescerhumano/` e imagens do site principal de `/public/psicologodanieldantas/`. O campo `imagem_capa_arquivo` no Supabase deve conter o caminho relativo dentro da pasta do blog (ex: `categoria/arquivo.png`), preferencialmente usando barras normais (`/`).
*   **[CRUCIAL] Organização de Arquivos do Blog:** Manter **todos** os arquivos específicos do blog (componentes, páginas, hooks, etc.) estritamente dentro da pasta `app/blogflorescerhumano/`. Usar subpastas (`components`, `hooks`, etc.) dentro dela conforme necessário. Utilizar sufixos como `Blog` em nomes de arquivos (ex: `BlogHeader.tsx`, `useFetchBlogPosts.ts`) sempre que possível para clareza, respeitando as convenções do Next.js. **Evitar duplicar estruturas de pastas fora de `app/blogflorescerhumano/`.**
*   **[NOTA] Lógica de Busca de Dados:** A estratégia adotada é:
    *   Manter a lógica de busca específica da página (ex: buscar artigo por slug da URL) dentro do Server Component (`page.tsx`) correspondente.
    *   Centralizar funções de busca genéricas e reutilizáveis (ex: buscar todas as categorias, todos os artigos publicados) no arquivo `lib/supabase/queries.ts` (agora corrigido e funcional).
*   **[NOTA] Localização Config Supabase:** A pasta `lib/supabase/` está na raiz do projeto (`lib/`), não dentro do módulo do blog, o que é aceitável para código compartilhado.
*   **[NOTA] Estrutura Interna do Módulo Blog:** A estrutura interna detalhada no `doc-integracao...` (com `services`, `components/Category`, etc.) foi simplificada. A lógica de busca de dados está integrada nas páginas (`page.tsx`) e os componentes específicos estão em `app/blogflorescerhumano/components/`.
*   **[NOTA] Estrutura de Componentes UI:** Componentes de UI básicos (shadcn/ui) estão em `components/ui/` (raiz) para uso global. Componentes específicos do blog estão em `app/blogflorescerhumano/components/`. Não criar `app/blogflorescerhumano/components/ui/` a menos que estritamente necessário para variantes de estilo exclusivas do blog.
*   **[NOTA] Páginas de Categoria:** As estruturas de página `app/blogflorescerhumano/categorias/page.tsx` (listagem geral) e `app/blogflorescerhumano/[categoria]/` (listagem por categoria) existem.
*   **[CRUCIAL] Qualidade do Código:** Manter o código limpo, organizado e bem comentado para facilitar a manutenção e colaboração futuras.
*   [Documentação de Planejamento](c:\\DevDriverRepo\\landing-page-psiblog-vscode-insiders\\docs\\doc-integracao-psidanieldantas-florescerhumano.md) - Link para o documento detalhado inicial.
*   O erro na página `/sobre` foi resolvido.
*   As páginas `/sobre` e `/contato` estão funcionalmente completas.
*   O `middleware.ts` usa `@supabase/auth-helpers-nextjs` (obsoleto, mas funcional).
*   **Prioridade Atual:** Implementar paginação na página de categorias (`/blogflorescerhumano/[categoria]/page.tsx`).
*   O componente `ShareButtons.tsx` está funcional.

## 5. Diretrizes de Arquitetura Fundamentais

Esta seção detalha decisões arquiteturais cruciais que devem ser sempre seguidas para manter a organização e manutenibilidade do projeto.

### 5.1. Centralização dos Arquivos do Blog em `app/blogflorescerhumano/`

A insistência em manter **todos** os arquivos específicos do blog (componentes, páginas, hooks, utils, etc.) estritamente dentro da pasta `app/blogflorescerhumano/` é crucial pelas seguintes razões:

1.  **Clareza e Organização:** Define um limite claro. Qualquer pessoa (incluindo a IA assistente) que trabalhe no blog saberá que *tudo* relacionado a ele está contido nessa pasta. Não há necessidade de procurar em outros diretórios (`components/` raiz, `hooks/` raiz, etc.) por arquivos do blog. Isso torna a navegação no projeto muito mais rápida e intuitiva.
2.  **Manutenção Simplificada:** Se precisarmos alterar um componente usado apenas no blog (como o `BlogHeader`), sabemos exatamente onde ele está (`app/blogflorescerhumano/components/BlogHeader.tsx`). Se tivéssemos uma estrutura duplicada (por exemplo, `components/blogflorescerhumano/`), poderíamos acidentalmente editar o arquivo errado ou esquecer de atualizar uma cópia, levando a inconsistências e bugs difíceis de rastrear.
3.  **Prevenção de Ambiguidade:** Evita a confusão sobre qual versão de um arquivo ou componente deve ser usada. Se existissem duas pastas `components` para o blog, qual delas conteria a versão mais recente ou correta? Manter uma única fonte de verdade elimina essa ambiguidade.
4.  **Consistência Arquitetural:** Garante que o módulo do blog permaneça coeso e logicamente separado do resto da aplicação (o site principal do psicólogo Daniel Dantas). Isso reforça a separação de conceitos e ajuda a manter a arquitetura do projeto limpa.
5.  **Facilita a Colaboração e Integração:** Torna mais fácil para novos desenvolvedores (ou a IA assistente) entenderem a estrutura e contribuírem sem introduzir desorganização.

Em resumo, evitar a duplicação de pastas e centralizar os arquivos do blog em `app/blogflorescerhumano/` não é apenas uma questão de preferência, mas uma prática fundamental para garantir que o projeto seja fácil de entender, manter e escalar de forma organizada e consistente.

*   **[ADICIONAR AQUI NOVAS FUNCIONALIDADES IMPLEMENTADAS DESDE 25-04-2025]**
