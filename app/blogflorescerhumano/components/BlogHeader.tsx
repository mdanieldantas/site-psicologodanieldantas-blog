// Componente Header específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogHeader.tsx
import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Image from 'next/image';
import HeaderSearchInline from './HeaderSearchInline';

const BlogHeader = () => {
  return (
    <header className="bg-[color:var(--blog-background)] text-[color:var(--blog-foreground)] shadow-md border-b border-[color:var(--blog-border)]">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo do Blog */}
        <Link href="/blogflorescerhumano" legacyBehavior>
          <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.png"
              alt="Logo Florescer Humano"
              width={160}
              height={40}
              priority
            />
            <span className="sr-only">Blog Florescer Humano</span>
          </a>
        </Link>

        {/* Links de navegação */}
        <div className="hidden md:flex space-x-6">
          <Link href="/blogflorescerhumano/categorias" legacyBehavior>
            <a className="hover:text-[color:var(--blog-accent)]">Categorias</a>
          </Link>
          <Link href="/blogflorescerhumano/artigos" legacyBehavior>
            <a className="hover:text-[color:var(--blog-accent)]">Artigos</a>
          </Link>
          <Link href="/blogflorescerhumano/sobre" legacyBehavior>
            <a className="hover:text-[color:var(--blog-accent)]">Sobre</a>
          </Link>
          <Link href="/blogflorescerhumano/contato" legacyBehavior>
            <a className="hover:text-[color:var(--blog-accent)]">Contato</a>
          </Link>
          <Link href="/blogflorescerhumano/materiais" legacyBehavior>
            <a className="hover:text-[color:var(--blog-accent)]">Materiais</a>
          </Link>
          <Link href="/blogflorescerhumano/midias" legacyBehavior>
            <a className="hover:text-[color:var(--blog-accent)]">Mídias</a>
          </Link>
        </div>

        {/* Botão e Busca */}
        <div className="flex items-center space-x-4">
          <HeaderSearchInline />
          <Link href="/" legacyBehavior>
            <a className="px-4 py-2 bg-[color:var(--blog-primary)] text-[color:var(--blog-primary-foreground)] rounded-md hover:bg-[color:var(--blog-accent)] transition-colors">
              Voltar ao Site Principal
            </a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default BlogHeader;
