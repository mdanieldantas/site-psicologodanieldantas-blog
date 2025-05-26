'use client';

import React from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';

// Componentes motion tipados para resolver o problema do Next.js 15
export const MotionDiv = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  (props, ref) => <motion.div ref={ref} {...props} />
);
MotionDiv.displayName = 'MotionDiv';

export const MotionH2 = React.forwardRef<HTMLHeadingElement, HTMLMotionProps<'h2'>>(
  (props, ref) => <motion.h2 ref={ref} {...props} />
);
MotionH2.displayName = 'MotionH2';

export const MotionH3 = React.forwardRef<HTMLHeadingElement, HTMLMotionProps<'h3'>>(
  (props, ref) => <motion.h3 ref={ref} {...props} />
);
MotionH3.displayName = 'MotionH3';

export const MotionP = React.forwardRef<HTMLParagraphElement, HTMLMotionProps<'p'>>(
  (props, ref) => <motion.p ref={ref} {...props} />
);
MotionP.displayName = 'MotionP';

export const MotionSVG = React.forwardRef<SVGSVGElement, any>(
  (props, ref) => <motion.svg ref={ref} {...props} />
);
MotionSVG.displayName = 'MotionSVG';

// Variantes de animação reutilizáveis
export const defaultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const cardVariants = {
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
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
