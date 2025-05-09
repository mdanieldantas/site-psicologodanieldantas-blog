// app/blogflorescerhumano/components/ArticleSchema.tsx
'use client';

import React, { useMemo } from 'react';

interface ArticleSchemaProps {
  title: string;
  description: string;
  publishDate: string;
  modifiedDate?: string;
  authorName: string;
  imagePath?: string;
  categoryName: string;
  tags?: { nome: string }[];
  url: string;
}

export default function ArticleSchema({
  title,
  description,
  publishDate,
  modifiedDate,
  authorName,
  imagePath,
  categoryName,
  tags,
  url
}: ArticleSchemaProps) {
  // URL base fixa para evitar diferenças entre servidor e cliente
  const baseUrl = 'https://psicologodanieldantas.com.br';
  
  // Construir URL completa para a imagem
  const imageUrl = imagePath ? `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}` : null;
  
  // Construir URL completa para o artigo
  const articleUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  
  // Preparar tags para keywords
  const keywords = tags ? tags.map(tag => tag.nome).join(', ') : '';
  // Construir o breadcrumb para melhor navegação nos resultados de busca
  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog Florescer Humano',
        item: `${baseUrl}/blogflorescerhumano`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${baseUrl}/blogflorescerhumano/${url.split('/')[2]}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: title,
        item: articleUrl
      }
    ]
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Psicólogo Daniel Dantas',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/navbar-logo-horizontal-navbar.png`,
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    image: imageUrl,
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    articleSection: categoryName,
    keywords: keywords,
    // Adiciona breadcrumbs para melhorar a navegação nos resultados de busca
    breadcrumb: breadcrumbList
  };
  // Use useMemo para garantir estabilidade no objeto JSON durante renderizações
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
