'use client';

import { usePageContext } from './page-context';
import { useEffect } from 'react';

interface SchemaManagerProps {
  blogSchemaHtml: string;
  breadcrumbSchemaHtml: string;
}

export default function SchemaManager({ blogSchemaHtml, breadcrumbSchemaHtml }: SchemaManagerProps) {
  const { shouldShowBlogSchema } = usePageContext();

  useEffect(() => {
    // Remove schemas existentes para evitar duplicação
    const existingSchemas = document.querySelectorAll('script[data-schema="blog"], script[data-schema="breadcrumb"]');
    existingSchemas.forEach(script => script.remove());

    // Adiciona o breadcrumb schema (sempre presente)
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.setAttribute('data-schema', 'breadcrumb');
    breadcrumbScript.textContent = breadcrumbSchemaHtml;
    document.head.appendChild(breadcrumbScript);

    // Adiciona o blog schema condicionalmente
    if (shouldShowBlogSchema) {
      const blogScript = document.createElement('script');
      blogScript.type = 'application/ld+json';
      blogScript.setAttribute('data-schema', 'blog');
      blogScript.textContent = blogSchemaHtml;
      document.head.appendChild(blogScript);
    }

    // Cleanup na desmontagem
    return () => {
      const schemasToRemove = document.querySelectorAll('script[data-schema="blog"], script[data-schema="breadcrumb"]');
      schemasToRemove.forEach(script => script.remove());
    };
  }, [shouldShowBlogSchema, blogSchemaHtml, breadcrumbSchemaHtml]);

  return null; // Este componente não renderiza nada visualmente
}
