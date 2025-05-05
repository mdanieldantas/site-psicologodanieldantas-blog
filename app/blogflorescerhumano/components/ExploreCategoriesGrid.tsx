import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Database } from '@/types/supabase';

type Categoria = Database['public']['Tables']['categorias']['Row'];

interface ExploreCategoriesGridProps {
  categories: Categoria[];
}

export default function ExploreCategoriesGrid({ categories }: ExploreCategoriesGridProps) {
  const fallbackImage = '/blogflorescerhumano/category-images/test-image-category.png';

  return (
    <section className="py-12 bg-[#F4EED9]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-4 text-[#583B1F] font-['Old Roman']">
          Explore por Categoria
        </h2>
        <p className="text-lg text-[#735B43] text-center mb-12 max-w-2xl mx-auto font-light">
          Navegue pelos temas que mais ressoam com sua jornada de autoconhecimento e crescimento pessoal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/blogflorescerhumano/${category.slug}`} 
              className="group transform transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                {/* Imagem de fundo com fallback */}
                <Image
                  src={fallbackImage}
                  alt={category.nome}
                  fill
                  className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                />
                
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
          ))}
        </div>
      </div>
    </section>
  );
}
