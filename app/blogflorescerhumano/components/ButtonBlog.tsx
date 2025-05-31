"use client"

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface BaseProps {
  variant?: 'primary' | 'secondary' | 'golden' | 'green';
  className?: string;
  children: React.ReactNode;
  
  // 🔄 Automações de UI/UX
  autoScroll?: {
    target: string; // Ex: "#artigos", ".categoria"
    behavior?: 'smooth' | 'instant';
    offset?: number; // Ex: 100 (para header fixo)
  }; // Uso: autoScroll={{ target: "#sobre", offset: 80 }}
  
  autoToggle?: {
    target: string; // Ex: "#menu-mobile"
    className?: string; // Ex: "hidden", "active"
  }; // Uso: autoToggle={{ target: "#modal", className: "hidden" }}
  
  // 📊 Automações de Analytics
  autoTrack?: {
    event: string; // Ex: "button_click", "newsletter_signup"
    properties?: Record<string, any>; // Ex: { source: "hero" }
  }; // Uso: autoTrack={{ event: "cta_click", properties: { page: "home" } }}
  
  // ⏱️ Automações de Tempo
  autoDelay?: number; // Ex: 1000 (1 segundo)
  autoDebounce?: number; // Ex: 300 (previne spam)
  
  // 💾 Automações de Dados
  autoSave?: {
    key: string; // Ex: "user-preferences"
    value: any; // Ex: { theme: "dark" }
    expiry?: number; // Ex: 86400000 (24h)
  }; // Uso: autoSave={{ key: "progress", value: userData }}
  
  autoLoad?: {
    key: string; // Ex: "saved-data"
    callback?: (data: any) => void; // Ex: setUserData
  }; // Uso: autoLoad={{ key: "settings", callback: setSettings }}
  
  // 🔔 Automações de Notificação
  autoNotify?: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string; // Ex: "Salvo com sucesso!"
    duration?: number; // Ex: 3000 (3 segundos)
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  }; // Uso: autoNotify={{ type: "success", message: "Inscrito!" }}
  
  // 📋 Automações de Clipboard
  autoCopy?: {
    text: string; // Ex: window.location.href
    successMessage?: string; // Ex: "Link copiado!"
  }; // Uso: autoCopy={{ text: "Texto copiado", successMessage: "Copiado!" }}
  
  // 🌐 Automações de Rede
  autoFetch?: {
    url: string; // Ex: "/api/newsletter"
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any; // Ex: { email: userEmail }
    headers?: Record<string, string>;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }; // Uso: autoFetch={{ url: "/api/save", method: "POST", body: formData }}
  
  // 📱 Automações de Dispositivo
  autoShare?: {
    title: string; // Ex: "Blog Psicólogo"
    text: string; // Ex: "Confira este artigo"
    url?: string; // Ex: window.location.href
  }; // Uso: autoShare={{ title: "Artigo", text: "Leia sobre..." }}
  
  autoVibrate?: number[]; // Ex: [100, 50, 100] (vibra-pausa-vibra)
  
  // 🎨 Automações Visuais
  autoAnimate?: {
    target?: string; // Ex: "#hero-section"
    animation: string; // Ex: "fadeIn", "slideUp"
    duration?: number; // Ex: 500 (ms)
  }; // Uso: autoAnimate={{ animation: "bounce", duration: 300 }}
  
  autoRipple?: boolean; // Ex: true (efeito Material Design)
  
  // 📄 Automações de Formulário
  autoSubmit?: {
    form: string; // Ex: "contact-form"
    resetAfter?: boolean; // Ex: true
  }; // Uso: autoSubmit={{ form: "newsletter-form", resetAfter: true }}
  
  autoReset?: {
    form: string; // Ex: "search-form"
  }; // Uso: autoReset={{ form: "contact-form" }}
  
  // 🔄 Automações de Estado
  autoToggleClass?: {
    target?: string; // Ex: "#sidebar"
    className: string; // Ex: "active", "visible"
    duration?: number; // Ex: 2000 (remove após 2s)
  }; // Uso: autoToggleClass={{ className: "highlight", duration: 1000 }}
  
  autoCounter?: {
    key: string; // Ex: "daily-clicks"
    max?: number; // Ex: 5 (máximo 5 cliques)
    onMax?: () => void; // Ex: () => alert("Limite!")
  }; // Uso: autoCounter={{ key: "motivation", max: 3, onMax: showLimit }}
  
  // 🎯 Automações de Foco
  autoFocus?: {
    target: string; // Ex: "email-input"
    delay?: number; // Ex: 500 (ms)
  }; // Uso: autoFocus={{ target: "search-input", delay: 300 }}
  
  // 📤 Automações de Download
  autoDownload?: {
    url: string; // Ex: "/files/ebook.pdf"
    filename?: string; // Ex: "Guia-Completo.pdf"
  }; // Uso: autoDownload={{ url: "/pdfs/guia.pdf", filename: "Guia.pdf" }}
  
  // 🔊 Automações de Som
  autoSound?: {
    url: string; // Ex: "/sounds/click.mp3"
    volume?: number; // Ex: 0.5 (50% do volume)
  }; // Uso: autoSound={{ url: "/audio/success.mp3", volume: 0.3 }}
  
  // 🌙 Automações de Tema
  autoTheme?: {
    toggle?: boolean; // Ex: true (alterna tema)
    set?: 'light' | 'dark'; // Ex: "dark"
  }; // Uso: autoTheme={{ toggle: true }} ou autoTheme={{ set: "dark" }}
  
  // 📍 Automações de Localização
  autoLocation?: {
    onSuccess?: (coords: GeolocationCoordinates) => void;
    onError?: (error: GeolocationPositionError) => void;
  }; // Uso: autoLocation={{ onSuccess: saveLocation, onError: showError }}
  
  // 🔄 Automações de Recarregamento
  autoRefresh?: {
    delay?: number; // Ex: 2000 (2 segundos)
    hard?: boolean; // Ex: false (reload normal)
  }; // Uso: autoRefresh={{ delay: 1000, hard: false }}
  
  // ✅ Automações de Confirmação
  autoConfirm?: {
    message: string; // Ex: "Tem certeza?"
    title?: string; // Ex: "Confirmação"
  }; // Uso: autoConfirm={{ message: "Deletar item?" }}
  
  // Estados
  loading?: boolean; // Ex: true (mostra spinner)
  disabled?: boolean; // Ex: false (botão ativo)
}

// Props para botão
interface ButtonProps extends BaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: never;
}

// Props para link
interface LinkProps extends BaseProps {
  href: string;
  onClick?: never;
}

type ButtonBlogProps = ButtonProps | LinkProps;

// Custom hook para notificações otimizado
const useNotifications = () => {
  const showNotification = useCallback((
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration = 3000,
    position = 'top-right'
  ) => {
    const getNotificationStyles = (notifType: string) => {
      const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-black'
      };
      return styles[notifType as keyof typeof styles];
    };

    const getPositionStyles = (pos: string) => {
      const styles = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4'
      };
      return styles[pos as keyof typeof styles];
    };

    const getPositionTransform = (pos: string) => {
      return pos.includes('right') ? 'translateX(100%)' : 'translateX(-100%)';
    };

    const notification = document.createElement('div');
    notification.className = `fixed z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${getNotificationStyles(type)} ${getPositionStyles(position)}`;
    notification.textContent = message;
    notification.style.transform = getPositionTransform(position);
    notification.style.opacity = '0';
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });
    
    // Remove após duration
    setTimeout(() => {
      notification.style.transform = getPositionTransform(position);
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, duration);
  }, []);

  return { showNotification };
};

// Custom hook para analytics otimizado
const useAnalytics = () => {
  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Tracking event:', event, properties);
    }
    
    // Google Analytics integration
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }
  }, []);

  return { trackEvent };
};

// Custom hook para storage operations
const useStorage = () => {
  const saveData = useCallback((key: string, value: any, expiry?: number) => {
    try {
      const data = {
        value,
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + expiry : null
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }, []);

  const loadData = useCallback((key: string) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      
      // Verifica expiração
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data.value;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  }, []);

  return { saveData, loadData };
};

/**
 * Botão padronizado do blog com automações avançadas.
 * 
 * Variantes disponíveis:
 * - primary: Marrom escuro (#583B1F) com hover verde oliva (#6B7B3F)
 * - secondary: Branco com borda marrom e hover bege (#F8F5F0)
 * - golden: Dourado (#A57C3A) com hover marrom escuro (#583B1F)
 * - green: Verde oliva (#6B7B3F) com hover verde escuro (#5B6B35)
 * 
 * Exemplos de uso:
 * 
 * // Botão simples
 * <ButtonBlog variant="primary">Clique aqui</ButtonBlog>
 * 
 * // Scroll para seção
 * <ButtonBlog autoScroll={{ target: "#artigos", offset: 100 }}>
 *   Ver Artigos
 * </ButtonBlog>
 * 
 * // Link com analytics
 * <ButtonBlog href="/contato" autoTrack={{ event: "contact_click" }}>
 *   Contato
 * </ButtonBlog>
 * 
 * // Compartilhamento
 * <ButtonBlog autoShare={{ title: "Blog", text: "Confira!" }}>
 *   Compartilhar
 * </ButtonBlog>
 * 
 * // Múltiplas automações
 * <ButtonBlog 
 *   autoScroll={{ target: "#newsletter" }}
 *   autoTrack={{ event: "newsletter_click" }}
 *   autoNotify={{ type: "success", message: "Inscrito!" }}
 * >
 *   Newsletter
 * </ButtonBlog>
 */
const ButtonBlog: React.FC<ButtonBlogProps> = ({
  className,
  variant = 'primary',
  href,
  children,
  autoScroll,
  autoToggle,
  autoTrack,
  autoDelay,
  autoDebounce,
  autoSave,
  autoLoad,
  autoNotify,
  autoCopy,
  autoFetch,
  autoShare,
  autoVibrate,
  autoAnimate,
  autoRipple,
  autoSubmit,
  autoReset,
  autoToggleClass,
  autoCounter,
  autoFocus: autoFocusTarget,
  autoDownload,
  autoSound,
  autoTheme,
  autoLocation,
  autoRefresh,
  autoConfirm,
  loading = false,
  disabled = false,
  onClick,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(loading);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastClickTime = useRef(0);
  const clickCount = useRef(0);
  
  // Hook para tratamento de erros
  const handleError = useErrorHandler();
  // Custom hooks para separação de responsabilidades
  const { showNotification } = useNotifications();
  const { trackEvent } = useAnalytics();
  const { saveData, loadData } = useStorage();

  // Memoização das classes CSS para otimização
  const buttonClasses = useMemo(() => {
    const base = 'inline-flex items-center justify-center px-6 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#583B1F] focus:ring-offset-2 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden';

    const variants = {
      primary: 'bg-[#583B1F] text-white border border-[#583B1F] hover:bg-[#6B7B3F]',
      secondary: 'bg-white text-[#583B1F] border border-[#583B1F] hover:bg-[#F8F5F0]',
      golden: 'bg-[#A57C3A] text-white border border-[#A57C3A] hover:bg-[#583B1F]',
      green: 'bg-[#6B7B3F] text-white border border-[#6B7B3F] hover:bg-[#5B6B35]',
    };

    return cn(base, variants[variant], className);
  }, [variant, className]);

  // Função principal otimizada com useCallback
  const handleAutomations = useCallback(async (event?: React.MouseEvent) => {
    // Previne ação se estiver carregando, desabilitado ou processando
    if (isLoading || disabled || isProcessing) {
      event?.preventDefault();
      return;
    }

    // Debounce protection
    if (autoDebounce) {
      const now = Date.now();
      if (now - lastClickTime.current < autoDebounce) {
        event?.preventDefault();
        return;
      }
      lastClickTime.current = now;
    }

    // Counter logic
    if (autoCounter) {
      const stored = loadData(autoCounter.key) || 0;
      const count = typeof stored === 'number' ? stored : 0;
      clickCount.current = count + 1;
      
      if (autoCounter.max && clickCount.current > autoCounter.max) {
        autoCounter.onMax?.();
        event?.preventDefault();
        return;
      }
      
      saveData(autoCounter.key, clickCount.current);
    }

    // Confirmação se necessária
    if (autoConfirm) {
      const confirmed = window.confirm(autoConfirm.message);
      if (!confirmed) {
        event?.preventDefault();
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Auto load data
      if (autoLoad) {
        const data = loadData(autoLoad.key);
        if (data) {
          autoLoad.callback?.(data);
        }
      }

      // Delay se especificado
      if (autoDelay) {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, autoDelay));
      }

      // Analytics tracking otimizado
      if (autoTrack) {
        trackEvent(autoTrack.event, autoTrack.properties);
      }

      // Auto scroll otimizado
      if (autoScroll) {
        const target = document.querySelector(autoScroll.target);
        if (target) {
          const offset = autoScroll.offset || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: autoScroll.behavior || 'smooth'
          });
        }
      }

      // Auto toggle
      if (autoToggle) {
        const target = document.querySelector(autoToggle.target);
        if (target) {
          const className = autoToggle.className || 'hidden';
          target.classList.toggle(className);
        }
      }

      // Auto copy com tratamento de erro melhorado
      if (autoCopy) {
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(autoCopy.text);
            if (autoCopy.successMessage) {
              showNotification('success', autoCopy.successMessage);
            }
          } else {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = autoCopy.text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (autoCopy.successMessage) {
              showNotification('success', autoCopy.successMessage);
            }
          }
        } catch (error) {
          console.error('Erro ao copiar:', error);
          showNotification('error', 'Erro ao copiar texto');
        }
      }

      // Auto share com fallback melhorado
      if (autoShare) {
        try {
          if (navigator.share) {
            await navigator.share({
              title: autoShare.title,
              text: autoShare.text,
              url: autoShare.url || window.location.href
            });
          } else {
            // Fallback melhorado
            const url = autoShare.url || window.location.href;
            const text = `${autoShare.text} ${url}`;
            
            if (navigator.clipboard) {
              await navigator.clipboard.writeText(text);
              showNotification('info', 'Link copiado para área de transferência');
            }
          }
        } catch (error) {
          console.error('Erro ao compartilhar:', error);
          showNotification('error', 'Erro ao compartilhar');
        }
      }

      // Auto fetch com tratamento melhorado
      if (autoFetch) {
        try {
          const response = await fetch(autoFetch.url, {
            method: autoFetch.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...autoFetch.headers
            },
            body: autoFetch.body ? JSON.stringify(autoFetch.body) : undefined
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          autoFetch.onSuccess?.(data);
        } catch (error) {
          console.error('Fetch error:', error);
          autoFetch.onError?.(error);
        }
      }

      // Auto vibrate com verificação de suporte
      if (autoVibrate && 'vibrate' in navigator) {
        navigator.vibrate(autoVibrate);
      }

      // Auto save otimizado
      if (autoSave) {
        saveData(autoSave.key, autoSave.value, autoSave.expiry);
      }

      // Demais automações continuam iguais...
      // Auto animate
      if (autoAnimate) {
        const target = autoAnimate.target 
          ? document.querySelector(autoAnimate.target)
          : event?.currentTarget;
        
        if (target) {
          (target as HTMLElement).style.animationName = autoAnimate.animation;
          (target as HTMLElement).style.animationDuration = `${autoAnimate.duration || 300}ms`;
        }
      }

      // Auto submit form
      if (autoSubmit) {
        const form = document.getElementById(autoSubmit.form) as HTMLFormElement;
        if (form) {
          form.submit();
          if (autoSubmit.resetAfter) {
            form.reset();
          }
        }
      }

      // Auto reset form
      if (autoReset) {
        const form = document.getElementById(autoReset.form) as HTMLFormElement;
        if (form) {
          form.reset();
        }
      }

      // Auto toggle class
      if (autoToggleClass) {
        const target = autoToggleClass.target 
          ? document.querySelector(autoToggleClass.target)
          : event?.currentTarget;
        
        if (target) {
          target.classList.toggle(autoToggleClass.className);
          
          if (autoToggleClass.duration) {
            setTimeout(() => {
              target.classList.remove(autoToggleClass.className);
            }, autoToggleClass.duration);
          }
        }
      }

      // Auto focus
      if (autoFocusTarget) {
        const focusElement = document.getElementById(autoFocusTarget.target);
        if (focusElement) {
          const delay = autoFocusTarget.delay || 0;
          setTimeout(() => {
            focusElement.focus();
          }, delay);
        }
      }

      // Auto download
      if (autoDownload) {
        const link = document.createElement('a');
        link.href = autoDownload.url;
        link.download = autoDownload.filename || 'download';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Auto sound com tratamento de erro
      if (autoSound) {
        try {
          const audio = new Audio(autoSound.url);
          audio.volume = autoSound.volume || 1;
          await audio.play();
        } catch (error) {
          console.error('Erro ao reproduzir som:', error);
        }
      }

      // Auto theme
      if (autoTheme) {
        if (autoTheme.toggle) {
          const currentTheme = loadData('theme') || 'light';
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          saveData('theme', newTheme);
          document.documentElement.classList.toggle('dark');
        } else if (autoTheme.set) {
          saveData('theme', autoTheme.set);
          if (autoTheme.set === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }

      // Auto location com verificação de suporte
      if (autoLocation && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => autoLocation.onSuccess?.(position.coords),
          (error) => autoLocation.onError?.(error)
        );
      }

      // Auto refresh
      if (autoRefresh) {
        const delay = autoRefresh.delay || 0;
        setTimeout(() => {
          if (autoRefresh.hard) {
            window.location.reload();
          } else {
            window.location.href = window.location.href;
          }
        }, delay);
      }

      // Auto notify
      if (autoNotify) {
        showNotification(autoNotify.type, autoNotify.message, autoNotify.duration, autoNotify.position);
      }

      // Executa onClick original se existir
      if (onClick) {
        onClick(event as any);
      }

    } catch (error) {      console.error('Erro nas automações:', error);
      showNotification('error', 'Erro ao executar ação');
      handleError(error instanceof Error ? error : new Error(String(error))); // Tratamento de erro otimizado
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, [
    isLoading, disabled, isProcessing, autoDebounce, autoCounter, autoConfirm,
    autoLoad, autoDelay, autoTrack, autoScroll, autoToggle, autoCopy, autoShare,
    autoFetch, autoVibrate, autoSave, autoAnimate, autoSubmit, autoReset,
    autoToggleClass, autoFocusTarget, autoDownload, autoSound, autoTheme,
    autoLocation, autoRefresh, autoNotify, onClick, trackEvent, showNotification,
    saveData, loadData, handleError
  ]);

  // Renderização do conteúdo otimizada
  const renderContent = useMemo(() => {
    if (isLoading || isProcessing) {
      return (
        <>
          <svg 
            className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loading ? 'Carregando...' : children}
        </>
      );
    }
    return children;
  }, [isLoading, isProcessing, loading, children]);

  // Atributos de acessibilidade
  const accessibilityProps = useMemo(() => ({
    'aria-busy': isLoading || isProcessing,
    'aria-disabled': disabled || isLoading || isProcessing,
    'aria-describedby': autoNotify ? 'button-notifications' : undefined,
  }), [isLoading, isProcessing, disabled, autoNotify]);

  // Se for link
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonClasses}
        onClick={handleAutomations}
        {...accessibilityProps}
      >
        {renderContent}
      </Link>
    );
  }

  // Se for botão
  return (
    <button 
      className={buttonClasses} 
      onClick={handleAutomations}
      disabled={disabled || isLoading || isProcessing}
      {...accessibilityProps}
      {...props}
    >
      {renderContent}
      {/* Efeito ripple se habilitado */}
      {autoRipple && (
        <span className="absolute inset-0 overflow-hidden rounded-md">
          <span className="absolute inset-0 bg-white opacity-0 scale-0 rounded-full transition-all duration-300 group-active:scale-100 group-active:opacity-20"></span>
        </span>
      )}
    </button>
  );
};

export default ButtonBlog;
