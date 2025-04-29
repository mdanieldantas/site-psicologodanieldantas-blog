// app/blogflorescerhumano/tags/[slug]/page.tsx
import React from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '@/app/blogflorescerhumano/components/ArticleCardBlog'; // Reutiliza o card
import PaginationControls from '@/app/blogflorescerhumano/components/PaginationControls'; // Importa o componente de paginação
import type { Metadata, ResolvingMetadata } from 'next'; // Importa tipos de Metadata

interface TagPageProps {
  params: {
    slug: string; // slug da tag
  };
  // Adiciona searchParams à interface
  searchParams: { [key: string]: string | string[] | undefined };
}

// Tipagem para o artigo com slug da categoria (necessário para o ArticleCardBlog)
type ArtigoComCategoriaSlug = Database['public']['Tables']['artigos']['Row'] & {
  categorias: { slug: string } | null; // Apenas o slug da categoria é necessário
  // Adiciona a relação com tags para a query funcionar
  tags: { id: number }[] | null;
};

// --- Geração de Metadados Dinâmicas para Tag --- //
export async function generateMetadata(
  { params }: TagPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tagSlug = params.slug;

  // Busca nome da tag
  const { data: tag, error } = await supabaseServer
    .from('tags')
    .select('nome') // Seleciona apenas o nome
    .eq('slug', tagSlug)
    .maybeSingle();

  // Se não encontrar a tag ou houver erro
  if (error || !tag) {
    console.error(`[Metadata] Tag não encontrada para slug: ${tagSlug}`, error);
    return {
      title: 'Tag não encontrada | Blog Florescer Humano',
      description: 'A tag de artigos que você procura não foi encontrada.',
    };
  }

  const pageTitle = `Artigos sobre ${tag.nome} | Blog Florescer Humano`;
  const pageDescription = `Explore artigos marcados com a tag "${tag.nome}" no Blog Florescer Humano.`;
  const canonicalUrl = `/blogflorescerhumano/tags/${tagSlug}`;

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
      // Não há imagem específica para tag por padrão, herda do layout
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDescription,
      // Não há imagem específica para tag por padrão
    },
  };
}

// --- Componente da Página --- //
export default async function TagPage({ params, searchParams }: TagPageProps) {
  const tagSlug = params.slug;

  // --- Obter parâmetros de paginação --- //
  const page = searchParams['page'] ?? '1';
  const perPage = searchParams['per_page'] ?? '6'; // Define um padrão, ex: 6 artigos por página
  const pageNumber = Math.max(1, parseInt(page as string, 10) || 1);
  const perPageNumber = Math.max(1, parseInt(perPage as string, 10) || 6);
  const offset = (pageNumber - 1) * perPageNumber;

  // --- 1. Busca da Tag pelo Slug --- //
  const { data: tag, error: tagError } = await supabaseServer
    .from('tags')
    .select('id, nome')
    .eq('slug', tagSlug)
    .maybeSingle();

  // Se a tag não for encontrada ou houver erro
  if (tagError || !tag) {
    console.error(`Erro ao buscar tag com slug "${tagSlug}":`, tagError);
    notFound();
  }

  // --- 2. Busca de Artigos Associados à Tag (com Paginação) --- //

  // --- 2a. Busca da Contagem Total de Artigos para a Tag --- //
  // CORREÇÃO: Usar 'artigos_tags' se esse for o nome correto da tabela de junção
  // CORREÇÃO: Filtrar artigos publicados na tabela 'artigos' via relacionamento
  const { count, error: countError } = await supabaseServer
    .from('artigos_tags') // CORRIGIDO: Nome da tabela de junção
    .select('artigos!inner(status, data_publicacao)', { count: 'exact', head: true }) // Seleciona da tabela relacionada para filtrar
    .eq('tag_id', tag.id)
    .eq('artigos.status', 'publicado') // Filtra na tabela relacionada
    .lte('artigos.data_publicacao', new Date().toISOString()); // Filtra na tabela relacionada


  if (countError) {
    console.error(`Erro ao contar artigos para a tag "${tag.nome}":`, countError);
    // Lidar com o erro de contagem, talvez mostrar 0 ou uma mensagem
  }

  // Calcular total de páginas
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / perPageNumber));

  // --- 2b. Busca dos Artigos da Página Atual --- //
  // CORREÇÃO: Usar 'artigos_tags' na relação se necessário
  const { data: artigos, error: artigosError } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      slug,
      resumo,
      imagem_capa_arquivo,
      data_publicacao,
      categorias ( slug ),
      artigos_tags!inner(tag_id) // CORRIGIDO: Nome da tabela de junção
    `)
    .eq('artigos_tags.tag_id', tag.id) // Filtra artigos que têm a tag com o ID encontrado via tabela de junção
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .order('data_publicacao', { ascending: false })
    .range(offset, offset + perPageNumber - 1) // Aplica a paginação com range
    .returns<ArtigoComCategoriaSlug[]>();


  if (artigosError) {
    console.error(`Erro ao buscar artigos para a tag "${tag.nome}":`, artigosError);
    // Não chama notFound(), apenas mostra mensagem de erro na página
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Artigos com a tag: <span className="text-blue-600">{tag.nome}</span>
      </h1>

      <section>
        {artigos && artigos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artigos.map((artigo) => (
              <ArticleCardBlog
                key={artigo.id}
                titulo={artigo.titulo ?? 'Artigo sem título'}
                resumo={artigo.resumo ?? undefined}
                slug={artigo.slug ?? ''}
                // Extrai o slug da categoria do objeto aninhado
                categoriaSlug={artigo.categorias?.slug ?? 'sem-categoria'}
                imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {artigosError
              ? 'Não foi possível carregar os artigos desta tag no momento.'
              : `Nenhum artigo encontrado para a tag "${tag.nome}".`}
          </p>
        )}
      </section>

      {/* --- Controles de Paginação --- */}
      <div className="mt-12 flex justify-center">
        <PaginationControls
          totalCount={count ?? 0} // Passa o total de itens
          pageSize={perPageNumber} // Passa o tamanho da página
          currentPage={pageNumber} // Passa a página atual
          basePath={`/blogflorescerhumano/tags/${tagSlug}`} // Passa o caminho base para os links
        />
      </div>
    </main>
  );
}

// Opcional: Gerar páginas estáticas para tags populares
// export async function generateStaticParams() {
//   // Buscar slugs de tags mais usadas ou todas as tags
//   const { data: tags } = await supabaseServer.from('tags').select('slug');
//   return tags?.map(({ slug }) => ({ slug })) || [];
// }
