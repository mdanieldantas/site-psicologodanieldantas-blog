// app/blogflorescerhumano/categorias/page.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server'; // Ajustado para @/
import type { Database } from '@/types/supabase'; // Ajustado para @/

type Categoria = Database['public']['Tables']['categorias']['Row'];

export default async function CategoriasPage() {
  // --- Busca de Dados das Categorias --- //
  const { data: categorias, error } = await supabaseServer
    .from('categorias')
    .select('id, nome, slug, descricao') // Busca nome, slug e descrição
    .order('nome', { ascending: true }); // Ordena por nome

  // --- Tratamento de Erro --- //
  if (error) {
    console.error('Erro ao buscar categorias:', error);
    // Poderia retornar uma mensagem de erro mais explícita aqui
  }

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
          {error ? 'Não foi possível carregar as categorias no momento.' : 'Nenhuma categoria encontrada.'}
        </p>
      )}
    </main>
  );
}
