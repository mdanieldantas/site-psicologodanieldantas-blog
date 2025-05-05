// app/blogflorescerhumano/page.tsx
import React from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import type { Metadata } from 'next';
import ExploreCategoriesGrid from './components/ExploreCategoriesGrid';
import FeaturedArticles from './components/FeaturedArticles';
import RecentMaterials from './components/RecentMaterials';

// --- Metadados Estáticos para a Página Inicial do Blog --- //
export const metadata: Metadata = {
  title: 'Blog Florescer Humano | Psicologia Humanista e Autoconhecimento',
  description: 'Explore artigos sobre autoconhecimento, bem-estar, relacionamentos e crescimento pessoal através da perspectiva da psicologia humanista no Blog Florescer Humano.',
  alternates: {
    canonical: '/blogflorescerhumano',
  },
  // OpenGraph e Twitter podem ser adicionados depois se necessário
};

export default async function BlogHomePage() {
  // Buscar categorias e artigos em destaque
  const [categoriesResponse, articlesResponse] = await Promise.all([
    supabaseServer
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true }),
    
    supabaseServer
      .from('artigos')
      .select(`
        *,
        categorias (
          slug
        )
      `)
      .order('data_publicacao', { ascending: false })
      .limit(3)
  ]);

  const { data: categories } = categoriesResponse;
  const { data: featuredArticles } = articlesResponse;

  return (
    <main className="flex-1">
      {/* Hero Section - Altura ajustada para desktop */}
      <section className="relative h-screen md:h-[90vh] bg-[url('/blogflorescerhumano/banners-blog/hero-home-mulher-blog.png')] bg-cover bg-center">
        {/* Overlay com gradiente mais forte para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F8F5F0]/70" />
        
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-light mb-8 font-['Old Roman'] tracking-wide drop-shadow-lg">
              Florescer Humano
            </h1>
            <div className="w-24 h-0.5 bg-[#C19A6B] mx-auto mb-8" />
            <p className="text-xl md:text-2xl text-white/95 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              Explorando o potencial humano através da psicologia humanista, arte, educação e filosofia.
            </p>
          </div>
        </div>

        {/* Seta indicativa de scroll */}
        <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-center">
          <div className="w-8 h-16 text-[#C19A6B] animate-bounce cursor-pointer hover:text-[#735B43] transition-colors duration-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-full h-full drop-shadow-md"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        {/* Gradiente de transição na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F5F0] to-transparent" />
      </section>

      <div className="space-y-12 bg-[#F8F5F0]">
        {/* Artigos em Destaque */}
        {featuredArticles && featuredArticles.length > 0 && (
          <FeaturedArticles articles={featuredArticles} />
        )}

        {/* Grid de Categorias */}
        {categories && categories.length > 0 && (
          <ExploreCategoriesGrid categories={categories} />
        )}

        {/* Materiais Recentes */}
        <RecentMaterials />
      </div>
    </main>
  );
}
