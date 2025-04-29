// Template de e-mail em massa para newsletter
// Use esta função para gerar o HTML do e-mail, personalizando nome, conteúdo e link de descadastro
// Exemplo de uso: const html = newsletterEmailTemplate({ nome: 'Fulano', conteudo: '<p>Olá!</p>', unsubscribeUrl: '...' })

interface NewsletterEmailTemplateProps {
  nome?: string;
  conteudo: string; // HTML principal do e-mail
  unsubscribeUrl: string;
}

export function newsletterEmailTemplate({ nome, conteudo, unsubscribeUrl }: NewsletterEmailTemplateProps): string {
  return `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px;">
        <header style="border-bottom: 1px solid #eee; margin-bottom: 24px; padding-bottom: 12px;">
          <h1 style="font-size: 1.5em; color: #2b2b2b; margin: 0;">Florescer Humano - Newsletter</h1>
        </header>
        <main style="font-size: 1.1em; color: #333;">
          ${nome ? `<p>Olá, <strong>${nome}</strong>!</p>` : ''}
          ${conteudo}
        </main>
        <footer style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 16px; font-size: 0.95em; color: #888;">
          <p style="margin-bottom: 8px;">Você está recebendo este e-mail porque se inscreveu na newsletter do blog Florescer Humano.</p>
          <p style="margin-bottom: 0;">
            Não deseja mais receber nossos e-mails?
            <a href="${unsubscribeUrl}" style="color: #b91c1c; text-decoration: underline;">Clique aqui para cancelar sua inscrição</a>.
          </p>
        </footer>
      </div>
    </div>
  `;
}
