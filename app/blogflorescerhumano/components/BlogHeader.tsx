// Componente Header específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogHeader.tsx
import React from 'react';
import Link from 'next/link';

const BlogHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Link para a página inicial do blog */}
        <Link href="/blogflorescerhumano" legacyBehavior>
          <a className="text-2xl font-bold hover:text-gray-200">Blog Florescer Humano</a>
        </Link>
        {/* Links de navegação do blog */}
        <div className="space-x-4">
          <Link href="/blogflorescerhumano/categorias" legacyBehavior><a className="hover:text-gray-200">Categorias</a></Link>
          <Link href="/blogflorescerhumano/artigos" legacyBehavior><a className="hover:text-gray-200">Artigos</a></Link>
          <Link href="/blogflorescerhumano/sobre" legacyBehavior><a className="hover:text-gray-200">Sobre</a></Link>
          <Link href="/blogflorescerhumano/contato" legacyBehavior><a className="hover:text-gray-200">Contato</a></Link>
          {/* Adiciona links para as novas páginas */}
          <Link href="/blogflorescerhumano/materiais" legacyBehavior><a className="hover:text-gray-200">Materiais</a></Link>
          <Link href="/blogflorescerhumano/midias" legacyBehavior><a className="hover:text-gray-200">Mídias</a></Link>
        </div>
      </nav>
    </header>
  );
};

export default BlogHeader;
