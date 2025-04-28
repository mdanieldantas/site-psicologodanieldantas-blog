'use server';

import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server'; // Usando alias @/
import type { Database } from '@/types/supabase'; // Usando alias @/

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
      // TODO: Decidir o que fazer se o email já existe (ex: apenas retornar sucesso, ou indicar que já está inscrito)
      // Por enquanto, vamos retornar sucesso assumindo que o usuário queria se inscrever
      console.log(`Email ${email} já cadastrado.`);
      return { message: 'Obrigado por se inscrever!', type: 'success' };
    }

    // Inserir o novo assinante (sem double opt-in por enquanto)
    const { error: insertError } = await supabase
      .from('newsletter_assinantes')
      .insert({
        email: email,
        status_confirmacao: 'confirmado', // Simplificado por enquanto, sem double opt-in
        data_inscricao: new Date().toISOString(),
        // token_confirmacao e data_confirmacao seriam usados no double opt-in
      });

    if (insertError) {
      console.error('Erro ao inserir novo assinante:', insertError);
      // TODO: Tratar erros específicos (ex: violação de constraint única, se houver)
      return { message: 'Ocorreu um erro ao salvar seu e-mail. Tente novamente.', type: 'error' };
    }

    console.log(`Novo assinante adicionado: ${email}`);
    return { message: 'Inscrição realizada com sucesso! Obrigado.', type: 'success' };

  } catch (error) {
    console.error('Erro inesperado na Server Action:', error);
    return { message: 'Ocorreu um erro inesperado. Por favor, tente mais tarde.', type: 'error' };
  }
}
