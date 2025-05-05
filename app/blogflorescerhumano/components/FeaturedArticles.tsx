import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Database } from '@/types/supabase';

type ArtigoComCategoria = Database['public']['Tables']['artigos']['Row'] & {
  categorias: { slug: string } | null;
};

interface FeaturedArticlesProps {
  articles: ArtigoComCategoria[];
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (!articles?.length) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light text-[#583B1F]">Artigos em Destaque</h2>
          <Link 
            href="/blogflorescerhumano/artigos" 
            className="text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300"
          >
            Ver todos
            <ArrowRight className="inline-block ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col space-y-6">
          {articles.map((article) => (
            <Link 
              key={article.id}
              href={`/blogflorescerhumano/${article.categorias?.slug ?? 'sem-categoria'}/${article.slug}`}
              className="group"
            >
              <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Imagem do artigo */}
                  <div className="relative w-full md:w-2/5 h-64 md:h-auto">
                    <Image
                      src={`/blogflorescerhumano/${article.imagem_capa_arquivo}` || '/blogflorescerhumano/placeholder.jpg'}
                      alt={article.titulo || 'Artigo em destaque'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                  
                  {/* Conteúdo do artigo */}
                  <div className="flex flex-col flex-grow p-6 md:p-8">
                    {article.data_publicacao && (
                      <time className="text-sm text-[#C19A6B] mb-2">
                        {new Date(article.data_publicacao).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </time>
                    )}
                    <h3 className="text-2xl font-light text-[#583B1F] mb-3 group-hover:text-[#C19A6B] transition-colors duration-300">
                      {article.titulo}
                    </h3>
                    {article.resumo && (
                      <p className="text-[#735B43] mb-4 line-clamp-3">
                        {article.resumo}
                      </p>
                    )}
                    <span className="inline-flex items-center text-sm text-[#583B1F] group-hover:text-[#C19A6B] transition-colors duration-300 mt-auto">
                      Ler artigo completo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
