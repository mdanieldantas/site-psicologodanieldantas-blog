/**
 * Configuração das Google Fonts para o Blog Florescer Humano
 * Implementação seguindo o Designer Guide - Sistema Tipográfico Unificado
 * 
 * Fontes Oficiais:
 * - Playfair Display: Títulos e headings (serifada elegante)
 * - Source Sans 3: Corpo de texto e UI (sans-serif humanista)
 */

import { Playfair_Display, Source_Sans_3 } from 'next/font/google';

// Fonte principal para títulos - Playfair Display
export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

// Fonte principal para corpo de texto - Source Sans 3
export const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sourcesans',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

// Exportação das variáveis CSS para uso no layout
export const fontVariables = `${playfairDisplay.variable} ${sourceSans3.variable}`;
