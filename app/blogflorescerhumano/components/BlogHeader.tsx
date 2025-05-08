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
  
  // Fechar menu mobile quando scrollar
  useEffect(() => {
    if (isScrolled && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isScrolled, isMobileMenuOpen]);  // Utilizando useCallback para memorizar a função de debounce
  const handleScroll = React.useCallback(() => {
    const checkScroll = () => setIsScrolled(window.scrollY > 30);
    
    // Criamos um pequeno delay para melhorar a performance
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(checkScroll, 10);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'h-[60px]' : 'h-[70px]'
        } ${
          isHome 
            ? isMobileMenuOpen 
              ? 'bg-[#F8F5F0] shadow-sm'
              : isScrolled
                ? 'md:bg-[#F8F5F0]/85 md:backdrop-blur-md md:shadow-sm bg-[#F8F5F0] shadow-sm' 
                : 'bg-[#F8F5F0]'
            : 'bg-[#F8F5F0]'
        }`}
        role="banner"
        aria-label="Cabeçalho do blog"
      >
        <nav 
          className="container mx-auto px-4 py-3 flex items-center justify-between"
          role="navigation"
          aria-label="Navegação principal"
        >
          {/* Logo do Blog */}          <Link href="/blogflorescerhumano" legacyBehavior>
            <a 
              className={`flex items-center gap-2 hover:opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] rounded-md ${
                isScrolled && !isMobileMenuOpen 
                  ? 'opacity-0 md:opacity-100 invisible md:visible drop-shadow-sm' 
                  : 'opacity-100 visible drop-shadow-sm'
              }`}
              aria-label="Ir para página inicial do blog"
            >
              <Image
                src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.png"
                alt="Logo Florescer Humano"
                width={140}
                height={35}
                priority
                className="transition-opacity duration-300"
                sizes="(max-width: 768px) 120px, 140px"
              />            </a>
          </Link>
          
          {/* Links de navegação - Desktop */}
          <div className="hidden md:flex space-x-6" role="menubar">
            {['categorias', 'artigos', 'materiais', 'midias', 'sobre', 'contato'].map((item) => {
              // Detectar se o link está ativo (URL atual)
              const isActive = typeof window !== 'undefined' && 
                window.location.pathname.includes(`/blogflorescerhumano/${item}`);
              
              return (
                <Link key={item} href={`/blogflorescerhumano/${item}`} legacyBehavior>
                  <a 
                    className={`relative transition-colors duration-300 ${
                      isActive ? 'text-[#C19A6B] font-medium' : 'text-[#583B1F]'
                    } hover:text-[#C19A6B] group focus:outline-none focus:ring-2 focus:ring-[#C19A6B] rounded-md px-2 py-1 text-sm`}
                    role="menuitem"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#C19A6B] transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </a>
                </Link>
              );
            })}
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
              className={`p-2 transition-all duration-300 text-[#583B1F] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C19A6B] ${
                isScrolled && !isMobileMenuOpen ? 'bg-[#F8F5F0]/60 backdrop-blur-sm hover:bg-[#F8F5F0]/80' : ''
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop: Busca e Botão */}          <div className="hidden md:flex items-center space-x-4">
            <HeaderSearchInline />
            <Link href="/" legacyBehavior>
              <a className="px-4 py-1.5 rounded-md border border-[#735B43] text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-all duration-300 text-sm shadow-sm hover:shadow-md">
                Voltar ao Site Principal
              </a>
            </Link>          </div>
        </nav>
        
        {/* Menu Mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-[400px] bg-[#F8F5F0] shadow-md' : 'max-h-0'
        }`}>
          <div className="container mx-auto px-4 py-3 space-y-2">
            {['categorias', 'artigos', 'materiais', 'midias', 'sobre', 'contato'].map((item) => {
              // Detectar se o link está ativo (URL atual)
              const isActive = typeof window !== 'undefined' && 
                window.location.pathname.includes(`/blogflorescerhumano/${item}`);
                
              return (
                <Link key={item} href={`/blogflorescerhumano/${item}`} legacyBehavior>
                  <a className={`block py-2 ${isActive ? 'text-[#C19A6B] font-medium' : 'text-[#583B1F]'} hover:text-[#C19A6B] transition-colors duration-300 border-b border-[#F0EBE2]`}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </Link>
              );
            })}
            <Link href="/" legacyBehavior>
              <a className="block py-2 px-4 my-2 rounded-md border border-[#735B43] text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-all duration-300 text-center shadow-sm hover:shadow-md">
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
