'use server';

import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server'; // Usando alias @/
import type { Database } from '@/types/supabase'; // Usando alias @/
import crypto from 'crypto';
import { sendConfirmationEmail } from '@/lib/sendConfirmationEmail';
// Importações duplicadas removidas

// Esquema de validação com Zod
const NewsletterSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
});

// Tipagem para o estado do formulário (para useFormState)
export interface NewsletterFormState {
  message: string;
  type: 'success' | 'error' | 'idle';
}

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
    const token = crypto.randomBytes(32).toString('hex');
    // Calcular data de expiração (24 horas a partir de agora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Inserir novo assinante com status pendente, token e data de expiração
    const { error: insertError } = await supabase
      .from('newsletter_assinantes')
      .insert({
        email: email,
        status_confirmacao: 'pendente',
        token_confirmacao: token,
        token_expires_at: expiresAt.toISOString(), // <-- Salvar expiração
        data_inscricao: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Erro ao inserir novo assinante:', insertError);
      return { message: 'Ocorreu um erro ao salvar seu e-mail. Tente novamente.', type: 'error' };
    }

    // Enviar e-mail de confirmação
    try {
      await sendConfirmationEmail(email, token);
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
