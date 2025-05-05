'use client';

// Componente Header específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogHeader.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import HeaderSearchInline from './HeaderSearchInline';
import { useIsHomePage } from '../hooks/useIsHomePage';

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHome = useIsHomePage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isHome 
          ? isMobileMenuOpen 
            ? 'bg-[#F8F5F0]' // Quando menu aberto, fundo sólido
            : isScrolled
              ? 'md:bg-[#F8F5F0]/95 md:backdrop-blur-md md:shadow-md bg-transparent' 
              : 'bg-[#F8F5F0]'
          : 'bg-[#F8F5F0]'
      }`}>
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo do Blog */}
          <Link href="/blogflorescerhumano" legacyBehavior>
            <a className={`flex items-center gap-2 hover:opacity-80 transition-all duration-300 ${
              isScrolled && !isMobileMenuOpen ? 'opacity-0 md:opacity-100 invisible md:visible' : 'opacity-100 visible'
            }`}>
              <Image
                src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.png"
                alt="Logo Florescer Humano"
                width={160}
                height={40}
                priority
                className="transition-opacity duration-300"
              />
            </a>
          </Link>

          {/* Links de navegação - Desktop */}
          <div className="hidden md:flex space-x-6">
            {['categorias', 'artigos', 'materiais', 'midias', 'sobre', 'contato'].map((item) => (
              <Link key={item} href={`/blogflorescerhumano/${item}`} legacyBehavior>
                <a className={`transition-colors duration-300 ${
                  'text-[#583B1F] hover:text-[#C19A6B]'
                }`}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </Link>
            ))}
          </div>

          {/* Mobile: Lupa e Menu Hambúrguer */}
          <div className={`flex md:hidden items-center space-x-4 transition-all duration-300`}>
            <div className={`relative transition-all duration-300 ${
              isScrolled && !isMobileMenuOpen ? 'bg-[#F8F5F0]/60 backdrop-blur-sm' : ''
            } rounded-full`}>
              <HeaderSearchInline />
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-all duration-300 text-[#583B1F] rounded-full ${
                isScrolled && !isMobileMenuOpen ? 'bg-[#F8F5F0]/60 backdrop-blur-sm hover:bg-[#F8F5F0]/80' : ''
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop: Busca e Botão */}
          <div className="hidden md:flex items-center space-x-4">
            <HeaderSearchInline />
            <Link href="/" legacyBehavior>
              <a className="px-4 py-2 rounded-md transition-all duration-300 bg-[#583B1F] text-white hover:bg-[#735B43]">
                Voltar ao Site Principal
              </a>
            </Link>
          </div>
        </nav>

        {/* Menu Mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen bg-[#F8F5F0]' : 'max-h-0'
        }`}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            {['categorias', 'artigos', 'materiais', 'midias', 'sobre', 'contato'].map((item) => (
              <Link key={item} href={`/blogflorescerhumano/${item}`} legacyBehavior>
                <a className="block py-2 text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </Link>
            ))}
            <Link href="/" legacyBehavior>
              <a className="block py-2 px-4 bg-[#583B1F] text-white rounded-md hover:bg-[#735B43] transition-colors duration-300">
                Voltar ao Site Principal
              </a>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default BlogHeader;
