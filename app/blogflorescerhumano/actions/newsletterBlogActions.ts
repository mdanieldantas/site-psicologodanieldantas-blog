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
  email?: string;
  status?: 'pendente' | 'confirmado' | 'cancelado';
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

// Schema para solicitação de reenvio de confirmação
const ResendConfirmationSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
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
      message: validatedFields.error.flatten().fieldErrors.email?.[0] ?? 'Erro de validação desconhecido. Por favor, verifique se digitou um e-mail válido.',
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
    }    if (existingSubscriber) {
      if (existingSubscriber.status_confirmacao === 'pendente') {
        return { 
          message: `O e-mail ${email} já está cadastrado, mas ainda não foi confirmado. Verifique sua caixa de entrada e pasta de Spam para o link de confirmação. Caso não tenha recebido, você pode solicitar um novo e-mail de confirmação.`, 
          type: 'success',
          status: 'pendente',
          email: email 
        };
      }
      if (existingSubscriber.status_confirmacao === 'confirmado') {
        return { 
          message: `O e-mail ${email} já está confirmado e inscrito na newsletter.`, 
          type: 'success',
          status: 'confirmado',
          email: email 
        };
      }
      // fallback
      return { 
        message: `O e-mail ${email} já está cadastrado.`, 
        type: 'success',
        email: email 
      };
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
      await sendConfirmationEmail(email, confirmationToken, unsubscribeToken);    } catch (emailError) {
      console.error('Erro ao enviar e-mail de confirmação:', emailError);
      return { 
        message: `Inscrição para ${email} está pendente, mas houve um erro ao enviar o e-mail de confirmação. Você pode tentar reenviar o e-mail mais tarde ou contatar nosso suporte.`, 
        type: 'error',
        email: email,
        status: 'pendente'
      };
    }return {
      message: `Quase lá! Enviamos um link de confirmação para ${email}. Por favor, verifique sua caixa de entrada (e a pasta de Spam!) e clique no link para confirmar sua inscrição.`,
      type: 'success',
      email: email,
      status: 'pendente'
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

// Ação para reenviar e-mail de confirmação
export async function resendConfirmationEmail(
  prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  // Validar os dados do formulário
  const validatedFields = ResendConfirmationSchema.safeParse({
    email: formData.get('email'),
  });

  // Se a validação falhar, retorna erro
  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] ?? 'Erro de validação desconhecido.',
      type: 'error',
    };
  }

  const { email } = validatedFields.data;
  const supabase = getSupabaseServiceRoleClient(); // Usando cliente service role para garantir acesso

  try {
    // Verificar se o email existe e está com status pendente
    const { data: subscriber, error: checkError } = await supabase
      .from('newsletter_assinantes')
      .select('id, status_confirmacao')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Erro ao verificar assinante existente:', checkError);
      return { message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.', type: 'error' };
    }

    if (!subscriber) {
      return { 
        message: `O e-mail ${email} não está cadastrado na nossa newsletter. Por favor, inscreva-se primeiro.`,
        type: 'error',
        email: email
      };
    }

    if (subscriber.status_confirmacao === 'confirmado') {
      return { 
        message: `O e-mail ${email} já está confirmado e inscrito na newsletter.`,
        type: 'success',
        email: email,
        status: 'confirmado'
      };
    }

    if (subscriber.status_confirmacao === 'cancelado') {
      return { 
        message: `O e-mail ${email} teve a inscrição cancelada. Por favor, inscreva-se novamente caso deseje receber a newsletter.`,
        type: 'error',
        email: email,
        status: 'cancelado'
      };
    }

    // Se chegou aqui, o status é 'pendente' - vamos gerar novos tokens
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas para expirar

    // Atualizar com o novo token
    const { error: updateError } = await supabase
      .from('newsletter_assinantes')
      .update({
        token_confirmacao: confirmationToken,
        token_expires_at: expiresAt.toISOString(),
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Erro ao atualizar token de confirmação:', updateError);
      return { message: 'Ocorreu um erro ao gerar novo link de confirmação. Tente novamente.', type: 'error' };
    }

    // Reenviar e-mail de confirmação
    try {
      // Recuperar o token de cancelamento existente
      const { data: tokenData } = await supabase
        .from('newsletter_assinantes')
        .select('unsubscribe_token')
        .eq('id', subscriber.id)
        .single();

      await sendConfirmationEmail(email, confirmationToken, tokenData?.unsubscribe_token || '');
    } catch (emailError) {
      console.error('Erro ao reenviar e-mail de confirmação:', emailError);
      return { 
        message: 'Ocorreu um erro ao enviar o e-mail de confirmação. Tente novamente mais tarde ou contate o suporte.',
        type: 'error',
        email: email
      };
    }

    return {
      message: `Um novo e-mail de confirmação foi enviado para ${email}. Por favor, verifique sua caixa de entrada (e a pasta de Spam!) e clique no link para confirmar sua inscrição.`,
      type: 'success',
      email: email,
      status: 'pendente'
    };

  } catch (error) {
    console.error('Erro inesperado no reenvio:', error);
    return { message: 'Ocorreu um erro inesperado. Tente novamente.', type: 'error' };
  }
}
