/**
 * Componente para gerenciar a renderização condicional de schemas Blog e BreadcrumbList
 * 
 * Este componente resolve o problema de duplicidade de schemas garantindo que:
 * - Schema Blog aparece apenas em páginas apropriadas (home, categorias, tags)
 * - Schema Blog NÃO aparece em páginas de artigo individual
 * - BreadcrumbList aparece em todas as páginas quando apropriado
 */

'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { detectPageTypeFromPath, type PageTypeResult } from '../utils/page-type-detector';

interface BlogSchemaManagerProps {
  /** Schema do blog a ser renderizado condicionalmente */
  blogSchema: object;
  /** Schema de breadcrumb a ser renderizado */
  breadcrumbSchema: object;
  /** Força o comportamento para debug/testing */
  forcePageType?: 'blog-home' | 'blog-article' | 'blog-category' | 'blog-tag' | 'blog-other';
}

/**
 * Componente que gerencia schemas de forma inteligente
 * Renderiza apenas os schemas apropriados para cada tipo de página
 */
export default function BlogSchemaManager({ 
  blogSchema, 
  breadcrumbSchema, 
  forcePageType 
}: BlogSchemaManagerProps) {
  
  const pathname = usePathname();
  const [pageDetection, setPageDetection] = useState<PageTypeResult | null>(null);
  
  useEffect(() => {
    // Detecta o tipo de página
    const detection: PageTypeResult = forcePageType 
      ? {
          type: forcePageType,
          shouldRenderBlogSchema: forcePageType !== 'blog-article',
          shouldRenderBreadcrumbSchema: true,
          reason: `Forçado para ${forcePageType}`
        }
      : detectPageTypeFromPath(pathname);
    
    setPageDetection(detection);
    
    // Log para debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 BlogSchemaManager:', {
        pathname,
        forcePageType,
        detection
      });
    }
  }, [pathname, forcePageType]);
  
  // Não renderiza nada até que a detecção seja concluída
  if (!pageDetection) {
    return null;
  }

  return (
    <>
      {/* Renderiza schema Blog apenas quando apropriado */}
      {pageDetection.shouldRenderBlogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(blogSchema, null, 0) 
          }}
        />
      )}
      
      {/* Renderiza BreadcrumbList quando apropriado */}
      {pageDetection.shouldRenderBreadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(breadcrumbSchema, null, 0) 
          }}
        />
      )}
      
      {/* Comentário HTML para debug */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {/* Meta tag para debug */}
          <meta 
            name="blog-schema-debug" 
            content={JSON.stringify({
              pageType: pageDetection.type,
              blogSchemaRendered: pageDetection.shouldRenderBlogSchema,
              breadcrumbRendered: pageDetection.shouldRenderBreadcrumbSchema,
              reason: pageDetection.reason,
              pathname
            })}
          />
        </>
      )}
    </>
  );
}

/**
 * Hook personalizado para usar o detector de página em componentes client
 */
export function usePageTypeDetection(pathname?: string) {
  return React.useMemo(() => {
    return detectPageTypeFromPath(pathname);
  }, [pathname]);
}

/**
 * Componente de debug para exibir informações sobre a detecção
 */
export function BlogSchemaDebugInfo({ pathname }: { pathname?: string }) {
  const detection = usePageTypeDetection(pathname);
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#000',
      color: '#fff',
      padding: '10px',
      fontSize: '12px',
      borderRadius: '5px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <strong>Schema Debug:</strong><br />
      Type: {detection.type}<br />
      Blog Schema: {detection.shouldRenderBlogSchema ? '✅' : '❌'}<br />
      Breadcrumb: {detection.shouldRenderBreadcrumbSchema ? '✅' : '❌'}<br />
      Reason: {detection.reason}<br />
      Path: {pathname || 'N/A'}
    </div>
  );
}
