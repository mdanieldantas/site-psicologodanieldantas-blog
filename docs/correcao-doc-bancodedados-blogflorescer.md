# Correções para Documentação do Banco de Dados (doc-integracao)

Este documento lista as correções e atualizações necessárias para os capítulos sobre o banco de dados no arquivo `doc-integracao-psidanieldantas-florescerhumano.md`, com base no estado atual do schema e funcionalidades implementadas.

---

## Correções Sugeridas

1.  **Seção/Capítulo:** Descrição da Tabela `artigos`
    *   **Correção:** Adicionar a coluna `fts` (tipo `tsvector`).
    *   **Justificativa:** Esta coluna foi adicionada para implementar a funcionalidade de Busca Full-Text (FTS) no título e conteúdo dos artigos. Ela é populada automaticamente (provavelmente via trigger, combinando `titulo` e `conteudo`) e usada nas consultas de busca para otimizar a performance.

2.  **Seção/Capítulo:** Exemplos de SQL (Povoamento de Tabelas) / `INSERT INTO artigos`
    *   **Correção:** Substituir completamente o exemplo de `INSERT INTO artigos` no `doc-integracao...`. O exemplo atual está malformado (sintaxe incorreta, valores incompletos). O novo exemplo deve seguir a sintaxe SQL padrão `INSERT INTO artigos (coluna1, coluna2, ...) VALUES (valor1, valor2, ...), (valor1, valor2, ...);` e incluir todas as colunas relevantes (exceto `id` se for auto-incrementado e `fts` que é gerado). Recomenda-se usar o conteúdo do arquivo `docs/artigos_rows.sql` como base para um exemplo correto e completo.
    *   **Justificativa:** O exemplo atual no `doc-integracao...` não é funcional, não reflete a estrutura correta da tabela e pode confundir o usuário.

3.  **Seção/Capítulo:** Funcionalidades do Banco de Dados / Consultas (ou criar nova seção "Busca Avançada")
    *   **Correção:** Adicionar descrição detalhada da funcionalidade de Busca Full-Text (FTS). Explicar o propósito da coluna `fts`, o uso do operador `@@` com a função `websearch_to_tsquery`, e a importância da configuração de idioma `'portuguese'` para buscas eficazes em português.
    *   **Justificativa:** A FTS é uma funcionalidade central para a busca de artigos e sua implementação e uso precisam ser documentados para desenvolvedores e administradores.

4.  **Seção/Capítulo:** Funcionalidades do Banco de Dados / Consultas (ou criar nova seção "Funções Customizadas")
    *   **Correção:** Adicionar descrição detalhada da função RPC (Remote Procedure Call) `search_articles_fts_or_author(search_term text)`. Documentar:
        *   **Propósito:** Realizar uma busca combinada que retorna artigos correspondentes ao `search_term` via Busca Full-Text (na coluna `fts`) OU pelo nome do autor (na tabela `autores`, coluna `nome`).
        *   **Parâmetro:** `search_term` (tipo `text`) - O termo a ser buscado.
        *   **Retorno:** Uma tabela (`SETOF artigos` ou similar, mas especificamente os campos selecionados dentro da função) contendo as colunas: `id`, `titulo`, `slug`, `resumo`, `imagem_capa_arquivo`, `data_publicacao`, e `categoria_slug` (obtido via `JOIN` com a tabela `categorias`).
        *   **Uso:** Explicar que esta função é chamada pela aplicação Next.js (via `supabaseClient.rpc(...)`) para popular os resultados da página de busca.
    *   **Justificativa:** Esta função RPC customizada é a principal forma como a busca funciona atualmente no blog, combinando FTS e busca por autor, e sua existência, parâmetros e retorno devem ser claramente documentados.

5.  **Seção/Capítulo:** Geral (Revisão de Nomenclaturas e Consistência)
    *   **Correção:** Realizar uma revisão completa em todas as seções que descrevem o banco de dados para garantir que:
        *   Todos os nomes de tabelas (`artigos`, `autores`, `categorias`, `subcategorias`, `tags`, `artigos_tags`, `newsletter_assinantes`) estejam corretos.
        *   Todos os nomes de colunas dentro de cada tabela estejam corretos e consistentes com o schema atual (conforme imagens e arquivos `.sql` na pasta `docs`).
        *   Os tipos de dados mencionados (ex: `text`, `timestamptz`, `bigint`, `tsvector`) estejam corretos.
        *   As descrições dos relacionamentos (chaves estrangeiras como `autor_id`, `categoria_id`) estejam precisas.
    *   **Justificativa:** Assegura que a documentação seja uma referência precisa e confiável da estrutura atual do banco de dados, evitando confusões causadas por informações desatualizadas.

