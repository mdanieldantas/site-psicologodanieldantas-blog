import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client'; // Importa a função createClient

// Interface para as sugestões (deve ser consistente com o frontend)
interface Suggestion {
  type: 'article' | 'category' | 'tag' | 'author';
  value: string;
  slug?: string;
}

// Interfaces para tipagem dos dados do Supabase
interface ArticleData {
  titulo: string;
  slug: string;
}
interface CategoryData {
  nome: string;
  slug: string;
}
interface TagData {
  nome: string;
  slug: string; // Adiciona slug para tags
}
interface AuthorData {
  nome: string;
}

export async function GET(request: NextRequest) {
  const supabase = createClient(); // Cria o cliente dentro da função

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json([], { status: 400 }); // Bad Request se query for inválida
  }

  const searchTerm = `%${query.trim()}%`;
  console.log(`Buscando sugestões para: ${query}`);

  try {
    // --- Lógica de busca no Banco de Dados (Supabase) --- 
    const results = await Promise.allSettled([
      supabase
        .from('artigos')
        .select('titulo, slug')
        .ilike('titulo', searchTerm)
        .limit(5),
      supabase
        .from('categorias')
        .select('nome, slug')
        .ilike('nome', searchTerm)
        .limit(3),
      supabase
        .from('tags')
        .select('nome, slug') // Seleciona nome e slug para tags
        .ilike('nome', searchTerm)
        .limit(3),
      supabase
        .from('autores')
        .select('nome')
        .ilike('nome', searchTerm)
        .limit(2)
    ]);

    const suggestions: Suggestion[] = [];

    // Processa resultados de artigos
    if (results[0].status === 'fulfilled' && results[0].value.data) {
      // Adiciona 'as const' para garantir o tipo literal
      suggestions.push(...results[0].value.data.map((a: ArticleData) => ({ type: 'article' as const, value: a.titulo, slug: a.slug })));
    } else if (results[0].status === 'rejected') {
      console.error("Erro ao buscar artigos:", results[0].reason);
    }

    // Processa resultados de categorias
    if (results[1].status === 'fulfilled' && results[1].value.data) {
      // Adiciona 'as const' para garantir o tipo literal
      suggestions.push(...results[1].value.data.map((c: CategoryData) => ({ type: 'category' as const, value: c.nome, slug: c.slug })));
    } else if (results[1].status === 'rejected') {
      console.error("Erro ao buscar categorias:", results[1].reason);
    }

    // Processa resultados de tags
    if (results[2].status === 'fulfilled' && results[2].value.data) {
      // Inclui slug no mapeamento de tags
      suggestions.push(...results[2].value.data.map((t: TagData) => ({ type: 'tag' as const, value: t.nome, slug: t.slug })));
    } else if (results[2].status === 'rejected') {
      console.error("Erro ao buscar tags:", results[2].reason);
    }

    // Processa resultados de autores
    if (results[3].status === 'fulfilled' && results[3].value.data) {
      // Adiciona 'as const' para garantir o tipo literal
      suggestions.push(...results[3].value.data.map((a: AuthorData) => ({ type: 'author' as const, value: a.nome })));
    } else if (results[3].status === 'rejected') {
      console.error("Erro ao buscar autores:", results[3].reason);
    }

    // Remove duplicados baseados no 'value' (opcional, mas recomendado)
    const uniqueSuggestions = Array.from(new Map(suggestions.map(item => [item.value, item])).values());

    return NextResponse.json(uniqueSuggestions);

  } catch (error) {
    console.error("Erro geral na API de sugestões:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
