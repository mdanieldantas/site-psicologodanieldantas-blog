// app/blogflorescerhumano/buscar/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import PaginationControls from '../components/PaginationControls'; // Importar o novo componente
import type { Metadata } from 'next'; // Importar Metadata

// Interface para os parâmetros de busca (vem da URL)
interface SearchParams {
  q?: string;
  page?: string; // Adicionar parâmetro de página
}

// Adicionar Metadados Estáticos
export const metadata: Metadata = {
  title: 'Buscar Artigos | Blog Florescer Humano',
  description: 'Encontre artigos sobre psicologia humanista, autoconhecimento, bem-estar e relacionamentos no Blog Florescer Humano.',
  alternates: {
    canonical: '/blogflorescerhumano/buscar',
  },
  openGraph: {
    title: 'Buscar Artigos | Blog Florescer Humano',
    description: 'Encontre artigos sobre psicologia humanista, autoconhecimento e bem-estar.',
    url: '/blogflorescerhumano/buscar',
    siteName: 'Blog Florescer Humano',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Buscar Artigos | Blog Florescer Humano',
    description: 'Encontre artigos sobre psicologia humanista, autoconhecimento e bem-estar.',
  },
};

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
  categoria_slug: string | null; // Campo vindo da função SQL
};

// --- ATUALIZADO: Corresponde ao retorno da função SQL 'search_articles_paginated' ---
type PaginatedArticlesResponse = {
  articles: ArticleSearchResult[];
  totalCount: number; // Corresponde ao 'totalCount' retornado pela função SQL
};

const PAGE_SIZE = 6; // Definir o número de artigos por página

// Componente para exibir os resultados da busca
async function SearchResults({ query, currentPage }: { query: string | undefined, currentPage: number }) {
  if (!query) {
    return <p className="text-center text-gray-500">Digite algo para buscar.</p>;
  }

  // Calcula o offset para a consulta SQL
  const offset = (currentPage - 1) * PAGE_SIZE;

  // --- MODIFICADO: Chama a função RPC CORRETA com parâmetros CORRETOS ---
  // Certifique-se que os tipos do Supabase foram regenerados!
  const { data, error } = await supabaseServer
    .rpc('search_articles_paginated', { // Nome CORRETO da função SQL
      search_term: query,       // Parâmetro da função SQL
      page_limit: PAGE_SIZE,    // Parâmetro da função SQL
      page_offset: offset       // Parâmetro da função SQL
    })
    .returns<PaginatedArticlesResponse>(); // Especifica o tipo de retorno ATUALIZADO

  if (error) {
    console.error('Erro ao buscar artigos paginados via RPC:', JSON.stringify(error, null, 2));
    return <p className="text-center text-red-500">Erro ao buscar artigos. Tente novamente mais tarde.</p>;
  }

  // --- ATUALIZADO: Usa totalCount (camelCase) conforme definido no tipo e retornado pela SQL ---
  const artigos = data?.articles ?? [];
  const totalCount = data?.totalCount ?? 0;

  if (totalCount === 0) {
    return <p className="text-center text-gray-500">Nenhum artigo encontrado para "{query}".</p>;
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
            categoriaSlug={artigo.categoria_slug ?? 'sem-categoria'}
            imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
          />
        ))}
      </div>

      {/* Adiciona os controles de paginação */}
      <Suspense fallback={null}>
        <PaginationControls
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          basePath="/blogflorescerhumano/buscar"
        />
      </Suspense>
    </>
  );
}

// Componente principal da página de busca (MODIFICADO para ler a página)
export default function BuscarPage({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.q;
  // Lê o parâmetro 'page' da URL, converte para número, padrão é 1
  const currentPage = parseInt(searchParams.page || '1', 10);

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Buscar Artigos</h1>
      {/* Resultados da Busca (renderizados no servidor com Suspense) */}
      <h2 className="text-2xl font-semibold mb-6">
        {query ? `Resultados para "${query}"` : 'Digite algo para buscar'}
      </h2>
      <Suspense fallback={<p className="text-center">Carregando resultados...</p>}>
        {/* Passa a query e a página atual para SearchResults */}
        <SearchResults query={query} currentPage={currentPage} />
      </Suspense>
    </main>
  );
}

// Opcional: Forçar renderização dinâmica se a busca precisar ser sempre fresca
// export const dynamic = 'force-dynamic';
