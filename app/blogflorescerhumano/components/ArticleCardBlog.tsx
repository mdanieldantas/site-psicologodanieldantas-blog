// app/blogflorescerhumano/components/ArticleCardBlog.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from "lucide-react";

interface ArticleCardBlogProps {
  titulo: string;
  resumo?: string;
  slug: string;
  categoriaSlug: string;
  imagemUrl?: string;
}

const ArticleCardBlog: React.FC<ArticleCardBlogProps> = ({
  titulo,
  resumo,
  slug,
  categoriaSlug,
  imagemUrl,
}) => {
  const linkArtigo = `/blogflorescerhumano/${categoriaSlug}/${slug}`;
  const fallbackImage = '/placeholder.jpg'; // Imagem padrão caso não haja imagemUrl
  return (
    <Link 
      href={linkArtigo}
      className="bg-[#F8F5F0]/70 rounded-lg overflow-hidden h-full flex flex-col border-[0.5px] border-[#C19A6B]/20 transition-all duration-300 hover:shadow-md hover:bg-[#F8F5F0] group"
    >
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={imagemUrl ? `/blogflorescerhumano/${imagemUrl}` : fallbackImage}
          alt={`Imagem para ${titulo}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow relative">
        <h3 className="text-base font-medium mb-2 text-[#583B1F] line-clamp-2 group-hover:text-[#C19A6B] transition-colors duration-300">{titulo}</h3>
        {resumo && (
          <p className="text-sm text-[#735B43]/80 mb-3 line-clamp-2 flex-grow">{resumo}</p>
        )}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-[#C19A6B]/10">
          <span className="inline-flex items-center text-xs font-medium text-[#C19A6B] group-hover:text-[#583B1F] transition-colors duration-300">
            Continuar leitura
          </span>
          <span className="w-6 h-6 rounded-full bg-[#F8F5F0] flex items-center justify-center text-[#C19A6B] group-hover:bg-[#C19A6B]/10 transition-colors duration-300">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCardBlog;
