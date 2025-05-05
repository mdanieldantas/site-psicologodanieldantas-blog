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
    <main className="flex-1 bg-[#F8F5F0]">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] bg-[url('/blogflorescerhumano/banner-bg-florescer-humano.jpg')] bg-cover bg-center flex items-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-light mb-6 font-['Old Roman']">
            Florescer Humano
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-light">
            Explorando o potencial humano através da psicologia humanista, arte, educação e filosofia.
          </p>
        </div>
      </section>

      <div className="space-y-12">
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
