'use client';

import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface MotionWrapperProps extends MotionProps {
  children: React.ReactNode;
  reduceMotion?: boolean;
  className?: string;
}

/**
 * Wrapper inteligente para animações que respeita preferências de acessibilidade
 * Baseado nas melhores práticas do Context7 para Framer Motion
 */
export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  reduceMotion = false,
  className = '',
  ...motionProps
}) => {
  // Detectar preferência de movimento reduzido
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Se movimento reduzido for preferido, renderizar div simples
  if (prefersReducedMotion || reduceMotion) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  // Caso contrário, renderizar com animações
  return (
    <motion.div
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

/**
 * Variantes de animação pré-configuradas baseadas no Context7
 */
export const animationVariants = {
  // Entrada suave para cards
  cardEnter: {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  },

  // Stagger para containers
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  // Hover suave
  gentleHover: {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
  },

  // Entrada desde baixo
  slideUp: {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  },

  // Fade com escala
  fadeScale: {
    hidden: { 
      opacity: 0, 
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  },
};

/**
 * Configurações de transição otimizadas
 */
export const transitionConfigs = {
  // Para elementos pequenos e rápidos
  quick: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
  },

  // Para elementos médios
  smooth: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  },

  // Para elementos grandes ou complexos
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
  },

  // Para hover effects
  hover: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
  },
};

export default MotionWrapper;
