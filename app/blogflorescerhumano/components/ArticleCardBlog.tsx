// app/blogflorescerhumano/components/ArticleCardBlog.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
      <a className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full h-48">
          <Image
            src={imagemUrl || fallbackImage}
            alt={`Imagem para ${titulo}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{titulo}</h3>
          {resumo && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{resumo}</p>
          )}
          <span className="text-teal-600 hover:underline text-sm font-medium">
            Leia mais →
          </span>
        </div>
      </a>
    </Link>
  );
};

export default ArticleCardBlog;
