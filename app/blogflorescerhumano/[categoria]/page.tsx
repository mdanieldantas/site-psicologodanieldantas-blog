// app/blogflorescerhumano/[categoria]/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseServer } from '@/lib/supabase/server'; // Ajustado para @/
import { notFound } from 'next/navigation';
import type { Database } from '@/types/supabase'; // Ajustado para @/
import ArticleCardBlog from '../components/ArticleCardBlog'; // Ajustado para ../
import PaginationControls from '../components/PaginationControls'; // Importa o componente de paginação
import type { Metadata, ResolvingMetadata } from 'next'; // Importa tipos de Metadata
import CategorySchema from '../components/CategorySchema'; // Importa o componente Schema JSON-LD para categorias

// Define quantos artigos serão exibidos por página
const ARTICLES_PER_PAGE = 6; // Valor original
// const ARTICLES_PER_PAGE = 2; // TEMPORÁRIO PARA TESTE DE PAGINAÇÃO

type Categoria = Database['public']['Tables']['categorias']['Row'];
type Artigo = Database['public']['Tables']['artigos']['Row'] & {
  tags?: Array<{ id: number; nome: string; slug: string; }> | null;
};

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
  // Acesso direto à propriedade sem usar operador opcional
  const categoriaSlug = params.categoria;

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
}) {  // Acesso direto à propriedade categoria de params e notação de colchetes para searchParams
  const categoriaSlug = params.categoria;
  const page = searchParams['page'] ?? "1";
  // --- 1. Busca de Dados da Categoria --- //
  const { data: categoria, error: categoriaError } = await supabaseServer
    .from('categorias')
    .select('id, nome, slug, descricao, imagem_url')
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
      data_publicacao,
      data_atualizacao,
      tags (
        id,
        nome,
        slug
      )
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
  console.log(`Categoria: ${categoria.nome}, Página Atual: ${currentPage}, Total de Artigos: ${totalCount}, Total de Páginas: ${totalPages}`);  // Função para obter a URL da imagem da categoria a partir do campo imagem_url do banco de dados
  const getCategoryImageUrl = (categoria: Categoria) => {
    if (categoria.imagem_url) {
      return `/blogflorescerhumano/category-images/${categoria.imagem_url}`;
    }
    
    // Fallback caso não haja imagem definida
    return '/blogflorescerhumano/category-images/categoria-default.webp';
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">        <Image
          src={getCategoryImageUrl(categoria)}
          alt={`Banner da categoria ${categoria.nome}`}
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          className="brightness-75"
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
              {categoria.nome}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              {categoria.descricao || `Explore artigos sobre ${categoria.nome}`}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>              <Link 
                href="/" 
                className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Início
              </Link>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li>
              <Link 
                href="/blogflorescerhumano" 
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li>
              <Link 
                href="/blogflorescerhumano/categorias" 
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Categorias
              </Link>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li className="text-[#583B1F] font-medium">
              {categoria.nome}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {/* Articles Grid */}
        {artigos && artigos.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {artigos.map((artigo, index) => (
                <div
                  key={artigo.id}
                  className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 hover:zoom-in-105 transition-all duration-300"
                  style={{
                    animationDelay: `${600 + (index * 100)}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="group h-full">
                    <ArticleCardBlog
                      titulo={artigo.titulo ?? 'Artigo sem título'}
                      resumo={artigo.resumo ?? undefined}
                      slug={artigo.slug ?? ''}
                      categoriaSlug={categoria.slug}
                      imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
                      autor={{
                        nome: "Psicólogo Daniel Dantas",
                        fotoUrl: "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                      }}
                      dataPublicacao={artigo.data_publicacao || undefined}
                      dataAtualizacao={artigo.data_atualizacao || undefined}
                      categoria={categoria.nome}
                      tags={artigo.tags ?? []}
                      tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
                      numeroComentarios={0}
                      tipoConteudo="artigo"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 animate-in fade-in zoom-in-75 duration-700">
            <div className="bg-white rounded-xl shadow-lg p-12 border border-[#C19A6B]/20 max-w-md mx-auto">              <div className="text-[#735B43]/60 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#583B1F] mb-2 font-['Old_Roman']">
                {artigosError ? 'Erro ao carregar' : 'Nenhum artigo'}
              </h3>
              <p className="text-[#735B43]">
                {artigosError
                  ? 'Não foi possível carregar os artigos desta categoria no momento.'
                  : currentPage > 1 
                    ? 'Não há mais artigos nesta categoria.' 
                    : 'Nenhum artigo publicado nesta categoria ainda.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <Suspense fallback={null}>
              <PaginationControls
                currentPage={currentPage}
                totalCount={totalCount ?? 0}
                pageSize={ARTICLES_PER_PAGE}
                basePath={`/blogflorescerhumano/${categoria.slug}`}
              />
            </Suspense>
          </div>
        )}        {/* Schema da Categoria (JSON-LD) */}
        <CategorySchema
          nome={categoria.nome}
          descricao={categoria.descricao ?? ''}
          slug={categoria.slug}
          url={`/blogflorescerhumano/${categoria.slug}`}
          imagemUrl={(artigos && artigos.length > 0) ? artigos[0].imagem_capa_arquivo : null}
          artigosCount={totalCount}
        />
      </main>
    </div>
  );
}
