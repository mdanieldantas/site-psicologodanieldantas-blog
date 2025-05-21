'use client';

// Componente Header específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogHeader.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Share2, Settings } from 'lucide-react';
import HeaderSearchInline from './HeaderSearchInline';
import { useIsHomePage } from '../hooks/useIsHomePage';
import { useRouter, usePathname } from 'next/navigation';

// Definições dos tamanhos de fonte
const FONT_SIZES = {
  sm: 0.9, // 90% do tamanho padrão
  md: 1,   // Tamanho padrão (100%)
  lg: 1.2, // 120% do tamanho padrão
  xl: 1.4, // 140% do tamanho padrão
};

// Definições dos modos de contraste
const CONTRAST_MODES = {
  normal: 'Padrão',
  highContrast: 'Alto Contraste',
  darkMode: 'Modo Escuro'
};

// Interface para as preferências de usuário
interface UserPreferences {
  fontSize: keyof typeof FONT_SIZES;
  contrastMode: keyof typeof CONTRAST_MODES;
}

// Declare global para habilitar as funções diagnósticas e utilitárias no objeto window
declare global {
  interface Window {
    diagnosticarPreferencias?: () => {
      state: UserPreferences;
      storage: string | null;
      classes: {
        fontSize: string | undefined;
        contrast: string | undefined;
      };
      cssVars: {
        fontSizeMultiplier: string;
      };
    };
    forcarPreferencias?: () => void;
  }
}

const BlogHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal de fallback
  const [preferencesMenuOpen, setPreferencesMenuOpen] = useState(false);
  
  /**
   * Inicializa ou redefine as preferências de leitura do usuário
   * Pode ser chamada em situações onde as preferências precisam ser restauradas ao padrão
   */
  const inicializarPreferencias = useCallback(() => {
    // Definir valores padrão
    const defaultPrefs: UserPreferences = {
      fontSize: 'md',
      contrastMode: 'normal'
    };
    
    try {
      // Tentar carregar do localStorage primeiro
      const savedPrefs = localStorage.getItem('userReadingPreferences');
      if (savedPrefs) {
        const parsedPrefs = JSON.parse(savedPrefs) as UserPreferences;
        
        // Validar se tem os valores esperados antes de usar
        if (parsedPrefs && 
            parsedPrefs.fontSize && 
            parsedPrefs.contrastMode && 
            Object.keys(FONT_SIZES).includes(parsedPrefs.fontSize) &&
            Object.keys(CONTRAST_MODES).includes(parsedPrefs.contrastMode)) {
          
          // Aplicar propriedades válidas
          return parsedPrefs;
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar preferências:', error);
    }
    
    // Se não houver preferências salvas ou se forem inválidas, usar padrões
    return defaultPrefs;
  }, []);
  
  // Inicializar estado com função que valida as preferências salvas
  const [preferences, setPreferences] = useState<UserPreferences>(inicializarPreferencias);
  const [prefsInitialized, setPrefsInitialized] = useState(false);
  
  const isHome = useIsHomePage();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefsMenuRef = useRef<HTMLDivElement>(null);
  const preferencesBtnRef = useRef<HTMLButtonElement>(null);
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
    setPreferencesMenuOpen(false);
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
      
      // Fechar menu de preferências ao clicar fora
      if (
        preferencesMenuOpen &&
        prefsMenuRef.current &&
        preferencesBtnRef.current &&
        !prefsMenuRef.current.contains(event.target as Node) &&
        !preferencesBtnRef.current.contains(event.target as Node)
      ) {
        setPreferencesMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, preferencesMenuOpen]);
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

  // Efeito para carregar preferências do localStorage quando o componente montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPrefs = localStorage.getItem('userReadingPreferences');
        if (savedPrefs) {
          // Parsear as preferências salvas
          const parsedPrefs = JSON.parse(savedPrefs) as UserPreferences;
          
          // Verificar se os valores são válidos antes de aplicar
          if (parsedPrefs.fontSize && Object.keys(FONT_SIZES).includes(parsedPrefs.fontSize)) {
            // Aplicar tamanho de fonte
            document.documentElement.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
            document.documentElement.classList.add(`font-size-${parsedPrefs.fontSize}`);
          }
          
          if (parsedPrefs.contrastMode && Object.keys(CONTRAST_MODES).includes(parsedPrefs.contrastMode)) {
            // Aplicar contraste
            document.documentElement.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
            const contrastClass = 
              parsedPrefs.contrastMode === 'normal' ? 'contrast-normal' : 
              parsedPrefs.contrastMode === 'highContrast' ? 'contrast-high' : 'contrast-dark';
            document.documentElement.classList.add(contrastClass);
          }
          
          // Atualizar estado com preferências salvas
          setPreferences(parsedPrefs);
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
      setPrefsInitialized(true);
    }
  }, []);
  // Efeito para aplicar preferências quando elas mudarem
  useEffect(() => {
    if (!prefsInitialized) return;
    
    console.log('Aplicando preferências após mudança de estado:', preferences);
    
    // Remover todas as classes de tamanho de fonte anteriores
    document.documentElement.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
    // Adicionar a nova classe de tamanho de fonte
    const fontSizeClass = `font-size-${preferences.fontSize}`;
    console.log(`Adicionando classe de fonte: ${fontSizeClass}`);
    document.documentElement.classList.add(fontSizeClass);
    
    // Remover todas as classes de contraste anteriores
    document.documentElement.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    // Adicionar a nova classe de contraste
    const contrastClass = 
      preferences.contrastMode === 'normal' ? 'contrast-normal' : 
      preferences.contrastMode === 'highContrast' ? 'contrast-high' : 
      'contrast-dark';
    
    console.log(`Adicionando classe de contraste: ${contrastClass}`);
    document.documentElement.classList.add(contrastClass);
    
    // Salvar preferências no localStorage para persistência
    try {
      localStorage.setItem('userReadingPreferences', JSON.stringify(preferences));
      console.log('Preferências salvas no localStorage');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  }, [preferences, prefsInitialized]);

  // Adicionando uma verificação periódica para garantir que as preferências sejam mantidas
  // Isso é especialmente útil em caso de carregamentos dinâmicos que possam sobrescrever nossas preferências
  useEffect(() => {
    if (!prefsInitialized) return;
    
    // Verificação inicial após montagem do componente
    const enforcePreferences = () => {
      console.log('Verificando e reforçando preferências...');
      
      // Verificar se as classes foram mantidas
      const fontSizeClass = `font-size-${preferences.fontSize}`;
      const contrastClass = 
        preferences.contrastMode === 'normal' ? 'contrast-normal' : 
        preferences.contrastMode === 'highContrast' ? 'contrast-high' : 
        'contrast-dark';
      
      const hasFontClass = document.documentElement.classList.contains(fontSizeClass);
      const hasContrastClass = document.documentElement.classList.contains(contrastClass);
      
      // Verificar se as variáveis CSS estão corretas
      const styles = getComputedStyle(document.documentElement);
      const currentFontSize = styles.getPropertyValue('--font-size-multiplier').trim();
      const expectedFontSize = `${FONT_SIZES[preferences.fontSize]}`;
      
      // Se alguma preferência foi perdida, reaplique
      if (!hasFontClass || currentFontSize !== expectedFontSize) {
        console.log('Reforçando preferência de tamanho de fonte:', preferences.fontSize);
        applyFontSize(preferences.fontSize);
      }
      
      if (!hasContrastClass) {
        console.log('Reforçando preferência de contraste:', preferences.contrastMode);
        applyContrastMode(preferences.contrastMode);
      }
    };
    
    // Verificar logo após 1 segundo para dar tempo ao navegador de processar o CSS
    const initialCheck = setTimeout(enforcePreferences, 1000);
    
    // Verificação periódica a cada 3 segundos
    const interval = setInterval(enforcePreferences, 3000);
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, [preferences, prefsInitialized]);

  // Efeito para fechar o menu de preferências ao pressionar Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreferencesMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);  // Remover as referências aos timeouts que não estamos mais usando
  useEffect(() => {
    return () => {
      // Limpar todos os timeouts e intervalos para evitar memory leaks na desmontagem do componente
      if (fontSizeTimeoutRef.current) {
        clearTimeout(fontSizeTimeoutRef.current);
        fontSizeTimeoutRef.current = null;
      }
      if (contrastModeTimeoutRef.current) {
        clearTimeout(contrastModeTimeoutRef.current);
        contrastModeTimeoutRef.current = null;
      }
    };
  }, []);
  // Função para manipular teclas de setas nos botões de preferências
  const handlePreferenceKeyDown = (event: React.KeyboardEvent) => {
    // Suporte a teclas de seta para navegação de preferências
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      // Navegar pelos tamanhos de fonte
      if (event.currentTarget.getAttribute('aria-label')?.includes('Tamanho da fonte')) {
        const sizes: (keyof typeof FONT_SIZES)[] = ['sm', 'md', 'lg', 'xl'];
        const currentIndex = sizes.indexOf(preferences.fontSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        applyFontSize(sizes[nextIndex]);
        event.preventDefault();
      }
      // Navegar pelos modos de contraste
      else if (event.currentTarget.getAttribute('aria-label')?.includes('Modo de contraste')) {
        const modes = Object.keys(CONTRAST_MODES) as Array<keyof typeof CONTRAST_MODES>;
        const currentIndex = modes.indexOf(preferences.contrastMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        applyContrastMode(modes[nextIndex]);
        event.preventDefault();
      }
    }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      // Navegar pelos tamanhos de fonte
      if (event.currentTarget.getAttribute('aria-label')?.includes('Tamanho da fonte')) {
        const sizes: (keyof typeof FONT_SIZES)[] = ['sm', 'md', 'lg', 'xl'];
        const currentIndex = sizes.indexOf(preferences.fontSize);
        const prevIndex = (currentIndex - 1 + sizes.length) % sizes.length;
        applyFontSize(sizes[prevIndex]);
        event.preventDefault();
      }
      // Navegar pelos modos de contraste
      else if (event.currentTarget.getAttribute('aria-label')?.includes('Modo de contraste')) {
        const modes = Object.keys(CONTRAST_MODES) as Array<keyof typeof CONTRAST_MODES>;
        const currentIndex = modes.indexOf(preferences.contrastMode);
        const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
        applyContrastMode(modes[prevIndex]);
        event.preventDefault();
      }
    }
  };

  // Função para feedback visual quando as preferências são alteradas com suporte aprimorado a leitores de tela
  const provideFeedback = (message: string) => {
    // Remover qualquer feedback anterior que possa existir
    const existingFeedback = document.getElementById('preferences-feedback');
    if (existingFeedback) {
      document.body.removeChild(existingFeedback);
    }
    
    // Criar um elemento de feedback
    const feedbackEl = document.createElement('div');
    feedbackEl.id = 'preferences-feedback';
    feedbackEl.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#583B1F] text-white py-2 px-4 rounded-md shadow-lg z-50';
    feedbackEl.setAttribute('role', 'status');
    feedbackEl.setAttribute('aria-live', 'polite');
    feedbackEl.style.opacity = '0';
    feedbackEl.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
    feedbackEl.style.transform = 'translate(-50%, 10px)';
    
    // Adicionar ícone para melhorar visibilidade (opcional)
    feedbackEl.innerHTML = `
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>${message}</span>
      </div>
    `;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(feedbackEl);
    
    // Aplicar fade-in após um pequeno delay (para dar tempo ao browser de processar)
    setTimeout(() => {
      feedbackEl.style.opacity = '1';
      feedbackEl.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // Remover após 2 segundos
    setTimeout(() => {
      feedbackEl.style.opacity = '0';
      feedbackEl.style.transform = 'translate(-50%, 10px)';
      
      // Remover elemento do DOM após a animação terminar
      setTimeout(() => {
        if (document.body.contains(feedbackEl)) {
          document.body.removeChild(feedbackEl);
        }
      }, 300);
    }, 2000);
  };
    // Referências que serão usadas para controle de estado dos botões
  // mas não mais para debounce já que removemos o timeout
  const fontSizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contrastModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);  // Função para aplicar tamanho de fonte - abordagem aprimorada com força bruta
  const applyFontSize = (size: keyof typeof FONT_SIZES) => {
    console.log(`Aplicando tamanho de fonte: ${size}`);
    
    // Evitar operações desnecessárias se o tamanho já for o mesmo
    if (preferences.fontSize === size) {
      console.log(`Tamanho já está em ${size}, ignorando.`);
      return;
    }

    const sizeName = size === 'sm' ? 'pequeno' : size === 'md' ? 'médio' : size === 'lg' ? 'grande' : 'muito grande';
    
    // FORÇA BRUTA: Criar um estilo inline e injetá-lo no head do documento
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      :root {
        --font-size-multiplier: ${FONT_SIZES[size]} !important;
      }
      
      /* Aplicar diretamente aos elementos mais importantes */
      body {
        font-size: calc(1rem * ${FONT_SIZES[size]}) !important;
      }
      
      /* Garantir que títulos mantenham sua proporção relativa */
      h1, .h1 { font-size: calc(2rem * ${FONT_SIZES[size]}) !important; }
      h2, .h2 { font-size: calc(1.8rem * ${FONT_SIZES[size]}) !important; }
      h3, .h3 { font-size: calc(1.5rem * ${FONT_SIZES[size]}) !important; }
      h4, .h4 { font-size: calc(1.25rem * ${FONT_SIZES[size]}) !important; }
      h5, .h5 { font-size: calc(1.125rem * ${FONT_SIZES[size]}) !important; }
      h6, .h6 { font-size: calc(1rem * ${FONT_SIZES[size]}) !important; }
      
      /* Classes específicas de títulos em blogs */
      .article-title { font-size: calc(2.25rem * ${FONT_SIZES[size]}) !important; }
      .article-subtitle { font-size: calc(1.5rem * ${FONT_SIZES[size]}) !important; }
      
      /* Garantir que os elementos mais comuns de conteúdo sejam afetados */
      main p, main li,
      article p, article li,
      .article-content p, .article-content li,
      .blog-post-content p, .blog-post-content li,
      .post p, .post li,
      .content-area p, .content-area li {
        font-size: calc(var(--font-size-multiplier) * 1em) !important;
      }
    `;
    
    // Remover qualquer estilo anterior injetado
    const oldStyle = document.getElementById('dynamic-font-size');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // Adicionar ID para referência futura
    styleEl.id = 'dynamic-font-size';
    document.head.appendChild(styleEl);
    
    // Aplicação tradicional das classes para compatibilidade
    document.documentElement.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
    document.documentElement.classList.add(`font-size-${size}`);
    
    // Forçar um pequeno reflow para garantir que as mudanças sejam aplicadas
    void document.documentElement.offsetHeight;
    
    // Garantir que a classe seja aplicada no body também para maior compatibilidade
    document.body.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
    document.body.classList.add(`font-size-${size}`);
    
    // Atualizar o estado
    setPreferences(prev => ({ ...prev, fontSize: size }));
    
    // Tentar salvar no localStorage imediatamente
    try {
      localStorage.setItem('userReadingPreferences', JSON.stringify({
        ...preferences,
        fontSize: size
      }));
      console.log('Preferência de tamanho salva com sucesso:', size);
    } catch (error) {
      console.error('Erro ao salvar preferência de tamanho:', error);
    }
    
    // Mostrar feedback visual
    provideFeedback(`Tamanho da fonte ${sizeName} aplicado`);
  };  // Função para aplicar modo de contraste - implementação aprimorada com abordagem agressiva
  const applyContrastMode = (mode: keyof typeof CONTRAST_MODES) => {
    console.log(`Aplicando modo de contraste: ${mode}`);
    
    // Evitar operações desnecessárias se o modo já for o mesmo
    if (preferences.contrastMode === mode) {
      console.log(`Contraste já está em ${mode}, ignorando.`);
      return;
    }

    const contrastClass = 
      mode === 'normal' ? 'contrast-normal' : 
      mode === 'highContrast' ? 'contrast-high' : 
      'contrast-dark';

    // ABORDAGEM ULTRA-AGRESSIVA: Aplicar estilos diretamente com a maior especificidade possível
    const styleEl = document.createElement('style');
    
    if (mode === 'normal') {
      // Modo normal - cores padrão
      styleEl.textContent = `
        :root {
          --text-primary: #583B1F !important;
          --text-secondary: #735B43 !important;
          --background-primary: #F8F5F0 !important;
          --link-color: #C19A6B !important;
        }
        
        html, body {
          color-scheme: light !important;
          background-color: #F8F5F0 !important;
          color: #583B1F !important;
        }
        
        html.contrast-normal body,
        html.contrast-normal main,
        html.contrast-normal article,
        html.contrast-normal section,
        html.contrast-normal header,
        html.contrast-normal footer,
        html.contrast-normal div.bg-\\[\\#F8F5F0\\],
        html.contrast-normal \\[class\\*\\=\\"bg-\\[\\#F8F5F0\\]\\"\\] {
          background-color: #F8F5F0 !important;
          color: #583B1F !important;
        }
        
        html.contrast-normal a:not(.btn):not(.button) {
          color: #C19A6B !important;
        }
      `;
    } else if (mode === 'highContrast') {
      // Alto contraste
      styleEl.textContent = `
        :root {
          --text-primary: #000000 !important;
          --text-secondary: #333333 !important;
          --background-primary: #FFFFFF !important;
          --link-color: #0000CC !important;
        }
        
        html, body {
          color-scheme: light !important;
          background-color: white !important;
          color: black !important;
        }
        
        html.contrast-high body,
        html.contrast-high main,
        html.contrast-high article,
        html.contrast-high section,
        html.contrast-high header,
        html.contrast-high nav,
        html.contrast-high footer,
        html.contrast-high div,
        html.contrast-high aside,
        html.contrast-high p,
        html.contrast-high span,
        html.contrast-high h1,
        html.contrast-high h2,
        html.contrast-high h3,
        html.contrast-high h4,
        html.contrast-high h5,
        html.contrast-high h6 {
          background-color: white !important;
          color: black !important;
          border-color: black !important;
        }
        
        html.contrast-high a:not(.btn):not(.button) {
          color: #0000CC !important;
          text-decoration: underline !important;
          text-underline-offset: 2px !important;
        }
        
        html.contrast-high button, 
        html.contrast-high .button,
        html.contrast-high .btn {
          border: 2px solid black !important;
          background: white !important;
          color: black !important;
          font-weight: bold !important;
        }
        
        html.contrast-high img, 
        html.contrast-high svg,
        html.contrast-high video {
          filter: grayscale(100%) contrast(120%) !important;
        }
      `;
    } else { // darkMode
      // Modo escuro
      styleEl.textContent = `
        :root {
          --text-primary: #FFFFFF !important;
          --text-secondary: #CCCCCC !important;
          --background-primary: #121212 !important;
          --link-color: #93C5FD !important;
        }
        
        html, body {
          color-scheme: dark !important;
          background-color: #121212 !important;
          color: #FFFFFF !important;
        }
        
        html.contrast-dark body,
        html.contrast-dark main,
        html.contrast-dark article,
        html.contrast-dark section,
        html.contrast-dark header,
        html.contrast-dark nav,
        html.contrast-dark footer,
        html.contrast-dark div,
        html.contrast-dark aside {
          background-color: #121212 !important;
          color: #FFFFFF !important;
          border-color: #333333 !important;
        }
        
        html.contrast-dark p,
        html.contrast-dark span,
        html.contrast-dark h1,
        html.contrast-dark h2,
        html.contrast-dark h3,
        html.contrast-dark h4,
        html.contrast-dark h5,
        html.contrast-dark h6,
        html.contrast-dark li {
          color: #FFFFFF !important;
        }
        
        html.contrast-dark a:not(.btn):not(.button) {
          color: #93C5FD !important;
          text-decoration: underline !important;
          text-underline-offset: 2px !important;
        }
        
        html.contrast-dark button, 
        html.contrast-dark .button,
        html.contrast-dark .btn {
          border: 2px solid #FFFFFF !important;
        }
        
        html.contrast-dark img, 
        html.contrast-dark svg {
          filter: brightness(0.8) contrast(1.2) !important;
        }
      `;
    }
    
    // Remover qualquer estilo anterior injetado
    const oldStyle = document.getElementById('dynamic-contrast-mode');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    // Adicionar ID para referência futura
    styleEl.id = 'dynamic-contrast-mode';
    document.head.appendChild(styleEl);
    
    // Aplicação tradicional das classes para compatibilidade
    document.documentElement.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    console.log(`Adicionando classe de contraste: ${contrastClass}`);
    document.documentElement.classList.add(contrastClass);
    
    // Aplicar também ao body para maior compatibilidade
    document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    document.body.classList.add(contrastClass);
    
    // Forçar um reflow mais agressivo para garantir que as mudanças sejam aplicadas
    void document.documentElement.offsetHeight;
    void document.body.offsetHeight;
    
    // Verificar se mudanças foram aplicadas e tentar novamente se necessário
    setTimeout(() => {
      const computedBodyBg = window.getComputedStyle(document.body).backgroundColor;
      const expectedBg = mode === 'normal' ? 'rgb(248, 245, 240)' : 
                         mode === 'highContrast' ? 'rgb(255, 255, 255)' : 
                         'rgb(18, 18, 18)';
      
      if (!document.documentElement.classList.contains(contrastClass) || 
          !computedBodyBg.includes(expectedBg.split(' ')[0])) {
        console.warn('Contraste não foi aplicado corretamente. Tentando novamente...');
        
        // Aplicar novamente as classes
        document.documentElement.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
        document.documentElement.classList.add(contrastClass);
        document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
        document.body.classList.add(contrastClass);
        
        // Forçar outro reflow
        void document.documentElement.offsetHeight;
        void document.body.offsetHeight;
      }
    }, 50);
    
    // Atualizar o estado
    setPreferences(prev => ({ ...prev, contrastMode: mode }));
    
    // Tentar salvar no localStorage imediatamente
    try {
      localStorage.setItem('userReadingPreferences', JSON.stringify({
        ...preferences,
        contrastMode: mode
      }));
      console.log('Preferência de contraste salva com sucesso:', mode);
    } catch (error) {
      console.error('Erro ao salvar preferência de contraste:', error);
    }
    
    // Mostrar feedback visual
    provideFeedback(`Modo ${CONTRAST_MODES[mode]} aplicado`);
  };

  // Função para alternar o menu de preferências
  const togglePreferencesMenu = () => {
    setPreferencesMenuOpen(!preferencesMenuOpen);
  };
  // Função para garantir que as preferências sejam aplicadas corretamente
  const forceApplyPreferences = useCallback(() => {
    if (!prefsInitialized) return;
    
    console.log('Forçando aplicação de todas as preferências');
    
    // Técnica mais agressiva para garantir a aplicação
    // Primeiro remover todas as classes relacionadas a preferências
    document.documentElement.classList.remove(
      'font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl',
      'contrast-normal', 'contrast-high', 'contrast-dark'
    );
    
    document.body.classList.remove(
      'font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl',
      'contrast-normal', 'contrast-high', 'contrast-dark'
    );
    
    // Pequena pausa para garantir que o DOM processou as mudanças
    setTimeout(() => {
      // Aplicar tamanho de fonte
      applyFontSize(preferences.fontSize);
      
      // Pequena pausa entre as aplicações para evitar conflitos
      setTimeout(() => {
        // Aplicar contraste
        applyContrastMode(preferences.contrastMode);
        
        // Verificação adicional após aplicar as preferências
        setTimeout(() => {
          // Verificar se as classes foram aplicadas corretamente
          const fontSizeClass = `font-size-${preferences.fontSize}`;
          const contrastClass = 
            preferences.contrastMode === 'normal' ? 'contrast-normal' : 
            preferences.contrastMode === 'highContrast' ? 'contrast-high' : 
            'contrast-dark';
            
          if (!document.documentElement.classList.contains(fontSizeClass) ||
              !document.documentElement.classList.contains(contrastClass)) {
            console.warn('Algumas preferências não foram aplicadas corretamente. Tentando novamente...');
            
            // Aplicar classes diretamente
            document.documentElement.classList.add(fontSizeClass);
            document.documentElement.classList.add(contrastClass);
            document.body.classList.add(fontSizeClass);
            document.body.classList.add(contrastClass);
            
            // Forçar reflow
            void document.documentElement.offsetHeight;
            void document.body.offsetHeight;
          }
        }, 100);
      }, 50);
    }, 10);
  }, [preferences, prefsInitialized, applyFontSize, applyContrastMode]);

  // Garantir que as preferências sejam aplicadas após a montagem completa do componente
  useEffect(() => {
    if (prefsInitialized) {
      // Pequeno atraso para garantir que o DOM esteja totalmente carregado
      const timer = setTimeout(() => {
        forceApplyPreferences();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [prefsInitialized, forceApplyPreferences]);

  // Adicionar comando global para depuração e forçar aplicação das preferências
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.forcarPreferencias = forceApplyPreferences;
      
      return () => {
        delete window.forcarPreferencias;
      };
    }
  }, [forceApplyPreferences]);

  // Função utilitária para diagnóstico de problemas com as preferências de leitura
  // Esta função pode ser chamada pelo console do navegador: window.diagnosticarPreferencias()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Função para diagnóstico de problemas com as preferências
      window.diagnosticarPreferencias = () => {
        console.group('Diagnóstico de Preferências de Leitura');
        
        // Verificar preferências no state
        console.log('Estado interno (React):', preferences);
        
        // Verificar localStorage
        try {
          const savedPrefs = localStorage.getItem('userReadingPreferences');
          console.log('localStorage:', savedPrefs ? JSON.parse(savedPrefs) : 'Não encontrado');
        } catch (error) {
          console.error('Erro ao ler localStorage:', error);
        }
        
        // Verificar classes aplicadas ao document
        const fontSizeClass = ['font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl']
          .find(cls => document.documentElement.classList.contains(cls));
        
        const contrastClass = ['contrast-normal', 'contrast-high', 'contrast-dark']
          .find(cls => document.documentElement.classList.contains(cls));
        
        console.log('Classes aplicadas:', {
          'Tamanho de fonte': fontSizeClass || 'Nenhum',
          'Modo de contraste': contrastClass || 'Nenhum'
        });
        
        // Verificar variáveis CSS computadas
        const styles = getComputedStyle(document.documentElement);
        console.log('Variável CSS --font-size-multiplier:', styles.getPropertyValue('--font-size-multiplier'));
        
        console.groupEnd();
        
        return {
          state: preferences,
          storage: localStorage.getItem('userReadingPreferences'),
          classes: {
            fontSize: fontSizeClass,
            contrast: contrastClass
          },
          cssVars: {
            fontSizeMultiplier: styles.getPropertyValue('--font-size-multiplier')
          }
        };
      };
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.diagnosticarPreferencias) {
        delete window.diagnosticarPreferencias;
      }
    };
  }, [preferences]);

  // Efeito para adicionar script de inicialização rápida das preferências salvas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Script que será executado o mais cedo possível
      const initScript = document.createElement('script');
      initScript.innerHTML = `
        (function() {
          try {
            // Tentar carregar preferências salvas do localStorage
            const savedPrefs = localStorage.getItem('userReadingPreferences');
            if (savedPrefs) {
              const prefs = JSON.parse(savedPrefs);
              
              if (prefs && prefs.fontSize) {
                // Aplicar tamanho da fonte
                document.documentElement.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
                document.documentElement.classList.add('font-size-' + prefs.fontSize);
                document.body.classList.add('font-size-' + prefs.fontSize);
                
                // Injetar estilo para garantir variáveis CSS
                const fontSizes = {
                  sm: 0.9,
                  md: 1,
                  lg: 1.2,
                  xl: 1.4
                };
                
                const styleEl = document.createElement('style');
                styleEl.id = 'early-font-size';
                styleEl.textContent = ':root { --font-size-multiplier: ' + fontSizes[prefs.fontSize] + ' !important; }';
                document.head.appendChild(styleEl);
              }
              
              if (prefs && prefs.contrastMode) {
                // Aplicar contraste
                const contrastClass = 
                  prefs.contrastMode === 'normal' ? 'contrast-normal' : 
                  prefs.contrastMode === 'highContrast' ? 'contrast-high' : 
                  'contrast-dark';
                
                document.documentElement.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
                document.documentElement.classList.add(contrastClass);
                document.body.classList.add(contrastClass);
                
                if (prefs.contrastMode === 'darkMode') {
                  document.documentElement.style.colorScheme = 'dark';
                }
              }
            }
          } catch (e) {
            console.error('Erro ao aplicar preferências iniciais:', e);
          }
        })();
      `;
      
      // Adicionar o script ao head para execução imediata
      document.head.appendChild(initScript);
      
      // Limpeza
      return () => {
        if (document.head.contains(initScript)) {
          document.head.removeChild(initScript);
        }
        
        const earlyStyle = document.getElementById('early-font-size');
        if (earlyStyle) {
          earlyStyle.remove();
        }
      };
    }
  }, []);

  // Adicionar script de diagnóstico para verificar se as preferências estão sendo aplicadas corretamente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Executar diagnóstico quando a página carregar completamente
      const handleLoad = () => {
        setTimeout(() => {
          console.group('🔍 Diagnóstico automático de preferências');
          
          // Verificar preferências no state
          console.log('Estado interno (React):', preferences);
          
          // Verificar localStorage
          try {
            const savedPrefs = localStorage.getItem('userReadingPreferences');
            console.log('localStorage:', savedPrefs ? JSON.parse(savedPrefs) : 'Não encontrado');
          } catch (error) {
            console.error('Erro ao ler localStorage:', error);
          }
          
          // Verificar classes aplicadas ao document
          const fontSizeClass = ['font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl']
            .find(cls => document.documentElement.classList.contains(cls));
          
          const contrastClass = ['contrast-normal', 'contrast-high', 'contrast-dark']
            .find(cls => document.documentElement.classList.contains(cls));
          
          console.log('Classes aplicadas:', {
            'Tamanho de fonte': fontSizeClass || 'Nenhum',
            'Modo de contraste': contrastClass || 'Nenhum'
          });
          
          // Verificar variáveis CSS computadas
          const styles = getComputedStyle(document.documentElement);
          console.log('Variável CSS --font-size-multiplier:', styles.getPropertyValue('--font-size-multiplier'));
          
          console.groupEnd();
        }, 1000);
      };
      
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [preferences]);

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
          className={`container mx-auto px-2 pr-1 ${isScrolled ? 'py-2' : 'py-3'} flex items-center justify-between transition-all duration-300`}
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
            })}
            
            {/* Botão de preferências de leitura - Desktop */}
            <div className="relative">
              <button
                ref={preferencesBtnRef}
                onClick={() => setPreferencesMenuOpen(!preferencesMenuOpen)}
                className="flex items-center justify-center p-2 text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] rounded-md"
                aria-label="Preferências de leitura"
                aria-expanded={preferencesMenuOpen}
              >
                <Settings size={18} />
              </button>
              
              {/* Menu de preferências - Desktop */}
        {preferencesMenuOpen && (
                <div 
                  ref={prefsMenuRef}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg z-50 p-4 border border-[#F0EBE2]"
                >
                  <h3 className="text-sm font-medium text-[#583B1F] mb-3">Preferências de Leitura</h3>
                  
                  {/* Controle de tamanho de fonte */}
                  <div className="mb-4">
                    <p className="text-xs text-[#735B43] mb-2">Tamanho da Fonte</p>
                    <div className="flex items-center justify-between gap-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Clique no botão de tamanho pequeno');
                          applyFontSize('sm');
                        }}
                        onKeyDown={handlePreferenceKeyDown}
                        className={`flex-1 px-2 py-1 text-xs rounded-md ${
                          preferences.fontSize === 'sm' 
                            ? 'bg-[#C19A6B] text-white' 
                            : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                        }`}
                        tabIndex={0}
                        aria-label="Tamanho da fonte pequeno"
                      >
                        A-
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Clique no botão de tamanho médio');
                          applyFontSize('md');
                        }}
                        onKeyDown={handlePreferenceKeyDown}
                        className={`flex-1 px-2 py-1 text-sm rounded-md ${
                          preferences.fontSize === 'md' 
                            ? 'bg-[#C19A6B] text-white' 
                            : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                        }`}
                        tabIndex={0}
                        aria-label="Tamanho da fonte médio"
                      >
                        A
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Clique no botão de tamanho grande');
                          applyFontSize('lg');
                        }}
                        onKeyDown={handlePreferenceKeyDown}
                        className={`flex-1 px-2 py-1 text-base rounded-md ${
                          preferences.fontSize === 'lg' 
                            ? 'bg-[#C19A6B] text-white' 
                            : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                        }`}
                        tabIndex={0}
                        aria-label="Tamanho da fonte grande"
                      >
                        A+
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Clique no botão de tamanho muito grande');
                          applyFontSize('xl');
                        }}
                        onKeyDown={handlePreferenceKeyDown}
                        className={`flex-1 px-2 py-1 text-lg rounded-md ${
                          preferences.fontSize === 'xl' 
                            ? 'bg-[#C19A6B] text-white' 
                            : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                        }`}
                        tabIndex={0}
                        aria-label="Tamanho da fonte muito grande"
                      >
                        A++
                      </button>
                    </div>
                  </div>
                    {/* Controle de contraste */}
                  <div>
                    <p className="text-xs text-[#735B43] mb-2">Contraste</p>                    <div className="space-y-2" role="radiogroup" aria-label="Opções de contraste">
                      {(Object.keys(CONTRAST_MODES) as Array<keyof typeof CONTRAST_MODES>).map((mode) => (
                        <div 
                          key={mode} 
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            preferences.contrastMode === mode 
                              ? 'bg-[#F0EBE2]/80 border border-[#C19A6B]' 
                              : 'hover:bg-[#F0EBE2]/40'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`Clique na opção de contraste ${mode}`);
                            applyContrastMode(mode);
                          }}
                          onKeyDown={handlePreferenceKeyDown}
                          tabIndex={0}
                          role="radio"
                          aria-checked={preferences.contrastMode === mode}
                          aria-label={`Modo de contraste ${CONTRAST_MODES[mode]}`}
                        >
                          <span className="text-sm text-[#583B1F]">{CONTRAST_MODES[mode]}</span>
                          {preferences.contrastMode === mode && (
                            <div className="w-2 h-2 rounded-full bg-[#C19A6B]"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>          </div>{/* Mobile: Compartilhamento, Lupa e Menu Hambúrguer */}
          <div className={`flex md:hidden items-center space-x-2 transition-all duration-300`}>
            {/* Botão de preferências de leitura - Mobile */}
            <button              onClick={togglePreferencesMenu}
              className={`p-1.5 transition-all duration-300 focus:outline-none 
                flex items-center justify-center
                focus:ring-2 focus:ring-[#C19A6B]/70 active:scale-95
                ${preferencesMenuOpen 
                  ? 'text-[#C19A6B]' 
                  : 'text-[#583B1F] hover:text-[#C19A6B]'
                }`}
              aria-label="Preferências de leitura"
              aria-expanded={preferencesMenuOpen}
            >
              <Settings className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} />
            </button>
              {/* Botão de Compartilhamento */}
            <button 
              onClick={handleNativeShare}
              className={`p-1.5 transition-all duration-300 focus:outline-none 
                flex items-center justify-center
                focus:ring-2 focus:ring-[#C19A6B]/70 active:scale-95
                text-[#583B1F] hover:text-[#C19A6B]`}
              aria-label="Compartilhar página"
            >
              <Share2 className={`w-5 h-5 ${isScrolled ? 'scale-90' : 'scale-100'} transition-transform`} />
            </button>
              <div className={`relative transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}>
              <HeaderSearchInline />
            </div>
              <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 transition-all duration-300 focus:outline-none 
                flex items-center justify-center
                focus:ring-2 focus:ring-[#C19A6B]/70 active:scale-95
                ${isMobileMenuOpen 
                  ? 'text-[#C19A6B]' 
                  : 'text-[#583B1F] hover:text-[#C19A6B]'
                }`}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              ref={buttonRef}
            >{isMobileMenuOpen 
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
      
      {/* Menu de preferências - Mobile (fora do header para posicionamento correto) */}
      {preferencesMenuOpen && isMobile && (
        <div 
          ref={prefsMenuRef}
          className="fixed top-[60px] left-4 right-4 bg-white rounded-md shadow-lg z-50 p-4 border border-[#F0EBE2] animate-scale-in"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-[#583B1F]">Preferências de Leitura</h3>
            <button 
              onClick={() => setPreferencesMenuOpen(false)}
              className="text-[#583B1F] hover:text-[#C19A6B] transition-colors"
              aria-label="Fechar menu de preferências"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Controle de tamanho de fonte */}
          <div className="mb-4">
            <p className="text-xs text-[#735B43] mb-2">Tamanho da Fonte</p>            <div className="flex items-center justify-between gap-2">              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clique no botão de tamanho pequeno (mobile)');
                  applyFontSize('sm');
                }}
                onKeyDown={handlePreferenceKeyDown}
                className={`flex-1 px-2 py-2 text-xs rounded-md ${
                  preferences.fontSize === 'sm' 
                    ? 'bg-[#C19A6B] text-white' 
                    : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                }`}
                tabIndex={0}
                aria-label="Tamanho da fonte pequeno"
              >
                A-
              </button>
                <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clique no botão de tamanho médio (mobile)');
                  applyFontSize('md');
                }}
                onKeyDown={handlePreferenceKeyDown}
                className={`flex-1 px-2 py-2 text-sm rounded-md ${
                  preferences.fontSize === 'md' 
                    ? 'bg-[#C19A6B] text-white' 
                    : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                }`}
                tabIndex={0}
                aria-label="Tamanho da fonte médio"
              >
                A
              </button>                <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clique no botão de tamanho grande (mobile)');
                  applyFontSize('lg');
                }}
                onKeyDown={handlePreferenceKeyDown}
                className={`flex-1 px-2 py-2 text-base rounded-md ${
                  preferences.fontSize === 'lg' 
                    ? 'bg-[#C19A6B] text-white' 
                    : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                }`}
                tabIndex={0}
                aria-label="Tamanho da fonte grande"
              >
                A+
              </button>
                <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Clique no botão de tamanho muito grande (mobile)');
                  applyFontSize('xl');
                }}
                onKeyDown={handlePreferenceKeyDown}
                className={`flex-1 px-2 py-2 text-lg rounded-md ${
                  preferences.fontSize === 'xl' 
                    ? 'bg-[#C19A6B] text-white' 
                    : 'bg-[#F0EBE2] text-[#583B1F] hover:bg-[#F0EBE2]/80'
                }`}
                tabIndex={0}
                aria-label="Tamanho da fonte muito grande"
              >
                A++
              </button>
            </div>
          </div>
            {/* Controle de contraste */}
          <div>
            <p className="text-xs text-[#735B43] mb-2">Contraste</p>            <div className="space-y-2" role="radiogroup" aria-label="Opções de contraste">              {(Object.keys(CONTRAST_MODES) as Array<keyof typeof CONTRAST_MODES>).map((mode) => (
                <div 
                  key={mode} 
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                    preferences.contrastMode === mode 
                      ? 'bg-[#F0EBE2]/80 border border-[#C19A6B]' 
                      : 'hover:bg-[#F0EBE2]/40'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Clique na opção de contraste ${mode} (mobile)`);
                    applyContrastMode(mode);
                  }}
                  onKeyDown={handlePreferenceKeyDown}
                  tabIndex={0}
                  role="radio"
                  aria-checked={preferences.contrastMode === mode}
                  aria-label={`Modo de contraste ${CONTRAST_MODES[mode]}`}
                >
                  <span className="text-sm text-[#583B1F]">{CONTRAST_MODES[mode]}</span>
                  {preferences.contrastMode === mode && (
                    <div className="w-2 h-2 rounded-full bg-[#C19A6B]"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
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
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579.487.5.669.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.884-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
