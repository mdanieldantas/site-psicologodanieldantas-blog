// app/blogflorescerhumano/components/ArticleCardSkeleton.tsx
'use client';

import React from 'react';

const ArticleCardSkeleton: React.FC = () => {
  return (
    <article className="group animate-pulse">
      <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-lg border border-[#E8E6E2]">
        
        {/* Imagem Skeleton */}
        <div className="relative w-full h-56 bg-[#E8E6E2] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-[#E8E6E2] via-[#F8F5F0] to-[#E8E6E2] animate-shimmer"></div>
          
          {/* Badge Skeleton */}
          <div className="absolute top-4 right-4 w-20 h-6 bg-[#E8E6E2] rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-6 bg-[#E8E6E2] rounded-full"></div>
        </div>

        {/* Conteúdo Skeleton */}
        <div className="p-6 flex flex-col flex-grow">
          
          {/* Header com autor */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#E8E6E2]"></div>
            <div className="flex flex-col gap-2">
              <div className="w-32 h-3 bg-[#E8E6E2] rounded"></div>
              <div className="w-24 h-2 bg-[#E8E6E2] rounded"></div>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2 mb-3">
            <div className="w-full h-4 bg-[#E8E6E2] rounded"></div>
            <div className="w-3/4 h-4 bg-[#E8E6E2] rounded"></div>
          </div>

          {/* Resumo */}
          <div className="space-y-2 mb-4 flex-grow">
            <div className="w-full h-3 bg-[#E8E6E2] rounded"></div>
            <div className="w-full h-3 bg-[#E8E6E2] rounded"></div>
            <div className="w-2/3 h-3 bg-[#E8E6E2] rounded"></div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <div className="w-16 h-6 bg-[#E8E6E2] rounded-full"></div>
            <div className="w-20 h-6 bg-[#E8E6E2] rounded-full"></div>
            <div className="w-14 h-6 bg-[#E8E6E2] rounded-full"></div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-[#E8E6E2]/50">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-6 bg-[#E8E6E2] rounded-lg"></div>
                <div className="w-12 h-6 bg-[#E8E6E2] rounded-lg"></div>
              </div>
              <div className="w-20 h-4 bg-[#E8E6E2] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCardSkeleton;
