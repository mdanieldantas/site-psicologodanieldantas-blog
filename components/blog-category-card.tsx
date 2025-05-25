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
      className={`group transform transition-transform duration-300 hover:scale-105 ${className}`}
    >
      <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">        {/* Imagem de fundo */}
        {showImage && (
          <Image
            src={imageUrl}
            alt={category.nome}
            fill
            className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
          />
        )}
        
        {/* Fallback sem imagem */}
        {!showImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#583B1F] to-[#735B43]" />
        )}
        
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Conteúdo do card */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-semibold text-white mb-2 font-['Old Roman']">
            {category.nome}
          </h3>
          {category.descricao && (
            <p className="text-sm text-white/90 line-clamp-2">
              {category.descricao}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
