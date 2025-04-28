// Componente Header específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogHeader.tsx
import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react'; // Importar ícone

const BlogHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md">
      {/* Alterado: removido justify-between, adicionado relative */}
      <nav className="container mx-auto px-4 py-4 flex items-center relative">
        {/* Link para a página inicial do blog */}
        <Link href="/blogflorescerhumano" legacyBehavior>
          <a className="text-2xl font-bold hover:text-gray-200">Blog Florescer Humano</a>
        </Link>
        {/* Links de navegação do blog - Centralizados */}
        {/* Alterado: adicionado absolute, left-1/2, transform, -translate-x-1/2 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 space-x-4">
          <Link href="/blogflorescerhumano/categorias" legacyBehavior><a className="hover:text-gray-200">Categorias</a></Link>
          <Link href="/blogflorescerhumano/artigos" legacyBehavior><a className="hover:text-gray-200">Artigos</a></Link>
          <Link href="/blogflorescerhumano/sobre" legacyBehavior><a className="hover:text-gray-200">Sobre</a></Link>
          <Link href="/blogflorescerhumano/contato" legacyBehavior><a className="hover:text-gray-200">Contato</a></Link>
          {/* Adiciona links para as novas páginas */}
          <Link href="/blogflorescerhumano/materiais" legacyBehavior><a className="hover:text-gray-200">Materiais</a></Link>
          <Link href="/blogflorescerhumano/midias" legacyBehavior><a className="hover:text-gray-200">Mídias</a></Link>
          {/* Botão movido para fora deste div */}
        </div>
        {/* Container para Botão e Lupa - Empurrado para a direita */}
        <div className="ml-auto flex items-center space-x-3">
          {/* Ícone de Lupa para Busca (Agora primeiro) */}
          <Link href="/blogflorescerhumano/buscar" legacyBehavior>
            <a className="hover:text-gray-300 cursor-pointer" title="Buscar no blog">
              <Search size={20} /> {/* Ícone de Lupa */}
            </a>
          </Link>
          {/* Botão para voltar ao site principal */}
          <Link href="/" legacyBehavior>
            {/* Removido ml-auto daqui */}
            <a className="px-3 py-1 border border-white rounded-md hover:bg-white hover:text-blue-600 transition-colors">
              Site Psi Daniel Dantas
            </a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default BlogHeader;
