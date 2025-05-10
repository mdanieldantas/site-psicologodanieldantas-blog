import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, confirmationToken: string, unsubscribeToken: string) { // Adiciona unsubscribeToken
  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blogflorescerhumano/confirmar-newsletter?token=${confirmationToken}`;
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blogflorescerhumano/cancelar-newsletter?token=${unsubscribeToken}`; // Cria URL de cancelamento
  const subject = 'Confirme sua inscrição na Newsletter do Florescer Humano';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #735B43; margin-bottom: 5px;">Florescer Humano</h2>
        <h3 style="color: #8A7A68; margin-top: 0;">Confirmação de Inscrição</h3>
      </div>
      
      <p>Olá!</p>
      
      <p>Recebemos seu pedido de inscrição na newsletter do <strong>Blog Florescer Humano</strong>.</p>
      
      <p>Para completar sua inscrição e começar a receber nossos conteúdos exclusivos, por favor confirme seu e-mail clicando no botão abaixo:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmUrl}" style="background-color: #735B43; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Confirmar Minha Inscrição</a>
      </div>
      
      <p>Se o botão acima não funcionar, você também pode copiar e colar o link abaixo no seu navegador:</p>
      <p style="word-break: break-all; font-size: 14px; color: #666666; margin-bottom: 30px;">${confirmUrl}</p>
      
      <p>Este link de confirmação é válido por 24 horas.</p>
      
      <p>Se você não solicitou esta inscrição, pode simplesmente ignorar este e-mail.</p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
      
      <p style="font-size: 0.9em; color: #666;">
        © ${new Date().getFullYear()} Blog Florescer Humano | Para cancelar sua inscrição a qualquer momento, <a href="${unsubscribeUrl}" style="color: #b91c1c;">clique aqui</a>.
      </p>
    </div>
  `;

// ...existing code...
  return resend.emails.send({
    from: 'Florescer Humano Blog - Psi Daniel Dantas <newsletter-no-reply@psicologodanieldantas.com.br>', // Alterado para o formato solicitado
    to: email,
    subject,
    html,
  });
}
