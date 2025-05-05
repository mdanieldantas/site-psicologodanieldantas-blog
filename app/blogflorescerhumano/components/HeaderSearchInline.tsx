'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ButtonBlog from './ButtonBlog';
import { Search } from 'lucide-react';

export default function HeaderSearchInline() {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null); // <-- Adiciona ref para o container do form

  // Foca no input ao abrir
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Verifica se o clique foi fora do container do formulário
      if (
        showInput &&
        formContainerRef.current && // <-- Usa a ref do container
        !formContainerRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
      }
    }
    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/blogflorescerhumano/buscar?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/blogflorescerhumano/buscar`);
    }
    setShowInput(false);
  };

  return (
    <div className="relative">
      {/* Botão de busca */}      <button
        onClick={() => setShowInput((v) => !v)}
        className="p-2 rounded-full hover:bg-[#C19A6B]/10 transition-colors duration-200"
        aria-label="Abrir busca"
      >
        <Search className="h-5 w-5 text-[#583B1F]" />
      </button>

      {/* Modal de busca */}
      {showInput && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-20" onClick={() => setShowInput(false)}>
          {/* Adiciona a ref e stopPropagation ao container do formulário */}
          <div 
            ref={formContainerRef} 
            onClick={(e) => e.stopPropagation()} // <-- Adiciona stopPropagation aqui
            className="absolute right-0 top-[4.5rem] mt-1 z-30 w-[90vw] max-w-sm sm:w-[350px] mx-4"
          >
            <form
              className="flex items-center gap-2 bg-[#F8F5F0]/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-[#C19A6B]"
              onSubmit={handleSearch}
            >              <input
                ref={inputRef}
                type="search"
                id="headerSearchQuery"
                name="q"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar no blog..." // Placeholder simplificado
                aria-label="Campo de busca no blog" // Adicionado aria-label
                className="flex-1 py-1.5 pl-2 pr-2 text-sm bg-white/90 text-[#583B1F] placeholder:text-[#C19A6B] font-medium border border-[#C19A6B] rounded focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:border-[#735B43]"
                // Removido onBlur={() => setShowInput(false)}
              />
              <ButtonBlog type="submit" className="text-xs px-3 sm:px-4 py-1.5 rounded bg-[#F8F5F0] text-[#583B1F] border border-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-colors">
                Buscar
              </ButtonBlog>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
