// Componente para controles de paginação
// Localização: app/blogflorescerhumano/components/PaginationControls.tsx
'use client'; // Necessário para usar hooks como useSearchParams, embora aqui usemos props

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // Ex: /blogflorescerhumano/humanismo
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, basePath }) => {
  // Não renderiza nada se houver apenas uma página
  if (totalPages <= 1) {
    return null;
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mt-12 flex justify-center items-center space-x-4">
      {/* Botão Anterior */}
      {hasPreviousPage ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          passHref
          legacyBehavior
        >
          <a className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Anterior
          </a>
        </Link>
      ) : (
        <span className="flex items-center px-4 py-2 border border-gray-200 rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
          <ChevronLeft className="h-5 w-5 mr-2" />
          Anterior
        </span>
      )}

      {/* Indicador de Página Atual */}
      <span className="text-gray-700">
        Página {currentPage} de {totalPages}
      </span>

      {/* Botão Próximo */}
      {hasNextPage ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          passHref
          legacyBehavior
        >
          <a className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Próximo
            <ChevronRight className="h-5 w-5 ml-2" />
          </a>
        </Link>
      ) : (
        <span className="flex items-center px-4 py-2 border border-gray-200 rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
          Próximo
          <ChevronRight className="h-5 w-5 ml-2" />
        </span>
      )}
    </div>
  );
};

export default PaginationControls;
