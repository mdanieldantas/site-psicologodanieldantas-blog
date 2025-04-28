import { supabaseServer } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';

export default async function ConfirmarNewsletterPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;

  if (!token) {
    return <div>Token de confirmação ausente. Verifique o link enviado por e-mail.</div>;
  }

  // Buscar assinante pelo token
  const supabase = supabaseServer;
  const { data: subscriber, error } = await supabase
    .from('newsletter_assinantes')
    .select('id, status_confirmacao')
    .eq('token_confirmacao', token)
    .maybeSingle();

  if (error) {
    return <div>Erro ao validar o token. Tente novamente mais tarde.</div>;
  }

  if (!subscriber) {
    return <div>Token inválido ou já utilizado.</div>;
  }

  if (subscriber.status_confirmacao === 'confirmado') {
    return <div>Seu e-mail já está confirmado! Obrigado por participar da newsletter.</div>;
  }

  // Atualizar status para confirmado
  const { error: updateError } = await supabase
    .from('newsletter_assinantes')
    .update({ status_confirmacao: 'confirmado', data_confirmacao: new Date().toISOString(), token_confirmacao: null })
    .eq('id', subscriber.id);

  if (updateError) {
    return <div>Erro ao confirmar sua inscrição. Por favor, tente novamente.</div>;
  }

  return <div>Inscrição confirmada com sucesso! Agora você receberá nossas novidades :)</div>;
}
