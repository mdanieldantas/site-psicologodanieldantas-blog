# Guia de Uso da Newsletter - Blog Florescer Humano

Este documento apresenta um passo a passo completo para o uso da newsletter do Blog Florescer Humano, incluindo inscrição, confirmação, cancelamento e envio de e-mails em massa.

---

## 1. Como funciona a newsletter

- Usuários se inscrevem via formulário no site.
- Recebem um e-mail de confirmação (double opt-in) com link único.
- Após confirmar, passam a receber e-mails da newsletter.
- Podem cancelar a inscrição a qualquer momento via link de descadastro presente em todos os e-mails.

---

## 2. Fluxo de inscrição e confirmação

1. **Usuário preenche o formulário de inscrição** no rodapé do blog.
2. **O sistema salva o e-mail** no banco de dados (`newsletter_assinantes`) com status `pendente` e gera um token de confirmação e um token de descadastro.
3. **É enviado um e-mail de confirmação** com um link único para o usuário.
4. **O usuário clica no link de confirmação** e o status é atualizado para `confirmado`.
5. **A partir desse momento, o usuário está apto a receber e-mails em massa.**

---

## 3. Cancelamento de inscrição (descadastro)

- Todos os e-mails enviados contêm um link de descadastro único.
- Ao clicar, o usuário é levado para uma página de confirmação de cancelamento.
- Após confirmar, o status no banco é atualizado para `cancelado` e o usuário não recebe mais e-mails.

---

## 4. Como enviar e-mails em massa para a newsletter

### 4.1. Filtrar destinatários

Sempre envie apenas para quem tem `status_confirmacao = 'confirmado'`:

```typescript
const { data: subscribers, error } = await supabase
  .from('newsletter_assinantes')
  .select('email, nome, unsubscribe_token')
  .eq('status_confirmacao', 'confirmado');
```

### 4.2. Gerar o conteúdo do e-mail

Use o template pronto em `lib/newsletterEmailTemplate.ts`:

```typescript
import { newsletterEmailTemplate } from '@/lib/newsletterEmailTemplate';

const html = newsletterEmailTemplate({
  nome: 'Nome do Assinante',
  conteudo: '<h2>Novidades do mês</h2><p>Veja os artigos mais recentes...</p>',
  unsubscribeUrl: 'https://seusite.com/blogflorescerhumano/cancelar-newsletter?token=TOKEN_UNICO'
});
```

### 4.3. Envio em massa (exemplo com Resend)

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

for (const subscriber of subscribers) {
  const unsubscribeUrl = `https://seusite.com/blogflorescerhumano/cancelar-newsletter?token=${subscriber.unsubscribe_token}`;
  const html = newsletterEmailTemplate({
    nome: undefined, // Não usamos nome
    conteudo: `
      <h2>Olá!</h2>
      <p>Que bom ter você na nossa newsletter do <strong>Florescer Humano</strong>!</p>
      <p>Este é um e-mail de teste em massa, mas aproveito para agradecer sua inscrição e lembrar que você pode sugerir temas ou responder este e-mail a qualquer momento.</p>
      <p>
        <strong>Dica:</strong> Se este e-mail caiu na aba <b>Promoções</b> do Gmail, arraste-o para a aba <b>Principal</b> e adicione nosso endereço aos seus contatos. Assim, você não perde nenhuma novidade!
      </p>
      <p>Um abraço,<br>Daniel Dantas</p>
    `,
    unsubscribeUrl,
  });
  await resend.emails.send({
    from: 'Florescer Humano Blog <newsletter@no-reply.psicologodanieldantas.com>',
    to: subscriber.email,
    subject: 'Florescer Humano: fique por dentro das novidades!',
    html,
  });
  // (Opcional) Aguarde um pequeno intervalo entre envios
}
```

**Dicas:**
- Envie em lotes pequenos (ex: 50-100) para evitar bloqueios.
- Sempre inclua o link de descadastro.
- Teste com poucos e-mails antes de enviar para toda a base.
- Personalize o campo "from" para facilitar a identificação do remetente.
- Torne o conteúdo mais pessoal e humano para melhorar a entregabilidade.

---

## 5. Envio manual para um assinante específico

Você pode usar o mesmo template para enviar um e-mail individual, por exemplo para reenvio de confirmação ou comunicação personalizada:

```typescript
const html = newsletterEmailTemplate({
  nome: 'Fulano',
  conteudo: '<p>Seu pedido foi recebido!</p>',
  unsubscribeUrl: 'https://seusite.com/blogflorescerhumano/cancelar-newsletter?token=TOKEN_UNICO'
});
// Envie usando Resend, Nodemailer, etc.
```

---

## 6. Boas práticas e observações

- Nunca envie para quem tem status diferente de `confirmado`.
- Sempre inclua o link de descadastro.
- Personalize o conteúdo e o nome quando possível.
- Mantenha logs dos envios para rastreabilidade.
- Respeite os limites do seu provedor de e-mail.

---

## 7. Referências rápidas

- Template de e-mail: `lib/newsletterEmailTemplate.ts`
- Página de cancelamento: `/blogflorescerhumano/cancelar-newsletter`
- Página de confirmação: `/blogflorescerhumano/confirmar-newsletter`
- Tabela Supabase: `newsletter_assinantes`

---

## 8. Exemplo prático: Enviando um e-mail de teste em massa

A seguir, um passo a passo para enviar um e-mail com a mensagem "email de teste em massa" para todos os assinantes confirmados:

### 8.1. Filtrar os destinatários

Execute este código em um script Node.js (recomendado para envios em massa, pois Server Actions devem ser protegidas e usadas apenas para operações administrativas internas):

```typescript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const { data: subscribers, error } = await supabase
  .from('newsletter_assinantes')
  .select('email, nome, unsubscribe_token')
  .eq('status_confirmacao', 'confirmado');

if (error) throw error;
```

### 8.2. Gerar o conteúdo do e-mail

```typescript
import { newsletterEmailTemplate } from '@/lib/newsletterEmailTemplate';

function gerarHtml(subscriber) {
  return newsletterEmailTemplate({
    nome: subscriber.nome,
    conteudo: '<p>email de teste em massa</p>',
    unsubscribeUrl: `https://seusite.com/blogflorescerhumano/cancelar-newsletter?token=${subscriber.unsubscribe_token}`,
  });
}
```

### 8.3. Enviar os e-mails em massa (exemplo com Resend)

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

for (const subscriber of subscribers) {
  const html = gerarHtml(subscriber);
  await resend.emails.send({
    from: 'newsletter@no-reply.seudominio.com',
    to: subscriber.email,
    subject: 'Teste em Massa',
    html,
  });
  // (Opcional) Aguarde um pequeno intervalo entre envios
}
```

**Resumo:**
- O código acima envia o e-mail "email de teste em massa" para todos os assinantes confirmados.
- O template já inclui o link de descadastro personalizado para cada destinatário.
- Sempre teste com poucos e-mails antes de enviar para toda a base.

---

## 9. Como executar o envio em massa na prática

### 9.1. Criando o script de envio

1. Crie um arquivo chamado `enviar_emails_newsletter.ts` (ou `.js`) na raiz do projeto ou em uma pasta `scripts/`.
2. Copie o exemplo de código da seção 8 para esse arquivo, ajustando o conteúdo, assunto e remetente conforme necessário.
3. Certifique-se de que as variáveis de ambiente (`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `RESEND_API_KEY`) estejam corretamente configuradas no `.env.local`.

### 9.2. Executando o script

No terminal, execute:

```powershell
node enviar_emails_newsletter.ts
```

Se estiver usando TypeScript, rode antes:

```powershell
ts-node enviar_emails_newsletter.ts
```

> **Dica:** Se não tiver o `ts-node` instalado, rode `npm install -g ts-node`.


### 9.3. O que esperar

- O terminal mostrará logs de sucesso ou erro para cada envio.
- Se tudo estiver correto, todos os assinantes confirmados receberão o e-mail.
- Sempre teste com poucos destinatários antes de enviar para toda a base.

### 9.4. Segurança

- Nunca compartilhe o script com terceiros.
- Nunca exponha suas chaves de API.
- Use sempre o ambiente de produção para envios reais.

---

**Dúvidas ou sugestões? Consulte a documentação do projeto ou entre em contato com o responsável técnico.**
