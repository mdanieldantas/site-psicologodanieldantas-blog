

// app/blogflorescerhumano/components/BlogSchema.tsx
// Componente de servidor para evitar erros de hidratação

import React from 'react';

export default function BlogSchema() {
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
        url: `${baseUrl}/navbar-logo-horizontal-navbar-danieldantas.webp`
      }
    },
    inLanguage: 'pt-BR'
  };
  
  // Convertendo para string
  const jsonLdString = JSON.stringify(schemaData);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
