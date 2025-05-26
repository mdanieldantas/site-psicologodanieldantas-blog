'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationControlsProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  basePath: string; // Ex: /blogflorescerhumano/buscar
}

export default function PaginationControls({
  totalCount,
  pageSize,
  currentPage,
  basePath,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null; // Não mostra paginação se só tem uma página ou nenhuma
  }

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams); // Clona os params existentes (importante para manter 'q')
    params.set('page', pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  };

  // Determina quais páginas mostrar nos controles
  const displayPages = () => {
    const pages = [];
    const totalPagesToShow = 5; // Quantas páginas mostrar no max
    
    if (totalPages <= totalPagesToShow) {
      // Se o total de páginas for menor que o limite, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostra a primeira página
      pages.push(1);
      
      // Decide quais páginas intermediárias mostrar
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajusta para mostrar 3 páginas intermediárias quando possível
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Adiciona ellipsis se necessário
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
      
      // Adiciona páginas intermediárias
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Adiciona ellipsis se necessário
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      // Sempre mostra a última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const pages = displayPages();

  return (
    <div className="flex flex-col items-center space-y-4 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
      <div className="flex items-center space-x-2 text-[#735B43]">
        {/* Botão Anterior */}
        {hasPreviousPage ? (
          <Link
            href={createPageURL(currentPage - 1)}
            className="p-2 rounded-md border border-[#C19A6B]/30 hover:bg-[#F8F5F0] transition-all duration-300 flex items-center"
            aria-label="Página anterior"
          >
            <ChevronLeftIcon className="h-5 w-5 text-[#583B1F]" />
          </Link>
        ) : (
          <span className="p-2 rounded-md border border-[#C19A6B]/20 text-[#C19A6B]/40 cursor-not-allowed flex items-center">
            <ChevronLeftIcon className="h-5 w-5" />
          </span>
        )}

        {/* Números das Páginas */}
        <div className="flex space-x-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span 
                  key={`ellipsis-${page}`} 
                  className="flex items-center justify-center px-4 py-2 text-[#735B43]"
                >
                  ...
                </span>
              );
            }
            
            return (
              <Link
                key={`page-${page}`}
                href={createPageURL(page as number)}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-[#583B1F] text-white shadow-md'
                    : 'text-[#583B1F] hover:bg-[#F8F5F0] border border-[#C19A6B]/30'
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* Botão Próxima */}
        {hasNextPage ? (
          <Link
            href={createPageURL(currentPage + 1)}
            className="p-2 rounded-md border border-[#C19A6B]/30 hover:bg-[#F8F5F0] transition-all duration-300 flex items-center"
            aria-label="Próxima página"
          >
            <ChevronRightIcon className="h-5 w-5 text-[#583B1F]" />
          </Link>
        ) : (
          <span className="p-2 rounded-md border border-[#C19A6B]/20 text-[#C19A6B]/40 cursor-not-allowed flex items-center">
            <ChevronRightIcon className="h-5 w-5" />
          </span>
        )}
      </div>

      <p className="text-sm text-[#735B43] text-center">
        Mostrando <span className="font-semibold text-[#583B1F]">{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</span> a <span className="font-semibold text-[#583B1F]">{Math.min(currentPage * pageSize, totalCount)}</span> de <span className="font-semibold text-[#583B1F]">{totalCount}</span> artigos
      </p>
    </div>
  );
}
