import { getSupabaseServiceRoleClient } from '@/lib/supabase/server'; // Importa o helper
import { notFound, redirect } from 'next/navigation';

export default async function ConfirmarNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return <div style={{ color: 'red' }}>Token de confirmação ausente. Verifique o link enviado por e-mail.</div>;
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data: subscriber, error } = await supabase
    .from('newsletter_assinantes')
    .select('id, status_confirmacao, token_confirmacao, token_expires_at') // <-- Selecionar expiração
    .eq('token_confirmacao', token)
    .maybeSingle();

  // Log de debug removido

  if (error) {
    return <div style={{ color: 'red' }}>Erro ao validar o token. Tente novamente mais tarde.</div>;
  }

  // Verifica se o assinante existe E se o token não expirou
  if (!subscriber || (subscriber.token_expires_at && new Date(subscriber.token_expires_at) < new Date())) {
    // Se expirou ou não existe, invalida o token no banco para segurança (se existir)
    if (subscriber) {
        await supabase
            .from('newsletter_assinantes')
            .update({ token_confirmacao: null, token_expires_at: null })
            .eq('id', subscriber.id);
    }
    return <div style={{ color: 'red' }}>Token inválido, expirado ou já utilizado. Por favor, inscreva-se novamente.</div>; // Mensagem unificada
  }


  if (subscriber.status_confirmacao === 'confirmado') {
    return <div style={{ color: 'green' }}>Seu e-mail já está confirmado! Obrigado por participar da newsletter.</div>;
  }

  // Atualizar status para confirmado e limpar token/expiração
  const { error: updateError } = await supabase
    .from('newsletter_assinantes')
    .update({
      status_confirmacao: 'confirmado',
      data_confirmacao: new Date().toISOString(),
      token_confirmacao: null,
      token_expires_at: null // <-- Limpar expiração
     })
    .eq('id', subscriber.id);

  if (updateError) {
    return <div style={{ color: 'red' }}>Erro ao confirmar sua inscrição. Por favor, tente novamente.</div>;
  }

  return <div style={{ color: 'green' }}>Inscrição confirmada com sucesso! Agora você receberá nossas novidades :)</div>;
}