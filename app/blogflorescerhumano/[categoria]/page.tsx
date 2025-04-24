// app/blogflorescerhumano/[categoria]/page.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server'; // Ajustado para @/
import { notFound } from 'next/navigation';
import type { Database } from '@/types/supabase'; // Ajustado para @/
import ArticleCardBlog from '../components/ArticleCardBlog'; // Ajustado para ../

type Categoria = Database['public']['Tables']['categorias']['Row'];
type Artigo = Database['public']['Tables']['artigos']['Row'];

interface CategoriaPageProps {
  params: {
    categoria: string; // slug da categoria
  };
}

export default async function CategoriaEspecificaPage({ params }: CategoriaPageProps) {
  const { categoria: categoriaSlugParam } = params;

  // --- 1. Busca de Dados da Categoria --- //
  const { data: categoria, error: categoriaError } = await supabaseServer
    .from('categorias')
    .select('id, nome, slug, descricao')
    .eq('slug', categoriaSlugParam)
    .single<Categoria>();

  // --- Validação da Categoria --- //
  if (categoriaError || !categoria) {
    console.error(`Erro ao buscar categoria com slug "${categoriaSlugParam}" ou categoria não encontrada:`, categoriaError);
    notFound();
  }

  // --- 2. Busca de Artigos da Categoria --- //
  const { data: artigos, error: artigosError } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      slug,
      resumo,
      imagem_capa_arquivo,
      data_publicacao
    `)
    .eq('categoria_id', categoria.id)
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .order('data_publicacao', { ascending: false });

  // --- Tratamento de Erro (Artigos) --- //
  if (artigosError) {
    console.error(`Erro ao buscar artigos para a categoria "${categoria.nome}":`, artigosError);
    // Não chama notFound(), apenas mostra mensagem de erro
  }

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/blogflorescerhumano" legacyBehavior><a className="hover:underline">Blog</a></Link>
        <span className="mx-2">/</span>
        <Link href={`/blogflorescerhumano/categorias`} legacyBehavior><a className="hover:underline">Categorias</a></Link>
      </nav>

      {/* Cabeçalho da Categoria */}
      <header className="mb-10 border-b pb-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{categoria.nome}</h1>
        {categoria.descricao && (
          <p className="text-lg text-gray-600 max-w-3xl">{categoria.descricao}</p>
        )}
      </header>

      {/* Lista de Artigos */}
      <section>
        {artigos && artigos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artigos.map((artigo) => (
              <ArticleCardBlog
                key={artigo.id}
                titulo={artigo.titulo ?? 'Artigo sem título'}
                resumo={artigo.resumo ?? undefined}
                slug={artigo.slug ?? ''} // Garante que slug não seja null
                categoriaSlug={categoria.slug} // Usa o slug da categoria atual
                imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {artigosError
              ? 'Não foi possível carregar os artigos desta categoria no momento.'
              : 'Nenhum artigo publicado nesta categoria ainda.'}
          </p>
        )}
      </section>
    </main>
  );
}
