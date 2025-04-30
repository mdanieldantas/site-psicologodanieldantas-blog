# Guia de Criação de Tags no Google Tag Manager (GTM)

Este guia detalha o processo de criação de tags e acionadores no Google Tag Manager (GTM) para rastrear eventos personalizados enviados pelo site, como os cliques nos botões de contato do WhatsApp.

**Pré-requisitos:**

*   Conta no Google Tag Manager ([https://tagmanager.google.com/](https://tagmanager.google.com/)).
*   Container do GTM criado e instalado corretamente no site (ver `components/cookie-consent.tsx`).
*   Eventos personalizados sendo enviados pelo código do site via `window.dataLayer.push({ event: 'nome_do_evento' });`.
    *   Exemplos implementados: `whatsapp_modal_aberto`, `whatsapp_formulario_enviado`.
*   ID de Métrica do Google Analytics 4 (GA4) (ex: `G-V8D9NKCXGS`).

---

## Passo 1: Criar Acionadores (Triggers)

Acionadores definem *quando* uma tag deve ser disparada. Para nossos eventos personalizados, usaremos o tipo "Evento Personalizado".

1.  **Acesse o GTM:** Faça login e selecione seu container.
2.  **Vá para "Acionadores":** No menu lateral esquerdo.
3.  **Clique em "Novo".**
4.  **Dê um nome ao acionador:** Use um nome descritivo.
    *   *Exemplo 1:* `Acionador - Evento - WhatsApp Modal Aberto`
    *   *Exemplo 2:* `Acionador - Evento - WhatsApp Formulário Enviado`
5.  **Clique em "Configuração do acionador".**
6.  **Escolha o tipo de acionador:** Selecione **"Evento personalizado"**.
7.  **Nome do evento:** Insira o nome *exato* do evento enviado pelo código.
    *   *Exemplo 1:* `whatsapp_modal_aberto`
    *   *Exemplo 2:* `whatsapp_formulario_enviado`
8.  **Este acionador dispara em:** Deixe selecionado **"Todos os eventos personalizados"**.
9.  **Clique em "Salvar".**

*Repita esses passos para cada evento personalizado que deseja rastrear.*

---

## Passo 2: Criar Tags

Tags definem *o que* deve acontecer quando um acionador é disparado (ex: enviar dados para o Google Analytics).

1.  **Vá para "Tags":** No menu lateral esquerdo.
2.  **Clique em "Nova".**
3.  **Dê um nome à tag:** Use um nome descritivo.
    *   *Exemplo 1:* `GA4 - Evento - WhatsApp Modal Aberto`
    *   *Exemplo 2:* `GA4 - Evento - WhatsApp Formulário Enviado`
4.  **Clique em "Configuração da tag".**
5.  **Escolha o tipo de tag:** Selecione **"Google Analytics: Evento do GA4"**.
6.  **Configuração do Google Analytics 4:**
    *   Selecione sua tag de configuração GA4 existente.
    *   *Se não existir:* Clique em "Nova variável...", insira seu **ID de métrica** (ex: `G-V8D9NKCXGS`) e salve a variável (ex: `Configuração GA4`).
7.  **Nome do evento:** Insira o nome *exato* do evento que esta tag representa (o mesmo nome usado no acionador e no código).
    *   *Exemplo 1:* `whatsapp_modal_aberto`
    *   *Exemplo 2:* `whatsapp_formulario_enviado`
8.  **Parâmetros do evento (Opcional):** Você pode adicionar mais informações aqui se necessário, mas para esses eventos básicos, não é obrigatório.
9.  **Propriedades do usuário (Opcional):** Similar aos parâmetros.
10. **Mais configurações / Configurações avançadas:** Geralmente, não é necessário alterar as opções padrão para eventos simples. Em "Verificações de permissão adicional", marque **"Nenhum consentimento adicional é necessário"** (pois o consentimento já é tratado pelo banner do site).
11. **Clique em "Acionamento".**
12. **Escolha o acionador:** Selecione o acionador correspondente criado no Passo 1.
    *   *Exemplo 1:* `Acionador - Evento - WhatsApp Modal Aberto`
    *   *Exemplo 2:* `Acionador - Evento - WhatsApp Formulário Enviado`
13. **Clique em "Salvar".**

*Repita esses passos para cada evento personalizado.*

---

## Passo 3: Publicar as Alterações

As tags e acionadores só entram em vigor no site após a publicação.

1.  **Clique em "Enviar"** no canto superior direito do GTM.
2.  **Adicione um "Nome da versão":** Descreva as alterações feitas.
    *   *Exemplo:* `Adiciona rastreamento de eventos do WhatsApp`
3.  **Adicione uma "Descrição da versão" (Opcional):** Detalhe o que foi implementado.
    *   *Exemplo:* `Configura tags e acionadores para whatsapp_modal_aberto e whatsapp_formulario_enviado.`
4.  **Clique em "Publicar".**

---

## Passo 4: Testar e Verificar

É crucial testar para garantir que tudo está funcionando como esperado.

1.  **Use o Modo de Visualização:** Clique em **"Visualizar"** no canto superior direito do GTM.
2.  **Insira a URL do seu site** e clique em "Connect". Uma nova aba do seu site será aberta com o painel de depuração do GTM (Tag Assistant).
3.  **Realize as ações no site:** Clique nos botões de contato do WhatsApp e envie o formulário.
4.  **Verifique no Tag Assistant:**
    *   No painel de depuração, observe a coluna da esquerda. Os eventos personalizados (`whatsapp_modal_aberto`, `whatsapp_formulario_enviado`) devem aparecer quando você realiza as ações.
    *   Clique em um evento na coluna da esquerda. Na seção "Tags Fired", a tag GA4 correspondente deve aparecer.
5.  **Verifique no Google Analytics:**
    *   Acesse sua propriedade GA4.
    *   Vá para **"Relatórios" > "Tempo Real"**.
    *   Na seção "Contagem de eventos por nome do evento", os nomes dos seus eventos (`whatsapp_modal_aberto`, `whatsapp_formulario_enviado`) devem aparecer alguns segundos/minutos após serem disparados no site.

---

Seguindo estes passos, você poderá rastrear eventos personalizados importantes do seu site diretamente no Google Analytics 4 através do Google Tag Manager.
