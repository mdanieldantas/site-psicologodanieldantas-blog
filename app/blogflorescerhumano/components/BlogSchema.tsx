// app/blogflorescerhumano/components/BlogSchema.tsx
// Transformado em componente de servidor para evitar erros de hidratação
'use client';

import React, { useMemo } from 'react';

export default function BlogSchema() {
  // Use useMemo para garantir estabilidade no objeto JSON durante renderizações
  const jsonLdString = useMemo(() => {
    // URL base fixa para evitar diferenças entre servidor e cliente
    const baseUrl = 'https://psicologodanieldantas.com.br';
    
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog Florescer Humano',
      description: 'Blog com artigos sobre psicologia, desenvolvimento pessoal, saúde mental e autoconhecimento.',
      url: `${baseUrl}/blogflorescerhumano`,
      publisher: {
        '@type': 'Organization',
        name: 'Psicólogo Daniel Dantas',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/navbar-logo-horizontal-navbar.png`
        }
      },
      inLanguage: 'pt-BR'
    };
    
    // Use uma ordenação determinística para garantir a mesma string tanto no servidor quanto no cliente
    return JSON.stringify(schemaData);
  }, []);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
