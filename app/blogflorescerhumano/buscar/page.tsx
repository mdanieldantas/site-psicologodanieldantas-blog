// app/blogflorescerhumano/buscar/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server'; // Importa a instância do cliente
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import PaginationControls from '../components/PaginationControls';
import BannerImage from '../components/BannerImage';
import type { Metadata, ResolvingMetadata } from 'next';
import { Search, Filter, BookOpen } from 'lucide-react';

// Força renderização dinâmica para Next.js 15
export const dynamic = 'force-dynamic';

// Interface para os parâmetros de busca (vem da URL)
interface SearchParams {
  q?: string;
  page?: string; // Adicionar parâmetro de página
}

// Interface para props da página
interface BuscarPageProps {
  searchParams: Promise<SearchParams>;
}

// --- ATUALIZADO: Gerar Metadados Dinâmicos ---
export async function generateMetadata(
  { searchParams }: BuscarPageProps,
  parent: ResolvingMetadata // Mantém o parâmetro parent
): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;
  const baseTitle = 'Blog Florescer Humano';
  const baseDescription = 'Encontre conteúdos, artigos, informações sobre psicologia, serviços e muito mais em nosso site.';
  const baseUrl = '/blogflorescerhumano/buscar';
  // CORRIGIDO: Usar a instância diretamente, sem chamar ()
  const supabase = supabaseServer;
  let title = `Buscar no Site | ${baseTitle}`;
  let description = `Resultados da busca por "${query}" no ${baseTitle}. ${baseDescription}`;
  let url = `${baseUrl}?q=${encodeURIComponent(query || '')}`;

  if (!query) {
    title = `Buscar no Site | ${baseTitle}`;
    description = `Use a busca para encontrar conteúdos no ${baseTitle}. ${baseDescription}`;
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
  tags?: Array<{ id: number; nome: string; slug: string; }> | null;
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
    tags: Array<{ id: number; nome: string; slug: string; }> | null;
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

  if (categoryId) {    // --- LÓGICA PARA BUSCA POR CATEGORIA (USA categoryId) ---
    const { data: categoryArticles, error: categoryError, count } = await supabase
      .from('artigos')
      .select(`
        id,
        titulo,
        slug,
        resumo,
        imagem_capa_arquivo,
        data_publicacao,
        categorias ( slug ),
        tags ( id, nome, slug )
      `, { count: 'exact' })
      .eq('categoria_id', categoryId)
      .eq('status', 'publicado')
      .order('data_publicacao', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);      if (categoryArticles) {
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
                              : 'sem-categoria',
            tags: a.tags ?? []
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
    error = rpcError;  } else {
    // Nenhum query e nenhuma categoria
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-xl shadow-lg p-12 border border-[#C19A6B]/20 max-w-md mx-auto">
          <Search className="h-16 w-16 text-[#C19A6B] mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-[#583B1F] mb-3">
            Comece sua busca
          </h3>          <p className="font-sans text-[#7D6E63] leading-relaxed">
            Digite algo para buscar ou selecione uma categoria para explorar o conteúdo do site.
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    console.error('Erro ao buscar artigos:', JSON.stringify(error, null, 2)); // Log do erro
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-xl shadow-lg p-12 border border-red-200 max-w-md mx-auto">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-[#583B1F] mb-3">
            Ops! Algo deu errado
          </h3>
          <p className="font-sans text-[#7D6E63] leading-relaxed">
            Erro ao buscar artigos. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }
  if (totalCount === 0) {
    const message = categoryId
      ? `Nenhum artigo encontrado na categoria especificada.`
      : `Nenhum artigo encontrado para "${query}".`;
    
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-xl shadow-lg p-12 border border-[#C19A6B]/20 max-w-md mx-auto">
          <BookOpen className="h-16 w-16 text-[#C19A6B] mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-[#583B1F] mb-3">
            Nenhum resultado encontrado
          </h3>
          <p className="font-sans text-[#7D6E63] leading-relaxed">
            {message}
          </p>          <p className="font-sans text-sm text-[#7D6E63] mt-3">
            Tente buscar por outros termos ou explore as diferentes seções do site.
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Indicador de resultados */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center bg-[#F8F5F0] border border-[#C19A6B]/30 rounded-full px-6 py-3">
          <Filter className="h-4 w-4 text-[#C19A6B] mr-2" />
          <span className="font-sans text-sm font-medium text-[#583B1F]">
            {totalCount} {totalCount === 1 ? 'artigo encontrado' : 'artigos encontrados'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">        {/* Mapeia os artigos recebidos */}
        {artigos.map((artigo) => (
          <ArticleCardBlog
            key={artigo.id}
            titulo={artigo.titulo ?? 'Artigo sem título'}
            resumo={artigo.resumo ?? undefined}
            slug={artigo.slug ?? ''}
            categoriaSlug={artigo.categoria_slug ?? 'sem-categoria'} // Usa o slug mapeado
            imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
            tags={artigo.tags ?? []}
            autor={{
              nome: "Psicólogo Daniel Dantas",
              fotoUrl: "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
            }}
            tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
            numeroComentarios={0}
            tipoConteudo="artigo"
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
  const params = await searchParams;
  const query = params.q;
  const currentPage = parseInt(params.page || '1', 10);
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
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#583B1F]/10">        <BannerImage 
          bannerPath="/blogflorescerhumano/banners-blog/banner-search.webp"
          fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
          alt="Banner de Busca do Site Psicólogo Daniel Dantas"
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl">              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Search className="h-4 w-4 mr-2" />
                <span className="font-sans text-sm font-medium">Busca no Site</span>
              </div>
              
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Encontre que Procura
              </h1>
              
              <p className="font-sans text-lg md:text-xl font-light leading-relaxed opacity-95 max-w-2xl mx-auto">
                Busque por artigos, conteúdos, categorias e temas em todo o nosso site
              </p>
            </div>
          </div>
        </div>
      </section>      {/* Breadcrumbs */}
      <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm font-sans">
            <li>
              <a href="/blogflorescerhumano" className="text-[#735B43] hover:text-[#C19A6B] transition-colors">
                Início
              </a>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li className="text-[#583B1F] font-medium">Buscar</li>
          </ol>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-12">        {/* Título da Página */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#583B1F] mb-4">
            {query ? searchTitle : 'Buscar no Site'}
          </h2>
          
          {query && (
            <div className="inline-flex items-center bg-[#E8E6E2] rounded-full px-6 py-2">
              <span className="font-sans text-sm text-[#583B1F]">
                Termo de busca: <strong>"{query}"</strong>
              </span>
            </div>
          )}
        </div>

        {/* Resultados da Busca */}
        <Suspense fallback={
          <div className="text-center py-16">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-[#E8E6E2] rounded mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-[#C19A6B]/20 p-6">
                    <div className="h-40 bg-[#E8E6E2] rounded mb-4"></div>
                    <div className="h-4 bg-[#E8E6E2] rounded mb-2"></div>
                    <div className="h-4 bg-[#E8E6E2] rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }>
          {/* Passa query E categoryId (se encontrado) para SearchResults */}
          <SearchResults
            query={query} // Passa a query original
            categoryId={categoryId} // CORRIGIDO: Passa o ID da categoria
            currentPage={currentPage}
          />
        </Suspense>
      </main>
    </div>
  );
}

// Opcional: Forçar renderização dinâmica se a busca precisar ser sempre fresca
// export const dynamic = 'force-dynamic';
