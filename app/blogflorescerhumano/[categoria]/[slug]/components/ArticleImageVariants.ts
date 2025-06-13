/**
 * @fileoverview Variantes de estilo para imagens de artigo usando Class Variance Authority
 * @description Sistema type-safe para gerenciar diferentes estilos de moldura e hover
 * @author Blog Florescer Humano
 * @since 2025-06-13
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Variantes de estilo para imagens de artigo
 * Utiliza CVA (Class Variance Authority) para type safety e performance
 */
export const imageVariants = cva(
  // ✅ Classes base aplicadas a todas as variantes
  [
    'relative w-full overflow-hidden',
    'transition-all duration-300 ease-in-out'
  ],
  {
    variants: {
      /**
       * Estilos de moldura para a imagem
       * - none: Sem moldura (novo padrão para artigos)
       * - classic: Moldura clássica com borda dourada
       * - modern: Estilo moderno com sombra sutil
       * - elegant: Estilo elegante com gradiente overlay
       * - minimal: Estilo minimalista simples
       */
      frame: {
        none: [
          // ✅ Estilo limpo sem decorações
          'border-0',
          'shadow-none',
          'rounded-none'
        ],
        classic: [
          'border-4 border-[#C19A6B]',
          'rounded-lg',
          'shadow-lg'
        ],
        modern: [
          'rounded-xl',
          'shadow-2xl',
          'border border-[#C19A6B]/20'
        ],
        elegant: [
          'rounded-lg',
          'shadow-xl',
          'border-2 border-[#C19A6B]/30',
          // ✅ Overlay será aplicado separadamente para maior controle
        ],
        minimal: [
          'rounded-md',
          'shadow-md'
        ]
      },
      /**
       * Efeitos de hover para interatividade
       * - none: Sem efeitos de hover
       * - subtle: Efeito sutil de zoom e sombra
       * - pronounced: Efeito mais pronunciado
       */
      hover: {
        none: '',
        subtle: [
          'hover:shadow-lg',
          'hover:scale-[1.02]',
          'hover:transition-transform'
        ],
        pronounced: [
          'hover:shadow-2xl',
          'hover:scale-105',
          'hover:transition-transform'
        ]
      },
      /**
       * Estados de carregamento
       * - normal: Estado padrão
       * - loading: Estado de carregamento com skeleton
       */
      loading: {
        normal: '',
        skeleton: [
          'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200',
          'animate-pulse'
        ]
      }
    },
    // ✅ Valores padrão seguros
    defaultVariants: {
      frame: 'none',        // 🎯 Novo padrão sem moldura
      hover: 'subtle',      // Interatividade sutil por padrão
      loading: 'normal'     // Estado normal por padrão
    }
  }
);

/**
 * Props TypeScript derivadas das variantes CVA
 * Garante type safety em tempo de compilação
 */
export interface ImageVariantsProps 
  extends VariantProps<typeof imageVariants> {
  /**
   * Classes CSS adicionais para customização
   */
  className?: string;
}

/**
 * Tipos específicos para cada variante
 * Útil para validações e autocomplete
 */
export type FrameStyle = NonNullable<ImageVariantsProps['frame']>;
export type HoverStyle = NonNullable<ImageVariantsProps['hover']>;
export type LoadingState = NonNullable<ImageVariantsProps['loading']>;

/**
 * Constantes para fácil reutilização
 */
export const FRAME_STYLES = {
  NONE: 'none' as const,
  CLASSIC: 'classic' as const,
  MODERN: 'modern' as const,
  ELEGANT: 'elegant' as const,
  MINIMAL: 'minimal' as const
} as const;

export const HOVER_STYLES = {
  NONE: 'none' as const,
  SUBTLE: 'subtle' as const,
  PRONOUNCED: 'pronounced' as const
} as const;
