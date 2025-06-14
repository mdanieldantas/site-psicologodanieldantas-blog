// app/blogflorescerhumano/layout.tsx (Server Component)
import type { Metadata } from 'next';
import BlogClientLayout from './blog-client-layout'; // Importando o layout do cliente
import React from 'react';
import './components/article-styles.css'; // Importando estilos específicos para artigos

// ✅ SISTEMA UNIFICADO DE METADADOS
import { createMetadata, BLOG_CONFIG } from '../../lib/metadata-config';

// ✅ METADADOS OTIMIZADOS PARA O BLOG
export const metadata: Metadata = createMetadata({
  title: BLOG_CONFIG.name,
  description: BLOG_CONFIG.description,
  path: "/blogflorescerhumano",
  images: ["/blogflorescerhumano/logos-blog/logo-fundomarrom.webp"],
  type: "website",
  robots: { index: true, follow: true }
});

// ✅ SCHEMA.ORG DO BLOG PARA SEO
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog Florescer Humano",
  "description": "Blog de psicologia com artigos sobre desenvolvimento pessoal, saúde mental e terapia humanista",
  "url": "https://psicologodanieldantas.com.br/blogflorescerhumano",
  "author": {
    "@type": "Person",
    "name": "Daniel Dantas",
    "jobTitle": "Psicólogo",
    "url": "https://psicologodanieldantas.com.br",
    "sameAs": [
      "https://www.instagram.com/psicologodanieldantas/",
      "https://www.linkedin.com/in/danielpsd/"
    ]
  },
  "publisher": {
    "@type": "Person",
    "name": "Daniel Dantas"
  },
  "inLanguage": "pt-BR"
};

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <>
      {/* ✅ SCHEMA.ORG DO BLOG */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema, null, 0) }}
      />
      
      {/* Layout do Cliente com funcionalidades interativas */}
      <BlogClientLayout>
        {children}
      </BlogClientLayout>
    </>
  );
}
