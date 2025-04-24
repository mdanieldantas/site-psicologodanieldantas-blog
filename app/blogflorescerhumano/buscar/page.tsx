// app/blogflorescerhumano/buscar/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import SearchForm from '../components/SearchForm';

// Interface para os parâmetros de busca (vem da URL)
interface SearchParams {
  q?: string;
}

// Componente para exibir os resultados da busca
async function SearchResults({ query }: { query: string | undefined }) {
  if (!query) {
    return <p className="text-center text-gray-500">Digite algo para buscar.</p>;
  }

  // Busca no Supabase por título ou conteúdo (usando textSearch)
  // Nota: A busca por 'conteudo' pode ser lenta se a coluna for muito grande.
  // Considere otimizações como índices full-text no Supabase se necessário.
  const { data: artigos, error } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      slug,
      resumo,
      imagem_capa_arquivo,
      data_publicacao,
      categorias ( slug )
    `)
    .textSearch('fts', query, { // 'fts' é a coluna configurada para Full Text Search
      type: 'websearch', // Ou 'plain', 'phrase' dependendo da necessidade
      config: 'portuguese' // Configuração de idioma para FTS
    })
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .order('data_publicacao', { ascending: false });

  if (error) {
    console.error('Erro ao buscar artigos:', error);
    return <p className="text-center text-red-500">Erro ao buscar artigos. Tente novamente mais tarde.</p>;
  }

  if (!artigos || artigos.length === 0) {
    return <p className="text-center text-gray-500">Nenhum artigo encontrado para "{query}".</p>;
  }

  // Mapeia os resultados para extrair o slug da categoria
  const artigosComCategoriaSlug = artigos.map(artigo => {
    // A relação 'categorias' pode ser um objeto ou null
    // Se for um objeto, esperamos que tenha a propriedade 'slug'
    const categoriaSlug = typeof artigo.categorias === 'object' && artigo.categorias !== null
                          ? (artigo.categorias as { slug: string }).slug
                          : 'sem-categoria'; // Fallback se não houver categoria ou slug
    return {
      ...artigo,
      categoriaSlug: categoriaSlug
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {artigosComCategoriaSlug.map((artigo) => (
        <ArticleCardBlog
          key={artigo.id}
          titulo={artigo.titulo ?? 'Artigo sem título'}
          resumo={artigo.resumo ?? undefined}
          slug={artigo.slug ?? ''}
          categoriaSlug={artigo.categoriaSlug} // Passa o slug da categoria extraído
          imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
        />
      ))}
    </div>
  );
}

// Componente principal da página de busca
export default function BuscarPage({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.q;

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Buscar Artigos</h1>

      {/* Formulário de Busca (renderizado no cliente) */}
      <SearchForm />

      {/* Resultados da Busca (renderizados no servidor com Suspense) */}
      <h2 className="text-2xl font-semibold mb-6">
        {query ? `Resultados para "${query}"` : 'Últimos artigos'} {/* Mostra "Últimos artigos" se não houver busca */}
      </h2>
      <Suspense fallback={<p className="text-center">Carregando resultados...</p>}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

// Opcional: Forçar renderização dinâmica se a busca precisar ser sempre fresca
// export const dynamic = 'force-dynamic';
