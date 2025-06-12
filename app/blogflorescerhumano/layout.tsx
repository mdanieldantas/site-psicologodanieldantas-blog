// app/blogflorescerhumano/layout.tsx (Server Component)
import type { Metadata } from 'next';
import BlogClientLayout from './blog-client-layout'; // Importando o layout do cliente
import BlogSchema from './components/BlogSchema'; // Importando o componente de schema
import React from 'react';
import './components/article-styles.css'; // Importando estilos específicos para artigos

// Metadados específicos para o Blog Florescer Humano
export const metadata: Metadata = {  // Metadados básicos do blog
  title: {
    default: "Blog Florescer Humano | Psicólogo Daniel Dantas",
    template: "%s"
  },
  description: "Blog de psicologia com artigos sobre desenvolvimento pessoal, saúde mental e terapia humanista por Daniel Dantas",
    // Open Graph para WhatsApp, Facebook e outras redes sociais
  openGraph: {
    title: "Blog Florescer Humano",
    description: "Artigos sobre psicologia e desenvolvimento pessoal",
    url: "https://psicologodanieldantas.com.br/blogflorescerhumano",
    siteName: "Blog Florescer Humano",
    images: [
      {
        url: "https://psicologodanieldantas.com.br/blogflorescerhumano/logos-blog/logo-fundomarrom.webp",
        width: 1200,
        height: 630,
        alt: "Logo Blog Florescer Humano",
        type: "image/webp",
      }
    ],    locale: 'pt_BR',
    type: 'website',
    emails: ['contatomarcosdgomes@gmail.com'],
    phoneNumbers: ['+55-85-986013431'],
    countryName: 'Brasil',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: "Blog Florescer Humano",
    description: "Artigos sobre psicologia e desenvolvimento pessoal",
    images: ["https://psicologodanieldantas.com.br/blogflorescerhumano/logos-blog/logo-fundomarrom.webp"],
    creator: '@psicologodaniel',
  },
  
  // Configurações de SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // URL canônica
  alternates: {
    canonical: "https://psicologodanieldantas.com.br/blogflorescerhumano",
  },
  
  // Autor
  authors: [{ name: "Daniel Dantas", url: "https://psicologodanieldantas.com.br" }],
  
  // Palavras-chave
  keywords: [
    "psicologia",
    "desenvolvimento pessoal", 
    "saúde mental",
    "terapia humanista",
    "blog psicologia",
    "Daniel Dantas",
    "florescer humano"
  ],

  icons: {
    icon: [
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon.ico', rel: 'icon', sizes: 'any' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-36x36.png', type: 'image/png', sizes: '36x36' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-72x72.png', type: 'image/png', sizes: '72x72' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-144x144.png', type: 'image/png', sizes: '144x144' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-192x192.png', type: 'image/png', sizes: '192x192' }
    ],
    apple: [
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon.png', type: 'image/png' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-57x57.png', type: 'image/png', sizes: '57x57' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-60x60.png', type: 'image/png', sizes: '60x60' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-72x72.png', type: 'image/png', sizes: '72x72' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-76x76.png', type: 'image/png', sizes: '76x76' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-114x114.png', type: 'image/png', sizes: '114x114' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-120x120.png', type: 'image/png', sizes: '120x120' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-144x144.png', type: 'image/png', sizes: '144x144' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-152x152.png', type: 'image/png', sizes: '152x152' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-180x180.png', type: 'image/png', sizes: '180x180' }
    ],
    shortcut: ['/blogflorescerhumano/favicon-blog-florescer-humano/favicon.ico']
  },
  manifest: '/blogflorescerhumano/favicon-blog-florescer-humano/manifest.json',
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/blogflorescerhumano/favicon-blog-florescer-humano/ms-icon-144x144.png',
    'msapplication-config': '/blogflorescerhumano/favicon-blog-florescer-humano/browserconfig.xml',
    'theme-color': '#ffffff'  }
};

// Schema.org JSON-LD para melhor SEO
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
    "email": "contatomarcosdgomes@gmail.com",
    "telephone": "+55-85-986013431"
  },  "publisher": {
    "@type": "Organization",
    "name": "Daniel Dantas - Psicólogo",
    "@id": "https://psicologodanieldantas.com.br",
    "url": "https://psicologodanieldantas.com.br",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "url": "https://wa.me/5585986013431?text=Olá%20Dr.%20Daniel,%20gostaria%20de%20agendar%20uma%20consulta",
        "contactType": "customer service",
        "name": "WhatsApp - Agendamento de Consultas",
        "areaServed": "BR",
        "availableLanguage": "Portuguese",
        "hoursAvailable": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        ]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+55-85-986013431",
        "email": "contatomarcosdgomes@gmail.com",
        "contactType": "technical support",
        "areaServed": "BR",
        "availableLanguage": "Portuguese"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressRegion": "CE"
    }  },
  "inLanguage": "pt-BR",
  "about": "Psicologia, desenvolvimento pessoal e saúde mental",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://psicologodanieldantas.com.br/blogflorescerhumano"
  },
  "potentialAction": {
    "@type": "CommunicateAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://wa.me/5585986013431?text=Olá%20Dr.%20Daniel,%20gostaria%20de%20agendar%20uma%20consulta",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    },
    "name": "Agendar Consulta via WhatsApp"
  }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogSchema />
      <BlogClientLayout>{children}</BlogClientLayout>
    </>
  );
}
