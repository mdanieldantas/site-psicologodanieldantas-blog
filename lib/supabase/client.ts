import { createBrowserClient } from '@supabase/ssr';

// Cria um cliente Supabase para uso no lado do cliente (navegador)
export function createClient() {
  // Verifica se as variáveis de ambiente estão definidas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL ou Anon Key não estão definidos nas variáveis de ambiente.'
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
}
