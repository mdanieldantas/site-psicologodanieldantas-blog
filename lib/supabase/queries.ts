import { createClient } from './server'; // Importa o cliente Supabase do lado do servidor
import type { Post, Category } from '@/types/supabase'; // Importa os tipos definidos

// Busca todos os posts publicados, ordenados por data de criação (mais recentes primeiro)
export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*') // Seleciona todas as colunas
    .eq('published', true) // Filtra apenas os publicados
    .order('created_at', { ascending: false }); // Ordena por data de criação

  if (error) {
    console.error('Erro ao buscar posts:', error);
    return []; // Retorna array vazio em caso de erro
  }

  return data || []; // Retorna os dados ou um array vazio se data for null
}

// Busca todas as categorias, ordenadas por nome
export async function getAllCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*') // Seleciona todas as colunas
    .order('name', { ascending: true }); // Ordena por nome

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    return []; // Retorna array vazio em caso de erro
  }

  return data || []; // Retorna os dados ou um array vazio se data for null
}

// Busca um post específico pelo seu slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true) // Garante que só busca posts publicados
    .single(); // Espera um único resultado ou null

  if (error && error.code !== 'PGRST116') { // Ignora erro se for 'nenhum resultado encontrado'
    console.error('Erro ao buscar post pelo slug:', error);
  }

  return data; // Retorna o post encontrado ou null
}

// Busca posts de uma categoria específica pelo slug da categoria
export async function getPostsByCategorySlug(categorySlug: string): Promise<Post[]> {
  const supabase = createClient();

  // Primeiro, busca o ID da categoria pelo slug
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (categoryError || !categoryData) {
    console.error('Erro ao buscar categoria pelo slug ou categoria não encontrada:', categoryError);
    return [];
  }

  const categoryId = categoryData.id;

  // Agora, busca os posts publicados dessa categoria
  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', categoryId)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (postsError) {
    console.error('Erro ao buscar posts pela categoria:', postsError);
    return [];
  }

  return postsData || [];
}

// Busca uma categoria específica pelo seu slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single(); // Espera um único resultado ou null

  if (error && error.code !== 'PGRST116') { // Ignora erro se for 'nenhum resultado encontrado'
    console.error('Erro ao buscar categoria pelo slug:', error);
  }

  return data; // Retorna a categoria encontrada ou null
}
