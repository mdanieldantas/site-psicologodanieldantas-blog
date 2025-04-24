// app/blogflorescerhumano/page.tsx
import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server'; // Ajustado para @/
import type { Database } from '@/types/supabase'; // Ajustado para @/
import ArticleCardBlog from './components/ArticleCardBlog';
import type { Metadata } from 'next'; // Importa o tipo Metadata

// --- Metadados Estáticos para a Página Inicial do Blog --- //
export const metadata: Metadata = {
  title: 'Blog Florescer Humano | Psicologia Humanista e Autoconhecimento',
  description: 'Explore artigos sobre autoconhecimento, bem-estar, relacionamentos e crescimento pessoal através da perspectiva da psicologia humanista no Blog Florescer Humano.',
  alternates: {
    canonical: '/blogflorescerhumano',
  },
  // OpenGraph e Twitter podem ser adicionados depois se necessário
};

export default async function BlogHomePage() {
  // ... (restante do código do componente da página permanece o mesmo)
}
