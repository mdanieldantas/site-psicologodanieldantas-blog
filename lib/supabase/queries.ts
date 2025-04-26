import { supabaseServer } from './server'; // Corrigido: Importa a instância do cliente Supabase do lado do servidor
import type { Database } from '@/types/supabase'; // Corrigido: Importa o tipo Database principal

// Corrigido: Define tipos locais baseados nos nomes reais das tabelas
type Artigo = Database['public']['Tables']['artigos']['Row'];
type Categoria = Database['public']['Tables']['categorias']['Row'];

// Corrigido: Busca todos os ARTIGOS publicados, ordenados por data de publicação
export async function getPublishedArtigos(): Promise<Artigo[]> {
  // Corrigido: Usa a instância supabaseServer diretamente
  const supabase = supabaseServer;
  const { data, error } = await supabase
    .from('artigos') // Corrigido: Nome da tabela
    .select('*')
    .eq('status', 'publicado') // Corrigido: Coluna 'status' e valor 'publicado'
    .order('data_publicacao', { ascending: false }); // Corrigido: Coluna 'data_publicacao'

  if (error) {
    console.error('Erro ao buscar artigos publicados:', error);
    return []; // Retorna array vazio em caso de erro
  }

  return data || []; // Retorna os dados ou um array vazio se data for null
}

// Corrigido: Busca todas as CATEGORIAS, ordenadas por nome
export async function getAllCategorias(): Promise<Categoria[]> {
  // Corrigido: Usa a instância supabaseServer diretamente
  const supabase = supabaseServer;
  const { data, error } = await supabase
    .from('categorias') // Corrigido: Nome da tabela
    .select('*')
    .order('nome', { ascending: true }); // Corrigido: Coluna 'nome'

  if (error) {
    console.error('Erro ao buscar todas as categorias:', error);
    return []; // Retorna array vazio em caso de erro
  }

  return data || []; // Retorna os dados ou um array vazio se data for null
}

// Corrigido: Busca um ARTIGO específico pelo seu slug
export async function getArtigoBySlug(slug: string): Promise<Artigo | null> {
  // Corrigido: Usa a instância supabaseServer diretamente
  const supabase = supabaseServer;
  const { data, error } = await supabase
    .from('artigos') // Corrigido: Nome da tabela
    // Considerar buscar dados relacionados se necessário: '*, categorias(nome, slug), autores(nome)'
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publicado') // Corrigido: Coluna 'status' e valor 'publicado'
    .maybeSingle(); // Usar maybeSingle para resultado único ou null

  if (error) {
    // maybeSingle não retorna erro PGRST116 por padrão se não encontrar, apenas data: null
    console.error('Erro ao buscar artigo pelo slug:', error);
    return null; // Retorna null em caso de erro real
  }

  return data; // Retorna o artigo encontrado ou null
}

// Corrigido: Busca ARTIGOS de uma categoria específica pelo slug da categoria
export async function getArtigosByCategoriaSlug(categorySlug: string): Promise<Artigo[]> {
  // Corrigido: Usa a instância supabaseServer diretamente
  const supabase = supabaseServer;

  // Abordagem simplificada usando filtro de relacionamento
  const { data, error } = await supabase
    .from('artigos')
    // Seleciona artigos e garante que a categoria relacionada existe e corresponde ao slug
    .select('*, categorias!inner(slug)')
    .eq('categorias.slug', categorySlug) // Filtra pelo slug da categoria relacionada
    .eq('status', 'publicado') // Corrigido: Coluna 'status' e valor 'publicado'
    .order('data_publicacao', { ascending: false }); // Corrigido: Coluna 'data_publicacao'

  if (error) {
    console.error('Erro ao buscar artigos pela categoria slug:', error);
    return [];
  }

  return data || [];
}

// Corrigido: Busca uma CATEGORIA específica pelo seu slug
export async function getCategoriaBySlug(slug: string): Promise<Categoria | null> {
  // Corrigido: Usa a instância supabaseServer diretamente
  const supabase = supabaseServer;
  const { data, error } = await supabase
    .from('categorias') // Corrigido: Nome da tabela
    .select('*')
    .eq('slug', slug)
    .maybeSingle(); // Usar maybeSingle

  if (error) {
    console.error('Erro ao buscar categoria pelo slug:', error);
    return null; // Retorna null em caso de erro real
  }

  return data; // Retorna a categoria encontrada ou null
}
