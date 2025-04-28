'use server';

import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server'; // Usando alias @/
import type { Database } from '@/types/supabase'; // Usando alias @/
import crypto from 'crypto';

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

  // 2. Interagir com o Supabase
  const supabase = supabaseServer; // Usando a instância do servidor

  try {
    // Verificar se o email já existe (opcional, mas bom para feedback)
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_assinantes')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Erro ao verificar assinante existente:', checkError);
      return { message: 'Ocorreu um erro ao processar sua solicitação. Tente novamente.', type: 'error' };
    }

    if (existingSubscriber) {
      // Se já existe, verificar status
      // (Opcional: buscar status_confirmacao para feedback mais detalhado)
      return { message: 'Este e-mail já está cadastrado. Se ainda não confirmou, verifique sua caixa de entrada.', type: 'success' };
    }

    // Gerar token de confirmação único
    const token = crypto.randomBytes(32).toString('hex');

    // Inserir novo assinante com status pendente e token
    const { error: insertError } = await supabase
      .from('newsletter_assinantes')
      .insert({
        email: email,
        status_confirmacao: 'pendente',
        token_confirmacao: token,
        data_inscricao: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Erro ao inserir novo assinante:', insertError);
      return { message: 'Ocorreu um erro ao salvar seu e-mail. Tente novamente.', type: 'error' };
    }

    // TODO: Enviar e-mail de confirmação com o token
    // Exemplo: await sendConfirmationEmail(email, token);

    return { message: 'Inscrição recebida! Verifique seu e-mail para confirmar a inscrição.', type: 'success' };

  } catch (error) {
    console.error('Erro inesperado na Server Action:', error);
    return { message: 'Ocorreu um erro inesperado. Por favor, tente mais tarde.', type: 'error' };
  }
}
