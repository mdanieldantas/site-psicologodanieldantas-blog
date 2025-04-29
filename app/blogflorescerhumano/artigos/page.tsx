// app/blogflorescerhumano/artigos/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '../components/ArticleCardBlog';
import PaginationControls from '../components/PaginationControls'; // Importa o componente de paginação
import type { Metadata } from 'next';
import { ResolvingMetadata } from 'next';

// --- Metadados para a Página de Todos os Artigos --- //
// (Removido export const metadata para evitar conflito com generateMetadata)

// --- Metadados dinâmicos para SEO conforme paginação --- //
export async function generateMetadata(
  { searchParams }: { searchParams?: { page?: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const currentPage = parseInt(searchParams?.page ?? '1', 10);
  const isFirstPage = currentPage === 1;
  const pageTitle = isFirstPage
    ? 'Todos os Artigos | Blog Florescer Humano'
    : `Todos os Artigos - Página ${currentPage} | Blog Florescer Humano`;
  const pageDescription = isFirstPage
    ? 'Navegue por todos os artigos publicados no Blog Florescer Humano sobre psicologia humanista, autoconhecimento e bem-estar.'
    : `Página ${currentPage} da lista de artigos publicados no Blog Florescer Humano sobre psicologia humanista, autoconhecimento e bem-estar.`;
  const canonicalUrl = isFirstPage
    ? '/blogflorescerhumano/artigos'
    : `/blogflorescerhumano/artigos?page=${currentPage}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'Blog Florescer Humano',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDescription,
    },
  };
}

// Tipagem para o artigo com slug da categoria
type ArtigoComCategoriaSlug = Database['public']['Tables']['artigos']['Row'] & {
  categorias: { slug: string } | null;
};

// Define quantos artigos serão exibidos por página
const ARTICLES_PER_PAGE = 6; // Alterado para 6 para manter consistência

// Define as props da página, incluindo searchParams para paginação
interface TodosArtigosPageProps {
  searchParams: {
    page?: string; // Parâmetro opcional para a página
  };
}

export default async function TodosArtigosPage({ searchParams }: TodosArtigosPageProps) {
  // --- Lógica de Paginação --- //
  const currentPage = parseInt(searchParams.page ?? '1', 10);
  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  // --- Busca da Contagem Total de Artigos --- //
  const { count: totalCount, error: countError } = await supabaseServer
    .from('artigos')
    .select('* ', { count: 'exact', head: true }) // Conta todos os artigos publicados
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString());

  if (countError) {
    console.error('Erro ao contar todos os artigos:', countError);
    // Considerar como lidar com este erro
  }

  const totalPages = totalCount ? Math.ceil(totalCount / ARTICLES_PER_PAGE) : 1;

  // --- Busca de Artigos da Página Atual --- //
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
    .range(from, to) // Aplica o range para a paginação
    .returns<ArtigoComCategoriaSlug[]>();

  if (error) {
    console.error(`Erro ao buscar artigos (Página ${currentPage}):`, error);
    // Considerar mostrar um erro mais explícito para o usuário
  }

  // Log para depuração
  console.log(`Todos Artigos - Página Atual: ${currentPage}, Total de Artigos: ${totalCount}, Total de Páginas: ${totalPages}`);

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
            {error
              ? 'Não foi possível carregar os artigos no momento.'
              : currentPage > 1 ? 'Não há mais artigos para exibir.' : 'Nenhum artigo publicado ainda.' // Mensagem ajustada
            }
          </p>
        )}
      </section>

      {/* Adiciona controles de paginação */}
      <Suspense fallback={null}>
        <PaginationControls
          currentPage={currentPage}
          totalCount={totalCount ?? 0}
          pageSize={ARTICLES_PER_PAGE}
          basePath="/blogflorescerhumano/artigos"
        />
      </Suspense>
    </main>
  );
}
