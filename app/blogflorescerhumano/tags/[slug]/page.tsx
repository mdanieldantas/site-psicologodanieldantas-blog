// app/blogflorescerhumano/tags/[slug]/page.tsx
import React, { Suspense } from 'react';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Database } from '@/types/supabase';
import ArticleCardBlog from '@/app/blogflorescerhumano/components/ArticleCardBlog'; // Reutiliza o card
import PaginationControls from '@/app/blogflorescerhumano/components/PaginationControls'; // Importa o componente de paginação
import BannerImage from '@/app/blogflorescerhumano/components/BannerImage'; // Componente para banners
import type { Metadata, ResolvingMetadata } from 'next'; // Importa tipos de Metadata
import { ChevronRight } from 'lucide-react'; // Ícone para breadcrumb

// Força renderização dinâmica para Next.js 15
export const dynamic = 'force-dynamic';

interface TagPageProps {
  params: Promise<{
    slug: string; // slug da tag
  }>;
  // Adiciona searchParams à interface
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Tipagem para o artigo com slug da categoria (necessário para o ArticleCardBlog)
type ArtigoComCategoriaSlug = Database['public']['Tables']['artigos']['Row'] & {
  categorias: { slug: string } | null; // Apenas o slug da categoria é necessário
  // Adiciona a relação com tags para a query funcionar
  tags: Array<{ id: number; nome: string; slug: string; }> | null;
};

// --- Geração de Metadados Dinâmicas para Tag --- //
export async function generateMetadata(
  { params }: TagPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Await params para Next.js 15
  const resolvedParams = await params;
  const tagSlug = resolvedParams.slug;

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
  // Await params para Next.js 15
  const resolvedParams = await params;
  const tagSlug = resolvedParams.slug;

  // --- Obter parâmetros de paginação --- //
  const searchParamsData = await searchParams;
  const page = searchParamsData['page'] ?? '1';
  const perPage = searchParamsData['per_page'] ?? '6'; // Define um padrão, ex: 6 artigos por página
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
      tags ( id, nome, slug ),
      artigos_tags!inner(tag_id)
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
  }  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section - Split Screen com Designer Guide */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#F8F5F0]">
        {/* Mobile: Banner tradicional */}
        <div className="md:hidden relative h-full">
          <BannerImage 
            bannerPath="/blogflorescerhumano/banners-blog/banner-tags.webp"
            fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
            alt="Banner de Tags do Blog Florescer Humano"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/80 via-[#583B1F]/30 to-transparent" />
          
          {/* Conteúdo mobile centralizado */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                Artigos sobre
              </h1>
              <div className="text-2xl md:text-3xl font-bold text-[#A57C3A] mb-3">
                "{tag.nome}"
              </div>
              <p className="font-sans text-base text-white/90 leading-relaxed max-w-sm mx-auto">
                Explore nossa coleção de artigos sobre {tag.nome}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop: Split layout aprimorado */}
        <div className="hidden md:flex h-full">
          {/* Lado esquerdo: Conteúdo com elementos decorativos */}
          <div className="w-1/2 bg-gradient-to-br from-[#583B1F] via-[#5B3E22] to-[#583B1F] flex flex-col justify-center px-8 lg:px-12 relative overflow-hidden">
            {/* Elementos decorativos de fundo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-[#A57C3A] rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#6B7B3F] rounded-lg rotate-45"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-[#A57C3A] rotate-12"></div>
            </div>
            
            <div className="relative z-10 animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="flex items-center mb-4">
                <div className="w-12 h-1 bg-[#A57C3A] mr-4"></div>
                <div className="w-6 h-6 rounded-full bg-[#A57C3A]"></div>
                <div className="w-12 h-1 bg-[#A57C3A] ml-4"></div>
              </div>
              
              <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                Artigos sobre
              </h1>
              
              <div className="text-3xl lg:text-4xl font-bold text-[#A57C3A] mb-6">
                "{tag.nome}"
              </div>
              
              <p className="font-sans text-lg lg:text-xl text-white/90 leading-relaxed mb-8 max-w-md">
                Explore nossa coleção de artigos cuidadosamente selecionados sobre {tag.nome}
              </p>
              
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-[#A57C3A]/30">
                <span className="text-sm font-medium text-white">
                  {count && count > 0 ? `${count} artigo${count > 1 ? 's' : ''}` : 'Nenhum artigo'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Lado direito: Imagem com moldura elegante */}
          <div className="w-1/2 relative">
            {/* Gradientes decorativos */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#A57C3A]/20 via-transparent to-[#6B7B3F]/20 z-10 pointer-events-none"></div>
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-[#A57C3A]/30 rounded-lg z-10 pointer-events-none"></div>
            
            {/* Cantos decorativos */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-[#A57C3A] rounded-tl-lg z-20"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-[#A57C3A] rounded-tr-lg z-20"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-[#A57C3A] rounded-bl-lg z-20"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-[#A57C3A] rounded-br-lg z-20"></div>
            
            <BannerImage 
              bannerPath="/blogflorescerhumano/banners-blog/banner-tags.webp"
              fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
              alt="Banner de Tags do Blog Florescer Humano"
              className="animate-in fade-in slide-in-from-right-6 duration-1000 delay-300 hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <a href="/" className="text-[#735B43] hover:text-[#583B1F] transition-colors">
                Início
              </a>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li>
              <a href="/blogflorescerhumano" className="text-[#735B43] hover:text-[#583B1F] transition-colors">
                Blog
              </a>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li className="text-[#583B1F] font-medium">
              Tag: {tag.nome}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 pt-8">
        {/* Articles Grid */}
        {artigos && artigos.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">              {artigos.map((artigo) => (
                <ArticleCardBlog
                  key={artigo.id}
                  titulo={artigo.titulo ?? 'Artigo sem título'}
                  resumo={artigo.resumo ?? undefined}
                  slug={artigo.slug ?? ''}
                  categoriaSlug={artigo.categorias?.slug ?? 'sem-categoria'}
                  imagemUrl={artigo.imagem_capa_arquivo ?? undefined}
                  tags={artigo.tags ?? []}
                  autor={{
                    nome: "Psicólogo Daniel Dantas",
                    fotoUrl: "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                  }}
                  tempoLeitura={Math.ceil((artigo.resumo?.length || 0) / 200) + 3}
                  numeroComentarios={0}
                  tipoConteudo="artigo"
                  dataPublicacao={artigo.data_publicacao ?? undefined}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Estado vazio com design aprimorado */
          <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-6xl mb-6">🏷️</div>
            <h3 className="font-serif text-3xl text-[#583B1F] mb-4">
              Nenhum artigo encontrado
            </h3>
            <p className="text-[#7D6E63] text-lg max-w-md mx-auto leading-relaxed">
              Não encontramos artigos com a tag "<strong className="text-[#583B1F]">{tag.nome}</strong>". 
              <br />Que tal explorar outras categorias?
            </p>
            <div className="mt-8">
              <a 
                href="/blogflorescerhumano/categorias"
                className="inline-flex items-center px-6 py-3 bg-[#583B1F] text-white rounded-lg hover:bg-[#5B3E22] transition-all duration-300 font-medium"
              >
                Ver Categorias
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <Suspense fallback={null}>
              <PaginationControls
                totalCount={count ?? 0}
                pageSize={perPageNumber}
                currentPage={pageNumber}
                basePath={`/blogflorescerhumano/tags/${tagSlug}`}
              />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
}

// Opcional: Gerar páginas estáticas para tags populares
// export async function generateStaticParams() {
//   // Buscar slugs de tags mais usadas ou todas as tags
//   const { data: tags } = await supabaseServer.from('tags').select('slug');
//   return tags?.map(({ slug }) => ({ slug })) || [];
// }
