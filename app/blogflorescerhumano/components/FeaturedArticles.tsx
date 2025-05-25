import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
  if (!articles?.length) return null;

  return (
    <section className="py-12" id="featured-articles">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light text-[#583B1F]">Artigos em Destaque</h2>
          <Link 
            href="/blogflorescerhumano/artigos" 
            className="inline-flex items-center px-5 py-2 rounded-md text-white bg-[#C19A6B] hover:bg-[#583B1F] transition-colors duration-300 shadow-sm group"
          >
            Ver todos
            <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCardBlog
              key={article.id}
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
          ))}
        </div>
      </div>
    </section>
  );
}
