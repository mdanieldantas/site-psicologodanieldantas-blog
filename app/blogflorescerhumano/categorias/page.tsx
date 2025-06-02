// app/blogflorescerhumano/categorias/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import type { Metadata } from 'next';
import Link from 'next/link';
import PaginationControls from '../components/PaginationControls';
import BlogCategoryCard from '@/app/blogflorescerhumano/components/blog-category-card';
import { ChevronRight, Home } from 'lucide-react';
import BannerImage from '../components/BannerImage';

type Categoria = Database['public']['Tables']['categorias']['Row'];

// Adicionar Metadados Estáticos
export const metadata: Metadata = {
  title: 'Categorias | Blog Florescer Humano',
  description: 'Explore os artigos do Blog Florescer Humano por categoria, abordando temas como autoconhecimento, bem-estar, relacionamentos e psicologia humanista.',
  alternates: {
    canonical: '/blogflorescerhumano/categorias',
  },
  openGraph: {
    title: 'Categorias | Blog Florescer Humano',
    description: 'Explore os artigos do Blog Florescer Humano por categoria.',
    url: '/blogflorescerhumano/categorias',
    siteName: 'Blog Florescer Humano',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Categorias | Blog Florescer Humano',
    description: 'Explore os artigos do Blog Florescer Humano por categoria.',
  },
};

// Define quantas categorias serão exibidas por página
const CATEGORIES_PER_PAGE = 9; // Ajuste conforme necessário

// Força renderização dinâmica para Next.js 15
export const dynamic = 'force-dynamic';

// Cria uma função estática para processar a página no build time (em vez de usar searchParams diretamente)
export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {  // --- Lógica de Paginação --- //
  // Aguardar searchParams antes de acessar suas propriedades
  const resolvedParams = await searchParams;
  const page = resolvedParams['page'] ?? "1";
  const currentPage = parseInt(page, 10);
  const from = (currentPage - 1) * CATEGORIES_PER_PAGE;
  const to = from + CATEGORIES_PER_PAGE - 1;

  // --- Busca da Contagem Total de Categorias --- //
  const { count: totalCount, error: countError } = await supabaseServer
    .from('categorias')
    .select('*', { count: 'exact', head: true }); // Conta todas as categorias

  if (countError) {
    console.error('Erro ao contar categorias:', countError);
    // Considerar como lidar com este erro
  }

  const totalPages = totalCount ? Math.ceil(totalCount / CATEGORIES_PER_PAGE) : 1;
  // --- Busca de Categorias da Página Atual --- //
  const { data: categorias, error } = await supabaseServer
    .from('categorias')
    .select('*') // Busca todos os campos
    .order('nome', { ascending: true }) // Ordena por nome
    .range(from, to); // Aplica o range para a paginação

  // --- Tratamento de Erro --- //
  if (error) {
    console.error(`Erro ao buscar categorias (Página ${currentPage}):`, error);
    // Poderia retornar uma mensagem de erro mais explícita aqui
  }

  // Log para depuração
  console.log(`Categorias - Página Atual: ${currentPage}, Total de Categorias: ${totalCount}, Total de Páginas: ${totalPages}`);  return (
    <div className="min-h-screen bg-[#F8F5F0]">      {/* Hero Banner Section - Split Screen com Designer Guide */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#F8F5F0]">
        {/* Mobile: Banner tradicional */}
        <div className="md:hidden relative h-full">
          <BannerImage 
            bannerPath="/blogflorescerhumano/banners-blog/categories-banner.webp"
            fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
            alt="Banner de Categorias do Blog Florescer Humano"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/80 via-[#583B1F]/30 to-transparent" />
          
          {/* Conteúdo mobile centralizado */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mb-6 rounded-full shadow-md"></div>
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg font-serif">
                Categorias
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md font-sans">
                Explore os artigos organizados por temas para encontrar exatamente o que procura
              </p>
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mt-6 rounded-full shadow-md"></div>
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
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 font-serif leading-tight">
                Categorias
              </h1>
              
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-sans mb-8 max-w-md">
                Explore os artigos organizados por temas para encontrar exatamente o que procura
              </p>
                {/* CTA Button seguindo o padrão do designer guide */}
              {/* <div className="mb-6">
                <button className="px-6 py-2 bg-[#6B7B3F] text-white rounded-md font-medium font-sans transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:bg-[#5B6B35] animate-in fade-in slide-in-from-left-6 delay-300">
                  Ver Todas as Categorias
                </button>
              </div> */}
              
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
              bannerPath="/blogflorescerhumano/banners-blog/categories-banner.webp"
              fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
              alt="Banner de Categorias do Blog Florescer Humano"
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
          <ol className="flex items-center space-x-2 text-sm">            <li>
              <Link 
                href="/" 
                className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-1" />
                Início
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li>
              <Link 
                href="/blogflorescerhumano" 
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li className="text-[#583B1F] font-medium">
              Categorias
            </li>
          </ol>
        </div>
      </nav>      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 pt-8">        {/* Categories Grid - Usando o mesmo estilo da página inicial */}
        {categorias && categorias.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            {/* Primeira categoria em destaque (se houver) */}
            {categorias.length > 0 && (
              <div className="mb-12">
                <div className="relative animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-700 delay-300">
                  {/* Badge de destaque */}
                  <div className="absolute -top-3 -right-3 z-10 animate-in fade-in zoom-in-95 duration-500 delay-800">
                    <div className="bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ✨ Em Destaque
                    </div>
                  </div>
                  <BlogCategoryCard 
                    category={categorias[0]}
                    variant="visual"
                    showImage={true}
                    featured={true}
                    className="transform hover:scale-[1.02] transition-all duration-300"
                  />
                </div>
              </div>
            )}
            
            {/* Grid das demais categorias */}
            {categorias.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {categorias.slice(1).map((categoria, index) => (
                  <div
                    key={categoria.id}
                    className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700"
                    style={{
                      animationDelay: `${800 + (index * 100)}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <BlogCategoryCard 
                      category={categoria}
                      variant="visual"
                      showImage={true}
                      featured={false}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>        ) : (
          /* Estado vazio com design aprimorado */
          <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-700">
            <div className="max-w-md mx-auto">
              {/* Ícone decorativo */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#A57C3A]/10 to-[#6B7B3F]/10 rounded-full mb-8 animate-pulse">
                <svg className="w-10 h-10 text-[#735B43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-[#583B1F] mb-4 font-['Old_Roman']">
                {error ? 'Erro ao carregar categorias' : 'Nenhuma categoria encontrada'}
              </h3>
              
              <p className="text-lg text-[#735B43] leading-relaxed">
                {error
                  ? 'Não foi possível carregar as categorias no momento. Tente novamente mais tarde.'
                  : currentPage > 1 
                    ? 'Não há mais categorias para exibir nesta página.' 
                    : 'Estamos preparando conteúdo incrível para você. Volte em breve para explorar nossos temas.'
                }
              </p>
              
              {/* Decoração visual */}
              <div className="flex justify-center items-center mt-8">
                <div className="w-8 h-1 bg-[#A57C3A]/30 rounded-full"></div>
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mx-3"></div>
                <div className="w-8 h-1 bg-[#A57C3A]/30 rounded-full"></div>
              </div>
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
                pageSize={CATEGORIES_PER_PAGE}
                basePath="/blogflorescerhumano/categorias"
              />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
}
