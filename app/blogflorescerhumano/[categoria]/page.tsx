// app/blogflorescerhumano/[categoria]/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server'; // Ajustado para @/
import { notFound } from 'next/navigation';
import type { Database } from '@/types/supabase'; // Ajustado para @/
import ArticleCardBlog from '../components/ArticleCardBlog'; // Ajustado para ../
import PaginationControls from '../components/PaginationControls'; // Importa o componente de paginação
import type { Metadata, ResolvingMetadata } from 'next'; // Importa tipos de Metadata

// Define quantos artigos serão exibidos por página
const ARTICLES_PER_PAGE = 6; // Valor original
// const ARTICLES_PER_PAGE = 2; // TEMPORÁRIO PARA TESTE DE PAGINAÇÃO

type Categoria = Database['public']['Tables']['categorias']['Row'];
type Artigo = Database['public']['Tables']['artigos']['Row'];

interface CategoriaPageProps {
  params: {
    categoria: string; // slug da categoria
  };
  searchParams: {
    page?: string; // Parâmetro opcional para a página
  };
}

// --- Geração de Metadados Dinâmicos para Categoria --- //
export async function generateMetadata(
  { params }: { params: { categoria: string } }, 
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Colocamos o valor em uma variável temporária para evitar acessar a propriedade diretamente
  const categoriaSlug = params?.categoria;

  // Busca nome e descrição da categoria
  const { data: categoria, error } = await supabaseServer
    .from('categorias')
    .select('nome, descricao') // Seleciona nome e descrição
    .eq('slug', categoriaSlug)
    .maybeSingle();

  // Se não encontrar a categoria ou houver erro
  if (error || !categoria) {
    console.error(`[Metadata] Categoria não encontrada para slug: ${categoriaSlug}`, error);
    return {
      title: 'Categoria não encontrada | Blog Florescer Humano',
      description: 'A categoria de artigos que você procura não foi encontrada.',
    };
  }

  const pageTitle = `${categoria.nome} | Blog Florescer Humano`;
  const pageDescription = categoria.descricao ?? `Explore artigos sobre ${categoria.nome} no Blog Florescer Humano.`;
  const canonicalUrl = `/blogflorescerhumano/${categoriaSlug}`;

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
      // Não há imagem específica para categoria por padrão, herda do layout
      locale: 'pt_BR',
      type: 'website', // Ou 'object', dependendo do conteúdo exato
    },
    twitter: {
      card: 'summary',
      title: pageTitle,
      description: pageDescription,
      // Não há imagem específica para categoria por padrão
    },
  };
}

// --- Componente da Página --- //
export default async function CategoriaEspecificaPage({
  params,
  searchParams,
}: {
  params: { categoria: string };
  searchParams: { page?: string };
}) {
  // Colocamos os valores em variáveis temporárias para evitar acessar as propriedades diretamente
  const categoriaSlug = params?.categoria;
  const page = searchParams?.page ?? "1";

  // --- 1. Busca de Dados da Categoria --- //
  const { data: categoria, error: categoriaError } = await supabaseServer
    .from('categorias')
    .select('id, nome, slug, descricao')
    .eq('slug', categoriaSlug)
    .single<Categoria>();

  // --- Validação da Categoria --- //
  if (categoriaError || !categoria) {
    console.error(`Erro ao buscar categoria com slug \"${categoriaSlug}\" ou categoria não encontrada:`, categoriaError);
    notFound();
  }

  // --- 2. Lógica de Paginação --- //
  const currentPage = parseInt(page, 10);
  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  // --- 3. Busca da Contagem Total de Artigos --- //
  const { count: totalCount, error: countError } = await supabaseServer
    .from('artigos')
    .select('* ', { count: 'exact', head: true }) // Conta todos os artigos da categoria
    .eq('categoria_id', categoria.id)
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString());

  if (countError) {
    console.error(`Erro ao contar artigos para a categoria "${categoria.nome}":`, countError);
    // Considerar como lidar com este erro, talvez mostrar 0 ou uma mensagem?
  }

  const totalPages = totalCount ? Math.ceil(totalCount / ARTICLES_PER_PAGE) : 1;

  // --- 4. Busca de Artigos da Página Atual --- //
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
    .order('data_publicacao', { ascending: false })
    .range(from, to); // Aplica o range para a paginação

  // --- Tratamento de Erro (Artigos) --- //
  if (artigosError) {
    console.error(`Erro ao buscar artigos para a categoria "${categoria.nome}" (Página ${currentPage}):`, artigosError);
    // Não chama notFound(), apenas mostra mensagem de erro
  }

  // Log para depuração
  console.log(`Categoria: ${categoria.nome}, Página Atual: ${currentPage}, Total de Artigos: ${totalCount}, Total de Páginas: ${totalPages}`);

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
              : currentPage > 1 ? 'Não há mais artigos nesta categoria.' : 'Nenhum artigo publicado nesta categoria ainda.' // Mensagem ajustada para paginação
            }
          </p>
        )}
      </section>

      {/* Adiciona o componente de Paginação */}
      <Suspense fallback={null}>
        <PaginationControls
          currentPage={currentPage}
          totalCount={totalCount ?? 0}
          pageSize={ARTICLES_PER_PAGE}
          basePath={`/blogflorescerhumano/${categoria.slug}`}
        />
      </Suspense>

    </main>
  );
}
