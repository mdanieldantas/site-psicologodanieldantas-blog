// app/blogflorescerhumano/buscar/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server'; // Importa a instância do cliente
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import PaginationControls from '../components/PaginationControls';
import type { Metadata, ResolvingMetadata } from 'next';

// Interface para os parâmetros de busca (vem da URL)
interface SearchParams {
  q?: string;
  page?: string; // Adicionar parâmetro de página
}

// Interface para props da página
interface BuscarPageProps {
  searchParams: SearchParams;
}

// --- ATUALIZADO: Gerar Metadados Dinâmicos ---
export async function generateMetadata(
  { searchParams }: BuscarPageProps,
  parent: ResolvingMetadata // Mantém o parâmetro parent
): Promise<Metadata> {
  const query = searchParams.q;
  const baseTitle = 'Blog Florescer Humano';
  const baseDescription = 'Encontre artigos sobre psicologia humanista, autoconhecimento, bem-estar e relacionamentos.';
  const baseUrl = '/blogflorescerhumano/buscar';
  // CORRIGIDO: Usar a instância diretamente, sem chamar ()
  const supabase = supabaseServer;

  let title = `Buscar Artigos | ${baseTitle}`;
  let description = `Resultados da busca por "${query}" no ${baseTitle}. ${baseDescription}`;
  let url = `${baseUrl}?q=${encodeURIComponent(query || '')}`;

  if (!query) {
    title = `Buscar Artigos | ${baseTitle}`;
    description = `Use a busca para encontrar artigos no ${baseTitle}. ${baseDescription}`;
    url = baseUrl;
  } else {
     // Tenta encontrar a categoria correspondente ao query
     const { data: categoryData } = await supabase
       .from('categorias')
       .select('nome') // Só precisa do nome para os metadados
       .ilike('nome', query) // Busca case-insensitive
       .maybeSingle();

     if (categoryData) {
       title = `Artigos sobre ${categoryData.nome} | ${baseTitle}`;
       description = `Explore artigos sobre ${categoryData.nome} no ${baseTitle}. ${baseDescription}`;
     }
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: baseTitle,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}


// --- ATENÇÃO: Definir o tipo de retorno da RPC --- AJUSTADO PARA PAGINAÇÃO
// Ajuste este tipo para corresponder EXATAMENTE aos campos retornados pela função RPC
// A RPC agora deve retornar um objeto com os artigos e a contagem total
type ArticleSearchResult = {
  id: number;
  titulo: string | null;
  slug: string | null;
  resumo: string | null;
  imagem_capa_arquivo: string | null;
  data_publicacao: string | null; // Supabase retorna como string
  categoria_slug: string | null; // Campo vindo da função SQL ou da query direta
};

// --- ATUALIZADO: Corresponde ao retorno da função SQL 'search_articles_paginated' ---
type PaginatedArticlesResponse = {
  articles: ArticleSearchResult[];
  totalCount: number; // Corresponde ao 'totalCount' retornado pela função SQL
};

// Tipo para o artigo retornado pela busca de categoria (com relação)
// Ajuste conforme a estrutura exata retornada pelo Supabase
type ArticleWithCategorySlug = Database['public']['Tables']['artigos']['Row'] & {
    categorias: { slug: string | null } | null; // Ou { slug: string }[] se for many-to-many
};


const PAGE_SIZE = 6; // Definir o número de artigos por página

// --- MODIFICADO: Componente para exibir os resultados da busca ---
async function SearchResults({
  query,
  categoryId,
  currentPage
}: {
  query: string | undefined,
  categoryId: number | undefined,
  currentPage: number
}) {
  // CORRIGIDO: Usar a instância diretamente, sem chamar ()
  const supabase = supabaseServer;
  const offset = (currentPage - 1) * PAGE_SIZE;

  let artigos: ArticleSearchResult[] = [];
  let totalCount = 0;
  let error: any = null;

  if (categoryId) {
    // --- LÓGICA PARA BUSCA POR CATEGORIA (USA categoryId) ---
    const { data: categoryArticles, error: categoryError, count } = await supabase
      .from('artigos')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        imagem_capa_arquivo,
        data_publicacao,
        categorias ( slug )
      `, { count: 'exact' })
      .eq('categoria_id', categoryId)
      .eq('status', 'publicado')
      .order('data_publicacao', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

      if (categoryArticles) {
        // CORRIGIDO: Mapeamento mais seguro e remoção da tipagem explícita de 'a'
        artigos = categoryArticles.map(a => ({
            id: a.id,
            titulo: a.titulo,
            slug: a.slug, // Slug do artigo
            resumo: a.resumo,
            imagem_capa_arquivo: a.imagem_capa_arquivo,
            data_publicacao: a.data_publicacao,
            // Verifica explicitamente se 'categorias' existe e tem 'slug'
            categoria_slug: (a.categorias && typeof a.categorias === 'object' && 'slug' in a.categorias)
                              ? a.categorias.slug
                              : 'sem-categoria'
        }));
      }
      totalCount = count ?? 0;
      error = categoryError;

  } else if (query) {
    // --- LÓGICA PARA BUSCA TEXTUAL (EXISTENTE) ---
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('search_articles_paginated', {
        search_term: query,
        page_limit: PAGE_SIZE,
        page_offset: offset
      })
      .returns<PaginatedArticlesResponse>();

    artigos = rpcData?.articles ?? [];
    totalCount = rpcData?.totalCount ?? 0;
    error = rpcError;
  } else {
    // Nenhum query e nenhuma categoria
    return <p className="text-center text-gray-500">Digite algo para buscar ou selecione uma categoria.</p>;
  }

  if (error) {
    console.error('Erro ao buscar artigos:', JSON.stringify(error, null, 2)); // Log do erro
    return <p className="text-center text-red-500">Erro ao buscar artigos. Tente novamente mais tarde.</p>;
  }

  if (totalCount === 0) {
    const message = categoryId
      ? `Nenhum artigo encontrado na categoria especificada.`
      : `Nenhum artigo encontrado para "${query}".`;
    return <p className="text-center text-gray-500">{message}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Mapeia os artigos recebidos */}
        {artigos.map((artigo) => (
          <ArticleCardBlog
            key={artigo.id}
            titulo={artigo.titulo ?? 'Artigo sem título'}
            resumo={artigo.resumo ?? undefined}
            slug={artigo.slug ?? ''}
            categoriaSlug={artigo.categoria_slug ?? 'sem-categoria'} // Usa o slug mapeado
            imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
          />
        ))}
      </div>

      {/* Adiciona os controles de paginação */}
      {/* Suspense não é estritamente necessário aqui se PaginationControls não fizer fetch */}
      <PaginationControls
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        // A basePath deve sempre usar o parâmetro 'q' original da URL
        basePath={`/blogflorescerhumano/buscar?q=${encodeURIComponent(query || '')}`}
      />
    </>
  );
}

// --- MODIFICADO: Componente principal da página de busca ---
export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const query = searchParams.q;
  const currentPage = parseInt(searchParams.page || '1', 10);
  // CORRIGIDO: Usar a instância diretamente, sem chamar ()
  const supabase = supabaseServer;

  let categoryId: number | undefined = undefined;
  let categoryName: string | undefined = undefined;
  let searchTitle = `Resultados para "${query}"`;

  if (query) {
    // Verificar se o 'query' corresponde a um nome de categoria
    const { data: categoryData } = await supabase
      .from('categorias')
      .select('id, nome') // CORRIGIDO: Selecionar também o ID
      .ilike('nome', query)
      .maybeSingle();

    if (categoryData) {
      categoryId = categoryData.id; // CORRIGIDO: Armazenar o ID
      categoryName = categoryData.nome;
      searchTitle = `Artigos na categoria "${categoryName}"`;
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Buscar Artigos</h1>
      <h2 className="text-2xl font-semibold mb-6">
        {query ? searchTitle : 'Digite algo para buscar'}
      </h2>
      <Suspense fallback={<p className="text-center">Carregando resultados...</p>}>
        {/* Passa query E categoryId (se encontrado) para SearchResults */}
        <SearchResults
          query={query} // Passa a query original
          categoryId={categoryId} // CORRIGIDO: Passa o ID da categoria
          currentPage={currentPage}
        />
      </Suspense>
    </main>
  );
}

// Opcional: Forçar renderização dinâmica se a busca precisar ser sempre fresca
// export const dynamic = 'force-dynamic';
