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

  // Foca no input ao abrir
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showInput &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
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
    <div className="relative flex items-center gap-2">
      {showInput && (
        <div
          className="absolute right-0 top-full mt-6 z-30 w-[90vw] max-w-sm sm:w-[350px] transition-all duration-200"
          style={{ minWidth: 260 }}
        >
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-[#F8F5F0] border border-[#C19A6B] rounded-md shadow-lg px-3 py-3 animate-fade-in"
          >
            <input
              ref={inputRef}
              type="search"
              id="headerSearchQuery"
              name="q"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por artigo, autor, categoria, tag ou conteúdo..."
              className="flex-1 py-1.5 pl-2 pr-2 text-sm bg-transparent text-[#583B1F] placeholder:text-[#735B43]/70 font-light focus:outline-none"
              onBlur={() => setShowInput(false)}
            />
            <ButtonBlog type="submit" className="text-xs px-3 sm:px-4 py-1.5 rounded bg-[#F8F5F0] text-[#583B1F] border border-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-colors">
              Buscar
            </ButtonBlog>
          </form>
        </div>
      )}
      <button
        type="button"
        aria-label="Abrir busca"
        className="p-2 rounded-full border border-transparent hover:border-[#C19A6B] bg-[#F8F5F0] text-[#583B1F] focus:outline-none focus:ring-2 focus:ring-[#735B43] transition-all z-20"
        onClick={() => setShowInput((v) => !v)}
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
