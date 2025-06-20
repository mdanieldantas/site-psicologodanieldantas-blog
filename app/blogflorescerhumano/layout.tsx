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

// ✅ SCHEMA.ORG DO BLOG ENRIQUECIDO PARA SEO
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://psicologodanieldantas.com.br/blogflorescerhumano#blog",
  "name": "Blog Florescer Humano",
  "alternateName": "Florescer Humano",
  "description": "Blog especializado em psicologia humanista com artigos sobre autoconhecimento, desenvolvimento pessoal, bem-estar emocional e crescimento humano. Conteúdo baseado em evidências científicas e experiência clínica.",
  "url": "https://psicologodanieldantas.com.br/blogflorescerhumano",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://psicologodanieldantas.com.br/blogflorescerhumano"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "Psicologia Humanista"
    },
    {
      "@type": "Thing", 
      "name": "Autoconhecimento"
    },
    {
      "@type": "Thing",
      "name": "Desenvolvimento Pessoal"
    },
    {
      "@type": "Thing",
      "name": "Bem-estar Emocional"
    }
  ],
  "keywords": "psicologia humanista, autoconhecimento, desenvolvimento pessoal, bem-estar emocional, saúde mental, terapia, crescimento pessoal, psicologia positiva",
  "audience": {
    "@type": "Audience",
    "audienceType": "pessoas interessadas em desenvolvimento pessoal e bem-estar emocional"
  },
  "author": {
    "@type": "Person",
    "@id": "https://psicologodanieldantas.com.br#person",
    "name": "Daniel Dantas",
    "jobTitle": "Psicólogo",
    "description": "Psicólogo especializado em abordagem humanista, com foco em autoconhecimento e desenvolvimento pessoal",
    "url": "https://psicologodanieldantas.com.br",
    "sameAs": [
      "https://www.instagram.com/psicologodanieldantas/",
      "https://www.linkedin.com/in/danielpsd/"
    ],
    "knowsAbout": [
      "Psicologia Humanista",
      "Autoconhecimento", 
      "Desenvolvimento Pessoal",
      "Terapia"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://psicologodanieldantas.com.br#organization",
    "name": "Psicólogo Daniel Dantas",
    "description": "Consultório de psicologia especializado em abordagem humanista",
    "url": "https://psicologodanieldantas.com.br",
    "logo": {
      "@type": "ImageObject",
      "url": "https://psicologodanieldantas.com.br/blogflorescerhumano/logos-blog/logo-fundomarrom.webp"
    },
    "founder": {
      "@id": "https://psicologodanieldantas.com.br#person"
    }
  },
  "inLanguage": "pt-BR",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://psicologodanieldantas.com.br#website",
    "name": "Psicólogo Daniel Dantas",
    "url": "https://psicologodanieldantas.com.br"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://psicologodanieldantas.com.br/blogflorescerhumano/buscar?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// ✅ SCHEMA BREADCRUMBLIST PARA NAVEGAÇÃO SEO
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://psicologodanieldantas.com.br"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "Blog Florescer Humano",
      "item": "https://psicologodanieldantas.com.br/blogflorescerhumano"
    }
  ]
};

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <>
      {/* ✅ SCHEMA.ORG DO BLOG ENRIQUECIDO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema, null, 0) }}
      />
      
      {/* ✅ SCHEMA BREADCRUMBLIST PARA SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema, null, 0) }}
      />
      
      {/* Layout do Cliente com funcionalidades interativas */}
      <BlogClientLayout>
        {children}
      </BlogClientLayout>
    </>
  );
}
