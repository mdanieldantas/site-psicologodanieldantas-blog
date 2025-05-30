'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MotionDiv, staggerContainer, cardVariants } from '@/components/ui/motion-components';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from './ArticleCardBlog';

type ArtigoComCategoria = Database['public']['Tables']['artigos']['Row'] & {
  categorias: { slug: string } | null;
  tags?: Array<{ id: number; nome: string; slug: string; }> | null;
  autor?: {
    nome: string;
    fotoUrl?: string;
  };
};

interface FeaturedArticlesProps {
  articles: ArtigoComCategoria[];
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (!articles?.length) return null;  return (    <section className="pt-6 pb-16 bg-[#f9f6f2] relative overflow-hidden" id="featured-articles">
      
      <div className="container mx-auto px-4 relative">{/* Header da seção melhorado */}
        <div className="text-center mb-12 mt-0">          
          <h2 className="text-4xl md:text-5xl font-light text-[#583B1F] mb-4 font-['Old_Roman']">
            Artigos em 
            <span className="text-[#A57C3A] relative ml-2">
              Destaque
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] rounded-full opacity-60"></div>
            </span>
          </h2>
          
          <p className="text-[#7D6E63] text-lg max-w-2xl mx-auto leading-relaxed">
            Mergulhe em reflexões profundas e ferramentas práticas selecionadas especialmente para apoiar seu crescimento pessoal e bem-estar emocional.
          </p>
        </div>        {/* Grid de artigos com espaçamento melhorado */}
        <MotionDiv 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {articles.map((article, index) => (
            <MotionDiv
              key={article.id}
              variants={cardVariants}
            >
              <ArticleCardBlog
                titulo={article.titulo}
                resumo={article.resumo || undefined}
                slug={article.slug}
                categoriaSlug={article.categorias?.slug || 'sem-categoria'}
                imagemUrl={article.imagem_capa_arquivo || undefined}
                autor={{
                  nome: "Psicólogo Daniel Dantas",
                  fotoUrl: "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                }}
                dataPublicacao={article.data_publicacao || undefined}
                dataAtualizacao={article.data_atualizacao}
                categoria={article.categorias?.slug?.replace(/-/g, ' ')}
                tags={article.tags ?? []}
                tempoLeitura={Math.ceil((article.resumo?.length || 0) / 200) + 3}
                numeroComentarios={0}
                tipoConteudo="artigo"
              />
            </MotionDiv>
          ))}
        </MotionDiv>

        {/* CTA melhorado */}        <div className="text-center">
          <Link 
            href="/blogflorescerhumano/artigos" 
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#583B1F] text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-[#6B7B3F]"
          >
            <span>Ver todos os artigos</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
