// app/blogflorescerhumano/categorias/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import type { Metadata } from 'next'; // Importar Metadata
import PaginationControls from '../components/PaginationControls'; // Importa o componente de paginação

type Categoria = Database['public']['Tables']['categorias']['Row'];

// Adicionar Metadados Estáticos
export const metadata: Metadata = {
  title: 'Categorias | Blog Florescer Humano',
  description: 'Explore os artigos do Blog Florescer Humano por categoria, abordando temas como autoconhecimento, bem-estar, relacionamentos e psicologia humanista.',
  alternates: {
    canonical: '/blogflorescerhumano/categorias',
  },
  openGraph: {
    title: 'Categorias | Blog Florescer Humano',
    description: 'Explore os artigos do Blog Florescer Humano por categoria.',
    url: '/blogflorescerhumano/categorias',
    siteName: 'Blog Florescer Humano',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Categorias | Blog Florescer Humano',
    description: 'Explore os artigos do Blog Florescer Humano por categoria.',
  },
};

// Define quantas categorias serão exibidas por página
const CATEGORIES_PER_PAGE = 9; // Ajuste conforme necessário

// Cria uma função estática para processar a página no build time (em vez de usar searchParams diretamente)
export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {  // --- Lógica de Paginação --- //
  // Acesso às propriedades com sintaxe de colchetes
  const page = searchParams['page'] ?? "1";
  const currentPage = parseInt(page, 10);
  const from = (currentPage - 1) * CATEGORIES_PER_PAGE;
  const to = from + CATEGORIES_PER_PAGE - 1;

  // --- Busca da Contagem Total de Categorias --- //
  const { count: totalCount, error: countError } = await supabaseServer
    .from('categorias')
    .select('*', { count: 'exact', head: true }); // Conta todas as categorias

  if (countError) {
    console.error('Erro ao contar categorias:', countError);
    // Considerar como lidar com este erro
  }

  const totalPages = totalCount ? Math.ceil(totalCount / CATEGORIES_PER_PAGE) : 1;

  // --- Busca de Categorias da Página Atual --- //
  const { data: categorias, error } = await supabaseServer
    .from('categorias')
    .select('id, nome, slug, descricao') // Busca nome, slug e descrição
    .order('nome', { ascending: true }) // Ordena por nome
    .range(from, to); // Aplica o range para a paginação

  // --- Tratamento de Erro --- //
  if (error) {
    console.error(`Erro ao buscar categorias (Página ${currentPage}):`, error);
    // Poderia retornar uma mensagem de erro mais explícita aqui
  }

  // Log para depuração
  console.log(`Categorias - Página Atual: ${currentPage}, Total de Categorias: ${totalCount}, Total de Páginas: ${totalPages}`);


  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 border-b pb-4">Categorias</h1>

      {categorias && categorias.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => (
            <Link key={categoria.id} href={`/blogflorescerhumano/${categoria.slug}`} legacyBehavior>
              <a className="block p-6 border rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-2 text-teal-700">{categoria.nome}</h2>
                {categoria.descricao && (
                  <p className="text-gray-600 text-sm line-clamp-3">{categoria.descricao}</p>
                )}
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          {error
            ? 'Não foi possível carregar as categorias no momento.'
            : currentPage > 1 ? 'Não há mais categorias para exibir.' : 'Nenhuma categoria encontrada.' // Mensagem ajustada
          }
        </p>
      )}

      {/* Adiciona controles de paginação se houver mais de uma página */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Suspense fallback={null}>
            <PaginationControls
              currentPage={currentPage}
              totalCount={totalCount ?? 0}
              pageSize={CATEGORIES_PER_PAGE}
              basePath="/blogflorescerhumano/categorias"
            />
          </Suspense>
        </div>
      )}
    </main>
  );
}
