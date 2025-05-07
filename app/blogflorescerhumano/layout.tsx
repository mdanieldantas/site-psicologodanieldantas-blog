// app/blogflorescerhumano/layout.tsx (Server Component)
import type { Metadata } from 'next';
import BlogClientLayout from './blog-client-layout'; // Importando o layout do cliente
import React from 'react';

// Metadados específicos para o Blog Florescer Humano
export const metadata: Metadata = {
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
    'theme-color': '#ffffff'
  }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogClientLayout>{children}</BlogClientLayout>
  );
}
