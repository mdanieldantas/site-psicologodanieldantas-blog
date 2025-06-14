
// app/blogflorescerhumano/metadata.ts
import { Metadata } from 'next';

// Metadados específicos para o blog Florescer Humano
export const metadata: Metadata = {
  title: {
    template: '%s | Blog Florescer Humano',
    default: 'Blog Florescer Humano | Psicólogo Daniel Dantas',
  },
  description: 'Blog com artigos sobre psicologia, desenvolvimento pessoal, saúde mental e autoconhecimento. Abordando temas relacionados ao crescimento pessoal, bem-estar emocional e relacionamentos saudáveis.',
  keywords: 'blog de psicologia, desenvolvimento pessoal, saúde mental, autoconhecimento, bem-estar emocional, psicologia humanista, terapia online, crescimento pessoal, ansiedade, depressão',
  
  // Open Graph específico para o blog
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://psicologodanieldantas.com.br/blogflorescerhumano',
    siteName: 'Blog Florescer Humano',
    title: 'Blog Florescer Humano | Psicólogo Daniel Dantas',
    description: 'Blog com artigos sobre psicologia, desenvolvimento pessoal, saúde mental e autoconhecimento.',
    images: [
      {
        url: 'https://psicologodanieldantas.com.br/blogflorescerhumano/assets/blog-florescer-humano-og.png',
        width: 1200,
        height: 630,
        alt: 'Blog Florescer Humano',
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Florescer Humano | Psicólogo Daniel Dantas',
    description: 'Blog com artigos sobre psicologia, desenvolvimento pessoal, saúde mental e autoconhecimento.',
    images: ['https://psicologodanieldantas.com.br/blogflorescerhumano/assets/blog-florescer-humano-og.png'],
  },

  // URL canônica para o blog
  alternates: {
    canonical: 'https://psicologodanieldantas.com.br/blogflorescerhumano',
  },
};
