// app/blogflorescerhumano/components/ArticleCardBlog.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, MessageSquare } from "lucide-react";

interface ArticleCardBlogProps {
  titulo: string;
  resumo?: string;
  slug: string;
  categoriaSlug: string;
  imagemUrl?: string;
  autor?: {
    nome: string;
    fotoUrl?: string;
  };
  dataPublicacao?: string;
  dataAtualizacao?: string;
  categoria?: string;
  tags?: string[];
  tempoLeitura?: number; // em minutos
  numeroComentarios?: number;
  tipoConteudo?: 'artigo' | 'video' | 'podcast' | 'infografico';
}

const ArticleCardBlog: React.FC<ArticleCardBlogProps> = ({
  titulo,
  resumo,
  slug,
  categoriaSlug,
  imagemUrl,
  autor,
  dataPublicacao,
  dataAtualizacao,
  categoria,
  tags,
  tempoLeitura,
  numeroComentarios,
  tipoConteudo = 'artigo',
}) => {
  const linkArtigo = `/blogflorescerhumano/${categoriaSlug}/${slug}`;
  const fallbackImage = '/placeholder.jpg'; // Imagem padrão caso não haja imagemUrl
  
  // Formatar data no padrão brasileiro
  const formatarData = (dataString?: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric' 
    });
  };
  
  // Ícone com base no tipo de conteúdo
  const renderIconeTipoConteudo = () => {
    switch (tipoConteudo) {
      case 'video':
        return <span className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs">Vídeo</span>;
      case 'podcast':
        return <span className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1 text-xs">Podcast</span>;
      case 'infografico':
        return <span className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 text-xs">Infográfico</span>;
      default:
        return <span className="absolute top-2 right-2 bg-[#C19A6B] text-white rounded-full p-1 text-xs">Artigo</span>;
    }
  };

  return (
    <Link 
      href={linkArtigo}
      className="bg-[#F8F5F0]/70 rounded-lg overflow-hidden h-full flex flex-col border-[0.5px] border-[#C19A6B]/20 transition-all duration-300 hover:shadow-md hover:bg-[#F8F5F0] group"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={imagemUrl ? `/blogflorescerhumano/${imagemUrl}` : fallbackImage}
          alt={`Imagem para ${titulo}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
        {renderIconeTipoConteudo()}
        
        {/* Categoria label */}
        {categoria && (
          <span className="absolute left-3 bottom-3 bg-[#C19A6B]/90 text-white text-xs px-2 py-1 rounded">
            {categoria}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow relative">
        {/* Informações do autor e data */}
        <div className="flex items-center gap-3 mb-3">
          {autor?.fotoUrl && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C19A6B]/20">
              <Image
                src={`/blogflorescerhumano/autores/${autor.fotoUrl}`}
                alt={`Foto de ${autor.nome}`}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col">
            {autor?.nome && (
              <span className="text-sm text-[#583B1F]">{autor.nome}</span>
            )}
            {dataAtualizacao && (
              <span className="text-xs text-gray-500">
                Atualizado em {formatarData(dataAtualizacao)}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium text-[#583B1F] mb-2 line-clamp-2 group-hover:text-[#C19A6B] transition-colors">
          {titulo}
        </h3>

        {resumo && (
          <p className="text-[#583B1F]/80 text-sm mb-4 line-clamp-3">
            {resumo}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            {tempoLeitura && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {tempoLeitura} min
              </span>
            )}
            {numeroComentarios !== undefined && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {numeroComentarios}
              </span>
            )}
          </div>
          
          <ArrowRight className="w-4 h-4 text-[#C19A6B] transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default ArticleCardBlog;
