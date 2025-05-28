'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download, FileText, Package, Headphones, Star } from "lucide-react";
import { MotionDiv } from '@/components/ui/motion-components';

export interface MaterialCardProps {
  id: number;
  title: string;
  description?: string;
  type: 'E-book' | 'Kit Digital' | 'Áudio' | 'Guia' | 'Template' | 'Checklist';
  imageUrl?: string;
  downloadUrl?: string;
  featured?: boolean;
  tags?: string[];
  fileSize?: string;
  format?: string;
  downloadCount?: number;
  rating?: number;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  id,
  title,
  description,
  type,
  imageUrl,
  downloadUrl = '/blogflorescerhumano/materiais',
  featured = false,
  tags = [],
  fileSize,
  format,
  downloadCount,
  rating
}) => {
  // Função para processar URL da imagem
  const processarImagemUrl = (imagemUrl?: string) => {
    if (!imagemUrl) return '/blogflorescerhumano/test-image.webp';
    
    if (imagemUrl.startsWith('/') || imagemUrl.startsWith('http')) {
      return imagemUrl;
    }
    
    return `/blogflorescerhumano/materiais/${imagemUrl}`;
  };

  // Ícone com base no tipo de material
  const renderIconeTipoMaterial = () => {
    const baseClasses = "absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg border border-white/30 backdrop-blur-sm";
    
    switch (type) {
      case 'E-book':
        return (
          <span className={`${baseClasses} bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] text-white`}>
            <FileText className="w-3 h-3 inline mr-1" />
            E-book
          </span>
        );
      case 'Kit Digital':
        return (
          <span className={`${baseClasses} bg-gradient-to-r from-[#6B7B3F] to-[#A57C3A] text-white`}>
            <Package className="w-3 h-3 inline mr-1" />
            Kit Digital
          </span>
        );
      case 'Áudio':
        return (
          <span className={`${baseClasses} bg-gradient-to-r from-[#583B1F] to-[#5B3E22] text-white`}>
            <Headphones className="w-3 h-3 inline mr-1" />
            Áudio
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] text-white`}>
            <FileText className="w-3 h-3 inline mr-1" />
            {type}
          </span>
        );
    }
  };

  // Renderizar badge de destaque
  const renderBadgeDestaque = () => {
    if (!featured) return null;
    
    return (
      <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] text-white text-xs font-medium rounded-full shadow-md border border-white/20">
        <Star className="w-3 h-3 inline mr-1" />
        Destaque
      </div>
    );
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#A57C3A]/20 hover:border-[#A57C3A]/40 ${
        featured ? 'ring-2 ring-[#A57C3A]/30' : ''
      }`}
    >
      {/* Container da imagem */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={processarImagemUrl(imageUrl)}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        {renderBadgeDestaque()}
        {renderIconeTipoMaterial()}
        
        {/* Elemento decorativo */}
        {featured && (
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#A57C3A]/30 rounded-full z-10"></div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-6 flex flex-col h-full">
        {/* Título */}
        <h3 className="text-xl font-semibold text-[#583B1F] mb-3 line-clamp-2 group-hover:text-[#A57C3A] transition-colors duration-300 font-['Old_Roman']">
          {title}
        </h3>

        {/* Descrição */}
        {description && (
          <p className="text-[#7D6E63] text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#E8E6E2] text-[#583B1F] text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-[#E8E6E2] text-[#7D6E63] text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Informações adicionais */}
        <div className="flex items-center justify-between text-xs text-[#7D6E63] mb-4">
          <div className="flex items-center gap-3">
            {fileSize && <span>📁 {fileSize}</span>}
            {format && <span>📄 {format}</span>}
          </div>
          <div className="flex items-center gap-3">
            {downloadCount && <span>⬇️ {downloadCount}</span>}
            {rating && (
              <div className="flex items-center">
                <Star className="w-3 h-3 text-[#A57C3A] fill-current" />
                <span className="ml-1">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botão de download */}
        <Link
          href={downloadUrl}
          className="mt-auto group/btn relative overflow-hidden rounded-lg bg-[#583B1F] text-white py-3 px-4 text-center text-sm font-medium transition-all duration-300 hover:bg-[#5B3E22] hover:shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            <span>Download Gratuito</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </div>
          
          {/* Efeito de hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10" />
        </Link>

        {/* Overlay de foco/hover */}
        <div className="absolute inset-0 border-2 border-[#A57C3A]/0 rounded-xl transition-all duration-300 group-hover:border-[#A57C3A]/30 pointer-events-none" />
      </div>
    </MotionDiv>
  );
};

export default MaterialCard;
