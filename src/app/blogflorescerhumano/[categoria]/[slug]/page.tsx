// src/app/blogflorescerhumano/[categoria]/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Database } from '@/types/supabase'; // Tipos atualizados
import GiscusComments from '@/app/blogflorescerhumano/components/GiscusComments';

// Tipos específicos para esta página usando o schema correto
type Artigo = Database['public']['Tables']['artigos']['Row'];
type Categoria = Database['public']['Tables']['categorias']['Row'];
type Autor = Database['public']['Tables']['autores']['Row'];

interface ArtigoPageProps {
  params: {
    categoria: string; // slug da categoria
    slug: string;      // slug do artigo
  };
}

export default async function ArtigoEspecificoPage({ params }: ArtigoPageProps) {
  const { categoria: categoriaSlugParam, slug: artigoSlugParam } = params;

  // --- LOG: Parâmetros recebidos --- //
  console.log(`[Artigo Page] Recebido categoriaSlugParam: "${categoriaSlugParam}", artigoSlugParam: "${artigoSlugParam}"`);

  // --- 1. Busca de Dados do Artigo --- //
  const { data: artigo, error: artigoError } = await supabaseServer
    .from('artigos')
    .select(`
      id,
      titulo,
      conteudo,
      data_publicacao,
      imagem_capa_arquivo,
      categoria_id,
      autor_id,
      slug,
      status // Inclui status para depuração
    `)
    .eq('slug', artigoSlugParam)
    // Removendo filtros temporariamente para depuração, focando apenas no slug
    // .eq('status', 'publicado')
    // .lte('data_publicacao', new Date().toISOString())
    .single<Artigo>();

  // --- LOG: Resultado da busca do artigo --- //
  if (artigoError) {
    console.error('[Artigo Page] Erro ao buscar artigo:', artigoError);
  } else if (!artigo) {
    console.warn(`[Artigo Page] Artigo com slug "${artigoSlugParam}" não encontrado no DB (sem filtros de status/data).`);
  } else {
    console.log(`[Artigo Page] Artigo encontrado: ID=${artigo.id}, Titulo="${artigo.titulo}", CategoriaID=${artigo.categoria_id}, Status=${artigo.status}, DataPub=${artigo.data_publicacao}`);
  }

  // --- Validação do Artigo --- //
  if (artigoError || !artigo) {
    console.log('[Artigo Page] Chamando notFound() devido a erro na busca ou artigo não encontrado.');
    notFound();
  }

  // --- Re-aplicando filtros de status e data após encontrar pelo slug --- //
  if (artigo.status !== 'publicado') {
    console.warn(`[Artigo Page] Artigo encontrado (ID=${artigo.id}), mas status é "${artigo.status}" (esperado "publicado"). Chamando notFound().`);
    notFound();
  }
  if (artigo.data_publicacao && new Date(artigo.data_publicacao) > new Date()) {
    console.warn(`[Artigo Page] Artigo encontrado (ID=${artigo.id}), mas data_publicacao (${artigo.data_publicacao}) está no futuro. Chamando notFound().`);
    notFound();
  }

  // --- 2. Busca de Dados da Categoria --- //
  let categoria: Categoria | null = null;
  let categoriaError: any = null;

  if (artigo.categoria_id) {
    // --- LOG: Buscando categoria --- //
    console.log(`[Artigo Page] Buscando categoria com ID: ${artigo.categoria_id}`);
    const { data: catData, error: catError } = await supabaseServer
      .from('categorias')
      .select('id, nome, slug')
      .eq('id', artigo.categoria_id)
      .single<Categoria>();

    categoria = catData;
    categoriaError = catError;

    // --- LOG: Resultado da busca da categoria --- //
    if (catError) {
      console.error('[Artigo Page] Erro ao buscar categoria:', catError);
    } else if (!categoria) {
      console.warn(`[Artigo Page] Categoria com ID ${artigo.categoria_id} não encontrada.`);
    } else {
      console.log(`[Artigo Page] Categoria encontrada: ID=${categoria.id}, Nome="${categoria.nome}", Slug="${categoria.slug}"`);
    }

  } else {
    console.warn(`[Artigo Page] Artigo com slug "${artigoSlugParam}" não possui categoria_id. Chamando notFound().`);
    notFound();
  }

  // --- Validação da Categoria --- //
  if (categoriaError || !categoria) {
    console.log('[Artigo Page] Chamando notFound() devido a erro na busca ou categoria não encontrada.');
    notFound();
  }

  // --- Validação de Consistência Categoria URL vs DB --- //
  if (categoria.slug !== categoriaSlugParam) {
    console.warn(`[Artigo Page] Inconsistência de Slug! URL: "${categoriaSlugParam}", DB: "${categoria.slug}". Chamando notFound().`);
    notFound();
  }

  // --- 3. Busca de Dados do Autor --- //
  let autor: Autor | null = null;
  let autorError: any = null;

  if (artigo.autor_id) {
    // --- LOG: Buscando autor --- //
    console.log(`[Artigo Page] Buscando autor com ID: ${artigo.autor_id}`);
    const { data: autorData, error: autError } = await supabaseServer
      .from('autores')
      .select('id, nome')
      .eq('id', artigo.autor_id)
      .single<Autor>();

    autor = autorData;
    autorError = autError;

    // --- LOG: Resultado da busca do autor --- //
    if (autError) {
      console.error('[Artigo Page] Erro ao buscar autor:', autError);
    } else if (!autor) {
      console.warn(`[Artigo Page] Autor com ID ${artigo.autor_id} não encontrado.`);
    } else {
      console.log(`[Artigo Page] Autor encontrado: ID=${autor.id}, Nome="${autor.nome}"`);
    }

  } else {
    console.warn(`[Artigo Page] Artigo com slug "${artigoSlugParam}" não possui autor_id.`);
    // Não chama notFound() aqui, apenas usará o nome padrão
  }

  // --- Validação do Autor (Opcional) --- //
  if (autorError) {
    console.error('[Artigo Page] Erro ao buscar autor (não fatal):', autorError);
  }

  // --- LOG: Dados finais antes de renderizar --- //
  console.log('[Artigo Page] Dados prontos para renderização.');

  // Extrai dados (usando nomes corretos das colunas)
  const { titulo, conteudo, data_publicacao, imagem_capa_arquivo } = artigo;
  const categoriaNome = categoria.nome ?? 'Categoria Desconhecida';
  const categoriaSlug = categoria.slug; // Já validado
  const autorNome = autor?.nome ?? 'Autor Desconhecido'; // Usa o nome do autor buscado ou fallback

  const dataFormatada = data_publicacao
    ? new Date(data_publicacao).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Data não disponível';

  const imagemCapaUrl = imagem_capa_arquivo; // Coluna correta

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Navegação Estrutural (Breadcrumbs) */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/blogflorescerhumano" legacyBehavior><a className="hover:underline">Blog</a></Link>
        <span className="mx-2">/</span>
        <Link href={`/blogflorescerhumano/categorias`} legacyBehavior><a className="hover:underline">Categorias</a></Link>
        <span className="mx-2">/</span>
        <Link href={`/blogflorescerhumano/${categoriaSlug}`} legacyBehavior><a className="hover:underline">{categoriaNome}</a></Link>
      </nav>

      {/* Cabeçalho do Artigo */}
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{titulo ?? 'Artigo sem título'}</h1>
        <p className="text-gray-600">
          Publicado em {dataFormatada} por {autorNome} {/* Exibe nome do autor */}
        </p>
        {/* TODO: Adicionar Tags aqui */}
      </header>

      {/* Imagem de Capa */}
      {imagemCapaUrl && (
        <div className="mb-8 relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imagemCapaUrl} // Coluna correta
            alt={`Imagem de capa para ${titulo ?? 'artigo'}`}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      )}

      {/* Conteúdo Principal do Artigo */}
      {conteudo ? (
        <article
          className="prose lg:prose-xl max-w-none mx-auto"
          dangerouslySetInnerHTML={{ __html: conteudo }} // Coluna correta
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
    </main>
  );
}

// TODO: Implementar Tags
// TODO: Implementar Artigos Relacionados
// TODO: SEO Dinâmico (metadata)
