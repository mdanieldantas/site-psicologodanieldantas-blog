// filepath: c:\DevDriverRepo\site-psicologodanieldantas-blog\app\blogflorescerhumano\cancelar-newsletter\page.tsx
'use server';

import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache'; // Mantém se getSubscriberInfo usar
import { z } from 'zod'; // Mantém se getSubscriberInfo usar
// Importa apenas o Client Component
import { UnsubscribeForm } from './components/unsubscribe-form';
// Remove a importação de UnsubscribeState daqui

// --- Server Action Removida ---
// A definição de handleUnsubscribe, UnsubscribeState, UnsubscribeSchema foi movida para actions/newsletterBlogActions.ts

// --- Funções e Componente da Página (Server-Side) ---

async function getSubscriberInfo(token: string | undefined) {
  if (!token) {
    return { error: 'Token de cancelamento ausente.', subscriber: null };
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data: subscriber, error } = await supabase
    .from('newsletter_assinantes')
    .select('email, status_confirmacao')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar info do assinante para cancelar:', error);
    return { error: 'Erro ao validar o link de cancelamento.', subscriber: null };
  }

  if (!subscriber) {
    return { error: 'Link de cancelamento inválido ou já utilizado.', subscriber: null };
  }

   if (subscriber.status_confirmacao === 'cancelado') {
    // Retorna o e-mail mesmo se já cancelado, para exibir na mensagem de erro
    return { error: `O e-mail ${subscriber.email} já teve a inscrição cancelada.`, subscriber: { email: subscriber.email } };
  }

  return { error: null, subscriber };
}

// Componente principal da página (Server Component)
export default async function CancelarNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const { error, subscriber } = await getSubscriberInfo(token);

  // Se houve erro na busca OU se o assinante não foi encontrado (e não é erro de "já cancelado")
  if (error && !subscriber?.email) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Cancelar Inscrição</h1>
        <p className="text-red-600">{error}</p>
        {/* Adicionar link para voltar ao blog ou home */}
      </div>
    );
  }

  // Se chegou aqui, o token é válido (ou era válido e já foi cancelado)
  // Passamos apenas o token e o e-mail para o Client Component
  // A prop handleUnsubscribe foi removida
  return <UnsubscribeForm token={token!} email={subscriber!.email} />;
}
