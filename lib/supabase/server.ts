// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Importa os tipos gerados

// Cria um cliente Supabase para uso no lado do servidor (Server Components, Route Handlers, etc.)
// Nota: Para operações que exigem autenticação do usuário no servidor (ex: RLS com auth), 
// pode ser necessário usar helpers do pacote `@supabase/ssr` (createClientServerClient).
// Para leitura de dados públicos como categorias, o cliente básico é suficiente.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL ou Anon Key não estão definidos nas variáveis de ambiente.'
  );
}

// Exporta uma instância única do cliente Supabase para o servidor
// Usamos os tipos genéricos <Database> para ter type safety com o schema do seu banco.
export const supabaseServer = createClient<Database>(supabaseUrl, supabaseAnonKey);
