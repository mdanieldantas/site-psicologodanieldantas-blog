'use client';

// Componente Header específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogHeader.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Share2 } from 'lucide-react';
import HeaderSearchInline from './HeaderSearchInline';
import { useIsHomePage } from '../hooks/useIsHomePage';
import { useRouter, usePathname } from 'next/navigation';

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal de fallback
  const isHome = useIsHomePage();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Função auxiliar para verificar se um link está ativo (usando o pathname do Next.js)
  const isLinkActive = (item: string) => {
    return pathname ? pathname.includes(`/blogflorescerhumano/${item}`) : false;
  };

  // Função para compartilhar usando a API Web Share nativa
  const handleNativeShare = async () => {
    // Título dinâmico: usando o título da página ou um default
    const title = document.title || 'Florescer Humano';
    // URL atual
    const url = window.location.href;
    // Resumo opcional (pode ser personalizado com meta description ou texto estático)
    const summary = 'Conteúdo do Blog Florescer Humano sobre psicologia, autoconhecimento e desenvolvimento pessoal.';

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: summary,
          url: url,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para o modal quando a API não está disponível
      setIsModalOpen(true);
    }
  };
  
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
                  isScrolled && isMobile ? 'opacity-0' : 'opacity-100'
                }`}>
                  <Image
                    src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.webp"
                    alt="Logo Florescer Humano"
                    width={140}
                    height={35}
                    priority
                  />
                </div>
              ) : (
                /* Ícone compacto apenas para mobile quando rolado */                <div className="flex items-center justify-center h-10">                  {/* Solução baseada na documentação oficial do Next.js para manter proporção */}
                  <Image
                    src="/blogflorescerhumano/logos-blog/icone-florescer-humano.webp"
                    alt="Ícone Florescer Humano"
                    width={36}
                    height={36}
                    priority
                    className="drop-shadow-sm"
                    style={{ 
                      maxWidth: "100%",
                      height: "auto" // Mantém a proporção automaticamente
                    }}
                  />
                </div>
              )}
            </a>
          </Link>
          
          {/* Links de navegação - Desktop */}          <div className="hidden md:flex space-x-6" role="menubar">
            {['categorias', 'artigos', 'materiais', 'midias', 'sobre', 'contato'].map((item) => {
              // Usando a função auxiliar para consistência
              const isActive = isLinkActive(item);
              
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
            })}          </div>          {/* Mobile: Lupa, Compartilhamento e Menu Hambúrguer */}
          <div className={`flex md:hidden items-center space-x-2 transition-all duration-300`}>
            <div className={`relative transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}>
              <HeaderSearchInline />
            </div>
            
            {/* Botão de Compartilhamento */}
            <button 
              onClick={handleNativeShare}
              className={`p-1.5 transition-all duration-300 focus:outline-none 
                focus:ring-2 focus:ring-[#C19A6B]/70 active:scale-95
                text-[#583B1F] hover:text-[#C19A6B]`}
              aria-label="Compartilhar página"
            >
              <Share2 className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} />            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 transition-all duration-300 focus:outline-none 
                focus:ring-2 focus:ring-[#C19A6B]/70 active:scale-95
                ${isMobileMenuOpen 
                  ? 'text-[#C19A6B]' 
                  : 'text-[#583B1F] hover:text-[#C19A6B]'
                }`}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              ref={buttonRef}
             
            >              {isMobileMenuOpen 
                ? <X className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} /> 
                : <Menu className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} />
              }
            </button>
          </div>{/* Desktop: Busca e Botão */}          <div className="hidden md:flex items-center space-x-4">
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
              // Usando a função auxiliar para consistência
              const isActive = isLinkActive(item);
                
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
            })}            <div className="pt-3">              <Link href="/" legacyBehavior>
                <a 
                  className="mt-4 py-3.5 px-5 rounded-lg bg-[#C19A6B]/90 text-center text-white font-medium hover:bg-[#735B43] hover:text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-[#C19A6B]/20"
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
      
      {/* Modal de Compartilhamento para Fallback */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#583B1F]">Compartilhar</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#583B1F] hover:text-[#C19A6B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Botões de compartilhamento para redes sociais comuns */}
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </a>
                <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title || 'Florescer Humano')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </a>
                <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${document.title || 'Florescer Humano'} ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </a>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <input 
                  type="text" 
                  value={window.location.href} 
                  className="flex-1 border rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C19A6B]"
                  readOnly 
                />                <button 
                  onClick={(e) => {
                    const button = e.currentTarget;
                    navigator.clipboard.writeText(window.location.href);
                    
                    // Feedback visual temporário
                    button.textContent = "Copiado!";
                    button.classList.add("bg-green-600");
                    
                    setTimeout(() => {
                      button.textContent = "Copiar";
                      button.classList.remove("bg-green-600");
                    }, 2000);
                  }}
                  className="bg-[#C19A6B] text-white px-3 py-2 rounded-r hover:bg-[#583B1F] transition-colors text-sm"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogHeader;
