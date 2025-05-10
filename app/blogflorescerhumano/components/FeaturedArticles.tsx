import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
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
    <section className="py-12" id="featured-articles">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light text-[#583B1F]">Artigos em Destaque</h2>
          <Link 
            href="/blogflorescerhumano/artigos" 
            className="inline-flex items-center px-5 py-2 rounded-md text-white bg-[#C19A6B] hover:bg-[#583B1F] transition-colors duration-300 shadow-sm group"
            aria-label="Ver todos os artigos"
          >
            Ver todos
            <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>        <div className="flex flex-col space-y-6">
          {articles.map((article, index) => (
            <Link 
              key={article.id}
              href={`/blogflorescerhumano/${article.categorias?.slug ?? 'sem-categoria'}/${article.slug}`}
              className="block group transform hover:-translate-y-1 transition-all duration-300"            ><article className={`article-card-animate bg-white rounded-lg overflow-hidden border ${index === 0 ? 'border-[#C19A6B] border-glow' : 'border-[#E7DFD3]'} shadow-md hover:shadow-xl transition-all duration-300`}>
                <div className="flex flex-col md:flex-row">
                  {/* Imagem do artigo - Altura padronizada */}
                  <div className={`relative w-full ${index === 0 ? 'md:w-1/2' : 'md:w-2/5'} h-64 ${index === 0 ? 'md:h-[300px]' : 'md:h-[260px]'}`}>
                    <Image
                      src={`/blogflorescerhumano/${article.imagem_capa_arquivo}` || '/blogflorescerhumano/placeholder.jpg'}
                      alt={article.titulo || 'Artigo em destaque'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      loading="eager"
                      priority={index === 0}
                    />
                    {/* Efeito de hover na imagem */}
                    <div className="absolute inset-0 bg-[#583B1F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    
                    {/* Badge de destaque apenas para o primeiro artigo */}
                    {index === 0 && (
                      <div className="absolute top-3 right-3 bg-[#C19A6B] text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                        Em destaque
                      </div>
                    )}
                  </div>
                  
                  {/* Conteúdo do artigo */}
                  <div className="flex flex-col flex-grow p-6 md:p-8 border-l-4 border-[#C19A6B]">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Tag da categoria */}
                      {article.categorias?.slug && (
                        <span className="inline-block px-3 py-1 bg-[#F5F2EE] text-[#735B43] text-xs rounded-full">
                          {article.categorias.slug.replace(/-/g, ' ')}
                        </span>
                      )}
                      
                      {/* Tempo estimado de leitura */}
                      <span className="inline-flex items-center px-3 py-1 bg-[#F5F2EE] text-[#735B43] text-xs rounded-full">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.ceil((article.resumo?.length || 0) / 200) + 3} min
                      </span>
                    </div>
                    
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
                    <span className="inline-flex items-center text-sm font-medium text-[#583B1F] group-hover:text-[#C19A6B] transition-colors duration-300 mt-auto">
                      Ler artigo completo
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}        </div>
          {/* Paginação aprimorada */}
        <div className="flex justify-center mt-12">
          <nav aria-label="Navegação de página" className="flex items-center space-x-1 bg-white p-1.5 rounded-lg shadow-sm border border-[#E7DFD3]">
            <a 
              href="#" 
              className="p-2 rounded-md text-[#735B43] hover:bg-[#F5F2EE] transition-colors duration-300 flex items-center" 
              aria-label="Página anterior"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-md bg-[#C19A6B] text-white hover:bg-[#583B1F] transition-colors duration-300">1</a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-md text-[#735B43] hover:bg-[#F5F2EE] transition-colors duration-300">2</a>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-md text-[#735B43] hover:bg-[#F5F2EE] transition-colors duration-300">3</a>
            <span className="w-9 h-9 flex items-center justify-center text-[#735B43]">...</span>
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-md text-[#735B43] hover:bg-[#F5F2EE] transition-colors duration-300">10</a>
            <a 
              href="#" 
              className="p-2 rounded-md text-[#735B43] hover:bg-[#F5F2EE] transition-colors duration-300 flex items-center" 
              aria-label="Próxima página"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
