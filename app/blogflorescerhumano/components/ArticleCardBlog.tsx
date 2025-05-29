// app/blogflorescerhumano/components/ArticleCardBlog.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, MessageSquare, Calendar, Tag } from "lucide-react";
import { MotionDiv } from '@/components/ui/motion-components';

export interface ArticleCardBlogProps {
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
  };    // Ícone com base no tipo de conteúdo - Design mais moderno
  const renderIconeTipoConteudo = () => {
    const baseClasses = "absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border-2 border-white/20";
    
    switch (tipoConteudo) {
      case 'video':
        return <span className={`${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white`}>📹 Vídeo</span>;
      case 'podcast':
        return <span className={`${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 text-white`}>🎧 Podcast</span>;
      case 'infografico':
        return <span className={`${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white`}>📊 Infográfico</span>;
      default:
        return null; // Não renderizar tag para artigos
    }
  };

  return (
    <article className="group">
      <Link 
        href={linkArtigo}
        className="block h-full transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
      >
        <div className="bg-white rounded-2xl overflow-hidden h-full flex flex-col shadow-lg group-hover:shadow-2xl border border-[#E8E6E2] transition-all duration-500 group-hover:border-[#A57C3A]/30">
          
          {/* Imagem do Artigo */}
          <div className="relative w-full h-56 overflow-hidden">
            <Image
              src={processarImagemUrl(imagemUrl)}
              alt={`Imagem para ${titulo}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority
            />
            
            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>
            
            {/* Tipo de conteúdo */}
            {renderIconeTipoConteudo()}
            
            {/* Categoria Badge - Posição inferior esquerda */}
            {categoria && (
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center px-3 py-1.5 bg-[#583B1F]/90 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20 shadow-lg">
                  <Tag className="w-3 h-3 mr-1.5" />
                  {categoria}
                </span>
              </div>
            )}
          </div>

          {/* Conteúdo do Card */}
          <div className="p-6 flex flex-col flex-grow">
            
            {/* Header com autor e data */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {autor?.fotoUrl && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#A57C3A]/30 shadow-md">
                    <Image
                      src={autor.fotoUrl.startsWith('/') ? autor.fotoUrl : `/blogflorescerhumano/autores/${autor.fotoUrl}`}
                      alt={`Foto de ${autor.nome}`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  {autor?.nome && (
                    <span className="text-sm font-medium text-[#583B1F]">{autor.nome}</span>
                  )}
                  {dataAtualizacao && (
                    <span className="text-xs text-[#7D6E63] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Atualizado em {formatarData(dataAtualizacao)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Título do Artigo */}
            <h3 className="text-xl font-semibold text-[#583B1F] mb-3 line-clamp-2 leading-tight group-hover:text-[#A57C3A] transition-colors duration-300">
              {titulo}
            </h3>

            {/* Resumo */}
            {resumo && (
              <p className="text-[#7D6E63] text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                {resumo}
              </p>
            )}

            {/* Tags Section */}
            {(() => {
              if (!tags || !Array.isArray(tags) || tags.length === 0) {
                return null;
              }
              
              const tagsValidas = tags
                .filter(tag => tag && typeof tag === 'object' && tag.nome && tag.nome.trim().length > 0)
                .map(tag => ({ ...tag, nome: tag.nome.trim() }));
                
              if (tagsValidas.length === 0) {
                return null;
              }
              
              return (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {tagsValidas.slice(0, 3).map((tag, index) => (
                      <span 
                        key={`tag-${tag.id || index}-${tag.nome.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E8E6E2] text-[#583B1F] border border-[#A57C3A]/20 hover:bg-[#A57C3A]/10 hover:border-[#A57C3A]/40 transition-all duration-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7B3F] mr-1.5"></span>
                        {tag.nome}
                      </span>
                    ))}
                    {tagsValidas.length > 3 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#A57C3A]/10 text-[#583B1F] border border-[#A57C3A]/30">
                        +{tagsValidas.length - 3} mais
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Footer com métricas e CTA */}
            <div className="mt-auto pt-4 border-t border-[#E8E6E2]/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[#7D6E63]">
                  {tempoLeitura && (
                    <span className="flex items-center gap-1.5 bg-[#F8F5F0] px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {tempoLeitura} min
                    </span>
                  )}
                  {numeroComentarios !== undefined && (
                    <span className="flex items-center gap-1.5 bg-[#F8F5F0] px-2 py-1 rounded-lg">
                      <MessageSquare className="w-3 h-3" />
                      {numeroComentarios}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-[#A57C3A] group-hover:text-[#583B1F] transition-colors duration-300">
                  <span className="text-sm font-medium mr-2">Ler mais</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCardBlog;
