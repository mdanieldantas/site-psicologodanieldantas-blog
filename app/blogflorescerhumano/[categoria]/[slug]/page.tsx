// app/blogflorescerhumano/[categoria]/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Database } from '@/types/supabase';
import GiscusComments from '@/app/blogflorescerhumano/components/GiscusComments'; // Corrigindo o import para usar o alias @/

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

export default async function ArtigoEspecificoPage({ params }: ArtigoPageProps) {
  const { categoria: categoriaSlugParam, slug: artigoSlugParam } = params;

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
  // Agora 'artigo' tem o tipo ArtigoComRelacoes, e as propriedades devem ser reconhecidas
  const { titulo, conteudo: artigoConteudo, data_publicacao, imagem_capa_arquivo, categorias, autores, tags } = artigo;
  const nomeAutor = autores?.nome ?? 'Autor Desconhecido';
  const nomeCategoria = categorias?.nome ?? 'Categoria Desconhecida';
  const categoriaSlug = categorias?.slug ?? 'sem-categoria'; // Para links, se necessário

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
    const { data: imageData } = supabaseServer.storage
      .from('imagens-blog')
      .getPublicUrl(imagem_capa_arquivo);
    imageUrl = imageData?.publicUrl;
  }

  return (
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

      {/* Imagem de Capa */}
      {imageUrl && (
        <div className="mb-8 relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt={`Imagem de capa para ${titulo ?? 'artigo'}`}
            fill // Substitui layout="fill"
            className="object-cover" // Substitui objectFit="cover"
            priority // Carrega a imagem principal com prioridade
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Opcional: Ajuda o Next.js a otimizar o carregamento
          />
        </div>
      )}

      {/* Conteúdo Principal do Artigo */}
      {artigoConteudo ? (
        <div
          className="prose lg:prose-xl max-w-none mx-auto"
          dangerouslySetInnerHTML={{ __html: artigoConteudo }}
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

      {/* TODO: Seção de Artigos Relacionados */}
      {/* ... */}
    </article>
  );
}

// TODO: Implementar Tags
// TODO: Implementar Artigos Relacionados
// TODO: SEO Dinâmico (metadata)
