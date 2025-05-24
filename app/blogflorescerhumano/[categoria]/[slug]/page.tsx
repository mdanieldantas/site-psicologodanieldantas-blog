// app/blogflorescerhumano/[categoria]/[slug]/page.tsx
import React from "react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Database } from "@/types/supabase";
import GiscusComments from "@/app/blogflorescerhumano/components/GiscusComments";
import RelatedArticles from "@/app/blogflorescerhumano/components/RelatedArticles"; // Corrigido o import para usar o alias @/
import ShareButtons from "@/app/blogflorescerhumano/components/ShareButtons"; // Importa o novo componente
import type { Metadata, ResolvingMetadata } from "next"; // Importa tipos de Metadata
import ArticleSchema from "@/app/blogflorescerhumano/components/ArticleSchema"; // Importa o componente de Schema JSON-LD
import CitationBox from "@/app/blogflorescerhumano/components/CitationBox"; // Importa o componente de citação

import ProgressBar from "@/app/blogflorescerhumano/components/ProgressBar"; // Importa o componente da barra de progresso
import TableOfContents from "@/app/blogflorescerhumano/components/TableOfContents"; // Importa o componente do índice
import "@/app/blogflorescerhumano/components/article-styles.css"; // Importa estilos específicos para artigos
import * as AspectRatio from "@radix-ui/react-aspect-ratio"; // Importa o componente AspectRatio

type Artigo = Database["public"]["Tables"]["artigos"]["Row"];
type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
type Autor = Database["public"]["Tables"]["autores"]["Row"];

interface ArtigoPageProps {
  params: {
    categoria: string; // slug da categoria
    slug: string; // slug do artigo
  };
}

// --- Tipagem Explícita para Dados do Artigo --- //
type ArtigoComRelacoes = Database["public"]["Tables"]["artigos"]["Row"] & {
  categorias: Pick<
    Database["public"]["Tables"]["categorias"]["Row"],
    "id" | "nome" | "slug"
  > | null;
  autores: Pick<
    Database["public"]["Tables"]["autores"]["Row"],
    "id" | "nome"
  > | null;
  tags:
    | Pick<
        Database["public"]["Tables"]["tags"]["Row"],
        "id" | "nome" | "slug"
      >[]
    | null; // Array de tags
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
    .from("artigos")
    .select("titulo, resumo, imagem_capa_arquivo, categorias ( slug )") // Seleciona o slug da categoria também
    .eq("slug", artigoSlugParam)
    .eq("categorias.slug", categoriaSlugParam) // Garante que o artigo pertence à categoria correta
    .eq("status", "publicado")
    .lte("data_publicacao", new Date().toISOString())
    .maybeSingle();

  // Se não encontrar o artigo ou houver erro, retorna metadados padrão ou vazios
  if (error || !artigo) {
    console.error(
      `[Metadata] Artigo não encontrado para slug: ${artigoSlugParam} na categoria ${categoriaSlugParam}`,
      error
    );
    return {
      title: "Artigo não encontrado | Blog Florescer Humano",
      description: "O artigo que você procura não foi encontrado.",
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

  const pageTitle = `${artigo.titulo ?? "Artigo"} | Blog Florescer Humano`;
  const pageDescription =
    artigo.resumo ?? "Leia este artigo no Blog Florescer Humano.";
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
      siteName: "Blog Florescer Humano",
      images: ogImageUrl
        ? [
            {
              // Para URLs relativas, o Next.js precisa da URL base para gerar a URL absoluta para OG
              url: new URL(
                ogImageUrl,
                process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
              ).toString(),
              width: 1200, // Ajuste conforme necessário
              height: 630, // Ajuste conforme necessário
              alt: `Imagem para ${artigo.titulo}`,
            },
          ]
        : [], // Usa imagem padrão do layout pai se não houver específica
      locale: "pt_BR",
      type: "article", // Define o tipo como artigo para OG
      // publishedTime: artigo.data_publicacao, // Requer buscar data_publicacao
      // authors: [nomeAutor], // Requer buscar nomeAutor
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      // Twitter também precisa de URLs absolutas
      images: ogImageUrl
        ? [
            new URL(
              ogImageUrl,
              process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            ).toString(),
          ]
        : [], // URL da imagem para Twitter
      // site: '@seuTwitter', // Opcional: seu handle do Twitter
      // creator: '@autorTwitter', // Opcional: handle do autor
    },
  };
}

// --- Componente da Página --- //
export default async function ArtigoEspecificoPage({
  params,
}: ArtigoPageProps) {
  // Acesso direto às propriedades de params sem desestruturação
  const categoriaSlugParam = params.categoria;
  const artigoSlugParam = params.slug;

  // --- LOG: Parâmetros recebidos --- //
  console.log(
    `[Artigo Page] Recebido categoriaSlugParam: "${categoriaSlugParam}", artigoSlugParam: "${artigoSlugParam}"`
  );

  // --- 1. Busca do Artigo Específico --- //
  console.log(
    `[Artigo Page] Buscando artigo com slug: "${artigoSlugParam}" na categoria com slug: "${categoriaSlugParam}"`
  );
  // Usamos a tipagem explícita aqui
  const { data: artigo, error: artigoError } = await supabaseServer
    .from("artigos")
    .select(
      `
      id,
      titulo,
      conteudo,
      data_publicacao,
      imagem_capa_arquivo,
      categorias!inner ( id, nome, slug ),
      autores ( id, nome ),
      status,
      tags ( id, nome, slug ) // Busca as tags relacionadas
    `
    )
    .eq("slug", artigoSlugParam)
    .eq("categorias.slug", categoriaSlugParam) // Filtra pela categoria usando a relação
    .eq("status", "publicado") // Garante que o artigo esteja publicado
    .lte("data_publicacao", new Date().toISOString()) // Garante que a data de publicação não seja futura
    .maybeSingle<ArtigoComRelacoes>(); // Especifica o tipo esperado para maybeSingle

  // --- Tratamento de Erro ou Artigo Não Encontrado --- //
  if (artigoError) {
    console.error("[Artigo Page] Erro ao buscar artigo:", artigoError);
    // Não chama notFound() aqui ainda, pode ser erro de rede
  }

  // Se houve erro na busca OU o artigo não foi encontrado OU não está publicado OU data futura
  if (artigoError || !artigo) {
    console.log(
      "[Artigo Page] Chamando notFound() devido a erro na busca ou artigo não encontrado/publicado/data futura."
    );
    notFound(); // Exibe a página 404
  }

  // --- Extração de Dados --- //
  const {
    id: currentArticleId,
    titulo,
    conteudo: artigoConteudo,
    data_publicacao,
    imagem_capa_arquivo,
    categorias,
    autores,
    tags,
    resumo,
  } = artigo; // Extrai o ID e resumo também
  const nomeAutor = autores?.nome ?? "Autor Desconhecido";
  const nomeCategoria = categorias?.nome ?? "Categoria Desconhecida";
  const categoriaSlug = categorias?.slug ?? "sem-categoria";

  // --- Formatação da Data --- //
  const dataFormatada = data_publicacao
    ? new Date(data_publicacao).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Data não disponível";

  // --- Geração de URL da Imagem --- //
  let imageUrl = null;
  if (imagem_capa_arquivo) {
    // Constrói o caminho relativo à pasta public
    imageUrl = `/blogflorescerhumano/${imagem_capa_arquivo}`;
  }

  // --- Construção da URL Completa para Compartilhamento --- //
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://psicologodanieldantas.com.br";
  const shareUrl = `${baseUrl}/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`;

  return (
    <>
      {/* Componente ArticleSchema para gerar Schema.org markup para artigos */}
      <ArticleSchema
        title={titulo}
        description={resumo || ""}
        publishDate={data_publicacao || ""}
        authorName={nomeAutor}
        imagePath={
          imagem_capa_arquivo
            ? `/blogflorescerhumano/${imagem_capa_arquivo}`
            : undefined
        }
        categoryName={categorias?.nome || ""}
        tags={tags || []}
        url={`/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`}
      />      <article className="container mx-auto px-4 pt-2 pb-12 max-w-4xl">        {/* Navegação Estrutural (Breadcrumbs) - Versão sofisticada */}
        <nav aria-label="Navegação estrutural" className="mb-3 pt-0 pb-1 px-2.5 bg-gradient-to-r from-[#F8F5F0]/20 to-[#F8F5F0]/80 rounded-lg shadow-sm overflow-hidden">
          <ol className="flex items-center text-xs whitespace-nowrap w-full">
            <li className="flex items-center">
              <Link 
                href="/blogflorescerhumano" 
                className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-all duration-300 font-medium"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-3.5 h-3.5 mr-1.5 text-[#C19A6B]"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="hover:underline underline-offset-2 decoration-[#C19A6B]/40">Blog</span>
              </Link>
              <div className="flex items-center mx-2.5 text-[#C19A6B]">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-3 h-3"
                >
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </div>
            </li>
            <li className="flex items-center">
              <Link 
                href="/blogflorescerhumano/categorias" 
                className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-all duration-300 font-medium group"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-3.5 h-3.5 mr-1.5 text-[#C19A6B]"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                <span className="hover:underline underline-offset-2 decoration-[#C19A6B]/40">Categorias</span>
              </Link>
            </li>
          </ol>
        </nav>

        {/* Cabeçalho do Artigo - Nova estrutura aprimorada */}
        <header className="mb-8">
          {/* Categoria destacada - Redesenhada com ícone */}
          <div className="mb-4">
            <Link 
              href={`/blogflorescerhumano/${categoriaSlug}`}
              className="inline-flex items-center gap-2 text-[#583B1F] hover:text-[#C19A6B] transition-all duration-300"
              title="Ver todos os artigos desta categoria"
            >
              <span className="flex items-center justify-center w-7 h-7 bg-[#F8F5F0] rounded-full border border-[#C19A6B]/50">
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#C19A6B]"
                  fill="none"
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium pb-1 border-b border-[#C19A6B]/30">
                {nomeCategoria}
              </span>
            </Link>
          </div>
            {/* Título principal */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-[#583B1F]">
            {titulo ?? "Artigo sem título"}
          </h1>
          
          {/* Subtítulo destacado */}
          {resumo && (
            <p className="text-xl md:text-2xl text-[#735B43] font-normal italic mb-5 leading-relaxed">
              {resumo}
            </p>
          )}          {/* Informações do autor e metadados em layout responsivo - Reorganizado com foto à esquerda e alinhamento vertical */}
          <div className="flex flex-row items-center gap-5 border-b border-[#C19A6B]/30 pb-6 mb-6">
            <div className="flex-shrink-0 self-center">
              <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-[#C19A6B] shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-105">
                <Image
                  src="/blogflorescerhumano/autores/mini-autores-daniel-psi-blog.webp"
                  alt={`Foto de ${nomeAutor}`}
                  width={120}
                  height={120}
                  className="w-20 h-20 object-cover"
                />
              </div>
            </div>
            
            <div className="flex flex-col flex-1 py-1"><div className="flex flex-col xs:flex-row xs:items-center mb-1">
                <span className="font-semibold text-[#583B1F] mr-2">{nomeAutor}</span>
                <span className="text-sm text-[#735B43] flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1 text-[#C19A6B]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Psicólogo CRP 11/11854
                </span>
              </div>
              
              <div className="text-[#735B43] flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {/* Data de publicação */}
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-[#C19A6B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {dataFormatada}
                </span>
                  {/* Tempo de leitura */}
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-[#C19A6B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {artigoConteudo
                    ? `${Math.max(1, Math.ceil(artigoConteudo.split(" ").length / 200))} min de leitura`
                    : "5 min de leitura"}
                </span>
              </div>
            </div>
          </div>{/* Imagem de Capa Aprimorada */}
          {imageUrl && (
            <div className="mb-8 relative w-full overflow-hidden rounded-lg shadow-lg">
              <AspectRatio.Root ratio={16 / 9}>
                <Image
                  src={imageUrl}
                  alt={`Imagem de capa para ${titulo ?? "artigo"}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 pointer-events-none"></div>
                {resumo && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white text-sm md:text-base font-medium drop-shadow-md hidden md:block">
                      {resumo}
                    </p>
                  </div>
                )}
              </AspectRatio.Root>
            </div>
          )}
            {/* Exibição das Tags - Design elegante e refinado */}          {tags && Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-5">              <div className="flex items-center text-xs text-[#735B43] mr-1">
                <div className="flex items-center justify-center w-4 h-4 bg-gradient-to-br from-[#F8F5F0] to-[#C19A6B]/10 rounded-full border-[0.5px] border-[#C19A6B]/30 mr-1.5 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-[#C19A6B]" // Aumentado de h-3 w-3
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blogflorescerhumano/tags/${tag.slug}`}
                  className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F8F5F0]/50 to-[#F8F5F0]/80 text-[#583B1F] border-[0.5px] border-[#C19A6B]/15 hover:from-[#F8F5F0]/70 hover:to-[#F8F5F0] hover:border-[#C19A6B]/30 transition-all duration-300 hover:shadow-sm"
                >
                  <span className="text-[#C19A6B] mr-0.5 font-medium">#</span>
                  <span className="tracking-tight">{tag.nome}</span>
                </Link>
              ))}
            </div>
          )}
        </header>        {/* Barra de progresso de leitura - Componente cliente */}
        <ProgressBar />{/* Conteúdo Principal do Artigo - Aprimorado com Índice */}        {artigoConteudo ? (
          <div className="article-container">
            {/* Importamos o componente cliente TableOfContents */}
            <TableOfContents articleContentId="article-content" />
            
            {/* Componente de Citação Acadêmica e Compartilhamento */}            
            <CitationBox 
              title={titulo}
              author="Marcos Daniel Gomes Dantas"
              date={data_publicacao || new Date().toISOString()}
              url={`https://www.psicologodanieldantas.com/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`}
            />
            
            <div
              id="article-content"
              className="prose lg:prose-lg max-w-none mx-auto article-content"
              style={{
                lineHeight: "1.8",
                fontSize: "1.125rem",
                color: "#583B1F",
              }}dangerouslySetInnerHTML={{
                __html: artigoConteudo
                  // Garantindo que não há spans ou textos com cor branca ou invisível
                  .replace(/color:\s*white/gi, "color: #583B1F")
                  .replace(/color:\s*#fff(fff)?/gi, "color: #583B1F")
                  .replace(
                    /color:\s*rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/gi,
                    "color: #583B1F"
                  )
                  .replace(/style="color:\s*white/gi, 'style="color: #583B1F')
                  .replace(
                    /style="color:\s*#fff(fff)?/gi,
                    'style="color: #583B1F'
                  )
                  .replace(/color:\s*transparent/gi, "color: #583B1F")
                  
                  // Melhorar os headings para SEO - adicionando IDs semânticos e classes
                  .replace(/<h1(.*?)>(.*?)<\/h1>/gi, (match, attributes, content) => {
                    const cleanContent = content.replace(/<.*?>/g, '').trim();
                    const id = cleanContent.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
                    return `<h1${attributes} id="${id}" class="heading-h1" style="color: #583B1F; margin-top: 3rem; margin-bottom: 1.8rem; font-weight: 700; font-size: 2.25rem; line-height: 1.3;">${content}</h1>`;
                  })
                  .replace(/<h2(.*?)>(.*?)<\/h2>/gi, (match, attributes, content) => {
                    const cleanContent = content.replace(/<.*?>/g, '').trim();
                    const id = cleanContent.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
                    return `<h2${attributes} id="${id}" class="heading-h2" style="color: #583B1F; margin-top: 2.8rem; margin-bottom: 1.5rem; font-weight: 600; font-size: 1.85rem; line-height: 1.35; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(193, 154, 107, 0.2);">${content}</h2>`;
                  })
                  .replace(/<h3(.*?)>(.*?)<\/h3>/gi, (match, attributes, content) => {
                    const cleanContent = content.replace(/<.*?>/g, '').trim();
                    const id = cleanContent.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
                    return `<h3${attributes} id="${id}" class="heading-h3" style="color: #583B1F; margin-top: 2.5rem; margin-bottom: 1.2rem; font-weight: 600; font-size: 1.5rem; line-height: 1.4;">${content}</h3>`;
                  })
                  .replace(/<h([4-6])(.*?)>(.*?)<\/h\1>/gi, (match, level, attributes, content) => {
                    const cleanContent = content.replace(/<.*?>/g, '').trim();
                    const id = cleanContent.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
                    return `<h${level}${attributes} id="${id}" class="heading-h${level}" style="color: #583B1F; margin-top: 2rem; margin-bottom: 1rem; font-weight: 600; font-size: 1.25rem; line-height: 1.4;">${content}</h${level}>`;
                  })
                  
                  // Aplicar melhorias de estilo aos parágrafos e outros elementos
                  .replace(
                    /<p>/gi,
                    '<p style="color: #583B1F; margin-bottom: 1.5rem; line-height: 1.8; font-size: 1.1rem;">'
                  )
                  .replace(/<span/gi, '<span style="color: inherit"')
                  .replace(
                    /<li/gi,
                    '<li style="color: #583B1F; margin-bottom: 0.75rem; line-height: 1.7;"'
                  )
                  .replace(
                    /<ul/gi,
                    '<ul style="color: #583B1F; margin-top: 1.5rem; margin-bottom: 2rem; padding-left: 1.75rem; list-style-type: disc;"'
                  )
                  .replace(
                    /<ol/gi,
                    '<ol style="color: #583B1F; margin-top: 1.5rem; margin-bottom: 2rem; padding-left: 1.75rem; list-style-type: decimal;"'
                  )
                  // Estilizar links dentro do conteúdo
                  .replace(
                    /<a /gi,
                    '<a style="color: #C19A6B; text-decoration: none; border-bottom: 1px dotted #C19A6B; transition: all 0.2s ease;" onmouseover="this.style.color=\'#735B43\'" onmouseout="this.style.color=\'#C19A6B\'" '
                  )
                  // Melhorar aparência de blockquotes
                  .replace(
                    /<blockquote>/gi,
                    '<blockquote style="border-left: 4px solid #C19A6B; padding: 1.25rem 1.5rem; font-style: italic; color: #735B43; margin: 2.5rem 0; background-color: #F8F5F0; font-size: 1.1rem; line-height: 1.7;">'
                  )
                  // Adicionar estilo para tabelas
                  .replace(
                    /<table/gi,
                    '<table style="border-collapse: collapse; width: 100%; margin: 2.5rem 0;"'
                  )
                  .replace(
                    /<th/gi,
                    '<th style="border: 1px solid #C19A6B; padding: 0.85rem; background-color: #F8F5F0; color: #583B1F; font-weight: 600; text-align: left;"'
                  )
                  .replace(
                    /<td/gi,
                    '<td style="border: 1px solid #C19A6B30; padding: 0.85rem; color: #583B1F;"'
                  ),
              }}
            />
            
            {/* Adicionando o CitationBox novamente aqui */}
            <CitationBox 
              title={titulo}
              author="Marcos Daniel Gomes Dantas"
              date={data_publicacao || new Date().toISOString()}
              url={`https://www.psicologodanieldantas.com/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`}
            />

          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-[#735B43] mb-4">
              Conteúdo do artigo indisponível.
            </p>
            <Link href="/blogflorescerhumano" legacyBehavior>
              <a className="text-[#C19A6B] hover:text-[#583B1F] transition-colors font-medium">
                Voltar para o blog
              </a>
            </Link>
          </div>
        )}{" "}        {/* Bio do Autor ao Final do Artigo */}
        <div className="mt-12 pt-6 border-t border-[#C19A6B]/30">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 p-6 bg-[#F8F5F0] rounded-lg shadow-sm border border-[#C19A6B]/20">
            <div className="flex-shrink-0 self-center">
              <div className="w-28 h-28 overflow-hidden rounded-full border-2 border-[#C19A6B] shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-105">
                <Image
                  src="/blogflorescerhumano/autores/mini-autores-daniel-psi-blog.webp"
                  alt={`Foto de ${nomeAutor}`}
                  width={120}
                  height={120}
                  className="w-28 h-28 object-cover"
                />
              </div>
            </div>
            <div>              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold text-center sm:text-left text-[#583B1F]">
                  {nomeAutor}
                </h3>
                <span className="hidden sm:inline text-[#C19A6B]">•</span>
                <span className="text-[#735B43] text-sm font-medium text-center sm:text-left flex items-center justify-center sm:justify-start">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1 text-[#C19A6B]" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Psicólogo CRP 11/11854
                </span>
              </div>
              <p className="text-[#735B43] mb-3 text-sm italic">
                Psicólogo e escritor do Blog Florescer Humano
              </p>              <p className="text-[#735B43] text-sm mb-3">
                Especialista em Saúde Mental com formação em ACP,Focalização,e pesquisador de Mindfulness,
                ajudando pessoas a encontrarem seu potencial pleno
                através do autoconhecimento e crescimento pessoal.
              </p>
              <div className="flex items-center flex-wrap gap-4 mt-4">
                <a
                  href="https://psicologodanieldantas.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-[#C19A6B]/10 hover:bg-[#C19A6B]/20 text-[#583B1F] px-4 py-1.5 rounded-full border border-[#C19A6B]/30 transition-all duration-300 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4 mr-2 text-[#C19A6B]"
                  >
                    <path d="M12 2 C 6.5 2 2 6.5 2 12 C 2 17.5 6.5 22 12 22 C 17.5 22 22 17.5 22 12 C 22 6.5 17.5 2 12 2 Z"></path>
                    <path d="M12 8 L 12 16"></path>
                    <path d="M8 12 L 16 12"></path>
                  </svg>
                  Website
                </a>                <a
                  href="https://instagram.com/psidanieldantas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-[#C19A6B]/10 hover:bg-[#C19A6B]/20 text-[#583B1F] px-4 py-1.5 rounded-full border border-[#C19A6B]/30 transition-all duration-300 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4 mr-2 text-[#C19A6B]"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Instagram                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de Artigos Relacionados - Redesenhada para maior consistência */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold mb-6 pb-3 border-b border-[#C19A6B]/30 text-[#583B1F] flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#F8F5F0] to-[#C19A6B]/10 rounded-full border-[0.5px] border-[#C19A6B]/30 mr-3 shadow-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.75" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-4.5 h-4.5 text-[#C19A6B]"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <span>Leituras Relacionadas</span>
          </h2>
          <div className="bg-[#F8F5F0]/30 rounded-lg p-0">
            <div className="related-articles-container">
              <RelatedArticles
                currentArticleId={currentArticleId}
                tags={tags}
                limit={3}
              />
            </div>
          </div>
        </section>
        {/* Exibição de tags relacionadas em destaque ao final do artigo */}        {tags && Array.isArray(tags) && tags.length > 0 && (
          <section className="my-10">
            <div className="bg-[#F8F5F0]/60 p-4 rounded-lg border-[0.5px] border-[#C19A6B]/20 shadow-sm">              <h3 className="text-sm font-medium mb-3 text-[#583B1F] flex items-center">
                <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-[#F8F5F0] to-[#C19A6B]/10 rounded-full border-[0.5px] border-[#C19A6B]/30 mr-2 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-[#C19A6B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <span>Tópicos discutidos neste artigo</span>
              </h3>              <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blogflorescerhumano/tags/${tag.slug}`}
                    className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F8F5F0]/50 to-[#F8F5F0]/80 text-[#583B1F] border-[0.5px] border-[#C19A6B]/15 hover:from-[#F8F5F0]/70 hover:to-[#F8F5F0] hover:border-[#C19A6B]/30 transition-all duration-300 hover:shadow-sm"
                  >
                    <span className="text-[#C19A6B] mr-0.5 font-medium">#</span>
                    <span className="tracking-tight">{tag.nome}</span>
                  </Link>
                ))}
              </div>              <p className="mt-3 text-xs text-[#735B43]/70 italic flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1 text-[#C19A6B]/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Clique em uma tag para explorar mais conteúdo sobre o tema
              </p>
            </div>
          </section>
        )}        {/* Seção de Comentários com Giscus */}
        <section className="mt-14 pt-8 border-t border-[#C19A6B]/30">
          <h2 className="text-2xl font-semibold mb-6 text-[#583B1F] flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="w-5 h-5 mr-2 text-[#C19A6B]"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Comentários
          </h2>
          {/* Renderiza o componente Giscus */}
          <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-sm border border-[#C19A6B]/20">
            <GiscusComments />
          </div>
        </section>
      </article>
    </>
  );
}

// SEO Dinâmico implementado com metadata e schema
