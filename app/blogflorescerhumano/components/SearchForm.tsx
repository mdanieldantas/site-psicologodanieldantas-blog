'use client'; // Necessário para usar hooks como useState e useRouter

import React, { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || ''; // Pega a query atual da URL
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/blogflorescerhumano/buscar?q=${encodeURIComponent(query.trim())}`);
    } else {
      // Se a busca estiver vazia, talvez redirecionar para a página de busca sem query
      // ou simplesmente limpar os resultados (depende da lógica da página de busca)
      router.push(`/blogflorescerhumano/buscar`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <label htmlFor="searchQuery" className="sr-only">
        Buscar artigos
      </label>
      <div className="relative">
        <input
          type="search"
          id="searchQuery"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artigos por título ou conteúdo..."
          className="block w-full p-4 ps-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
