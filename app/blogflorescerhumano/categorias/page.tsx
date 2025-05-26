// app/blogflorescerhumano/categorias/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PaginationControls from '../components/PaginationControls';
import BlogCategoryCard from '@/components/blog-category-card';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

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

// Cria uma função estática para processar a página no build time (em vez de usar searchParams diretamente)
export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {  // --- Lógica de Paginação --- //
  // Acesso às propriedades com sintaxe de colchetes
  const page = searchParams['page'] ?? "1";
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
  console.log(`Categorias - Página Atual: ${currentPage}, Total de Categorias: ${totalCount}, Total de Páginas: ${totalPages}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner Section */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src="/blogflorescerhumano/banners-blog/categories-banner.webp"
          alt="Banner de Categorias do Blog Florescer Humano"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Categorias
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Explore os artigos organizados por temas para encontrar exatamente o que procura
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                Início
              </Link>
            </li>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <li>
              <Link 
                href="/blogflorescerhumano" 
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <li className="text-gray-900 font-medium">
              Categorias
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-gray-900">
                  {totalCount || 0} {totalCount === 1 ? 'Categoria' : 'Categorias'}
                </p>
                <p className="text-gray-600">
                  Organizadas para facilitar sua navegação
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {categorias && categorias.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categorias.map((categoria, index) => (
                <div
                  key={categoria.id}
                  className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 hover:zoom-in-105 transition-all duration-300"
                  style={{
                    animationDelay: `${600 + (index * 100)}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="group h-full">
                    <BlogCategoryCard 
                      category={categoria}
                      variant="enhanced"
                      showImage={true}
                      className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 animate-in fade-in zoom-in-75 duration-700">
            <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {error ? 'Erro ao carregar' : 'Nenhuma categoria'}
              </h3>
              <p className="text-gray-500">
                {error
                  ? 'Não foi possível carregar as categorias no momento.'
                  : currentPage > 1 
                    ? 'Não há mais categorias para exibir.' 
                    : 'Nenhuma categoria encontrada.'
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
