'use client';

// Componente Header específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogHeader.tsx
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import HeaderSearchInline from './HeaderSearchInline';
import { useIsHomePage } from '../hooks/useIsHomePage';
import { useRouter, usePathname } from 'next/navigation';

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isHome = useIsHomePage();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
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
    // Fechar o menu quando o usuário navega para outra página
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Fechar o menu quando o usuário clica fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen && 
        menuRef.current && 
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
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
    <>      <header        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'h-[54px]' : 'h-[70px]'
        } ${
          isHome 
            ? isMobileMenuOpen 
              ? 'bg-[#F8F5F0] shadow-none border-b-0'              : isScrolled
                ? 'md:bg-[#F8F5F0]/75 md:backdrop-blur-lg md:shadow-sm bg-[#F8F5F0]/20 backdrop-blur-md shadow-sm border-b border-[#F8F5F0]/30' 
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
            <div className={`relative transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}>
              <HeaderSearchInline />
            </div>            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 transition-all duration-300 focus:outline-none 
                focus:ring-2 focus:ring-[#C19A6B]/70 active:scale-95
                ${isMobileMenuOpen 
                  ? 'text-[#C19A6B]' 
                  : 'text-[#583B1F] hover:text-[#C19A6B]'
                }`}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              ref={buttonRef}
             
            >
              {isMobileMenuOpen 
                ? <X className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} /> 
                : <Menu className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} />
              }
            </button>
          </div>          {/* Desktop: Busca e Botão */}          <div className="hidden md:flex items-center space-x-4">
            <div className="relative self-stretch flex items-center">
              <HeaderSearchInline />
            </div>            <Link href="/" legacyBehavior>
              <a className="px-4 py-2 rounded-md bg-[#C19A6B]/90 text-white font-medium hover:bg-[#735B43] hover:text-white transition-all duration-300 text-sm shadow-md hover:shadow-lg flex items-center gap-2 border border-[#C19A6B]/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao Site Psi Daniel Dantas
              </a>
            </Link></div>        </nav>          {/* Menu Mobile */}        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out -mt-[2px] border-t-0 ${
          isMobileMenuOpen 
            ? 'max-h-[500px] opacity-100 bg-gradient-to-b from-[#F8F5F0] to-[#F8F5F0]/95 backdrop-blur-md shadow-md border-t-0' 
            : 'max-h-0 opacity-0'
        }`}
        ref={menuRef}
        >          <div className="container mx-auto px-4 py-4 space-y-3">
            {['categorias', 'artigos', 'materiais', 'midias', 'sobre', 'contato'].map((item, index) => {
              // Detectar se o link está ativo (URL atual)
              const isActive = typeof window !== 'undefined' && 
                window.location.pathname.includes(`/blogflorescerhumano/${item}`);
                
              return (
                <Link key={item} href={`/blogflorescerhumano/${item}`} legacyBehavior>
                  <a 
                    className={`block relative px-3 py-3 rounded-lg ${
                      isActive 
                        ? 'text-[#C19A6B] font-medium bg-[#F0EBE2]/40' 
                        : 'text-[#583B1F]'
                    } hover:text-[#C19A6B] hover:bg-[#F0EBE2]/30 active:scale-[0.98] transition-all duration-300`}
                    style={{
                      animationDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                      animation: isMobileMenuOpen ? 'fadeInUp 0.4s ease forwards' : 'none'
                    }}
                  >
                    <div className="flex items-center">
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                      {isActive && (
                        <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#C19A6B]"></span>
                      )}
                    </div>
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-[#C19A6B]"></span>
                    )}
                  </a>
                </Link>
              );
            })}            <div className="pt-3">
              <Link href="/" legacyBehavior>
                <a 
                  className="mt-4 block py-3.5 px-5 rounded-lg bg-[#C19A6B]/90 text-center text-white font-medium hover:bg-[#735B43] hover:text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-[#C19A6B]/20"
                  style={{
                    animation: isMobileMenuOpen ? 'fadeInUp 0.4s 300ms ease forwards' : 'none'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar ao Site Psi Daniel Dantas
                </a>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default BlogHeader;
