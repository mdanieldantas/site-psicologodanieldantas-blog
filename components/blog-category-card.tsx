import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MotionDiv, MotionH3, MotionP, MotionSVG, cardVariants } from '@/components/ui/motion-components';
import type { Database } from '@/types/supabase';

type Categoria = Database['public']['Tables']['categorias']['Row'];

interface BlogCategoryCardProps {
  category: Categoria;
  variant?: 'simple' | 'visual';
  showImage?: boolean;
  className?: string;
  featured?: boolean; // Nova prop para categoria destaque
}

export default function BlogCategoryCard({ 
  category, 
  variant = 'visual', 
  showImage = true,
  className = '',
  featured = false 
}: BlogCategoryCardProps) {// Construir o caminho da imagem dinamicamente
  const getImageUrl = () => {
    if (category.imagem_url) {
      // Se tem imagem no banco, usar diretamente o nome do arquivo
      return `/blogflorescerhumano/category-images/${category.imagem_url}`;
    }
    // Fallback padrão se não tiver imagem definida
    return `/blogflorescerhumano/category-images/categoria-default.webp`;
  };

  const imageUrl = getImageUrl();
  if (variant === 'simple') {    return (
      <MotionDiv
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link 
          href={`/blogflorescerhumano/${category.slug}`}
          className={`block p-6 border border-[#C19A6B]/20 rounded-lg shadow-md hover:shadow-xl hover:bg-[#F8F5F0] transition-all duration-300 hover:border-[#C19A6B]/40 ${className}`}
        >
          <h2 className="text-2xl font-semibold mb-2 text-[#583B1F] font-['Old_Roman'] hover:text-[#C19A6B] transition-colors duration-300">
            {category.nome}
          </h2>
          {category.descricao && (            <p className="text-[#735B43] text-sm line-clamp-3 leading-relaxed">
              {category.descricao}
            </p>
          )}
        </Link>
      </MotionDiv>
    );
  }

  // Variantes de animação para o card visual
  const cardVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: { 
      scale: featured ? 1.02 : 1.05,
      rotateY: featured ? 2 : 5,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.3
      }
    },
    tap: { scale: 0.98 }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.15,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const contentVariants = {
    initial: { y: 0 },
    hover: { 
      y: -6,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }
    }
  };

  const ctaVariants = {
    initial: { opacity: 0, y: 10, x: 0 },
    hover: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: { 
        delay: 0.1, 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const arrowVariants = {
    initial: { x: 0 },
    hover: { 
      x: 4,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }
    }
  };

  return (
    <MotionDiv
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`group block transform focus:outline-none focus:ring-4 focus:ring-[#C19A6B]/30 rounded-xl ${className}`}
    >
      <Link 
        href={`/blogflorescerhumano/${category.slug}`}
        className="block w-full h-full"
        aria-label={`Explorar categoria ${category.nome}${category.descricao ? `: ${category.descricao}` : ''}`}
      >
        <div className={`relative ${featured ? 'h-80 lg:h-96' : 'h-72'} rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-[#583B1F]/25 transition-all duration-500`}>
          {/* Imagem de fundo com animação aprimorada */}
          {showImage && (
            <MotionDiv
              variants={imageVariants}
              className="absolute inset-0"
            >
              <Image
                src={imageUrl}
                alt={`Imagem da categoria ${category.nome}`}
                fill
                className="object-cover brightness-[0.7] group-hover:brightness-[0.85] transition-all duration-700 ease-out"
                sizes={featured ? "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"}
                priority={featured}
              />
            </MotionDiv>
          )}
          
          {/* Fallback sem imagem */}
          {!showImage && (
            <MotionDiv 
              className="absolute inset-0 bg-gradient-to-br from-[#583B1F] via-[#735B43] to-[#C19A6B] group-hover:from-[#4A311A] group-hover:via-[#654F3A] group-hover:to-[#B8895E] transition-all duration-500"
              whileHover={{ scale: 1.05 }}
            />
          )}
          
          {/* Overlay com gradiente aprimorado */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500" />
          
          {/* Efeito de brilho sutil no hover - melhorado */}
          <MotionDiv 
            className="absolute inset-0 bg-gradient-to-t from-[#C19A6B]/0 via-[#C19A6B]/5 to-[#C19A6B]/0"
            variants={overlayVariants}
          />
          
          {/* Efeito shimmer no hover */}
          <MotionDiv
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
            whileHover={{
              x: "200%",
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
          />
          
          {/* Indicador visual aprimorado */}
          <MotionDiv 
            className={`absolute top-4 right-4 ${featured ? 'w-3 h-3' : 'w-2 h-2'} bg-[#C19A6B] rounded-full opacity-60`}
            whileHover={{ 
              scale: 1.3,
              opacity: 1,
              boxShadow: "0 0 20px rgba(193, 154, 107, 0.6)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          
          {/* Badge para categoria destaque */}
          {featured && (
            <MotionDiv
              className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-[#C19A6B] to-[#D4A574] text-white text-xs font-medium rounded-full shadow-md"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
            >
              Destaque
            </MotionDiv>
          )}
          
          {/* Conteúdo do card com animações aprimoradas */}
          <MotionDiv 
            className="absolute bottom-0 left-0 right-0 p-6"
            variants={contentVariants}
          >
            <div className="space-y-3">
              <MotionH3 
                className={`${featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'} font-semibold text-white mb-3 font-['Old_Roman'] tracking-wide leading-tight drop-shadow-lg`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {category.nome}
              </MotionH3>
              
              {category.descricao && (
                <MotionP 
                  className={`${featured ? 'text-base md:text-lg' : 'text-sm md:text-base'} text-white/95 line-clamp-2 leading-relaxed drop-shadow-md font-light`}
                  initial={{ opacity: 0.95 }}
                  whileHover={{ opacity: 1 }}
                >
                  {category.descricao}
                </MotionP>
              )}
              
              {/* Call-to-action aprimorado */}
              <MotionDiv 
                className="flex items-center text-white/80 text-sm mt-4"
                variants={ctaVariants}
              >
                <span className="mr-2 font-medium">
                  {featured ? 'Descobrir agora' : 'Explorar'}
                </span>
                <MotionSVG 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  variants={arrowVariants}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </MotionSVG>
              </MotionDiv>
            </div>
          </MotionDiv>
          
          {/* Borda sutil no hover - melhorada */}
          <MotionDiv 
            className="absolute inset-0 border-2 border-[#C19A6B]/0 rounded-xl"
            whileHover={{ 
              borderColor: "rgba(193, 154, 107, 0.4)",
              boxShadow: "inset 0 0 20px rgba(193, 154, 107, 0.1)"
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Link>
    </MotionDiv>
  );
}
