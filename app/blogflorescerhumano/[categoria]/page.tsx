// app/blogflorescerhumano/[categoria]/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import PaginationControls from '../components/PaginationControls';
import type { Metadata, ResolvingMetadata } from 'next';
import CategorySchema from '../components/CategorySchema';
import BannerImage from '../components/BannerImage';

// ✅ SISTEMA UNIFICADO DE METADADOS
import { createMetadata } from '../../../lib/metadata-config';

// ✅ PASSO 5.2 - ISR CONFIGURATION FOR CATEGORY PAGES (Next.js 15)
export const revalidate = 1800; // 30 minutos - categorias podem ter novos artigos

// Permite gerar páginas on-demand para novas categorias
export const dynamicParams = true;

// ✅ PASSO 5.2 - STATIC GENERATION PARA CATEGORIAS PRINCIPAIS
export async function generateStaticParams() {
  try {
    console.log('🔄 [ISR Category] Iniciando generateStaticParams para categorias...');
      // Busca todas as categorias (sem coluna 'ativa' que não existe)
    const { data: categorias, error } = await supabaseServer
      .from('categorias')
      .select('slug')
      .order('nome', { ascending: true });

    if (error) {
      console.error('❌ [ISR Category] Erro ao buscar categorias:', error);
      return [];
    }

    if (!categorias || categorias.length === 0) {
      console.log('⚠️ [ISR Category] Nenhuma categoria encontrada');
      return [];
    }

    const paths = categorias
      .filter(categoria => categoria.slug)
      .map(categoria => ({
        categoria: categoria.slug
      }));

    console.log(`✅ [ISR Category] ${paths.length} categorias pré-renderizadas:`, 
      paths.map(p => `/${p.categoria}`).join(', ')
    );

    return paths;

  } catch (error) {
    console.error('💥 [ISR Category] Erro crítico:', error);
    return [];
  }
}

// Força renderização dinâmica para Next.js 15 - REMOVIDO para ISR
// export const dynamic = 'force-dynamic';

// Define quantos artigos serão exibidos por página
const ARTICLES_PER_PAGE = 6; // Valor original

type Categoria = Database['public']['Tables']['categorias']['Row'];
type Artigo = Database['public']['Tables']['artigos']['Row'] & {
  tags?: Array<{ id: number; nome: string; slug: string; }> | null;
};

interface CategoriaPageProps {
  params: Promise<{
    categoria: string; // slug da categoria
  }>;
  searchParams: Promise<{
    page?: string; // Parâmetro opcional para a página
  }>;
}

// --- Geração de Metadados Dinâmicos para Categoria --- //
export async function generateMetadata(
  { params }: { params: Promise<{ categoria: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const categoriaSlug = resolvedParams.categoria;
  const validSlugPattern = /^[a-z0-9-]{3,50}$/;

  if (!categoriaSlug ||
      !validSlugPattern.test(categoriaSlug) ||
      categoriaSlug.includes('.') ||
      categoriaSlug.includes('_') ||
      categoriaSlug.startsWith('api') ||
      categoriaSlug === 'not-found' ||
      categoriaSlug.startsWith('-') ||
      categoriaSlug.endsWith('-')) {    return createMetadata({
      title: 'Página não encontrada',
      description: 'A página que você procura não foi encontrada.',
      path: `/blogflorescerhumano/${categoriaSlug}`,
      pageType: 'category',
      robots: { index: false, follow: false }
    });
  }

  const { data: categoria, error } = await supabaseServer
    .from('categorias')
    .select('nome, descricao')
    .eq('slug', categoriaSlug)
    .maybeSingle();

  if (error || !categoria) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dev] Categoria não encontrada para slug: ${categoriaSlug}`);
    }    return createMetadata({
      title: 'Categoria não encontrada',
      description: 'A categoria de artigos que você procura não foi encontrada.',
      path: `/blogflorescerhumano/${categoriaSlug}`,
      pageType: 'category',
      robots: { index: false, follow: false }
    });
  }
  // ✅ USAR SISTEMA UNIFICADO DE METADADOS COM E-A-T
  return createMetadata({
    title: categoria.nome,
    description: categoria.descricao || `Explore artigos sobre ${categoria.nome} no Blog Florescer Humano.`,
    path: `/blogflorescerhumano/${categoriaSlug}`,
    pageType: 'category', // ✅ NOVO: Define como página de categoria
    type: 'website',
    robots: { index: true, follow: true }
  });
}

// --- Componente da Página --- //
export default async function CategoriaEspecificaPage({
  params,
  searchParams,
}: CategoriaPageProps) {
  const resolvedParams = await params;
  const categoriaSlug = resolvedParams.categoria;
  const searchParamsData = await searchParams;
  const page = searchParamsData.page ?? "1";
  const validSlugPattern = /^[a-z0-9-]{3,50}$/;

  if (!categoriaSlug ||
      !validSlugPattern.test(categoriaSlug) ||
      categoriaSlug.includes('.') ||
      categoriaSlug.includes('_') ||
      categoriaSlug.startsWith('api') ||
      categoriaSlug === 'not-found' ||
      categoriaSlug.startsWith('-') ||
      categoriaSlug.endsWith('-')) {
    notFound();
  }

  const { data: categoria, error: categoriaError } = await supabaseServer
    .from('categorias')
    .select('id, nome, slug, descricao, imagem_url')
    .eq('slug', categoriaSlug)
    .single<Categoria>();

  if (categoriaError || !categoria) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dev] Categoria "${categoriaSlug}" não encontrada ou erro:`, categoriaError);
    }
    notFound();
  }

  const currentPage = parseInt(page, 10);
  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  const { count: totalCount, error: countError } = await supabaseServer
    .from('artigos')
    .select('* ', { count: 'exact', head: true })
    .eq('categoria_id', categoria.id)
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString());

  if (countError) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dev] Erro ao contar artigos para categoria "${categoria.nome}":`, countError);
    }
  }

  const totalPages = totalCount ? Math.ceil(totalCount / ARTICLES_PER_PAGE) : 1;

  const { data: artigos, error: artigosError } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      slug,
      resumo,
      imagem_capa_arquivo,
      data_publicacao,
      data_atualizacao,
      tags (
        id,
        nome,
        slug
      )
    `)
    .eq('categoria_id', categoria.id)
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .order('data_publicacao', { ascending: false })
    .range(from, to);

  if (artigosError) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Dev] Erro ao buscar artigos para categoria "${categoria.nome}" (Página ${currentPage}):`, artigosError);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dev] Categoria: ${categoria.nome}, Página: ${currentPage}, Total: ${totalCount}, Páginas: ${totalPages}`);
  }

  const getCategoryImageUrl = (cat: Categoria) => {
    if (cat.imagem_url) {
      return `/blogflorescerhumano/category-images/${cat.imagem_url}`;
    }
    return '/blogflorescerhumano/category-images/categoria-default.webp';
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section - MODELO ADAPTADO COM CORREÇÃO DE FONTE NO TÍTULO */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#F8F5F0]">
        {/* Mobile: Banner tradicional */}
        <div className="md:hidden relative h-full">
          <BannerImage
            bannerPath={getCategoryImageUrl(categoria)}
            fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
            alt={`Banner da categoria ${categoria.nome}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/80 via-[#583B1F]/30 to-transparent" />

          {/* Conteúdo mobile centralizado */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mb-6 rounded-full shadow-md"></div>
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg font-serif"> {/* CORRIGIDO para font-serif */}
                {categoria.nome}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md font-sans">
                {categoria.descricao || `Explore artigos sobre ${categoria.nome}`}
              </p>
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mt-6 rounded-full shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Desktop: Split layout aprimorado */}
        <div className="hidden md:flex h-full">
          {/* Lado esquerdo: Conteúdo com elementos decorativos */}
          <div className="w-1/2 bg-gradient-to-br from-[#583B1F] via-[#5B3E22] to-[#583B1F] flex flex-col justify-center px-8 lg:px-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-[#A57C3A] blur-xl"></div>
              <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-[#6B7B3F] blur-2xl"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-[#A57C3A] blur-lg"></div>
            </div>

            <div className="relative z-10 animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-[#A57C3A] rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mx-3 shadow-lg"></div>
                <div className="w-8 h-1 bg-[#A57C3A]/60 rounded-full shadow-lg"></div>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 font-serif leading-tight"> {/* CORRIGIDO para font-serif */}
                {categoria.nome}
              </h1>

              <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-sans mb-8 max-w-md">
                {categoria.descricao || `Explore artigos sobre ${categoria.nome}`}
              </p>

              {/* Botão adicionado */}
              <div className="mb-6">
                <Link href="/blogflorescerhumano/categorias"
                      className="inline-block px-6 py-2 bg-[#6B7B3F] text-white rounded-md font-medium font-sans transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:bg-[#5B6B35] animate-in fade-in slide-in-from-left-6 delay-300">
                  Ver Outras Categorias
                </Link>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-1 bg-[#A57C3A]/60 rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mx-3 shadow-lg"></div>
                <div className="w-12 h-1 bg-[#A57C3A] rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Lado direito: Imagem com moldura elegante */}
          <div className="w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#A57C3A]/20 via-transparent to-[#6B7B3F]/20 z-10 pointer-events-none"></div>
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-[#A57C3A]/30 rounded-lg z-10 pointer-events-none"></div>

            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-[#A57C3A] rounded-tl-lg z-20"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-[#A57C3A] rounded-tr-lg z-20"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-[#A57C3A] rounded-bl-lg z-20"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-[#A57C3A] rounded-br-lg z-20"></div>
            <BannerImage
              bannerPath={getCategoryImageUrl(categoria)}
              fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
              alt={`Banner da categoria ${categoria.nome}`}
              className="animate-in fade-in slide-in-from-right-6 duration-1000 delay-300 hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/5 via-transparent to-[#583B1F]/5"></div>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Início
              </Link>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li>
              <Link
                href="/blogflorescerhumano"
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li>
              <Link
                href="/blogflorescerhumano/categorias"
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Categorias
              </Link>
            </li>
            {/* O nome da categoria específica foi intencionalmente removido do breadcrumb aqui,
                pois o título da página já a exibe proeminentemente. Se desejar adicioná-lo,
                seria algo como:
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li className="text-[#583B1F] font-medium">
              {categoria.nome}
            </li>
            */}
          </ol>
        </div>
      </nav>
      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 pt-8">
        {/* Articles Grid */}
        {artigos && artigos.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {artigos.map((artigo, index) => (
                <div
                  key={artigo.id}
                  className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 hover:zoom-in-105 transition-all duration-300"
                  style={{
                    animationDelay: `${600 + (index * 100)}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="group h-full">
                    <ArticleCardBlog
                      titulo={artigo.titulo ?? 'Artigo sem título'}
                      resumo={artigo.resumo ?? undefined}
                      slug={artigo.slug ?? ''}
                      categoriaSlug={categoria.slug}
                      imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
                      autor={{
                        nome: "Psicólogo Daniel Dantas", // Considerando que o autor pode variar, buscar dinamicamente seria ideal
                        fotoUrl: "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                      }}
                      dataPublicacao={artigo.data_publicacao || undefined}
                      dataAtualizacao={artigo.data_atualizacao || undefined}
                      categoria={categoria.nome}
                      tags={artigo.tags ?? []}
                      tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
                      numeroComentarios={0}
                      tipoConteudo="artigo"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 animate-in fade-in zoom-in-75 duration-700">
            <div className="bg-white rounded-xl shadow-lg p-12 border border-[#C19A6B]/20 max-w-md mx-auto">
              <div className="text-[#735B43]/60 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#583B1F] mb-2 font-['Old_Roman']">
                {artigosError ? 'Erro ao carregar' : 'Nenhum artigo'}
              </h3>
              <p className="text-[#735B43]">
                {artigosError
                  ? 'Não foi possível carregar os artigos desta categoria no momento.'
                  : currentPage > 1
                    ? 'Não há mais artigos nesta categoria.'
                    : 'Nenhum artigo publicado nesta categoria ainda.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <Suspense fallback={null}>
              <PaginationControls
                currentPage={currentPage}
                totalCount={totalCount ?? 0}
                pageSize={ARTICLES_PER_PAGE}
                basePath={`/blogflorescerhumano/${categoria.slug}`}
              />
            </Suspense>
          </div>
        )}
        {/* Schema da Categoria (JSON-LD) */}
        <CategorySchema
          nome={categoria.nome}
          descricao={categoria.descricao ?? ''}
          slug={categoria.slug}
          url={`/blogflorescerhumano/${categoria.slug}`}
          imagemUrl={(artigos && artigos.length > 0 && artigos[0].imagem_capa_arquivo) ? artigos[0].imagem_capa_arquivo : (categoria.imagem_url ? `/blogflorescerhumano/category-images/${categoria.imagem_url}` : null)}
          artigosCount={totalCount}
        />
      </main>
    </div>
  );
}









// // app/blogflorescerhumano/[categoria]/page.tsx
// import React, { Suspense } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { supabaseServer } from '@/lib/supabase/server';
// import { notFound } from 'next/navigation';
// import type { Database } from '@/types/supabase';
// import ArticleCardBlog from '../components/ArticleCardBlog';
// import PaginationControls from '../components/PaginationControls';
// import type { Metadata, ResolvingMetadata } from 'next';
// import CategorySchema from '../components/CategorySchema';
// import BannerImage from '../components/BannerImage';

// // Força renderização dinâmica para Next.js 15
// export const dynamic = 'force-dynamic';

// // Define quantos artigos serão exibidos por página
// const ARTICLES_PER_PAGE = 6; // Valor original
// // const ARTICLES_PER_PAGE = 2; // TEMPORÁRIO PARA TESTE DE PAGINAÇÃO

// type Categoria = Database['public']['Tables']['categorias']['Row'];
// type Artigo = Database['public']['Tables']['artigos']['Row'] & {
//   tags?: Array<{ id: number; nome: string; slug: string; }> | null;
// };

// interface CategoriaPageProps {
//   params: Promise<{
//     categoria: string; // slug da categoria
//   }>;
//   searchParams: Promise<{
//     page?: string; // Parâmetro opcional para a página
//   }>;
// }

// // --- Geração de Metadados Dinâmicos para Categoria --- //
// export async function generateMetadata(
//   { params }: { params: Promise<{ categoria: string }> }, 
//   parent: ResolvingMetadata
// ): Promise<Metadata> {  // Await params para Next.js 15
//   const resolvedParams = await params;
//   const categoriaSlug = resolvedParams.categoria;
//   // Validação: filtrar slugs inválidos (arquivos internos do Next.js, extensões, etc.)
//   // Aceita apenas slugs com letras minúsculas, números e hífens, com pelo menos 3 caracteres
//   const validSlugPattern = /^[a-z0-9-]{3,50}$/;
  
//   if (!categoriaSlug || 
//       !validSlugPattern.test(categoriaSlug) ||
//       categoriaSlug.includes('.') || 
//       categoriaSlug.includes('_') ||
//       categoriaSlug.startsWith('api') ||
//       categoriaSlug === 'not-found' ||
//       categoriaSlug.startsWith('-') ||
//       categoriaSlug.endsWith('-')) {
//     return {
//       title: 'Página não encontrada | Blog Florescer Humano',
//       description: 'A página que você procura não foi encontrada.',
//     };
//   }

//   // Busca nome e descrição da categoria
//   const { data: categoria, error } = await supabaseServer
//     .from('categorias')
//     .select('nome, descricao') // Seleciona nome e descrição
//     .eq('slug', categoriaSlug)
//     .maybeSingle();
//   // Se não encontrar a categoria ou houver erro
//   if (error || !categoria) {
//     // Log silencioso apenas em desenvolvimento
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`[Dev] Categoria não encontrada para slug: ${categoriaSlug}`);
//     }
//     return {
//       title: 'Categoria não encontrada | Blog Florescer Humano',
//       description: 'A categoria de artigos que você procura não foi encontrada.',
//     };
//   }

//   const pageTitle = `${categoria.nome} | Blog Florescer Humano`;
//   const pageDescription = categoria.descricao ?? `Explore artigos sobre ${categoria.nome} no Blog Florescer Humano.`;
//   const canonicalUrl = `/blogflorescerhumano/${categoriaSlug}`;

//   return {
//     title: pageTitle,
//     description: pageDescription,
//     alternates: {
//       canonical: canonicalUrl,
//     },
//     openGraph: {
//       title: pageTitle,
//       description: pageDescription,
//       url: canonicalUrl,
//       siteName: 'Blog Florescer Humano',
//       // Não há imagem específica para categoria por padrão, herda do layout
//       locale: 'pt_BR',
//       type: 'website', // Ou 'object', dependendo do conteúdo exato
//     },
//     twitter: {
//       card: 'summary',
//       title: pageTitle,
//       description: pageDescription,
//       // Não há imagem específica para categoria por padrão
//     },
//   };
// }

// // --- Componente da Página --- //
// export default async function CategoriaEspecificaPage({
//   params,
//   searchParams,
// }: CategoriaPageProps) {  
//   // Await params para Next.js 15
//   const resolvedParams = await params;
//   const categoriaSlug = resolvedParams.categoria;
//   const searchParamsData = await searchParams;
//   const page = searchParamsData.page ?? "1";
//     // Validação: filtrar slugs inválidos antes de fazer consulta ao banco
//   // Aceita apenas slugs com letras minúsculas, números e hífens, com pelo menos 3 caracteres
//   const validSlugPattern = /^[a-z0-9-]{3,50}$/;
  
//   if (!categoriaSlug || 
//       !validSlugPattern.test(categoriaSlug) ||
//       categoriaSlug.includes('.') || 
//       categoriaSlug.includes('_') ||
//       categoriaSlug.startsWith('api') ||
//       categoriaSlug === 'not-found' ||
//       categoriaSlug.startsWith('-') ||
//       categoriaSlug.endsWith('-')) {
//     notFound();
//   }
  
//   // --- 1. Busca de Dados da Categoria --- //
//   const { data: categoria, error: categoriaError } = await supabaseServer
//     .from('categorias')
//     .select('id, nome, slug, descricao, imagem_url')
//     .eq('slug', categoriaSlug)
//     .single<Categoria>();
//   // --- Validação da Categoria --- //
//   if (categoriaError || !categoria) {
//     // Log silencioso apenas em desenvolvimento
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`[Dev] Categoria "${categoriaSlug}" não encontrada ou erro:`, categoriaError);
//     }
//     notFound();
//   }

//   // --- 2. Lógica de Paginação --- //
//   const currentPage = parseInt(page, 10);
//   const from = (currentPage - 1) * ARTICLES_PER_PAGE;
//   const to = from + ARTICLES_PER_PAGE - 1;

//   // --- 3. Busca da Contagem Total de Artigos --- //
//   const { count: totalCount, error: countError } = await supabaseServer
//     .from('artigos')
//     .select('* ', { count: 'exact', head: true }) // Conta todos os artigos da categoria
//     .eq('categoria_id', categoria.id)
//     .eq('status', 'publicado')
//     .lte('data_publicacao', new Date().toISOString());
//   if (countError) {
//     // Log silencioso apenas em desenvolvimento
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`[Dev] Erro ao contar artigos para categoria "${categoria.nome}":`, countError);
//     }
//     // Considerar como lidar com este erro, talvez mostrar 0 ou uma mensagem?
//   }

//   const totalPages = totalCount ? Math.ceil(totalCount / ARTICLES_PER_PAGE) : 1;
//   // --- 4. Busca de Artigos da Página Atual --- //
//   const { data: artigos, error: artigosError } = await supabaseServer
//     .from('artigos')
//     .select(`
//       id,
//       titulo,
//       slug,
//       resumo,
//       imagem_capa_arquivo,
//       data_publicacao,
//       data_atualizacao,
//       tags (
//         id,
//         nome,
//         slug
//       )
//     `)
//     .eq('categoria_id', categoria.id)
//     .eq('status', 'publicado')
//     .lte('data_publicacao', new Date().toISOString())
//     .order('data_publicacao', { ascending: false })
//     .range(from, to); // Aplica o range para a paginação
//   // --- Tratamento de Erro (Artigos) --- //
//   if (artigosError) {
//     // Log silencioso apenas em desenvolvimento
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`[Dev] Erro ao buscar artigos para categoria "${categoria.nome}" (Página ${currentPage}):`, artigosError);
//     }
//     // Não chama notFound(), apenas mostra mensagem de erro
//   }

//   // Log para depuração apenas em desenvolvimento
//   if (process.env.NODE_ENV === 'development') {
//     console.log(`[Dev] Categoria: ${categoria.nome}, Página: ${currentPage}, Total: ${totalCount}, Páginas: ${totalPages}`);
//   }// Função para obter a URL da imagem da categoria a partir do campo imagem_url do banco de dados
//   const getCategoryImageUrl = (categoria: Categoria) => {
//     if (categoria.imagem_url) {
//       return `/blogflorescerhumano/category-images/${categoria.imagem_url}`;
//     }
    
//     // Fallback caso não haja imagem definida
//     return '/blogflorescerhumano/category-images/categoria-default.webp';
//   };

//   return (
//     <div className="min-h-screen bg-[#F8F5F0]">
//       {/* Hero Banner Section */}      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
//         <BannerImage 
//           bannerPath={getCategoryImageUrl(categoria)}
//           fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
//           alt={`Banner da categoria ${categoria.nome}`}
//         />
        
//         {/* Hero Content Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent" />
//         <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
//           <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
//               {categoria.nome}
//             </h1>
//             <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
//               {categoria.descricao || `Explore artigos sobre ${categoria.nome}`}
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Breadcrumb Navigation */}
//       <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-3">
//           <ol className="flex items-center space-x-2 text-sm">
//             <li>              <Link 
//                 href="/" 
//                 className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                 </svg>
//                 Início
//               </Link>
//             </li>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//             <li>
//               <Link 
//                 href="/blogflorescerhumano" 
//                 className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
//               >
//                 Blog
//               </Link>
//             </li>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//             <li>
//               <Link 
//                 href="/blogflorescerhumano/categorias" 
//                 className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
//               >
//                 Categorias
//               </Link>
//             </li>
//             {/* Removido nome da categoria do breadcrumb */}
//           </ol>
//         </div>
//       </nav>      {/* Main Content */}
//       <main className="container mx-auto px-4 pb-12 pt-8">
//         {/* Articles Grid */}
//         {artigos && artigos.length > 0 ? (
//           <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {artigos.map((artigo, index) => (
//                 <div
//                   key={artigo.id}
//                   className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 hover:zoom-in-105 transition-all duration-300"
//                   style={{
//                     animationDelay: `${600 + (index * 100)}ms`,
//                     animationFillMode: 'both'
//                   }}
//                 >
//                   <div className="group h-full">
//                     <ArticleCardBlog
//                       titulo={artigo.titulo ?? 'Artigo sem título'}
//                       resumo={artigo.resumo ?? undefined}
//                       slug={artigo.slug ?? ''}
//                       categoriaSlug={categoria.slug}
//                       imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
//                       autor={{
//                         nome: "Psicólogo Daniel Dantas",
//                         fotoUrl: "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
//                       }}
//                       dataPublicacao={artigo.data_publicacao || undefined}
//                       dataAtualizacao={artigo.data_atualizacao || undefined}
//                       categoria={categoria.nome}
//                       tags={artigo.tags ?? []}
//                       tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
//                       numeroComentarios={0}
//                       tipoConteudo="artigo"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-16 animate-in fade-in zoom-in-75 duration-700">
//             <div className="bg-white rounded-xl shadow-lg p-12 border border-[#C19A6B]/20 max-w-md mx-auto">              <div className="text-[#735B43]/60 mb-4">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-[#583B1F] mb-2 font-['Old_Roman']">
//                 {artigosError ? 'Erro ao carregar' : 'Nenhum artigo'}
//               </h3>
//               <p className="text-[#735B43]">
//                 {artigosError
//                   ? 'Não foi possível carregar os artigos desta categoria no momento.'
//                   : currentPage > 1 
//                     ? 'Não há mais artigos nesta categoria.' 
//                     : 'Nenhum artigo publicado nesta categoria ainda.'
//                 }
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
//             <Suspense fallback={null}>
//               <PaginationControls
//                 currentPage={currentPage}
//                 totalCount={totalCount ?? 0}
//                 pageSize={ARTICLES_PER_PAGE}
//                 basePath={`/blogflorescerhumano/${categoria.slug}`}
//               />
//             </Suspense>
//           </div>
//         )}        {/* Schema da Categoria (JSON-LD) */}
//         <CategorySchema
//           nome={categoria.nome}
//           descricao={categoria.descricao ?? ''}
//           slug={categoria.slug}
//           url={`/blogflorescerhumano/${categoria.slug}`}
//           imagemUrl={(artigos && artigos.length > 0) ? artigos[0].imagem_capa_arquivo : null}
//           artigosCount={totalCount}
//         />
//       </main>
//     </div>
//   );
// }
