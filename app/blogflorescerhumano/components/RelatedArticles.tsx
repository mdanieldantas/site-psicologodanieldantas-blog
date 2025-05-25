// app/blogflorescerhumano/components/RelatedArticles.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from './ArticleCardBlog';

// Tipagem para os artigos relacionados
type RelatedArticle = Pick<
  Database['public']['Tables']['artigos']['Row'],
  'id' | 'titulo' | 'slug' | 'resumo' | 'imagem_capa_arquivo' | 'data_publicacao' | 'data_atualizacao'
> & {
  categorias: { slug: string } | null;  tipo_conteudo?: 'artigo' | 'video' | 'podcast' | 'infografico';
};

interface RelatedArticlesProps {
  currentArticleId: number;
  tags: string[];  // tags do artigo atual para encontrar artigos similares
  limit?: number;
}

export default async function RelatedArticles({ currentArticleId, tags, limit = 3 }: RelatedArticlesProps) {
  let relatedArticles: RelatedArticle[] | null = null;

  try {
    const { data: relatedData } = await supabaseServer
      .from('artigos')      .select(`
        id,
        titulo,
        slug,
        resumo,
        imagem_capa_arquivo,
        data_publicacao,
        data_atualizacao,
        categorias (
          slug
        )
      `)
      .neq('id', currentArticleId)
      .eq('status', 'publicado')
      .limit(limit);

    relatedArticles = relatedData as RelatedArticle[];
  } catch (error) {
    console.error('Erro ao buscar artigos relacionados:', error);
    return null;
  }

  if (!relatedArticles || relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {relatedArticles.map((artigo) => (
        <ArticleCardBlog
          key={artigo.id}
          titulo={artigo.titulo}
          resumo={artigo.resumo || undefined}
          slug={artigo.slug}
          categoriaSlug={artigo.categorias?.slug || 'sem-categoria'}
          imagemUrl={artigo.imagem_capa_arquivo || undefined}
          autor={{
            nome: "Psicólogo Daniel Dantas",
            fotoUrl: "autores/mini-autores-daniel-psi-blog.webp"
          }}          dataPublicacao={artigo.data_publicacao || undefined}
          dataAtualizacao={artigo.data_atualizacao || undefined}
          categoria={artigo.categorias?.slug?.replace(/-/g, ' ')}
          tags={[]}
          tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
          numeroComentarios={0}
          tipoConteudo={'artigo'}
        />
      ))}
      {relatedArticles.length < limit && (
        <Link 
          href="/blogflorescerhumano/artigos" 
          className="relative bg-[#F8F5F0]/70 rounded-lg overflow-hidden h-full flex flex-col justify-center items-center p-8 border-[0.5px] border-[#C19A6B]/20 hover:bg-[#F8F5F0] transition-all duration-300 hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-[#F8F5F0] flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-[#C19A6B]"
            >
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
          </div>
          <span className="text-center text-[#583B1F] font-medium">Ver Mais Artigos</span>
        </Link>
      )}
    </div>
  );
}
