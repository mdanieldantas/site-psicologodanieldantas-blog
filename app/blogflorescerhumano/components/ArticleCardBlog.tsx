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
    <Link href={linkArtigo} legacyBehavior>
      <a className="bg-[#F8F5F0] rounded-lg shadow-md overflow-hidden h-full flex flex-col border-l-4 border-[#C19A6B] transition-shadow duration-300 hover:shadow-lg">
        <div className="relative w-full h-48">
          <Image
            src={imagemUrl || fallbackImage}
            alt={`Imagem para ${titulo}`}
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-light mb-3 text-[#583B1F]">{titulo}</h3>
          {resumo && (
            <p className="text-[#735B43] font-light mb-4 line-clamp-3 flex-grow">{resumo}</p>
          )}
          <span className="inline-flex items-center text-sm text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300 self-start mt-auto">
            Ler mais <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </div>
      </a>
    </Link>
  );
};

export default ArticleCardBlog;
