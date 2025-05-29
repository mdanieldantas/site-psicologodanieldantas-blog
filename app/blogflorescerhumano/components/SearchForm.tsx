'use client'; // Necessário para usar hooks como useState e useRouter

import React, { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ButtonBlog from './ButtonBlog';

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
    <form onSubmit={handleSearch} className="mb-12 w-full max-w-lg mx-auto mt-8">
      <label htmlFor="searchQuery" className="sr-only">
        Buscar artigos, autores, categorias...
      </label>
      <div className="relative">
        <input
          type="search"
          id="searchQuery"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por artigo, autor, categoria, tag ou conteúdo..."
          className="block w-full py-2 pl-4 pr-28 text-base border border-[#C19A6B] rounded-md bg-[#F8F5F0] text-[#583B1F] placeholder:text-[#5A4632] shadow-sm font-light focus:ring-2 focus:ring-[#735B43] focus:border-[#735B43] transition-all"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <ButtonBlog type="submit" className="text-sm px-4 py-1 rounded bg-[#F8F5F0] text-[#583B1F] border border-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-colors">
            Buscar
          </ButtonBlog>
        </span>
      </div>
    </form>
  );
}
