// app/blogflorescerhumano/[categoria]/[slug]/page.tsx
import React from "react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Database } from "@/types/supabase";
import GiscusComments from "@/app/blogflorescerhumano/components/GiscusComments";
import RelatedArticles from "@/app/blogflorescerhumano/components/RelatedArticles"; // Corrigido o import para usar o alias @/
import type { Metadata } from "next"; // Importa tipos de Metadata
import CitationBox from "@/app/blogflorescerhumano/components/CitationBox"; // Importa o componente de citação

import ProgressBar from "@/app/blogflorescerhumano/components/ProgressBar"; // Importa o componente da barra de progresso
import TableOfContents from "@/app/blogflorescerhumano/components/TableOfContents"; // Importa o componente do índice
import AudioPlayerTrigger from "@/app/blogflorescerhumano/components/AudioPlayerTrigger"; // Importa o componente de player de áudio flutuante
import "@/app/blogflorescerhumano/components/article-styles.css"; // Importa estilos específicos para artigos
// import * as AspectRatio from "@radix-ui/react-aspect-ratio"; // Importa o componente AspectRatio
import { getImageUrl, hasValidImage } from "@/lib/image-utils"; // Importa utilitários de imagem

// ✅ IMPORTS do sistema unificado de SEO
import { createMetadata, optimizeTitle, optimizeDescription } from '../../../../lib/metadata-config';
import { getArticleBreadcrumbs, generateBreadcrumbJsonLd } from '../../../../lib/breadcrumbs';
import { generateSchemaByFactory, generateSchemaJsonLd, type ArticleSchemaData, type ArticleSchemaDataExtended } from '../../../../lib/article-schema';

// ✅ IMPORTS para FAQ - Sistema Modular
import FAQSection from './components/FAQSection';
import { processFAQData } from '@/lib/faq-utils';

// ✅ PASSO 5.2 - ISR CONFIGURATION FOR NEXT.JS 15.2.4
// Time-based revalidation - artigos se atualizam raramente, então 1 hora é ideal
export const revalidate = 3600; // 1 hora

// Controla comportamento para paths não pré-gerados
export const dynamicParams = true; // Permite gerar páginas on-demand para artigos novos

// ✅ PASSO 5.2 - STATIC GENERATION PARA ARTIGOS PRINCIPAIS
export async function generateStaticParams() {
  try {
    console.log('🔄 [ISR] Iniciando generateStaticParams para artigos principais...');
    
    // Busca os 15 artigos mais populares/recentes para pré-renderizar
    const { data: artigos, error } = await supabaseServer
      .from('artigos')
      .select(`
        slug,
        categorias!inner (
          slug
        )
      `)
      .eq('status', 'publicado')
      .lte('data_publicacao', new Date().toISOString())
      .order('data_publicacao', { ascending: false })
      .limit(15); // Pré-gera apenas os 15 mais importantes

    if (error) {
      console.error('❌ [ISR] Erro ao buscar artigos para generateStaticParams:', error);
      return []; // Fallback: nenhum path pré-gerado
    }

    if (!artigos || artigos.length === 0) {
      console.log('⚠️ [ISR] Nenhum artigo encontrado para pré-renderização');
      return [];
    }

    const paths = artigos
      .filter(artigo => artigo.categorias?.slug && artigo.slug)
      .map(artigo => ({
        categoria: artigo.categorias!.slug,
        slug: artigo.slug
      }));

    console.log(`✅ [ISR] ${paths.length} artigos serão pré-renderizados:`, 
      paths.map(p => `/${p.categoria}/${p.slug}`).slice(0, 3), '...'
    );

    return paths;

  } catch (error) {
    console.error('💥 [ISR] Erro crítico no generateStaticParams:', error);
    return []; // Graceful fallback
  }
}

// Tipos de dados
type Artigo = Database["public"]["Tables"]["artigos"]["Row"];
type Categoria = Database["public"]["Tables"]["categorias"]["Row"];
type Autor = Database["public"]["Tables"]["autores"]["Row"];

interface ArtigoPageProps {
  params: Promise<{
    categoria: string; // slug da categoria
    slug: string; // slug do artigo
  }>;
}

// ✅ GENERATEMETADATA OTIMIZADO - Usando sistema unificado de SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string; categoria: string }> 
}): Promise<Metadata> {
  const { categoria: categoriaSlug, slug: artigoSlug } = await params;
    try {    // ✅ QUERY SEGURA - Incluindo meta_descricao e faq_data para SEO e FAQ
    const { data: artigo } = await supabaseServer
      .from('artigos')
      .select(`
        id,
        titulo,
        resumo,
        conteudo,
        meta_descricao,
        faq_data,
        imagem_capa_arquivo,
        data_publicacao,
        data_atualizacao,
        categorias!inner(nome, slug, descricao),
        autores(nome, biografia, perfil_academico_url)
      `)
      .eq('slug', artigoSlug)
      .eq('status', 'publicado')
      .eq('categorias.slug', categoriaSlug)
      .single();

    // ✅ BUSCA SEGURA DO META_TITULO (separada para não quebrar se não existir)
    let metaTituloFromDB: string | null = null;
    try {
      const { data: metaData } = await supabaseServer
        .from('artigos')
        .select('meta_titulo')
        .eq('slug', artigoSlug)
        .single();
      
      metaTituloFromDB = (metaData as any)?.meta_titulo || null;
    } catch (metaError) {
      // Se der erro (coluna não existe), continua normalmente
      console.log('Campo meta_titulo ainda não disponível, usando titulo padrão');
    }    if (!artigo) {
      return createMetadata({
        title: 'Artigo não encontrado',
        description: 'O artigo que você procura não foi encontrado em nosso blog.',
        path: `/blogflorescerhumano/${categoriaSlug}/${artigoSlug}`,
        pageType: 'article',
        robots: { index: false, follow: false }
      });
    }

    // ✅ EXTRAÇÃO SEGURA DE DADOS RELACIONAIS
    const categoria = Array.isArray(artigo.categorias) ? artigo.categorias[0] : artigo.categorias;
    const autor = Array.isArray(artigo.autores) ? artigo.autores[0] : artigo.autores;
    const autorNome = autor?.nome || 'Daniel Dantas';    // ✅ TÍTULOS E DESCRIÇÕES OTIMIZADOS (usando meta_titulo se disponível)
    const tituloOtimizado = optimizeTitle(metaTituloFromDB, artigo.titulo, 50);
    
    // ✅ PRIORIZAÇÃO DE META_DESCRICAO - Campo específico para SEO tem prioridade sobre resumo
    const metaDescricaoFromDB = (artigo as any)?.meta_descricao || null;
    const descricaoOtimizada = optimizeDescription(
      metaDescricaoFromDB || artigo.resumo, // Prioriza meta_descricao, fallback para resumo
      `Artigo sobre ${categoria?.nome || 'psicologia'} por ${autorNome}.`
    );// ✅ CONFIGURAÇÃO DE IMAGEM COM FALLBACKS
    const imagemUrl = artigo.imagem_capa_arquivo 
      ? `/images/blog/${artigo.imagem_capa_arquivo}`
      : '/blogflorescerhumano/logos-blog/logo-fundomarrom.webp';

    // ✅ USAR SISTEMA UNIFICADO PARA METADADOS COM E-A-T
    return createMetadata({
      title: tituloOtimizado, // ✅ NOVO: Título limpo sem autor duplicado
      description: descricaoOtimizada,
      path: `/blogflorescerhumano/${categoriaSlug}/${artigoSlug}`,
      pageType: 'article', // ✅ NOVO: Define como artigo
      articleAuthor: autorNome, // ✅ NOVO: Autor específico para E-A-T
      images: [imagemUrl],
      type: 'article',
      publishedTime: artigo.data_publicacao || undefined,
      modifiedTime: artigo.data_atualizacao || undefined,
      section: categoria?.nome || 'Psicologia',
      authors: [autorNome],
      tags: [categoria?.nome || 'psicologia', 'desenvolvimento pessoal'] // Tags básicas
    });
  } catch (error) {
    console.error('❌ Erro ao gerar metadata do artigo:', error);
      // ✅ FALLBACK SEGURO EM CASO DE ERRO
    return createMetadata({
      title: 'Erro ao carregar artigo',
      description: 'Houve um erro ao carregar este artigo. Tente novamente mais tarde.',
      path: `/blogflorescerhumano/${categoriaSlug}/${artigoSlug}`,
      pageType: 'article',
      robots: { index: false, follow: false }
    });
  }
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

// --- Componente da Página --- //
export default async function ArtigoEspecificoPage({
  params,
}: ArtigoPageProps) {
  // Await params para Next.js 15
  const resolvedParams = await params;
  const categoriaSlugParam = resolvedParams.categoria;
  const artigoSlugParam = resolvedParams.slug;

  // --- LOG: Parâmetros recebidos --- //
  console.log(
    `[Artigo Page] Recebido categoriaSlugParam: "${categoriaSlugParam}", artigoSlugParam: "${artigoSlugParam}"`
  );

  // --- 1. Busca do Artigo Específico --- //
  console.log(
    `[Artigo Page] Buscando artigo com slug: "${artigoSlugParam}" na categoria com slug: "${categoriaSlugParam}"`
  );  // Usamos a tipagem explícita aqui
  const { data: artigo, error: artigoError } = await supabaseServer
    .from("artigos")
    .select(
      `
      id,
      titulo,
      conteudo,
      resumo,
      faq_data,
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
  // Se houve erro na busca OU o artigo não foi encontrado OU não está publicado OU data futura
  if (artigoError || !artigo) {
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
    faq_data, // ✅ Adicionando faq_data na extração
  } = artigo; // Extrai o ID, resumo e faq_data também
  
  const nomeAutor = autores?.nome ?? "Autor Desconhecido";
  const nomeCategoria = categorias?.nome ?? "Categoria Desconhecida";
  const categoriaSlug = categorias?.slug ?? "sem-categoria";

  // --- Geração de URL da Imagem com Fallback --- //
  const imageUrl = getImageUrl(imagem_capa_arquivo, categoriaSlug);
  // --- Formatação da Data --- //
  const dataFormatada = data_publicacao
    ? new Date(data_publicacao).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",      })
    : "Data não disponível";
  // ✅ --- Processamento do FAQ --- //
  console.log(`📋 [FAQ] Processando FAQ para artigo: "${titulo}"`);
  // Cast seguro do tipo Json do Supabase para nosso tipo RawFAQData
  const faqProcessado = processFAQData(faq_data as any);
  
  if (faqProcessado) {
    console.log(`✅ [FAQ] ${faqProcessado.length} perguntas processadas com sucesso`);
  } else {
    console.log(`ℹ️ [FAQ] Nenhum FAQ encontrado para este artigo`);
  }
  // --- Construção da URL Completa para Compartilhamento --- //
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://psicologodanieldantas.com.br";
  const shareUrl = `${baseUrl}/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`;

  // Schema Markup JSON-LD para SEO
  const articleUrl = `${baseUrl}/blogflorescerhumano/${categoriaSlugParam}/${artigoSlugParam}`;
  const imagemCompleta = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
    // Buscar dados do autor do Supabase
  const { data: autorCompleto } = await supabaseServer
    .from('autores')
    .select('nome, biografia, foto_arquivo, perfil_academico_url')
    .eq('id', artigo.autor_id)
    .single();

  const autorNomeCompleto = autorCompleto?.nome || nomeAutor;
  // ✅ ESTRATÉGIA FAQ E SCHEMA INTELIGENTE
  console.log(`[Schema Strategy] Processando artigo: "${titulo}"`);  // ✅ PREPARAR DADOS PARA SCHEMA.ORG UNIFICADO
  const articleSchemaData: ArticleSchemaData = {
    titulo,
    meta_titulo: (artigo as any).meta_titulo || null, // Compatibilidade com campo que pode não existir
    resumo,
    conteudo: artigoConteudo || '',
    data_publicacao: data_publicacao,
    data_atualizacao: artigo.data_atualizacao || data_publicacao || undefined,
    imagem_capa_arquivo: imagem_capa_arquivo,
    categoria: {
      nome: nomeCategoria,
      slug: categoriaSlug,
      descricao: (categorias as any)?.descricao || null // Cast temporário para compatibilidade
    },
    autor: {
      nome: nomeAutor,
      biografia: autorCompleto?.biografia || null,
      perfil_academico_url: autorCompleto?.perfil_academico_url || null
    },
    slug: artigoSlugParam,
    categoriaSlug: categoriaSlugParam  };
  
  // ✅ FUNÇÃO PARA CONVERTER FAQ DATA DO SUPABASE
  const convertFAQData = (faqData: any): readonly { question: string; answer: string }[] | null => {
    if (!faqData || !Array.isArray(faqData)) return null;
    
    try {
      return faqData.filter((item: any) => 
        item && 
        typeof item === 'object' && 
        typeof item.question === 'string' && 
        typeof item.answer === 'string'
      ).map((item: any) => ({
        question: item.question,
        answer: item.answer
      }));
    } catch {
      return null;
    }
  };
  
  // ✅ PREPARAR DADOS ESTENDIDOS PARA A FÁBRICA DE SEO
  const articleExtendedData: ArticleSchemaDataExtended = {
    ...articleSchemaData,
    schema_type: (artigo as any).schema_type || null,
    faq_data: convertFAQData((artigo as any).faq_data),
    url_video: (artigo as any).url_video || null,
    url_podcast: (artigo as any).url_podcast || null,
    download_url: (artigo as any).download_url || null,
    download_title: (artigo as any).download_title || null,
    download_format: (artigo as any).download_format || null,
    download_description: (artigo as any).download_description || null,
    download_size_mb: (artigo as any).download_size_mb || null,
    content_tier: (artigo as any).content_tier || null
  };
  
  // ✅ GERAR SCHEMAS JSON-LD COM A NOVA FÁBRICA DE SEO
  const articleJsonLd = generateSchemaJsonLd(articleExtendedData, articleExtendedData.schema_type);
  const breadcrumbs = getArticleBreadcrumbs(nomeCategoria, categoriaSlug, titulo, artigoSlugParam);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <>      {/* ✅ FÁBRICA DE SEO - Schema.org inteligente (26 tipos suportados) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={articleJsonLd}
      />
      
      {/* ✅ BREADCRUMBS SCHEMA - Rich snippets de navegação */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={breadcrumbJsonLd}
      /><article className="container mx-auto px-4 pt-2 pb-12 max-w-4xl">        {/* Navegação Estrutural (Breadcrumbs) - Versão sofisticada */}
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
        <header>
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
                </span>              </div>
            </div>
          </div>

          {/* Exibição das Tags - Design elegante e refinado */}
          {tags && Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-6 tags-container-mobile">
              <div className="flex items-center text-xs text-[#735B43] mr-1 tag-label-mobile">
                <div className="flex items-center justify-center w-4 h-4 tag-icon-mobile-small bg-gradient-to-br from-[#F8F5F0] to-[#C19A6B]/10 rounded-full border-[0.5px] border-[#C19A6B]/30 mr-1.5 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-[#C19A6B]"
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
                Tags:
              </div>
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blogflorescerhumano/tags/${tag.slug}`}
                  className="tag-mobile-small inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F8F5F0]/50 to-[#F8F5F0]/80 text-[#583B1F] border-[0.5px] border-[#C19A6B]/15 hover:from-[#F8F5F0]/70 hover:to-[#F8F5F0] hover:border-[#C19A6B]/30 transition-all duration-300 hover:shadow-sm"
                >
                  <span className="text-[#C19A6B] mr-0.5 font-medium">#</span>
                  <span className="tracking-tight">{tag.nome}</span>
                </Link>
              ))}
            </div>
          )}          {/* ✅ Next.js Image Otimizada - Versão Ultra-Simplificada */}
          {hasValidImage(imagem_capa_arquivo) && (
            <div className="w-full mb-8">
              <Image
                src={imageUrl}
                alt={`Imagem de capa para ${titulo ?? "artigo"}`}
                width={1200}
                height={0}
                priority
                className="w-full h-auto rounded-lg"
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </div>
          )}</header>{/* Barra de progresso de leitura - Componente cliente */}
        <ProgressBar />        {/* Componente de Player de Áudio Flutuante */}
        <AudioPlayerTrigger 
          conteudo={artigoConteudo || ''} 
          titulo={titulo || ''} 
        />

{/* Conteúdo Principal do Artigo - Aprimorado com Índice */}        {artigoConteudo ? (
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
                __html: artigoConteudo                  // ✅ LIMPEZA MÍNIMA - Apenas correções essenciais para compatibilidade
                  .replace(/color:\s*white/gi, "color: #583B1F")
                  .replace(/color:\s*transparent/gi, "color: #583B1F")                  
                  // ✅ HEADINGS COM IDs SEMÂNTICOS para SEO e TableOfContents
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
                  // ✅ ESTILOS BÁSICOS - Mantendo apenas o essencial
                  .replace(
                    /<p>/gi,
                    '<p style="margin-bottom: 1.5rem; line-height: 1.8;">'
                  )
                  .replace(
                    /<ul/gi,
                    '<ul style="margin: 1.5rem 0; padding-left: 1.75rem;"'
                  )
                  .replace(
                    /<ol/gi,
                    '<ol style="margin: 1.5rem 0; padding-left: 1.75rem;"'
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

            {/* ✅ FAQ SECTION - Renderizado após o conteúdo principal */}
            {faqProcessado && (
              <FAQSection 
                faqData={faqProcessado}
                titulo="Dúvidas sobre este artigo?"
                subtitulo="Esclarecemos as principais questões relacionadas ao tema"
                position="after-content"
                allowMultiple={true}
                showIcons={true}
                showCounter={true}
                showFooter={true}
                accessibility={{
                  sectionId: `faq-${currentArticleId}`,
                  headingLevel: 'h2'
                }}
              />
            )}

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
        )}        {/* ✅ CORREÇÃO: FAQ extraído APENAS para Schema.org SEO - NÃO para renderização visual */}
        {/* FAQ visual já vem do banco de dados via dangerouslySetInnerHTML no conteúdo do artigo */}
        {/* extractedFAQItems é usado SOMENTE para gerar JSON-LD Schema.org, não HTML visual */}        {/* ✅ SEÇÃO CTA REMOVIDA - Foco em conteúdo limpo sem CTAs desnecessários */}
        
        {/* ✅ DEBUG INFO (apenas em desenvolvimento) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🔍 Schema Strategy Debug</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Schema Type:</strong> {schemaConfig.schemaType}</p>
              <p><strong>Has FAQ:</strong> {schemaConfig.hasSpecificFAQ ? 'Sim' : 'Não'}</p>
              <p><strong>FAQ Count:</strong> {extractedFAQItems?.length || 0}</p>
              <p><strong>Article:</strong> {titulo}</p>
            </div>
          </div>
        )} */}
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
                Especialista em Saúde Mental com formação em ACP, Focalização, e pesquisador de Mindfulness,
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
          </h2>          <div className="bg-[#F8F5F0]/30 rounded-lg p-0">
            <div className="related-articles-container">
              <RelatedArticles
                currentArticleId={currentArticleId}
                tags={tags ? tags.map(tag => tag.nome) : []}
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
              </div>              <p className="mt-3 text-xs text-[#5A4632] italic flex items-center">
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
