import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Database } from '@/types/supabase';

type Categoria = Database['public']['Tables']['categorias']['Row'];

interface BlogCategoryCardProps {
  category: Categoria;
  variant?: 'simple' | 'visual';
  showImage?: boolean;
  className?: string;
}

export default function BlogCategoryCard({ 
  category, 
  variant = 'visual', 
  showImage = true,
  className = '' 
}: BlogCategoryCardProps) {  // Construir o caminho da imagem dinamicamente
  const getImageUrl = () => {
    if (category.imagem_url) {
      // Se tem imagem no banco, usar diretamente o nome do arquivo
      return `/blogflorescerhumano/category-images/${category.imagem_url}`;
    }
    // Fallback padrão se não tiver imagem definida
    return `/blogflorescerhumano/category-images/categoria-default.webp`;
  };

  const imageUrl = getImageUrl();

  if (variant === 'simple') {
    return (
      <Link 
        href={`/blogflorescerhumano/${category.slug}`}
        className={`block p-6 border rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 ${className}`}
      >
        <h2 className="text-2xl font-semibold mb-2 text-teal-700 font-['Old Roman']">
          {category.nome}
        </h2>
        {category.descricao && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {category.descricao}
          </p>
        )}
      </Link>
    );
  }
  return (
    <Link 
      href={`/blogflorescerhumano/${category.slug}`}
      className={`group block transform transition-all duration-500 ease-out hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#C19A6B]/30 rounded-xl ${className}`}
      aria-label={`Explorar categoria ${category.nome}${category.descricao ? `: ${category.descricao}` : ''}`}
    >
      <div className="relative h-72 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-[#583B1F]/25 transition-all duration-500">
        {/* Imagem de fundo */}
        {showImage && (
          <Image
            src={imageUrl}
            alt={`Imagem da categoria ${category.nome}`}
            fill
            className="object-cover brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-110 transition-all duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
        
        {/* Fallback sem imagem */}
        {!showImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#583B1F] via-[#735B43] to-[#C19A6B] group-hover:from-[#4A311A] group-hover:via-[#654F3A] group-hover:to-[#B8895E] transition-all duration-500" />
        )}
        
        {/* Overlay com gradiente aprimorado */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
        
        {/* Efeito de brilho sutil no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#C19A6B]/0 via-[#C19A6B]/5 to-[#C19A6B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Indicador visual discreto */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-[#C19A6B] rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
        
        {/* Conteúdo do card melhorado */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform group-hover:translate-y-[-4px] transition-transform duration-500">
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 font-['Old_Roman'] tracking-wide leading-tight drop-shadow-lg">
              {category.nome}
            </h3>
            {category.descricao && (
              <p className="text-sm md:text-base text-white/95 line-clamp-2 leading-relaxed drop-shadow-md font-light">
                {category.descricao}
              </p>
            )}
            
            {/* Call-to-action sutil */}
            <div className="flex items-center text-white/80 text-sm mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
              <span className="mr-2 font-medium">Explorar</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Borda sutil no hover */}
        <div className="absolute inset-0 border-2 border-[#C19A6B]/0 group-hover:border-[#C19A6B]/30 rounded-xl transition-all duration-500"></div>
      </div>
    </Link>
  );
}
