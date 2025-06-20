'use client'

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function ConditionalSchemas() {
  const pathname = usePathname();
  const [shouldShowBlogSchema, setShouldShowBlogSchema] = useState(true);
  
  useEffect(() => {
    // ✅ LAYER 1: Detecção por URL Pattern (Primária - 95% dos casos)
    const isArticleByURL = /\/blogflorescerhumano\/[^\/]+\/[^\/]+$/.test(pathname);
    
    // ✅ LAYER 2: Detecção por Schema Existente (Secundária - 4% dos casos)
    const hasArticleSchema = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .some(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          return data['@type'] === 'BlogPosting' || data['@type'] === 'Article';
        } catch {
          return false;
        }
      });
    
    // ✅ LAYER 3: Detecção por Metadata (Terciária - 1% dos casos)
    const isArticleByMeta = document.title.includes(' | ') && 
                           !document.title.includes('Blog Florescer Humano');
    
    // ✅ DECISÃO FINAL: NÃO mostrar Blog schema se for artigo
    const isArticlePage = isArticleByURL || hasArticleSchema || isArticleByMeta;
    setShouldShowBlogSchema(!isArticlePage);
    
    // ✅ LOG para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Schema Detection:', {
        pathname,
        isArticleByURL,
        hasArticleSchema,
        isArticleByMeta,
        finalDecision: isArticlePage ? 'HIDE Blog Schema' : 'SHOW Blog Schema'
      });
    }
    
  }, [pathname]);

  return (
    <>
      {/* ✅ SCHEMA BLOG: Apenas quando apropriado (homepage, categorias, tags) */}
      {shouldShowBlogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema, null, 0) }}
        />
      )}
      
      {/* ✅ BREADCRUMB: Sempre presente em todas as páginas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema, null, 0) }}
      />
    </>
  );
}