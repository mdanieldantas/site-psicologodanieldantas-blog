// app/blogflorescerhumano/artigos/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import PaginationControls from '../components/PaginationControls';
import type { Metadata } from 'next';
import { ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// --- Metadados dinâmicos para SEO conforme paginação --- //
export async function generateMetadata(
  { searchParams }: { searchParams?: Promise<{ page?: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = parseInt(params?.page ?? '1', 10);
  const isFirstPage = currentPage === 1;
  const pageTitle = isFirstPage
    ? 'Todos os Artigos | Blog Florescer Humano'
    : `Todos os Artigos - Página ${currentPage} | Blog Florescer Humano`;
  const pageDescription = isFirstPage
    ? 'Navegue por todos os artigos publicados no Blog Florescer Humano sobre psicologia humanista, autoconhecimento e bem-estar.'
    : `Página ${currentPage} da lista de artigos publicados no Blog Florescer Humano sobre psicologia humanista, autoconhecimento e bem-estar.`;
  const canonicalUrl = isFirstPage
    ? '/blogflorescerhumano/artigos'
    : `/blogflorescerhumano/artigos?page=${currentPage}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'Blog Florescer Humano',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDescription,
    },
  };
}

// Tipagem para o artigo com slug da categoria
type ArtigoComCategoriaSlug = Database['public']['Tables']['artigos']['Row'] & {
  categorias: {
    id: string;
    nome: string | null;
    slug: string;
  } | null;  
  autor: {
    id: string;
    nome: string | null;
    foto_arquivo: string | null;
    biografia: string | null;
  } | null;
  tags: {
    id: number;
    nome: string;
    slug: string;
  }[] | null;
};

// Define quantos artigos serão exibidos por página
const ARTICLES_PER_PAGE = 6;

// Define as props da página, incluindo searchParams para paginação
interface TodosArtigosPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TodosArtigosPage({ searchParams }: TodosArtigosPageProps) {
  // --- Lógica de Paginação --- //
  const params = await searchParams;
  const currentPage = parseInt(params['page'] ?? '1', 10);
  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  // --- Busca da Contagem Total de Artigos --- //
  const { count: totalCount, error: countError } = await supabaseServer
    .from('artigos')
    .select('* ', { count: 'exact', head: true })
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString());
  
  if (countError) {
    console.error('Erro ao contar todos os artigos:', countError);
  }

  const totalPages = totalCount ? Math.ceil(totalCount / ARTICLES_PER_PAGE) : 1;
  
  // --- Busca de Artigos da Página Atual --- //
  const { data: artigos, error } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      slug,
      resumo,
      imagem_capa_arquivo,
      data_publicacao,
      data_atualizacao,
      autor:autores (
        id,
        nome,
        foto_arquivo,
        biografia
      ),      
      categorias ( 
        id,
        nome,
        slug 
      ),
      tags ( 
        id,
        nome,
        slug 
      )
    `)
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .order('data_publicacao', { ascending: false })
    .range(from, to)
    .returns<ArtigoComCategoriaSlug[]>();

  if (error) {
    console.error(`Erro ao buscar artigos (Página ${currentPage}):`, error);
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src="/blogflorescerhumano/banners-blog/banner-artigos.webp"
          alt="Banner de Artigos do Blog Florescer Humano"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          className="brightness-75"
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
              Artigos
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Explore todos os conhecimentos compartilhados em nossos artigos de psicologia humanista
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                Início
              </Link>
            </li>
            <ChevronRightIcon className="h-4 w-4 text-[#735B43]/60" />
            <li>
              <Link 
                href="/blogflorescerhumano" 
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <ChevronRightIcon className="h-4 w-4 text-[#735B43]/60" />
            <li className="text-[#583B1F] font-medium">
              Artigos
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#C19A6B]/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-[#583B1F] font-['Old_Roman']">
                  {totalCount || 0} {totalCount === 1 ? 'Artigo' : 'Artigos'}
                </p>
                <p className="text-[#735B43]">
                  Conhecimentos compartilhados sobre psicologia humanista e bem-estar
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-[#735B43]/70">
                  Página {currentPage} de {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {artigos && artigos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {artigos.map((artigo) => 
                artigo.slug && artigo.categorias?.slug ? (
                  <ArticleCardBlog
                    key={artigo.id}
                    titulo={artigo.titulo ?? 'Artigo sem título'}
                    resumo={artigo.resumo ?? undefined}
                    slug={artigo.slug}
                    categoriaSlug={artigo.categorias.slug}
                    imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
                    autor={{
                      nome: artigo.autor?.nome ?? "Psicólogo Daniel Dantas",
                      fotoUrl: artigo.autor?.foto_arquivo 
                        ? `/blogflorescerhumano/autores/${artigo.autor.foto_arquivo}` 
                        : "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                    }}
                    dataPublicacao={artigo.data_publicacao ?? undefined}
                    dataAtualizacao={artigo.data_atualizacao ?? undefined}
                    categoria={artigo.categorias?.nome ?? undefined}
                    tags={artigo.tags ?? []}
                    tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
                    numeroComentarios={0}
                    tipoConteudo="artigo"
                  />
                ) : null
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 border border-[#C19A6B]/20 text-center">
              <p className="text-xl text-[#583B1F]">
                {error
                  ? 'Não foi possível carregar os artigos no momento.'
                  : currentPage > 1 
                    ? 'Não há mais artigos para exibir.' 
                    : 'Nenhum artigo publicado ainda.'
                }
              </p>
            </div>
          )}
        </section>

        {/* Adiciona controles de paginação */}
        <Suspense fallback={null}>
          <PaginationControls
            currentPage={currentPage}
            totalCount={totalCount ?? 0}
            pageSize={ARTICLES_PER_PAGE}
            basePath="/blogflorescerhumano/artigos"
          />
        </Suspense>
      </main>
    </div>
  );
}
