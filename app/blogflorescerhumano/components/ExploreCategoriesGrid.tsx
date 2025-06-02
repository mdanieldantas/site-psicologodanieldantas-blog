'use client';

import React from 'react';
import { MotionDiv, MotionH2, MotionH3, MotionP, MotionSVG, staggerContainer, cardVariants } from '@/components/ui/motion-components';
import BlogCategoryCard from '@/app/blogflorescerhumano/components/blog-category-card';
import type { Database } from '@/types/supabase';

type Categoria = Database['public']['Tables']['categorias']['Row'];

interface ExploreCategoriesGridProps {
  categories: Categoria[];
}

export default function ExploreCategoriesGrid({ categories }: ExploreCategoriesGridProps) {
  // Separar categoria destaque (primeira) das demais
  const featuredCategory = categories[0];
  const regularCategories = categories.slice(1);

  // Variantes de animação para o container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Variantes específicas para categoria destaque
  const featuredVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1.2,
        delay: 0.2,
      },
    },
  };
  return (
    <section className="relative py-16 md:py-20 bg-[#F8F5F0] overflow-hidden">
      {/* Padrão decorativo de fundo sutil */}
      <MotionDiv 
        className="absolute inset-0 opacity-[0.02]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.02 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <MotionDiv 
          className="absolute top-0 left-0 w-96 h-96 bg-[#A57C3A] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <MotionDiv 
          className="absolute bottom-0 right-0 w-80 h-80 bg-[#6B7B3F] rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"
          animate={{ 
            scale: [1.05, 1, 1.05],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
        />
      </MotionDiv>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header da seção */}
        <MotionDiv 
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >          <MotionDiv 
            className="inline-flex items-center justify-center w-16 h-16 bg-[#E8E6E2] rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MotionSVG 
              className="w-8 h-8 text-[#6B7B3F]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </MotionSVG>
          </MotionDiv>

          <MotionH2 
            className="text-4xl md:text-5xl font-bold text-[#583B1F] mb-6 font-['Old_Roman']"
            variants={cardVariants}
          >
            Explore Nossas Categorias
          </MotionH2>          <MotionP 
            className="text-xl text-[#7D6E63] max-w-3xl mx-auto leading-relaxed"
            variants={cardVariants}
          >
            Descubra artigos cuidadosamente organizados em temas que nutrem o crescimento pessoal e o bem-estar emocional.
          </MotionP>
        </MotionDiv>

        {/* Grid de categorias */}
        {categories.length > 0 ? (
          <MotionDiv 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Categoria em destaque */}
            {featuredCategory && (
              <MotionDiv
                variants={featuredVariants}
                className="relative"
              >                <MotionDiv
                  className="absolute -top-3 -right-3 z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    ✨ Em Destaque
                  </div>
                </MotionDiv><BlogCategoryCard 
                  category={featuredCategory} 
                  variant="visual"
                  className="transform hover:scale-[1.02] transition-all duration-300"
                />
              </MotionDiv>
            )}

            {/* Grid das categorias regulares */}
            {regularCategories.length > 0 && (
              <MotionDiv 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                variants={containerVariants}
              >
                {regularCategories.map((category, index) => (
                  <MotionDiv 
                    key={category.id}
                    variants={cardVariants}
                    className="group"
                    style={{ 
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <BlogCategoryCard 
                      category={category} 
                      variant="visual"
                      featured={false}
                    />
                  </MotionDiv>
                ))}
              </MotionDiv>
            )}
          </MotionDiv>
        ) : (
          /* Estado vazio com animações */
          <MotionDiv 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >            <MotionDiv 
              className="inline-flex items-center justify-center w-20 h-20 bg-[#E8E6E2] rounded-full mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MotionSVG 
                className="w-10 h-10 text-[#6B7B3F]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </MotionSVG>
            </MotionDiv>
            <MotionH3 
              className="text-xl font-medium text-[#583B1F] mb-3 font-['Old_Roman']"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Categorias em breve
            </MotionH3>            <MotionP 
              className="text-[#7D6E63] max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Estamos preparando conteúdo incrível para você. Volte em breve para explorar nossos temas.
            </MotionP>
          </MotionDiv>
        )}
      </div>
    </section>
  );
}
