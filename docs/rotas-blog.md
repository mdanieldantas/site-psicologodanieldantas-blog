# Rotas do Módulo Blog Florescer Humano

Este documento lista as principais rotas e os arquivos correspondentes dentro do módulo `blogflorescerhumano`.

## Rotas Principais

*   **`/blogflorescerhumano`**
    *   **Descrição:** Página inicial do blog, exibindo os artigos mais recentes.
    *   **Arquivo:** `app/blogflorescerhumano/page.tsx`

*   **`/blogflorescerhumano/sobre`**
    *   **Descrição:** Página estática "Sobre" do blog.
    *   **Arquivo:** `app/blogflorescerhumano/sobre/page.tsx`

*   **`/blogflorescerhumano/contato`**
    *   **Descrição:** Página estática de "Contato" do blog.
    *   **Arquivo:** `app/blogflorescerhumano/contato/page.tsx`

*   **`/blogflorescerhumano/materiais`**
    *   **Descrição:** Página estática "Materiais" do blog (e-books, guias, etc.).
    *   **Arquivo:** `app/blogflorescerhumano/materiais/page.tsx`

*   **`/blogflorescerhumano/midias`**
    *   **Descrição:** Página estática "Mídias Recomendadas" do blog (livros, filmes, etc.).
    *   **Arquivo:** `app/blogflorescerhumano/midias/page.tsx`

*   **`/blogflorescerhumano/categorias`**
    *   **Descrição:** Lista todas as categorias de artigos disponíveis.
    *   **Arquivo:** `app/blogflorescerhumano/categorias/page.tsx`

*   **`/blogflorescerhumano/[categoria]`** (Rota Dinâmica)
    *   **Descrição:** Exibe todos os artigos pertencentes a uma categoria específica, identificada pelo seu `slug`.
    *   **Arquivo:** `app/blogflorescerhumano/[categoria]/page.tsx`

*   **`/blogflorescerhumano/[categoria]/[slug]`** (Rota Dinâmica)
    *   **Descrição:** Exibe o conteúdo completo de um artigo específico, identificado pelo `slug` da categoria e o `slug` do próprio artigo.
    *   **Arquivo:** `app/blogflorescerhumano/[categoria]/[slug]/page.tsx`

## Rotas Planejadas (Ainda não implementadas)

*   **`/blogflorescerhumano/artigos`**
    *   **Descrição:** Página para listar *todos* os artigos publicados, possivelmente com paginação.

*   **`/blogflorescerhumano/tags/[tag]`** (Rota Dinâmica)
    *   **Descrição:** Página para listar artigos associados a uma tag específica.

## Componentes Reutilizáveis

*   `app/blogflorescerhumano/components/BlogHeader.tsx`: Cabeçalho padrão do blog.
*   `app/blogflorescerhumano/components/BlogFooter.tsx`: Rodapé padrão do blog.
*   `app/blogflorescerhumano/components/ArticleCardBlog.tsx`: Card para exibir um resumo do artigo em listas.
*   `app/blogflorescerhumano/components/GiscusComments.tsx`: Componente para exibir a seção de comentários Giscus.
*   `app/blogflorescerhumano/components/SearchForm.tsx`: Formulário de busca para artigos.
*   `app/blogflorescerhumano/contato/components/ContatoFormulario.tsx`: Formulário específico da página de contato.

## Layout

*   `app/blogflorescerhumano/layout.tsx`: Layout principal aplicado a todas as páginas dentro do módulo do blog.

## URLs para Teste Local (Copiar e Colar)

*   Página Inicial: `http://localhost:3000/blogflorescerhumano`
*   Sobre: `http://localhost:3000/blogflorescerhumano/sobre`
*   Categorias: `http://localhost:3000/blogflorescerhumano/categorias`

### Artigos Publicados (Exemplos):

*   **Empatia:** `http://localhost:3000/blogflorescerhumano/relacionamentos-conexoes-humanas/importancia-empatia-relacoes-humanas` (Categoria ID 4)
*   **ACP:** `http://localhost:3000/blogflorescerhumano/psicologia-humanista-abordagens/introducao-abordagem-centrada-pessoa-acp` (Categoria ID 2)
*   **Mindfulness:** `http://localhost:3000/blogflorescerhumano/bem-estar-emocional-saude-mental/exercicios-simples-mindfulness-dia-a-dia` (Categoria ID 3)
*   **Autocompaixão:** `http://localhost:3000/blogflorescerhumano/autoconhecimento-desenvolvimento-pessoal/cultivando-autocompaixao-caminho-gentil` (Categoria ID 1)

**Nota:** Estas URLs agora usam os slugs corretos das tabelas `categorias` e `artigos`.
