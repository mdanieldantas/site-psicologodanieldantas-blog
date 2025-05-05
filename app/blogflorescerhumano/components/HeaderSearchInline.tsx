'use client';

import { useState, FormEvent, useRef, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { useRouter } from 'next/navigation';
import ButtonBlog from './ButtonBlog';
import { Search, Loader2 } from 'lucide-react'; // Adicionado Loader2

// Interface para as sugestões (pode ser ajustada conforme a API)
interface Suggestion {
  type: 'article' | 'category' | 'tag' | 'author';
  value: string;
  slug?: string; // Opcional, útil para navegação direta
}

export default function HeaderSearchInline() {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false); // Para evitar fetch ao selecionar

  const inputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

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

  // Função para buscar sugestões na API
  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    if (!searchTerm || isSuggestionSelected) {
      setSuggestions([]);
      setIsSuggestionSelected(false); // Reseta o flag
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data: Suggestion[] = await response.json();
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [isSuggestionSelected]); // Depende de isSuggestionSelected para resetar

  // Debounce para buscar sugestões
  useEffect(() => {
    // Não busca se uma sugestão acabou de ser selecionada
    if (isSuggestionSelected) return;

    // Limpa sugestões se o campo estiver vazio ou muito curto
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timerId = setTimeout(() => {
      fetchSuggestions(query.trim());
    }, 300); // Atraso de 300ms

    return () => clearTimeout(timerId);
  }, [query, fetchSuggestions, isSuggestionSelected]);

  const handleSearch = (event?: FormEvent<HTMLFormElement>, searchQuery?: string) => {
    event?.preventDefault();
    const finalQuery = (searchQuery ?? query).trim();
    if (finalQuery) {
      router.push(`/blogflorescerhumano/buscar?q=${encodeURIComponent(finalQuery)}`);
    } else {
      router.push(`/blogflorescerhumano/buscar`);
    }
    // Não precisa mais atualizar o query aqui, pois ele já foi atualizado
    setSuggestions([]);
    setShowInput(false); // Fecha o modal APÓS a busca ser iniciada
  };

  // Mapeamento de tipos para exibição (opcional, para melhor UI)
  const suggestionTypeLabels: Record<Suggestion['type'], string> = {
    article: 'Artigo',
    category: 'Categoria',
    tag: 'Tag',
    author: 'Autor',
  };

  // --- MODIFICADO: handleSuggestionClick --- 
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setIsSuggestionSelected(true); // Marca que uma sugestão foi selecionada para evitar novo fetch
    setQuery(suggestion.value);   // Preenche o input com o valor da sugestão
    setSuggestions([]);           // Esconde o dropdown de sugestões
    // REMOVIDO: setShowInput(false); // Não fecha mais o modal aqui
    // REMOVIDA: Lógica de navegação direta ou chamada a handleSearch

    // Garante que o foco volte ao input para o usuário poder pressionar Enter ou clicar em Buscar
    // Usar setTimeout para garantir que o foco seja definido após o re-render
    setTimeout(() => {
        inputRef.current?.focus();
    }, 0);
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
              className="relative flex items-center gap-2 bg-[#F8F5F0]/95 backdrop-blur-md p-4 rounded-lg shadow-lg border border-[#C19A6B]" // Adicionado relative
              onSubmit={handleSearch}
            >              <input
                ref={inputRef}
                type="search"
                id="headerSearchQuery"
                name="q"
                autoComplete="off" // Desativa autocomplete nativo
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsSuggestionSelected(false); // Permite buscar novamente ao digitar
                }}
                placeholder="Pesquisar no blog..." // Placeholder simplificado
                aria-label="Campo de busca no blog" // Adicionado aria-label
                className="flex-1 py-1.5 pl-2 pr-2 text-sm bg-white/90 text-[#583B1F] placeholder:text-[#C19A6B] font-medium border border-[#C19A6B] rounded focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:border-[#735B43]"
                // Removido onBlur={() => setShowInput(false)}
              />
              <ButtonBlog type="submit" className="text-xs px-3 sm:px-4 py-1.5 rounded bg-[#F8F5F0] text-[#583B1F] border border-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-colors">
                {isLoadingSuggestions ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'} {/* Mostra loader */}
              </ButtonBlog>

              {/* Dropdown de Sugestões */} 
              {(suggestions.length > 0 || isLoadingSuggestions) && (
                <div className="absolute left-0 right-0 top-full mt-2 w-full bg-[#F8F5F0] border border-[#C19A6B] rounded-md shadow-lg z-40 max-h-60 overflow-y-auto">
                  {isLoadingSuggestions && suggestions.length === 0 && (
                    <div className="p-3 text-center text-sm text-[#735B43]">Buscando...</div>
                  )}
                  {!isLoadingSuggestions && suggestions.length === 0 && query.trim().length >= 2 && (
                     <div className="p-3 text-center text-sm text-[#735B43]">Nenhuma sugestão encontrada.</div>
                  )}
                  <ul className="divide-y divide-[#C19A6B]/30">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-2 text-sm text-[#583B1F] hover:bg-[#C19A6B]/20 transition-colors duration-150 flex justify-between items-center"
                        >
                          <span>{suggestion.value}</span>
                          {/* Mostra o tipo da sugestão */}
                          <span className="text-xs text-[#735B43] ml-2 px-1.5 py-0.5 bg-[#C19A6B]/20 rounded">
                            {suggestionTypeLabels[suggestion.type]}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
