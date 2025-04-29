'use server';

import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server'; // Usando alias @/
import type { Database } from '@/types/supabase'; // Usando alias @/
import crypto from 'crypto';
import { sendConfirmationEmail } from '@/lib/sendConfirmationEmail';
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server'; // Importa cliente service_role
import { revalidatePath } from 'next/cache'; // Importa revalidatePath

// Esquema de validação com Zod
const NewsletterSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
});

// Tipagem para o estado do formulário (para useFormState)
export interface NewsletterFormState {
  message: string;
  type: 'success' | 'error' | 'idle';
}

// Estado para o formulário de cancelamento
export interface UnsubscribeState {
  message: string;
  type: 'success' | 'error' | 'idle';
}

// Schema para cancelamento
const UnsubscribeSchema = z.object({
  token: z.string().min(1, { message: 'Token inválido.' }),
});


// --- Ações --

// Ação de Inscrição (código existente inalterado)
export async function subscribeToNewsletter(
  prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  // 1. Validar os dados do formulário
  const validatedFields = NewsletterSchema.safeParse({
    email: formData.get('email'),
  });

  // Se a validação falhar, retorna erro
  if (!validatedFields.success) {
    console.error('Erro de validação:', validatedFields.error.flatten().fieldErrors);
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] ?? 'Erro de validação desconhecido.',
      type: 'error',
    };
  }

  const { email } = validatedFields.data;
  const supabase = supabaseServer;

  try {
    // Verificar se o email já existe (opcional, mas bom para feedback)
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_assinantes')
      .select('id, status_confirmacao')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Erro ao verificar assinante existente:', checkError);
      return { message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.', type: 'error' };
    }

    if (existingSubscriber) {
      if (existingSubscriber.status_confirmacao === 'pendente') {
        return { message: 'Seu e-mail já está cadastrado, mas ainda não foi confirmado. Verifique sua caixa de entrada para o link de confirmação.', type: 'success' };
      }
      if (existingSubscriber.status_confirmacao === 'confirmado') {
        return { message: 'Este e-mail já está confirmado e inscrito na newsletter.', type: 'success' };
      }
      // fallback
      return { message: 'Este e-mail já está cadastrado.', type: 'success' };
    }

    // Gerar token de confirmação único
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    // Gerar token de cancelamento único
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    // Calcular data de expiração (24 horas a partir de agora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Inserir novo assinante com status pendente, tokens e data de expiração
    const { error: insertError } = await supabase
      .from('newsletter_assinantes')
      .insert({
        email: email,
        status_confirmacao: 'pendente',
        token_confirmacao: confirmationToken,
        token_expires_at: expiresAt.toISOString(),
        unsubscribe_token: unsubscribeToken, // <-- Salvar token de cancelamento
        data_inscricao: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Erro ao inserir novo assinante:', insertError);
      return { message: 'Ocorreu um erro ao salvar seu e-mail. Tente novamente.', type: 'error' };
    }

    // Enviar e-mail de confirmação
    try {
      // Passar o unsubscribeToken para a função de envio de e-mail
      await sendConfirmationEmail(email, confirmationToken, unsubscribeToken);
    } catch (emailError) {
      // ... tratamento de erro de e-mail ...
      console.error('Erro ao enviar e-mail de confirmação:', emailError);
      return { message: 'Inscrição pendente, mas houve um erro ao enviar o e-mail de confirmação. Tente novamente mais tarde ou contate o suporte.', type: 'error' };
    }

    return {
      message: 'Quase lá! Enviamos um link de confirmação para o seu e-mail. Verifique sua caixa de entrada (e spam).',
      type: 'success',
    };

  } catch (error) {
    console.error('Erro inesperado na inscrição:', error);
    return { message: 'Ocorreu um erro inesperado. Tente novamente.', type: 'error' };
  }
}


// Ação de Cancelamento (Movida para cá)
export async function handleUnsubscribe(
  prevState: UnsubscribeState,
  formData: FormData,
): Promise<UnsubscribeState> {
  const validatedFields = UnsubscribeSchema.safeParse({
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.token?.[0] ?? 'Token inválido.',
      type: 'error',
    };
  }

  const { token } = validatedFields.data;
  // Usa cliente com service_role para bypassar RLS
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
      return { message: 'Erro ao processar sua solicitação. Tente novamente.', type: 'error' };
    }

    if (!subscriber) {
      return { message: 'Link de cancelamento inválido ou já utilizado.', type: 'error' };
    }

     // Verifica se já está cancelado ANTES de tentar atualizar
    if (subscriber.status_confirmacao === 'cancelado') {
       return { message: `O e-mail ${subscriber.email} já teve a inscrição cancelada.`, type: 'error' }; // Retorna erro para evitar processamento desnecessário
    }


    // 2. Atualizar status para 'cancelado' e limpar tokens
    const { error: updateError } = await supabase
      .from('newsletter_assinantes')
      .update({
        status_confirmacao: 'cancelado', // Novo status
        token_confirmacao: null,
        token_expires_at: null,
        unsubscribe_token: null, // Limpa o token de cancelamento também
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Erro ao atualizar status para cancelado:', updateError);
      return { message: 'Erro ao cancelar a inscrição. Tente novamente.', type: 'error' };
    }

    // Opcional: Revalidar caminhos se necessário
    // revalidatePath('/algum/caminho');

    return { message: `Inscrição para ${subscriber.email} cancelada com sucesso.`, type: 'success' };

  } catch (error) {
    console.error('Erro inesperado no cancelamento:', error);
    return { message: 'Ocorreu um erro inesperado.', type: 'error' };
  }
}
