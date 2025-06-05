"use client"

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PreloadResource {
  href: string;
  as: 'image' | 'style' | 'script' | 'font';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  media?: string;
  priority?: 'high' | 'low';
}

export default function GlobalResourcePreloader() {
  const pathname = usePathname();

  useEffect(() => {
    const preloadResources = () => {
      // Recursos críticos globais
      const globalResources: PreloadResource[] = [
        // Fonte principal
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          as: 'style',
          crossOrigin: 'anonymous',
          priority: 'high'
        },
        // Imagem principal (LCP) para homepage
        {
          href: '/foto-psicologo-daniel-dantas.webp',
          as: 'image',
          type: 'image/webp',
          priority: 'high'
        },
        // Logo
        {
          href: '/logo-psicologodanieldantas.webp',
          as: 'image',
          type: 'image/webp',
          priority: 'high'
        }
      ];

      // Recursos específicos por rota
      const routeSpecificResources: Record<string, PreloadResource[]> = {
        '/': [
          // Homepage - preload imagens críticas
          {
            href: '/hero-background.webp',
            as: 'image',
            type: 'image/webp'
          }
        ],
        '/blogflorescerhumano': [
          // Blog - preload imagens de artigos
          {
            href: '/blogflorescerhumano/images/blog-hero.webp',
            as: 'image',
            type: 'image/webp'
          }
        ]
      };

      // Combinar recursos globais com específicos da rota
      const currentRouteResources = routeSpecificResources[pathname] || [];
      const allResources = [...globalResources, ...currentRouteResources];

      // Função para criar link de preload
      const createPreloadLink = (resource: PreloadResource) => {
        const existingLink = document.querySelector(`link[href="${resource.href}"]`);
        if (existingLink) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        
        if (resource.type) link.type = resource.type;
        if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
        if (resource.media) link.media = resource.media;
        
        // Adicionar atributo fetchpriority para recursos críticos
        if (resource.priority === 'high') {
          link.setAttribute('fetchpriority', 'high');
        }

        document.head.appendChild(link);
      };

      // Aplicar preloads
      allResources.forEach(createPreloadLink);

      // Preload inteligente baseado em interação do usuário
      const setupIntelligentPreload = () => {
        // Preload de recursos quando o usuário hover sobre links
        const links = document.querySelectorAll('a[href^="/"]');
        
        links.forEach(link => {
          let timeoutId: NodeJS.Timeout;
          
          const handleMouseEnter = () => {
            timeoutId = setTimeout(() => {
              const href = link.getAttribute('href');
              if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = href;
                document.head.appendChild(prefetchLink);
              }
            }, 100); // Delay para evitar preloads desnecessários
          };

          const handleMouseLeave = () => {
            if (timeoutId) clearTimeout(timeoutId);
          };

          link.addEventListener('mouseenter', handleMouseEnter);
          link.addEventListener('mouseleave', handleMouseLeave);
        });
      };

      // Configurar preload inteligente após o carregamento inicial
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupIntelligentPreload);
      } else {
        setupIntelligentPreload();
      }
    };

    // Otimizações de carregamento de recursos
    const optimizeResourceLoading = () => {
      // 1. Otimizar imagens existentes
      const optimizeImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
          // Adicionar loading="lazy" se não estiver definido
          if (!img.hasAttribute('loading')) {
            // Não aplicar lazy loading para imagens above-the-fold
            const rect = img.getBoundingClientRect();
            const isAboveFold = rect.top < window.innerHeight;
            
            if (!isAboveFold) {
              img.setAttribute('loading', 'lazy');
            }
          }
          
          // Adicionar decoding="async"
          if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
          }
        });
      };

      // 2. Otimizar iframes
      const optimizeIframes = () => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          if (!iframe.hasAttribute('loading')) {
            iframe.setAttribute('loading', 'lazy');
          }
        });
      };

      // 3. Configurar Intersection Observer para lazy loading avançado
      const setupAdvancedLazyLoading = () => {
        if ('IntersectionObserver' in window) {
          const lazyElements = document.querySelectorAll('[data-lazy]');
          
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const element = entry.target as HTMLElement;
                const src = element.dataset.lazy;
                
                if (src) {
                  if (element.tagName === 'IMG') {
                    (element as HTMLImageElement).src = src;
                  } else if (element.tagName === 'IFRAME') {
                    (element as HTMLIFrameElement).src = src;
                  }
                  
                  element.removeAttribute('data-lazy');
                  observer.unobserve(element);
                }
              }
            });
          }, {
            rootMargin: '50px 0px',
            threshold: 0.1
          });

          lazyElements.forEach(element => observer.observe(element));
        }
      };

      optimizeImages();
      optimizeIframes();
      setupAdvancedLazyLoading();
    };

    // Executar otimizações
    preloadResources();
    
    // Otimizar recursos após carregamento
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeResourceLoading);
    } else {
      optimizeResourceLoading();
    }

    // Cleanup listeners quando o componente for desmontado
    return () => {
      // Remover event listeners se necessário
    };
  }, [pathname]);

  // Preload crítico via JSX (executa no servidor)
  return (
    <>
      {/* Preload crítico inline */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        as="style"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/foto-psicologo-daniel-dantas.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/logo-psicologodanieldantas.webp"
        as="image"
        type="image/webp"
        fetchPriority="high"
      />
    </>
  );
}
