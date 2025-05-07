// app/blogflorescerhumano/blog-client-layout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BlogHeader from './components/BlogHeader';
import BlogFooter from './components/BlogFooter';
import ContentWrapper from './components/ContentWrapper';
import ScrollButton from './components/ScrollButton';
import BlogSchema from './components/BlogSchema';
import './ui/globalsBlog.css';

// Removida a exportação de metadata daqui

export default function BlogClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/blogflorescerhumano';

  return (
    // Removidas as tags de favicon do JSX daqui
    // O Fragmento React <>...</> é necessário se não houver um elemento raiz único após a remoção das tags de favicon que estavam aqui antes.
    // Se o seu layout já tem um elemento raiz como o <div> abaixo, o Fragmento extra não é estritamente necessário,
    // mas não prejudica.
    <>
      <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
        {/* Navbar */}
        <BlogHeader />

        {/* Conteúdo Principal com wrapper para controle de padding */}
        <ContentWrapper isHome={isHome}>
          <main className="flex-grow">
            {children}
          </main>
        </ContentWrapper>

        {/* Footer */}
        <BlogFooter />
          {/* Botão de Scroll */}
        <ScrollButton />
        
        {/* Schema JSON-LD do Blog */}
        <BlogSchema />
      </div>
    </>
  );
}
