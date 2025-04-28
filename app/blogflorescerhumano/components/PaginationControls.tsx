'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center space-x-4 mt-12">
      {hasPreviousPage ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Anterior
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600">
          Anterior
        </span>
      )}

      <span className="text-sm text-gray-700 dark:text-gray-300">
        Página {currentPage} de {totalPages}
      </span>

      {hasNextPage ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Próxima
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed dark:border-gray-700 dark:text-gray-600">
          Próxima
        </span>
      )}
    </div>
  );
}
