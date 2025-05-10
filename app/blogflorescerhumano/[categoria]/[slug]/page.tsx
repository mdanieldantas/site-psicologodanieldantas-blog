// app/blogflorescerhumano/[categoria]/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Database } from '@/types/supabase';
import GiscusComments from '@/app/blogflorescerhumano/components/GiscusComments';
import RelatedArticles from '@/app/blogflorescerhumano/components/RelatedArticles'; // Corrigido o import para usar o alias @/
import ShareButtons from '@/app/blogflorescerhumano/components/ShareButtons'; // Importa o novo componente
import type { Metadata, ResolvingMetadata } from 'next'; // Importa tipos de Metadata
import ArticleSchema from '@/app/blogflorescerhumano/components/ArticleSchema'; // Importa o componente de Schema JSON-LD

type Artigo = Database['public']['Tables']['artigos']['Row'];
type Categoria = Database['public']['Tables']['categorias']['Row'];
type Autor = Database['public']['Tables']['autores']['Row'];

interface ArtigoPageProps {
  params: {
    categoria: string; // slug da categoria
    slug: string;      // slug do artigo
  };
}

// --- Tipagem Explícita para Dados do Artigo --- //
type ArtigoComRelacoes = Database['public']['Tables']['artigos']['Row'] & {
  categorias: Pick<Database['public']['Tables']['categorias']['Row'], 'id' | 'nome' | 'slug'> | null;
  autores: Pick<Database['public']['Tables']['autores']['Row'], 'id' | 'nome'> | null;
  tags: Pick<Database['public']['Tables']['tags']['Row'], 'id' | 'nome' | 'slug'>[] | null; // Array de tags
};

// --- Geração de Metadados Dinâmicos --- //
export async function generateMetadata(
  { params }: ArtigoPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Acesso direto às propriedades de params sem desestruturação
  const categoriaSlugParam = params.categoria;
  const artigoSlugParam = params.slug;

  // Busca apenas os dados necessários para metadata
  const { data: artigo, error } = await supabaseServer
    .from('artigos')
    .select('titulo, resumo, imagem_capa_arquivo, categorias ( slug )') // Seleciona o slug da categoria também
    .eq('slug', artigoSlugParam)
    .eq('categorias.slug', categoriaSlugParam) // Garante que o artigo pertence à categoria correta
    .eq('status', 'publicado')
    .lte('data_publicacao', new Date().toISOString())
    .maybeSingle();

  // Se não encontrar o artigo ou houver erro, retorna metadados padrão ou vazios
  if (error || !artigo) {
    console.error(`[Metadata] Artigo não encontrado para slug: ${artigoSlugParam} na categoria ${categoriaSlugParam}`, error);
    return {
      title: 'Artigo não encontrado | Blog Florescer Humano',
      description: 'O artigo que você procura não foi encontrado.',
    };
  }

  // Gera URL da imagem a partir da pasta public
  let ogImageUrl = null;
  if (artigo.imagem_capa_arquivo) {
    // Constrói o caminho relativo à pasta public
    // Assumindo que imagem_capa_arquivo contém o caminho completo dentro de blogflorescerhumano
    // Ex: 'autoconhecimento-desenvolvimento-pessoal/focalizacao-sabedoria-corpo.png'
    ogImageUrl = `/blogflorescerhumano/${artigo.imagem_capa_arquivo}`;
  }

  const pageTitle = `${artigo.titulo ?? 'Artigo'} | Blog Florescer Humano`;
  const pageDescription = artigo.resumo ?? 'Leia este artigo no Blog Florescer Humano.';
  // Constrói a URL canônica da página
  const canonicalUrl = `/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl, // Adiciona URL canônica
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: 'Blog Florescer Humano',
      images: ogImageUrl ? [
        {
          // Para URLs relativas, o Next.js precisa da URL base para gerar a URL absoluta para OG
          url: new URL(ogImageUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString(),
          width: 1200, // Ajuste conforme necessário
          height: 630, // Ajuste conforme necessário
          alt: `Imagem para ${artigo.titulo}`,
        },
      ] : [], // Usa imagem padrão do layout pai se não houver específica
      locale: 'pt_BR',
      type: 'article', // Define o tipo como artigo para OG
      // publishedTime: artigo.data_publicacao, // Requer buscar data_publicacao
      // authors: [nomeAutor], // Requer buscar nomeAutor
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      // Twitter também precisa de URLs absolutas
      images: ogImageUrl ? [new URL(ogImageUrl, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString()] : [], // URL da imagem para Twitter
      // site: '@seuTwitter', // Opcional: seu handle do Twitter
      // creator: '@autorTwitter', // Opcional: handle do autor
    },
  };
}

// --- Componente da Página --- //
export default async function ArtigoEspecificoPage({ params }: ArtigoPageProps) {
  // Acesso direto às propriedades de params sem desestruturação
  const categoriaSlugParam = params.categoria;
  const artigoSlugParam = params.slug;

  // --- LOG: Parâmetros recebidos --- //
  console.log(`[Artigo Page] Recebido categoriaSlugParam: "${categoriaSlugParam}", artigoSlugParam: "${artigoSlugParam}"`);

  // --- 1. Busca do Artigo Específico --- //
  console.log(`[Artigo Page] Buscando artigo com slug: "${artigoSlugParam}" na categoria com slug: "${categoriaSlugParam}"`);
  // Usamos a tipagem explícita aqui
  const { data: artigo, error: artigoError } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      conteudo,
      data_publicacao,
      imagem_capa_arquivo,
      categorias!inner ( id, nome, slug ),
      autores ( id, nome ),
      status,
      tags ( id, nome, slug ) // Busca as tags relacionadas
    `)
    .eq('slug', artigoSlugParam)
    .eq('categorias.slug', categoriaSlugParam) // Filtra pela categoria usando a relação
    .eq('status', 'publicado') // Garante que o artigo esteja publicado
    .lte('data_publicacao', new Date().toISOString()) // Garante que a data de publicação não seja futura
    .maybeSingle<ArtigoComRelacoes>(); // Especifica o tipo esperado para maybeSingle

  // --- Tratamento de Erro ou Artigo Não Encontrado --- //
  if (artigoError) {
    console.error('[Artigo Page] Erro ao buscar artigo:', artigoError);
    // Não chama notFound() aqui ainda, pode ser erro de rede
  }

  // Se houve erro na busca OU o artigo não foi encontrado OU não está publicado OU data futura
  if (artigoError || !artigo) {
    console.log('[Artigo Page] Chamando notFound() devido a erro na busca ou artigo não encontrado/publicado/data futura.');
    notFound(); // Exibe a página 404
  }

  // --- Extração de Dados --- //
  const { id: currentArticleId, titulo, conteudo: artigoConteudo, data_publicacao, imagem_capa_arquivo, categorias, autores, tags, resumo } = artigo; // Extrai o ID e resumo também
  const nomeAutor = autores?.nome ?? 'Autor Desconhecido';
  const nomeCategoria = categorias?.nome ?? 'Categoria Desconhecida';
  const categoriaSlug = categorias?.slug ?? 'sem-categoria';

  // --- Formatação da Data --- //
  const dataFormatada = data_publicacao
    ? new Date(data_publicacao).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Data não disponível';

  // --- Geração de URL da Imagem --- //
  let imageUrl = null;
  if (imagem_capa_arquivo) {
    // Constrói o caminho relativo à pasta public
    imageUrl = `/blogflorescerhumano/${imagem_capa_arquivo}`;
  }

  // --- Construção da URL Completa para Compartilhamento --- //
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://psicologodanieldantas.com.br';
  const shareUrl = `${baseUrl}/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`;

  return (
    <>
      {/* Componente ArticleSchema para gerar Schema.org markup para artigos */}
      <ArticleSchema
        title={titulo}
        description={resumo || ''}
        publishDate={data_publicacao || ''}
        authorName={nomeAutor}
        imagePath={imagem_capa_arquivo ? `/blogflorescerhumano/${imagem_capa_arquivo}` : undefined}
        categoryName={categorias?.nome || ''}
        tags={tags || []}
        url={`/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`}
      />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Navegação Estrutural (Breadcrumbs) */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/blogflorescerhumano" legacyBehavior><a className="hover:underline">Blog</a></Link>
          <span className="mx-2">/</span>
          <Link href={`/blogflorescerhumano/categorias`} legacyBehavior><a className="hover:underline">Categorias</a></Link>
          <span className="mx-2">/</span>
          <Link href={`/blogflorescerhumano/${categoriaSlug}`} legacyBehavior><a className="hover:underline">{nomeCategoria}</a></Link>
        </nav>

        {/* Cabeçalho do Artigo */}
        <header className="mb-8 border-b pb-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{titulo ?? 'Artigo sem título'}</h1>
          <p className="text-gray-600">
            Publicado em {dataFormatada} por {nomeAutor}
          </p>
          {/* Exibição das Tags */}
          {tags && Array.isArray(tags) && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700">Tags:</span>
              {tags.map((tag) => (
                <Link key={tag.id} href={`/blogflorescerhumano/tags/${tag.slug}`} legacyBehavior>
                  <a className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors duration-200">
                    {tag.nome}
                  </a>
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Botões de Compartilhamento */}
        <ShareButtons url={shareUrl} title={titulo ?? 'Artigo do Blog Florescer Humano'} summary={resumo ?? undefined} />

        {/* Imagem de Capa */}
        {imageUrl && (
          <div className="mb-8 relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={`Imagem de capa para ${titulo ?? 'artigo'}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}        {/* Conteúdo Principal do Artigo */}
        {artigoConteudo ? (
          <div
            className="prose lg:prose-xl max-w-none mx-auto article-content text-gray-800"
            dangerouslySetInnerHTML={{ 
              __html: artigoConteudo
                // Garantindo que não há spans ou textos com cor branca
                .replace(/color:\s*white/gi, 'color: #333333')
                .replace(/color:\s*#fff(fff)?/gi, 'color: #333333')
                .replace(/color:\s*rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/gi, 'color: #333333')
                .replace(/style="color:\s*white/gi, 'style="color: #333333')
                .replace(/style="color:\s*#fff(fff)?/gi, 'style="color: #333333')
                .replace(/<p>/gi, '<p style="color: #333333">')
                .replace(/<h[1-6]/gi, '<h$1 style="color: #333333"')
                .replace(/<span/gi, '<span style="color: #333333"')
                .replace(/<li/gi, '<li style="color: #333333"')
            }}
            style={{ color: '#333333' }}
          />
        ) : (
          <p className="text-center text-gray-500">Conteúdo do artigo indisponível.</p>
        )}

        {/* Seção de Comentários com Giscus */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold mb-6">Comentários</h2>
          {/* Renderiza o componente Giscus */}
          <GiscusComments />
        </section>
        
        {/* Seção de Artigos Relacionados */}
        <RelatedArticles currentArticleId={currentArticleId} tags={tags} />
      </article>
    </>
  );
}

// SEO Dinâmico implementado com metadata e schema
