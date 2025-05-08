// app/blogflorescerhumano/blog-client-layout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BlogHeader from './components/BlogHeader';
import BlogFooter from './components/BlogFooter';
import ContentWrapper from './components/ContentWrapper';
import ScrollButton from './components/ScrollButton';
import BlogSchema from './components/BlogSchema';
import { ConnectionQualityAdjuster } from './components/ConnectionQualityAdjuster';
import './ui/globalsBlog.css';
import './ui/mobile-improvements.css';

// Removida a exportação de metadata daqui

export default function BlogClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/blogflorescerhumano';  // Carrega script de interações mobile quando o componente monta
  React.useEffect(() => {
    // Importação dinâmica do script de interações mobile
    import('./scripts/mobile-interactions').then(module => {
      // Chama a função exportada para inicializar as interações
      module.default();
    }).catch(err => {
      console.error('Erro ao carregar script de interações mobile:', err);
    });
  }, []);
  return (
    <>
      {/* Componente que ajusta a qualidade baseado na conexão do usuário */}
      <ConnectionQualityAdjuster />
      
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
