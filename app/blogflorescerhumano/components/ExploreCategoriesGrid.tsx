'use client';

import React from 'react';
import BlogCategoryCard from '@/components/blog-category-card';
import type { Database } from '@/types/supabase';

type Categoria = Database['public']['Tables']['categorias']['Row'];

interface ExploreCategoriesGridProps {
  categories: Categoria[];
}

export default function ExploreCategoriesGrid({ categories }: ExploreCategoriesGridProps) {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#F8F5F0] via-[#F4EED9] to-[#F8F5F0] overflow-hidden">
      {/* Padrão decorativo de fundo */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#C19A6B] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#583B1F] rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header da seção melhorado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-[#C19A6B] to-[#735B43] rounded-full mb-6"></div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-center mb-6 text-[#583B1F] font-['Old_Roman'] tracking-wide">
            Explore por Categoria
          </h2>
          
          <p className="text-lg md:text-xl text-[#735B43] text-center max-w-3xl mx-auto font-light leading-relaxed opacity-90">
            Navegue pelos temas que mais ressoam com sua jornada de autoconhecimento e crescimento pessoal.
          </p>
        </div>        {/* Grid de categorias melhorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              className={`category-card-enter group transform transition-all duration-700 ease-out`}
              style={{ 
                animationDelay: `${index * 150}ms`
              }}
            >
              <BlogCategoryCard 
                category={category}
                variant="visual"
                showImage={true}
                className="h-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#583B1F]/20 group-hover:-translate-y-2"
              />
            </div>
          ))}
        </div>
        
        {/* Mensagem quando não há categorias */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#F8F5F0] flex items-center justify-center border-2 border-[#C19A6B]/20">
              <svg className="w-10 h-10 text-[#735B43]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#583B1F] mb-3 font-['Old_Roman']">
              Categorias em breve
            </h3>
            <p className="text-[#735B43] max-w-md mx-auto">
              Estamos preparando conteúdo incrível para você. Volte em breve para explorar nossos temas.
            </p>
          </div>        )}
      </div>
    </section>
  );
}
