# Guia de Inicialização do Projeto (com npm)

Este guia descreve os passos para configurar e iniciar o ambiente de desenvolvimento local deste projeto Next.js utilizando o gerenciador de pacotes `npm`.

**Pré-requisitos:**
*   Node.js instalado (que inclui `npm`). Versões recentes do Node.js e npm são recomendadas.
*   Variáveis de ambiente Supabase configuradas (veja a seção "Configuração do Supabase").

**Passos:**

1.  **Navegar até a Pasta do Projeto:**
    *   Abra seu terminal (como PowerShell, Git Bash, CMD, etc.).
    *   Use o comando `cd` para entrar no diretório raiz do projeto:
        ```powershell
        cd "c:\\DevDriverRepo\\landing-page-psiblog-vscode-insiders"
        ```
        *(Ajuste o caminho se necessário)*

2.  **Instalar as Dependências do Projeto:**
    *   Dentro da pasta do projeto, execute o comando de instalação do `npm`. Ele lerá o arquivo `package.json` e usará o `package-lock.json` para instalar as versões corretas das dependências:
        ```powershell
        npm install
        ```
    *   **Observação sobre Peer Dependencies:** O `npm` é rigoroso com conflitos de `peer dependencies`. Se você encontrar erros `ERESOLVE` durante a instalação, pode ser necessário atualizar pacotes específicos para versões compatíveis ou, como último recurso temporário, usar `npm install --legacy-peer-deps`.

3.  **Configuração do Supabase (Autenticação e Middleware):**
    *   Este projeto utiliza Supabase para autenticação. A configuração inicial envolve um middleware para gerenciar as sessões do usuário.
    *   **Contexto:** Durante o desenvolvimento, encontramos um `TypeError` ao usar a função `createMiddlewareClient` do pacote `@supabase/ssr`. Como solução alternativa, utilizamos o pacote `@supabase/auth-helpers-nextjs`.
    *   **Instalação Específica (se necessário):** Embora as dependências principais já devam estar no `package.json`, caso precise reinstalar ou garantir as versões corretas para esta solução, use:
        ```powershell
        npm install @supabase/auth-helpers-nextjs@latest @supabase/supabase-js@latest
        ```
        *Nota: Você verá avisos informando que `@supabase/auth-helpers-nextjs` está obsoleto e recomendando `@supabase/ssr`. No entanto, esta solução com `auth-helpers` está funcional no momento.*
    *   **Código do Middleware (`middleware.ts`):** Certifique-se de que seu arquivo `middleware.ts` esteja configurado para importar `createMiddlewareClient` do pacote correto:
        ```typescript
        // filepath: middleware.ts
        import { NextResponse } from "next/server";
        import type { NextRequest } from "next/server";
        // Importa do pacote auth-helpers-nextjs
        import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

        export async function middleware(request: NextRequest) {
          const response = NextResponse.next();

          // Cria o cliente Supabase para o middleware
          const supabase = createMiddlewareClient({ req: request, res: response });

          // Atualiza a sessão se necessário
          await supabase.auth.getSession();

          // ... (lógica de cabeçalhos existente)

          return response;
        }

        export const config = {
          matcher: [
            '/((?!api|_next/static|_next/image|favicon.ico).*)',
          ],
        };
        ```
    *   **Variáveis de Ambiente:** Crie um arquivo `.env.local` na raiz do projeto (se ainda não existir) e adicione suas chaves do Supabase:
        ```env
        # .env.local
        NEXT_PUBLIC_SUPABASE_URL=SUA_URL_SUPABASE
        NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE
        ```
        Substitua `SUA_URL_SUPABASE` e `SUA_CHAVE_ANON_SUPABASE` pelos valores do seu projeto Supabase. **Nunca** adicione este arquivo ao controle de versão (ele já deve estar no `.gitignore`).

4.  **Iniciar o Servidor de Desenvolvimento Local:**
    *   Após a instalação das dependências e configuração do Supabase, inicie o servidor de desenvolvimento do Next.js:
        ```powershell
        npm run dev
        ```

5.  **Acessar o Projeto no Navegador:**
    *   O terminal exibirá uma mensagem indicando que o servidor está rodando, geralmente em `http://localhost:3000`.
    *   Abra seu navegador e acesse esse endereço.
    *   O servidor recarregará automaticamente a página ao detectar alterações no código.

6.  **Parar o Servidor de Desenvolvimento:**
    *   Para parar o servidor, volte ao terminal onde ele está rodando e pressione `Ctrl + C`.
