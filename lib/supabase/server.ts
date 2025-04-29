// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Importa os tipos gerados

// Cria um cliente Supabase para uso no lado do servidor (Server Components, Route Handlers, etc.)
// Nota: Para operações que exigem autenticação do usuário no servidor (ex: RLS com auth), 
// pode ser necessário usar helpers do pacote `@supabase/ssr` (createClientServerClient).
// Para leitura de dados públicos como categorias, o cliente básico é suficiente.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Nova variável

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL ou Anon Key não estão definidos nas variáveis de ambiente.'
  );
}

if (!supabaseServiceRoleKey) {
  // Aviso em vez de erro, pois nem todas as operações precisam da service_role
  console.warn(
    'SUPABASE_SERVICE_ROLE_KEY não definida. Operações que bypassam RLS não funcionarão.'
  );
}

// Exporta uma instância única do cliente Supabase para o servidor (usando chave anônima)
export const supabaseServer = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Exporta uma instância única do cliente Supabase com service_role (para bypassar RLS)
// Só cria se a chave estiver definida
export const supabaseServiceRole = supabaseServiceRoleKey
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
  : null;

// Opcional: Função helper para obter o cliente service_role, lançando erro se não disponível
export function getSupabaseServiceRoleClient(): ReturnType<typeof createClient<Database>> {
  if (!supabaseServiceRole) {
    throw new Error('Cliente Supabase com service_role não está disponível. Verifique a variável de ambiente SUPABASE_SERVICE_ROLE_KEY.');
  }
  return supabaseServiceRole;
}
