import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blogflorescerhumano/confirmar-newsletter?token=${token}`;
  const subject = 'Confirme sua inscrição na Newsletter';
  const html = `
    <h2>Confirmação de inscrição</h2>
    <p>Olá!</p>
    <p>Para confirmar sua inscrição na newsletter, clique no link abaixo:</p>
    <p><a href="${confirmUrl}">Confirmar inscrição</a></p>
    <p>Se você não solicitou esta inscrição, ignore este e-mail.</p>
  `;

  return resend.emails.send({
    from: 'no-reply@florescerhumano.com', // Altere para seu domínio verificado no Resend
    to: email,
    subject,
    html,
  });
}
