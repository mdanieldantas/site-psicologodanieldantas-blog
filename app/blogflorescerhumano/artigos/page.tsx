// app/blogflorescerhumano/artigos/page.tsx
import React from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import type { Metadata } from 'next';

// --- Metadados para a Página de Todos os Artigos --- //
export const metadata: Metadata = {
  title: 'Todos os Artigos | Blog Florescer Humano',
  description: 'Navegue por todos os artigos publicados no Blog Florescer Humano sobre psicologia humanista, autoconhecimento e bem-estar.',
  alternates: {
    canonical: '/blogflorescerhumano/artigos',
  },
  openGraph: {
    title: 'Todos os Artigos | Blog Florescer Humano',
    description: 'Navegue por todos os artigos publicados no Blog Florescer Humano.',
    url: '/blogflorescerhumano/artigos',
    siteName: 'Blog Florescer Humano',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Todos os Artigos | Blog Florescer Humano',
    description: 'Navegue por todos os artigos publicados no Blog Florescer Humano.',
  },
};

// Tipagem para o artigo com slug da categoria
type ArtigoComCategoriaSlug = Database['public']['Tables']['artigos']['Row'] & {
  categorias: { slug: string } | null;
};

// TODO: Implementar paginação no futuro
// const ITEMS_PER_PAGE = 9;

export default async function TodosArtigosPage() {
  // Por enquanto, busca todos os artigos. Adicionar paginação depois se necessário.
  const { data: artigos, error } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      slug,
      resumo,
      imagem_capa_arquivo,
      data_publicacao,
      categorias ( slug )
    `)
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .order('data_publicacao', { ascending: false })
    // .limit(ITEMS_PER_PAGE) // Descomentar para paginação
    // .range(startIndex, endIndex) // Para paginação
    .returns<ArtigoComCategoriaSlug[]>();

  if (error) {
    console.error('Erro ao buscar todos os artigos:', error);
    // Considerar mostrar um erro mais explícito para o usuário
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Todos os Artigos
      </h1>

      <section>
        {artigos && artigos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artigos.map((artigo) => (
              // Verifica se temos slug do artigo e da categoria antes de renderizar
              artigo.slug && artigo.categorias?.slug && (
                <ArticleCardBlog
                  key={artigo.id}
                  titulo={artigo.titulo ?? 'Artigo sem título'}
                  resumo={artigo.resumo ?? undefined}
                  slug={artigo.slug}
                  categoriaSlug={artigo.categorias.slug}
                  imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
                />
              )
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {error ? 'Não foi possível carregar os artigos no momento.' : 'Nenhum artigo publicado ainda.'}
          </p>
        )}
      </section>

      {/* TODO: Adicionar controles de paginação aqui */}
    </main>
  );
}
