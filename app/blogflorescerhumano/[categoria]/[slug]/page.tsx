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

import ProgressBar from "@/app/blogflorescerhumano/components/ProgressBar"; // Importa o componente da barra de progresso
import TableOfContents from "@/app/blogflorescerhumano/components/TableOfContents"; // Importa o componente do índice
import "@/app/blogflorescerhumano/components/article-styles.css"; // Importa estilos específicos para artigos

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
      />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {" "}
        {/* Navegação Estrutural (Breadcrumbs) aprimorada */}
        <nav aria-label="Navegação estrutural" className="mb-6">
          {" "}
          <ol className="flex items-center flex-wrap text-sm text-[#735B43]">
            <li className="flex items-center">
              <Link href="/blogflorescerhumano" legacyBehavior>
                <a className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Blog
                </a>
              </Link>
              <span className="mx-2 text-[#C19A6B]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </li>
            <li className="flex items-center">
              <Link href={`/blogflorescerhumano/categorias`} legacyBehavior>
                <a className="text-[#735B43] hover:text-[#C19A6B] transition-colors">
                  Categorias
                </a>
              </Link>
              <span className="mx-2 text-[#C19A6B]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </li>
            <li className="text-[#583B1F] font-medium">
              <Link
                href={`/blogflorescerhumano/${categoriaSlug}`}
                legacyBehavior
              >
                <a className="text-[#583B1F] hover:text-[#C19A6B] transition-colors">
                  {nomeCategoria}
                </a>
              </Link>
            </li>
          </ol>
        </nav>
        {/* Cabeçalho do Artigo */}{" "}
        <header className="mb-8 border-b pb-4 border-[#C19A6B]/30">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight text-[#583B1F]">
            {titulo ?? "Artigo sem título"}
          </h1>
          <div className="flex items-center mt-4 mb-3">
            <div className="flex-shrink-0 mr-3">
              <Image
                src="/blogflorescerhumano/autores/daniel-psi-blog.webp"
                alt={`Foto de ${nomeAutor}`}
                width={48}
                height={48}
                className="rounded-full border-2 border-[#C19A6B]/30 shadow-sm"
              />
            </div>
            <div>
              {" "}
              <div className="text-[#735B43] flex flex-col xs:flex-row xs:items-center">
                <span className="font-medium text-[#583B1F]">{nomeAutor}</span>
                <div className="flex items-center mt-1 xs:mt-0">
                  <span className="hidden xs:inline mx-2">•</span>
                  <span className="flex items-center text-sm">
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
                  </span>{" "}
                  <span className="hidden sm:flex items-center text-sm ml-2">
                    <span className="mx-2">•</span>
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
                    {/* Estimativa de tempo de leitura: ~200 palavras por minuto */}
                    {artigoConteudo
                      ? `${Math.max(1, Math.ceil(artigoConteudo.split(" ").length / 200))} min de leitura`
                      : "5 min de leitura"}
                  </span>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Exibição das Tags com Destaque */}
          {tags && Array.isArray(tags) && tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#C19A6B]"
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
                <span className="font-semibold text-[#583B1F]">Tags:</span>
              </div>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blogflorescerhumano/tags/${tag.slug}`}
                  legacyBehavior
                >
                  <a className="text-sm bg-[#F8F5F0] text-[#583B1F] px-4 py-1.5 rounded-full border border-[#C19A6B]/30 hover:bg-[#C19A6B]/20 transition-all duration-300 shadow-sm hover:shadow flex items-center">
                    <span className="text-[#C19A6B] mr-1">#</span>
                    {tag.nome}
                  </a>
                </Link>
              ))}
            </div>
          )}
        </header>{" "}
        {/* Botões de Compartilhamento Aprimorados */}{" "}
        <div className="bg-[#F8F5F0] p-4 rounded-lg shadow-sm mb-6 border border-[#C19A6B]/20">
          <ShareButtons
            url={shareUrl}
            title={titulo ?? "Artigo do Blog Florescer Humano"}
            summary={resumo ?? undefined}
          />{" "}
        </div>
        {/* Barra de progresso de leitura - Componente cliente */}
        <ProgressBar />
        {/* Imagem de Capa Aprimorada */}
        {imageUrl && (
          <div className="mb-10 relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            <Image
              src={imageUrl}
              alt={`Imagem de capa para ${titulo ?? "artigo"}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
          </div>
        )}{" "}        {/* Conteúdo Principal do Artigo - Aprimorado com Índice */}
        {artigoConteudo ? (
          <div className="article-container">
            {/* Importamos o componente cliente TableOfContents */}
            <TableOfContents articleContentId="article-content" />{" "}            <div
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
        )}{" "}
        {/* Bio do Autor ao Final do Artigo */}{" "}
        <div className="mt-12 pt-6 border-t border-[#C19A6B]/30">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 bg-[#F8F5F0] rounded-lg shadow-sm border border-[#C19A6B]/20">
            <div className="flex-shrink-0">
              <Image
                src="/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                alt={`Foto de ${nomeAutor}`}
                width={80}
                height={80}
                className="rounded-full border-2 border-[#C19A6B]/30 shadow-sm"
              />
            </div>
            <div>
              {" "}
              <h3 className="text-lg font-semibold mb-1 text-center sm:text-left text-[#583B1F]">
                {nomeAutor}
              </h3>{" "}
              <p className="text-[#735B43] mb-2 text-sm">
                Psicólogo e escritor do Blog Florescer Humano
              </p>
              <p className="text-[#735B43] text-sm">
                Especialista em Saúde Mental com formação em Abordagem Centrada
                Pessoa, ajudando pessoas a encontrarem seu potencial pleno
                através do autoconhecimento e crescimento pessoal.
              </p>
              <div className="mt-3 flex justify-center sm:justify-start">
                <a
                  href="https://psicologodanieldantas.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#C19A6B] hover:text-[#583B1F] transition-colors mr-4"
                >
                  Website
                </a>
                <a
                  href="https://instagram.com/psidanieldantas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#C19A6B] hover:text-[#583B1F] transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Seção de Artigos Relacionados */}{" "}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-[#C19A6B]/30 text-[#583B1F]">
            Leituras relacionadas
          </h2>
          <RelatedArticles
            currentArticleId={currentArticleId}
            tags={tags}
          />{" "}
        </section>
        {/* Exibição de tags relacionadas em destaque ao final do artigo */}
        {tags && Array.isArray(tags) && tags.length > 0 && (
          <section className="my-10">
            <div className="bg-[#F8F5F0] p-5 rounded-lg border border-[#C19A6B]/30 shadow-sm">
              <h3 className="text-lg font-medium mb-4 text-[#583B1F] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-[#C19A6B]"
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
                Tópicos discutidos neste artigo:
              </h3>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blogflorescerhumano/tags/${tag.slug}`}
                    legacyBehavior
                  >
                    <a className="text-sm bg-white text-[#583B1F] px-4 py-1.5 rounded-full border border-[#C19A6B]/30 hover:bg-[#C19A6B]/20 transition-all duration-300 shadow-sm hover:shadow flex items-center">
                      <span className="text-[#C19A6B] mr-1">#</span>
                      {tag.nome}
                    </a>
                  </Link>
                ))}
              </div>
              <p className="mt-4 text-sm text-[#735B43]">
                Clique em uma tag para ver mais artigos sobre esse tema.
              </p>
            </div>
          </section>
        )}
        {/* Seção de Comentários com Giscus */}
        <section className="mt-12 pt-8 border-t border-[#C19A6B]/30">
          <h2 className="text-2xl font-semibold mb-6 text-[#583B1F]">
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
