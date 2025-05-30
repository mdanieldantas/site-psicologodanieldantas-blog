// app/blogflorescerhumano/components/CategorySchema.tsx
'use client';

import React, { useMemo } from 'react';

interface CategorySchemaProps {
  nome: string; // Nome da categoria
  descricao: string; // Descrição da categoria
  slug: string; // Slug da categoria
  url: string; // URL completa da categoria
  imagemUrl: string | null; // URL da imagem (opcional)
  artigosCount: number | null; // Contagem de artigos (opcional)
}

export default function CategorySchema({
  nome,
  descricao,
  slug,
  url,
  imagemUrl,
  artigosCount
}: CategorySchemaProps) {
  // URL base fixa para evitar diferenças entre servidor e cliente
  const baseUrl = 'https://psicologodanieldantas.com.br';
    
  // Construir URL completa para a categoria
  const categoryUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    // Prepara objeto para Schema.org
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    headline: `${nome} - Blog Florescer Humano`,
    description: descricao,
    url: categoryUrl,
    // Adiciona imagem se disponível
    ...(imagemUrl && {
      image: {
        '@type': 'ImageObject',
        url: `${baseUrl}/blogflorescerhumano/${imagemUrl}`,
        width: 1200,
        height: 630
      }
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Psicólogo Daniel Dantas',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/navbar-logo-horizontal-navbar-danieldantas.webp`,
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': categoryUrl
    },
    // Adiciona contagem de itens se disponível
    ...(artigosCount !== null && {
      numberOfItems: artigosCount
    })
  };  // Use useMemo para garantir consistência na serialização
  const jsonLdString = useMemo(() => {
    return JSON.stringify(schemaData);
  }, [schemaData]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  );
}
