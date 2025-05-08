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
  const [isMobile, setIsMobile] = useState(false);
  const isHome = useIsHomePage();
  
  // Detectar tamanho da tela
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificação inicial
    checkIfMobile();
    
    // Atualizar ao redimensionar
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
    // Fechar menu mobile somente em situações específicas
  useEffect(() => {
    // Apenas fechamos o menu quando há uma mudança de rolagem
    // e não quando o usuário clica explicitamente para abrir
    if (isScrolled && isMobileMenuOpen) {
      const timer = setTimeout(() => {
        setIsMobileMenuOpen(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isScrolled]);// Utilizando useCallback para memorizar a função de debounce
  const handleScroll = React.useCallback(() => {
    const checkScroll = () => setIsScrolled(window.scrollY > 20); // Reduzimos o limiar para ativar mais cedo
    
    // Criamos um pequeno delay para melhorar a performance
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(checkScroll, 8);
  }, []);

  // Verificar o scroll ao carregar a página
  useEffect(() => {
    // Verificação inicial
    handleScroll();
    
    // Adicionar listener de evento
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  return (
    <>      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'h-[54px]' : 'h-[70px]'
        } ${
          isHome 
            ? isMobileMenuOpen 
              ? 'bg-[#F8F5F0] shadow-sm'              : isScrolled
                ? 'md:bg-[#F8F5F0]/80 md:backdrop-blur-lg md:shadow-sm bg-[#F8F5F0]/30 backdrop-blur-sm shadow-sm' 
                : 'bg-[#F8F5F0]'
            : 'bg-[#F8F5F0]'
        }`}
        role="banner"
        aria-label="Cabeçalho do blog"
      >        <nav 
          className={`container mx-auto px-4 ${isScrolled ? 'py-2' : 'py-3'} flex items-center justify-between transition-all duration-300`}
          role="navigation"
          aria-label="Navegação principal"
        >
          {/* Logo do Blog */}          <Link href="/blogflorescerhumano" legacyBehavior>
            <a 
              className={`flex items-center gap-2 hover:opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] rounded-md ${
                isScrolled && !isMobileMenuOpen 
                  ? 'md:opacity-100 drop-shadow-sm' 
                  : 'opacity-100 visible drop-shadow-sm'
              }`}
              aria-label="Ir para página inicial do blog"
            >              {/* Logo responsiva - alternando entre logo completa e ícone */}
              {(!isScrolled || !isMobile) ? (
                /* Logo completa para desktop ou mobile quando não está rolado */
                <div className={`overflow-hidden transition-all duration-300 ${
                  isScrolled && isMobile ? 'max-h-0 opacity-0' : 'max-h-[40px] opacity-100'
                }`}>
                  <Image
                    src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.png"
                    alt="Logo Florescer Humano"
                    width={isScrolled ? 130 : 140}
                    height={isScrolled ? 32 : 35}
                    priority
                    className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}
                    sizes="(max-width: 768px) 120px, 140px"
                  />
                </div>
              ) : (
                /* Ícone compacto apenas para mobile quando rolado */                <div className="flex items-center justify-center h-10">                  <Image
                    src="/blogflorescerhumano/logos-blog/icone-florescer-humano.png"
                    alt="Ícone Florescer Humano"
                    width={36}
                    height={36}
                    priority
                    className="transition-all duration-300 animate-fadeIn drop-shadow-sm"
                  />
                </div>
              )}
            </a>
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
          </div>          {/* Mobile: Lupa e Menu Hambúrguer */}
          <div className={`flex md:hidden items-center space-x-3 transition-all duration-300`}>
            <div className={`relative transition-all duration-300 ${
              isScrolled && !isMobileMenuOpen 
                ? 'bg-[#F8F5F0]/70 backdrop-blur-lg shadow-sm' 
                : 'bg-[#F8F5F0]/40 backdrop-blur-sm'
            } rounded-full p-1`}>
              <HeaderSearchInline />
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-all duration-300 text-[#583B1F] rounded-full focus:outline-none 
                focus:ring-2 focus:ring-[#C19A6B]/70 ${
                isScrolled && !isMobileMenuOpen 
                  ? 'bg-[#F8F5F0]/70 backdrop-blur-lg shadow-sm hover:bg-[#F8F5F0]/90' 
                  : 'bg-[#F8F5F0]/40 hover:bg-[#F8F5F0]/60 backdrop-blur-sm'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen 
                ? <X className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} /> 
                : <Menu className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} />
              }
            </button>
          </div>          {/* Desktop: Busca e Botão */}          <div className="hidden md:flex items-center space-x-4">
            <div className="relative self-stretch flex items-center">
              <HeaderSearchInline />
            </div>
            <Link href="/" legacyBehavior>
              <a className="px-4 py-1.5 rounded-md border border-[#735B43] text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-all duration-300 text-sm shadow-sm hover:shadow-md">
                Voltar ao Site Principal
              </a>
            </Link>          </div>
        </nav>          {/* Menu Mobile */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-[400px] opacity-100 bg-gradient-to-b from-[#F8F5F0] to-[#F8F5F0]/95 backdrop-blur-md shadow-md' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-4 py-3 space-y-1">
            {['categorias', 'artigos', 'materiais', 'midias', 'sobre', 'contato'].map((item) => {
              // Detectar se o link está ativo (URL atual)
              const isActive = typeof window !== 'undefined' && 
                window.location.pathname.includes(`/blogflorescerhumano/${item}`);
                
              return (
                <Link key={item} href={`/blogflorescerhumano/${item}`} legacyBehavior>
                  <a className={`block py-2.5 ${
                    isActive 
                      ? 'text-[#C19A6B] font-medium' 
                      : 'text-[#583B1F]'
                    } hover:text-[#C19A6B] transition-all duration-300 border-b border-[#F0EBE2]/70 ${
                      isActive ? 'border-[#C19A6B]/30' : ''
                    }`}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </Link>
              );
            })}
            <Link href="/" legacyBehavior>
              <a className="mt-3 block py-2 px-4 rounded-md border border-[#735B43] text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0] transition-all duration-300 text-center shadow-sm hover:shadow-md">
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
