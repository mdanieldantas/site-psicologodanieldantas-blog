import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, confirmationToken: string, unsubscribeToken: string) { // Adiciona unsubscribeToken
  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blogflorescerhumano/confirmar-newsletter?token=${confirmationToken}`;
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blogflorescerhumano/cancelar-newsletter?token=${unsubscribeToken}`; // Cria URL de cancelamento
  const subject = 'Confirme sua inscrição na Newsletter';
  const html = `
    <h2>Confirmação de inscrição</h2>
    <p>Olá!</p>
    <p>Para confirmar sua inscrição na newsletter, clique no link abaixo:</p>
    <p><a href="${confirmUrl}">Confirmar inscrição</a></p>
    <p>Se você não solicitou esta inscrição, ignore este e-mail.</p>
    <hr>
    <p style="font-size: 0.8em; color: #666;">
      Para cancelar sua inscrição a qualquer momento, <a href="${unsubscribeUrl}">clique aqui</a>.
    </p>
  `;

  return resend.emails.send({
    from: 'newsletter@no-reply.psicologodanieldantas.com', // Usando domínio verificado no Resend
    to: email,
    subject,
    html,
  });
}
