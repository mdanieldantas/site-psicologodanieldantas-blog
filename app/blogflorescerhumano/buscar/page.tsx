// app/blogflorescerhumano/buscar/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import SearchForm from '../components/SearchForm';
import type { Metadata } from 'next'; // Importar Metadata

// Interface para os parâmetros de busca (vem da URL)
interface SearchParams {
  q?: string;
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

// --- ATENÇÃO: Definir o tipo de retorno da RPC ---
// Ajuste este tipo para corresponder EXATAMENTE aos campos retornados pela função RPC
type ArticleSearchResult = {
  id: number;
  titulo: string | null;
  slug: string | null;
  resumo: string | null;
  imagem_capa_arquivo: string | null;
  data_publicacao: string | null; // Supabase retorna como string
  categoria_slug: string | null; // Campo adicionado na RPC
};


// Componente para exibir os resultados da busca (MODIFICADO para usar RPC)
async function SearchResults({ query }: { query: string | undefined }) {
  if (!query) {
    return <p className="text-center text-gray-500">Digite algo para buscar.</p>;
  }

  // --- MODIFICADO: Chama a função RPC ---
  const { data: artigos, error } = await supabaseServer
    .rpc('search_articles_fts_or_author', { // Nome da função criada no Supabase
      search_term: query // Passa o termo de busca como argumento para a função
    })
    .returns<ArticleSearchResult[]>(); // Especifica o tipo de retorno esperado

  if (error) {
    // Log mais detalhado do erro RPC
    console.error('Erro ao buscar artigos via RPC:', JSON.stringify(error, null, 2));
    return <p className="text-center text-red-500">Erro ao buscar artigos. Tente novamente mais tarde.</p>;
  }

  if (!artigos || artigos.length === 0) {
    return <p className="text-center text-gray-500">Nenhum artigo encontrado para "{query}".</p>;
  }

  // --- NÃO PRECISA MAIS MAPEAR para extrair categoriaSlug ---
  // A RPC já retorna o categoria_slug diretamente

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Ajusta o mapeamento para usar os dados da RPC */}
      {artigos.map((artigo) => (
        <ArticleCardBlog
          key={artigo.id}
          titulo={artigo.titulo ?? 'Artigo sem título'}
          resumo={artigo.resumo ?? undefined}
          slug={artigo.slug ?? ''}
          // Usa o categoria_slug retornado pela RPC
          categoriaSlug={artigo.categoria_slug ?? 'sem-categoria'}
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
