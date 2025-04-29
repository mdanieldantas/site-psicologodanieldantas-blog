import { getSupabaseServiceRoleClient } from '@/lib/supabase/server'; // Importa o helper
import { notFound, redirect } from 'next/navigation';

export default async function ConfirmarNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) { // Corrige tipo de searchParams
  const { token } = await searchParams; // Usa await para obter o token

  if (!token) {
    return <div>Token de confirmação ausente. Verifique o link enviado por e-mail.</div>;
  }

  // Buscar assinante pelo token usando o cliente com service_role
  const supabase = getSupabaseServiceRoleClient(); // Usa o cliente que bypassa RLS
  const { data: subscriber, error } = await supabase
    .from('newsletter_assinantes')
    .select('id, status_confirmacao, token_confirmacao') // Adiciona token_confirmacao ao select para debug
    .eq('token_confirmacao', token)
    .maybeSingle();

  console.log('DEBUG NEWSLETTER (Service Role):', { token, subscriber, error }); // Log atualizado

  if (error) {
    return <div>Erro ao validar o token. Tente novamente mais tarde.</div>;
  }

  if (!subscriber) {
    return <div>Token inválido ou já utilizado.</div>;
  }

  if (subscriber.status_confirmacao === 'confirmado') {
    return <div>Seu e-mail já está confirmado! Obrigado por participar da newsletter.</div>;
  }

  // Atualizar status para confirmado (também usa o cliente service_role)
  const { error: updateError } = await supabase
    .from('newsletter_assinantes')
    .update({ status_confirmacao: 'confirmado', data_confirmacao: new Date().toISOString(), token_confirmacao: null })
    .eq('id', subscriber.id);

  if (updateError) {
    return <div>Erro ao confirmar sua inscrição. Por favor, tente novamente.</div>;
  }

  return <div>Inscrição confirmada com sucesso! Agora você receberá nossas novidades :)</div>;
}
