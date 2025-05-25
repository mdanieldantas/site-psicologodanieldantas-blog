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
  tags?: Array<{ id: number; nome: string; slug: string; }>;
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
    // Função para processar URL da imagem com fallback e validação
  const processarImagemUrl = (imagemUrl?: string) => {
    if (!imagemUrl) return fallbackImage;
    
    // Se já tem o caminho completo, usar como está
    if (imagemUrl.startsWith('/blogflorescerhumano/') || imagemUrl.startsWith('http')) {
      return imagemUrl;
    }
    
    // Mapeamento de correções para imagens conhecidas no banco
    const correcaoImagens: Record<string, string> = {
      'importancia-empatia-image-blog.png': 'images-general-blog/importância-da-empatia-image-blog.png',
      'mindfulness-exercicios-blog.webp': 'images-general-blog/mindfulness-autorregulacao.png',
      'autocompaixao-blog.jpg': 'placeholder.jpg', // Usar placeholder até a imagem ser criada
    };
    
    // Verificar se precisa de correção
    if (correcaoImagens[imagemUrl]) {
      const imagemCorrigida = correcaoImagens[imagemUrl];
      // Se for placeholder, retornar do diretório public principal
      if (imagemCorrigida === 'placeholder.jpg') {
        return `/placeholder.jpg`;
      }
      return `/blogflorescerhumano/${imagemCorrigida}`;
    }
    
    // Se tem apenas o nome do arquivo, construir o caminho baseado na categoria
    if (imagemUrl.includes('/')) {
      // Já tem o caminho da categoria incluído
      return `/blogflorescerhumano/${imagemUrl}`;
    } else {
      // Apenas nome do arquivo, usar a categoria para construir o caminho
      return `/blogflorescerhumano/${categoriaSlug}/${imagemUrl}`;
    }
  };
  
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
    >      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={processarImagemUrl(imagemUrl)}
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

      <div className="p-5 flex flex-col flex-grow relative">        {/* Informações do autor e data */}
        <div className="flex items-center gap-3 mb-3">
          {autor?.fotoUrl && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C19A6B]/20">
              <Image
                src={autor.fotoUrl.startsWith('/') ? autor.fotoUrl : `/blogflorescerhumano/autores/${autor.fotoUrl}`}
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
        </h3>        {resumo && (
          <p className="text-[#583B1F]/80 text-sm mb-4 line-clamp-3">
            {resumo}
          </p>
        )}        {/* Tags Section - Proteção Completa Contra Falhas */}
        {(() => {
          // Validação robusta das tags
          if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return null;
          }
          
          // Filtrar e limpar tags válidas (agora são objetos)
          const tagsValidas = tags
            .filter(tag => tag && typeof tag === 'object' && tag.nome && tag.nome.trim().length > 0)
            .map(tag => ({ ...tag, nome: tag.nome.trim() }));
            
          if (tagsValidas.length === 0) {
            return null;
          }
          
          return (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1.5">
                {tagsValidas.slice(0, 3).map((tag, index) => (
                  <span 
                    key={`tag-${tag.id || index}-${tag.nome.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F8F5F0] text-[#583B1F] border border-[#C19A6B]/25 hover:bg-[#F8F5F0]/80 transition-colors"
                  >
                    <svg
                      className="w-3 h-3 mr-1 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                    {tag.nome}
                  </span>
                ))}
                {tagsValidas.length > 3 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#C19A6B]/10 text-[#583B1F]/70 border border-[#C19A6B]/20">
                    +{tagsValidas.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          );
        })()}

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
