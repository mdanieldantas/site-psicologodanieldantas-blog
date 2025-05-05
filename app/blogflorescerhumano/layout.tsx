// app/blogflorescerhumano/layout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BlogHeader from './components/BlogHeader';
import BlogFooter from './components/BlogFooter';
import ContentWrapper from './components/ContentWrapper';
import './ui/globalsBlog.css';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/blogflorescerhumano';

  return (
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
    </div>
  );
}
