// app/blogflorescerhumano/page.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server'; // Ajustado para @/
import type { Database } from '@/types/supabase'; // Ajustado para @/
import ArticleCardBlog from './components/ArticleCardBlog';

type Artigo = Database['public']['Tables']['artigos']['Row'];
type ArtigoComCategoriaSlug = Artigo & {
  categorias: { slug: string } | null;
};

const LIMITE_ARTIGOS_HOME = 6;

export default async function BlogHomePage() {
  const { data: artigosRecentes, error } = await supabaseServer
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
    .limit(LIMITE_ARTIGOS_HOME)
    .returns<ArtigoComCategoriaSlug[]>();

  if (error) {
    console.error('Erro ao buscar artigos recentes:', error);
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Blog Florescer Humano
      </h1>
      <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Explore artigos sobre autoconhecimento, bem-estar e crescimento pessoal através da psicologia humanista.
      </p>
      <section>
        <h2 className="text-3xl font-semibold mb-8 border-b pb-4">
          Últimas Publicações
        </h2>
        {artigosRecentes && artigosRecentes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artigosRecentes.map((artigo) => (
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
    </main>
  );
}
