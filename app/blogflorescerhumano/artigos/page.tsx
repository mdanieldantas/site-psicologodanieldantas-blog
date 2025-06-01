// app/blogflorescerhumano/artigos/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import PaginationControls from '../components/PaginationControls';
import type { Metadata } from 'next';
import { ResolvingMetadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import BannerImage from '../components/BannerImage';
import { redirect } from 'next/navigation';

// Força renderização dinâmica para Next.js 15
export const dynamic = 'force-dynamic';

// --- Metadados dinâmicos para SEO conforme paginação --- //
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ page?: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams?.page ?? '1', 10);
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
  try {
    // --- Lógica de Paginação --- //
    const resolvedParams = await searchParams;
    const currentPage = parseInt(resolvedParams?.page ?? '1', 10);

    // Validar página
    if (isNaN(currentPage) || currentPage < 1) {
      redirect('/blogflorescerhumano/artigos');
    }

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
      throw new Error('Falha ao carregar artigos');
    }
    const totalPages = totalCount ? Math.ceil(totalCount / ARTICLES_PER_PAGE) : 1;

    // Validar se a página existe
    if (currentPage > totalPages && totalPages > 0) {
      redirect('/blogflorescerhumano/artigos');
    }

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
      throw new Error('Falha ao buscar artigos');
    }

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section - MODELO ADAPTADO */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#F8F5F0]">
        {/* Mobile: Banner tradicional */}
        <div className="md:hidden relative h-full">
          <BannerImage
            bannerPath="/blogflorescerhumano/banners-blog/banner-artigos.webp" // CAMINHO DA IMAGEM PARA ARTIGOS
            fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp" // FALLBACK
            alt="Banner de Artigos do Blog Florescer Humano" // TEXTO ALT
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/80 via-[#583B1F]/30 to-transparent" /> {/* Gradiente do modelo */}

          {/* Conteúdo mobile centralizado */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mb-6 rounded-full shadow-md"></div> {/* Ornamento do modelo */}
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']"> {/* Mantendo Old_Roman e classes do modelo */}
                Artigos {/* TÍTULO ATUALIZADO */}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md font-sans"> {/* font-sans do modelo */}
                Explore todos os conhecimentos compartilhados em nossos artigos de psicologia humanista {/* DESCRIÇÃO ATUALIZADA */}
              </p>
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mt-6 rounded-full shadow-md"></div> {/* Ornamento do modelo */}
            </div>
          </div>
        </div>

        {/* Desktop: Split layout aprimorado */}
        <div className="hidden md:flex h-full">
          {/* Lado esquerdo: Conteúdo com elementos decorativos */}
          <div className="w-1/2 bg-gradient-to-br from-[#583B1F] via-[#5B3E22] to-[#583B1F] flex flex-col justify-center px-8 lg:px-12 relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-[#A57C3A] blur-xl"></div>
              <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-[#6B7B3F] blur-2xl"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-[#A57C3A] blur-lg"></div>
            </div>

            <div className="relative z-10 animate-in fade-in slide-in-from-left-6 duration-1000">
              {/* Ornamento superior */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-[#A57C3A] rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mx-3 shadow-lg"></div>
                <div className="w-8 h-1 bg-[#A57C3A]/60 rounded-full shadow-lg"></div>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 font-['Old_Roman'] leading-tight"> {/* Mantendo Old_Roman e classes do modelo */}
                Artigos {/* TÍTULO ATUALIZADO */}
              </h1>

              <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-sans mb-8 max-w-md"> {/* font-sans do modelo */}
                Explore todos os conhecimentos compartilhados em nossos artigos de psicologia humanista {/* DESCRIÇÃO ATUALIZADA */}
              </p>

              {/* O botão "Ver Todas as Categorias" foi removido pois esta página já lista os artigos.
                  Se precisar de um botão aqui, ele pode ser adicionado similar ao modelo de categorias.
              */}

              {/* Ornamento inferior */}
              <div className="flex items-center">
                <div className="w-8 h-1 bg-[#A57C3A]/60 rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mx-3 shadow-lg"></div>
                <div className="w-12 h-1 bg-[#A57C3A] rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Lado direito: Imagem com moldura elegante */}
          <div className="w-1/2 relative">
            {/* Moldura decorativa */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#A57C3A]/20 via-transparent to-[#6B7B3F]/20 z-10 pointer-events-none"></div>
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-[#A57C3A]/30 rounded-lg z-10 pointer-events-none"></div>

            {/* Elementos decorativos nos cantos */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-[#A57C3A] rounded-tl-lg z-20"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-[#A57C3A] rounded-tr-lg z-20"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-[#A57C3A] rounded-bl-lg z-20"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-[#A57C3A] rounded-br-lg z-20"></div>
            <BannerImage
              bannerPath="/blogflorescerhumano/banners-blog/banner-artigos.webp" // CAMINHO DA IMAGEM PARA ARTIGOS
              fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp" // FALLBACK
              alt="Banner de Artigos do Blog Florescer Humano" // TEXTO ALT
              className="animate-in fade-in slide-in-from-right-6 duration-1000 delay-300 hover:scale-105 transition-transform"
            />

            {/* Overlay sutil com padrão */}
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
                <Home className="h-4 w-4 mr-1" />                Início
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li>
              <Link
                href="/blogflorescerhumano"
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >                Blog
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li className="text-[#583B1F] font-medium">
              Artigos
            </li>
          </ol>
        </div>
      </nav>      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 pt-8">
        {/* Stats Section REMOVIDA */}

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
                    tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3} // Exemplo simples
                    numeroComentarios={0} // Exemplo
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
          />        </Suspense>
      </main>
    </div>
  );
  } catch (error) {
    console.error('Erro na página de artigos:', error);
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#583B1F] mb-4">
            Erro ao carregar artigos
          </h1>
          <p className="text-[#735B43] mb-4">
            Ocorreu um problema ao carregar os artigos. Tente novamente.
          </p>
          <Link
            href="/blogflorescerhumano"
            className="bg-[#583B1F] text-white px-6 py-3 rounded-lg hover:bg-[#735B43] transition-colors"
          >
            Voltar ao Blog
          </Link>
        </div>
      </div>
    );
  }
}




// // app/blogflorescerhumano/artigos/page.tsx
// import React, { Suspense } from 'react';
// import { supabaseServer } from '@/lib/supabase/server';
// import type { Database } from '@/types/supabase';
// import ArticleCardBlog from '../components/ArticleCardBlog';
// import PaginationControls from '../components/PaginationControls';
// import type { Metadata } from 'next';
// import { ResolvingMetadata } from 'next';
// import Link from 'next/link';
// import { Home, ChevronRight } from 'lucide-react';
// import BannerImage from '../components/BannerImage';
// import { redirect } from 'next/navigation';

// // Força renderização dinâmica para Next.js 15
// export const dynamic = 'force-dynamic';

// // --- Metadados dinâmicos para SEO conforme paginação --- //
// export async function generateMetadata(
//   { searchParams }: { searchParams: Promise<{ page?: string }> },
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const resolvedParams = await searchParams;
//   const currentPage = parseInt(resolvedParams?.page ?? '1', 10);
//   const isFirstPage = currentPage === 1;
//   const pageTitle = isFirstPage
//     ? 'Todos os Artigos | Blog Florescer Humano'
//     : `Todos os Artigos - Página ${currentPage} | Blog Florescer Humano`;
//   const pageDescription = isFirstPage
//     ? 'Navegue por todos os artigos publicados no Blog Florescer Humano sobre psicologia humanista, autoconhecimento e bem-estar.'
//     : `Página ${currentPage} da lista de artigos publicados no Blog Florescer Humano sobre psicologia humanista, autoconhecimento e bem-estar.`;
//   const canonicalUrl = isFirstPage
//     ? '/blogflorescerhumano/artigos'
//     : `/blogflorescerhumano/artigos?page=${currentPage}`;

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
//       locale: 'pt_BR',
//       type: 'website',
//     },
//     twitter: {
//       card: 'summary',
//       title: pageTitle,
//       description: pageDescription,
//     },
//   };
// }

// // Tipagem para o artigo com slug da categoria
// type ArtigoComCategoriaSlug = Database['public']['Tables']['artigos']['Row'] & {
//   categorias: {
//     id: string;
//     nome: string | null;
//     slug: string;
//   } | null;  
//   autor: {
//     id: string;
//     nome: string | null;
//     foto_arquivo: string | null;
//     biografia: string | null;
//   } | null;
//   tags: {
//     id: number;
//     nome: string;
//     slug: string;
//   }[] | null;
// };

// // Define quantos artigos serão exibidos por página
// const ARTICLES_PER_PAGE = 6;

// // Define as props da página, incluindo searchParams para paginação
// interface TodosArtigosPageProps {
//   searchParams: Promise<{
//     page?: string;
//   }>;
// }

// export default async function TodosArtigosPage({ searchParams }: TodosArtigosPageProps) {
//   try {
//     // --- Lógica de Paginação --- //
//     const resolvedParams = await searchParams;
//     const currentPage = parseInt(resolvedParams?.page ?? '1', 10);
    
//     // Validar página
//     if (isNaN(currentPage) || currentPage < 1) {
//       redirect('/blogflorescerhumano/artigos');
//     }
    
//     const from = (currentPage - 1) * ARTICLES_PER_PAGE;
//     const to = from + ARTICLES_PER_PAGE - 1;

//     // --- Busca da Contagem Total de Artigos --- //
//     const { count: totalCount, error: countError } = await supabaseServer
//       .from('artigos')
//       .select('* ', { count: 'exact', head: true })
//       .eq('status', 'publicado')
//       .lte('data_publicacao', new Date().toISOString());
    
//     if (countError) {
//       console.error('Erro ao contar todos os artigos:', countError);
//       throw new Error('Falha ao carregar artigos');
//     }
//     const totalPages = totalCount ? Math.ceil(totalCount / ARTICLES_PER_PAGE) : 1;
    
//     // Validar se a página existe
//     if (currentPage > totalPages && totalPages > 0) {
//       redirect('/blogflorescerhumano/artigos');
//     }
    
//     // --- Busca de Artigos da Página Atual --- //
//     const { data: artigos, error } = await supabaseServer
//       .from('artigos')
//       .select(`
//         id,
//         titulo,
//         slug,
//         resumo,
//         imagem_capa_arquivo,
//         data_publicacao,
//         data_atualizacao,
//         autor:autores (
//           id,
//           nome,
//           foto_arquivo,
//           biografia
//         ),      
//         categorias ( 
//           id,
//           nome,
//           slug 
//         ),
//         tags ( 
//           id,
//           nome,
//           slug 
//         )
//       `)
//       .eq('status', 'publicado')
//       .lte('data_publicacao', new Date().toISOString())
//       .order('data_publicacao', { ascending: false })
//       .range(from, to)
//       .returns<ArtigoComCategoriaSlug[]>();

//     if (error) {
//       console.error(`Erro ao buscar artigos (Página ${currentPage}):`, error);
//       throw new Error('Falha ao buscar artigos');
//     }

//   return (
//     <div className="min-h-screen bg-[#F8F5F0]">
//       {/* Hero Banner Section */}      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
//         <BannerImage 
//           bannerPath="/blogflorescerhumano/banners-blog/banner-artigos.webp"
//           fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
//           alt="Banner de Artigos do Blog Florescer Humano"
//         />
        
//         {/* Hero Content Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent" />
//         <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
//           <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
//               Artigos
//             </h1>
//             <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
//               Explore todos os conhecimentos compartilhados em nossos artigos de psicologia humanista
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Breadcrumb Navigation */}
//       <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-3">
//           <ol className="flex items-center space-x-2 text-sm">
//             <li>
//               <Link 
//                 href="/" 
//                 className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
//               >
//                 <Home className="h-4 w-4 mr-1" />                Início
//               </Link>
//             </li>
//             <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
//             <li>
//               <Link 
//                 href="/blogflorescerhumano" 
//                 className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
//               >                Blog
//               </Link>
//             </li>
//             <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
//             <li className="text-[#583B1F] font-medium">
//               Artigos
//             </li>
//           </ol>
//         </div>
//       </nav>      {/* Main Content */}
//       <main className="container mx-auto px-4 pb-12 pt-8">
//         {/* Stats Section REMOVIDA */}

//         {/* Articles Grid */}
//         <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
//           {artigos && artigos.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//               {artigos.map((artigo) => 
//                 artigo.slug && artigo.categorias?.slug ? (
//                   <ArticleCardBlog
//                     key={artigo.id}
//                     titulo={artigo.titulo ?? 'Artigo sem título'}
//                     resumo={artigo.resumo ?? undefined}
//                     slug={artigo.slug}
//                     categoriaSlug={artigo.categorias.slug}
//                     imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
//                     autor={{
//                       nome: artigo.autor?.nome ?? "Psicólogo Daniel Dantas",
//                       fotoUrl: artigo.autor?.foto_arquivo 
//                         ? `/blogflorescerhumano/autores/${artigo.autor.foto_arquivo}` 
//                         : "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
//                     }}
//                     dataPublicacao={artigo.data_publicacao ?? undefined}
//                     dataAtualizacao={artigo.data_atualizacao ?? undefined}
//                     categoria={artigo.categorias?.nome ?? undefined}
//                     tags={artigo.tags ?? []}
//                     tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
//                     numeroComentarios={0}
//                     tipoConteudo="artigo"
//                   />
//                 ) : null
//               )}
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-lg p-12 border border-[#C19A6B]/20 text-center">
//               <p className="text-xl text-[#583B1F]">
//                 {error
//                   ? 'Não foi possível carregar os artigos no momento.'
//                   : currentPage > 1 
//                     ? 'Não há mais artigos para exibir.' 
//                     : 'Nenhum artigo publicado ainda.'
//                 }
//               </p>
//             </div>
//           )}
//         </section>

//         {/* Adiciona controles de paginação */}
//         <Suspense fallback={null}>
//           <PaginationControls
//             currentPage={currentPage}
//             totalCount={totalCount ?? 0}
//             pageSize={ARTICLES_PER_PAGE}
//             basePath="/blogflorescerhumano/artigos"
//           />        </Suspense>
//       </main>
//     </div>
//   );
//   } catch (error) {
//     console.error('Erro na página de artigos:', error);
//     return (
//       <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-[#583B1F] mb-4">
//             Erro ao carregar artigos
//           </h1>
//           <p className="text-[#735B43] mb-4">
//             Ocorreu um problema ao carregar os artigos. Tente novamente.
//           </p>
//           <Link 
//             href="/blogflorescerhumano" 
//             className="bg-[#583B1F] text-white px-6 py-3 rounded-lg hover:bg-[#735B43] transition-colors"
//           >
//             Voltar ao Blog
//           </Link>
//         </div>
//       </div>
//     );
//   }
// }
