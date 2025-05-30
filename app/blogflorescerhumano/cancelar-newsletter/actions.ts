'use server';

import { redirect } from 'next/navigation';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { z } from 'zod';

const UnsubscribeSchema = z.object({
  token: z.string().min(1, { message: 'Token inválido.' }),
});

export async function cancelNewsletterAction(formData: FormData) {
  const validatedFields = UnsubscribeSchema.safeParse({
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    throw new Error('Token inválido.');
  }

  const { token } = validatedFields.data;
  const supabase = getSupabaseServiceRoleClient();

  try {
    // 1. Buscar assinante pelo token de cancelamento
    const { data: subscriber, error: findError } = await supabase
      .from('newsletter_assinantes')
      .select('id, email, status_confirmacao')
      .eq('unsubscribe_token', token)
      .maybeSingle();

    if (findError) {
      console.error('Erro ao buscar assinante para cancelar:', findError);
      throw new Error('Erro ao processar sua solicitação.');
    }

    if (!subscriber) {
      throw new Error('Link de cancelamento inválido ou já utilizado.');
    }

    // Verifica se já está cancelado
    if (subscriber.status_confirmacao === 'cancelado') {
      throw new Error(`O e-mail ${subscriber.email} já teve a inscrição cancelada.`);
    }

    // 2. Atualizar status para 'cancelado' e limpar tokens
    const { error: updateError } = await supabase
      .from('newsletter_assinantes')
      .update({
        status_confirmacao: 'cancelado',
        token_confirmacao: null,
        token_expires_at: null,
        unsubscribe_token: null,
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Erro ao cancelar inscrição:', updateError);
      throw new Error('Erro ao processar cancelamento.');
    }

    // 3. Redirecionar para página de sucesso
    redirect('/blogflorescerhumano/cancelar-newsletter/sucesso');
    
  } catch (error) {
    console.error('Erro no cancelamento:', error);
    throw error;
  }
}
