import React from 'react';
import BlogCategoryCard from '@/components/blog-category-card';
import type { Database } from '@/types/supabase';

type Categoria = Database['public']['Tables']['categorias']['Row'];

interface ExploreCategoriesGridProps {
  categories: Categoria[];
}

export default function ExploreCategoriesGrid({ categories }: ExploreCategoriesGridProps) {
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
            <BlogCategoryCard 
              key={category.id}
              category={category}
              variant="visual"
              showImage={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
