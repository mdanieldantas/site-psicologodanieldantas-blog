// app/blogflorescerhumano/components/RelatedArticles.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from './ArticleCardBlog'; // Reutiliza o card

// Tipagem para os artigos relacionados, incluindo slug da categoria
type RelatedArticle = Pick<
  Database['public']['Tables']['artigos']['Row'],
  'id' | 'titulo' | 'slug' | 'resumo' | 'imagem_capa_arquivo'
> & {
  categorias: { slug: string } | null;
};

interface RelatedArticlesProps {
  currentArticleId: number;
  // Ajusta a tipagem para esperar 'nome' em vez de 'name'
  tags: { id: number; nome: string; slug: string }[] | null;
  limit?: number; // Número máximo de artigos relacionados a exibir
}

export default async function RelatedArticles({ currentArticleId, tags, limit = 3 }: RelatedArticlesProps) {
  // Se não houver tags, não podemos buscar relacionados por tag
  if (!tags || tags.length === 0) {
    return null; // Ou poderia buscar por categoria, mas vamos manter simples por tag por enquanto
  }

  const tagIds = tags.map(tag => tag.id);

  // --- Busca Artigos Relacionados --- //
  // 1. Encontra IDs de artigos que compartilham pelo menos uma tag
  // 2. Filtra o artigo atual
  // 3. Limita o número de resultados
  // 4. Seleciona os campos necessários para o card, incluindo o slug da categoria

  // Usamos uma RPC (Remote Procedure Call) ou uma view no Supabase para isso seria mais eficiente.
  // Como alternativa, fazemos uma query que busca artigos que têm *alguma* das tags.
  // Isso pode trazer artigos não tão relevantes se uma tag for muito genérica.

  const { data: relatedArticles, error } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      slug,
      resumo,
      imagem_capa_arquivo,
      categorias ( slug ),
      tags!inner ( id )
    `)
    .in('tags.id', tagIds) // Artigos que têm PELO MENOS UMA das tags
    .neq('id', currentArticleId) // Exclui o artigo atual
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .order('data_publicacao', { ascending: false })
    .limit(limit)
    .returns<RelatedArticle[]>(); // Especifica o tipo de retorno

  if (error) {
    console.error('Erro ao buscar artigos relacionados:', error);
    return null; // Não quebra a página se a busca falhar
  }

  if (!relatedArticles || relatedArticles.length === 0) {
    return null; // Não mostra a seção se não houver artigos relacionados
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {relatedArticles.map((artigo) => (
        <ArticleCardBlog
          key={artigo.id}
          titulo={artigo.titulo ?? 'Artigo sem título'}
          resumo={artigo.resumo ?? undefined}
          slug={artigo.slug ?? ''}
          categoriaSlug={artigo.categorias?.slug ?? 'sem-categoria'}
          imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
        />
      ))}
      {relatedArticles.length < limit && (
        <div className="hidden md:flex items-center justify-center col-span-1 h-full">
          <Link 
            href="/blogflorescerhumano" 
            className="flex flex-col items-center justify-center p-6 h-full w-full border-2 border-dashed border-[#C19A6B]/30 rounded-lg bg-[#F8F5F0]/30 hover:bg-[#F8F5F0]/70 hover:border-[#C19A6B]/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#F8F5F0]/70 flex items-center justify-center mb-3 group-hover:bg-white transition-colors duration-300">
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
        </div>
      )}
    </div>
  );
}
