// Configurações globais para Next.js 15
// Este arquivo força o comportamento dinâmico para páginas específicas

// Força renderização dinâmica para todas as páginas do blog
export const dynamic = 'force-dynamic';

// Configurações para evitar problemas de chunk loading
export const runtime = 'nodejs';

// Desabilita a geração estática para páginas que causam problemas
export const revalidate = 0;

// Configuração para melhor compatibilidade com Vercel
export const maxDuration = 30;
