"use client"

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

interface WebVitalsMetric {
  id: string;
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export default function GlobalPerformanceOptimizer() {
  useEffect(() => {
    // Função para reportar Web Vitals customizada
    const reportWebVitals = (metric: WebVitalsMetric) => {
      // Log para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metric.name}: ${metric.value} (${metric.rating})`);
      }      // Enviar para Vercel Analytics
      if (typeof window !== 'undefined' && window.va) {
        window.va('event', {
          name: 'web_vitals',
          data: {
            metric_name: metric.name,
            metric_value: metric.value,
            metric_rating: metric.rating,
            page_path: window.location.pathname
          }
        });
      }

      // Enviar para Google Analytics se disponível
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          custom_map: {
            metric_rating: metric.rating
          }
        });
      }
    };    // Importar e configurar web-vitals dinamicamente
    const loadWebVitals = async () => {
      try {
        // Web Vitals v5.x - usando INP em vez de FID
        const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
        
        onCLS(reportWebVitals);
        onFCP(reportWebVitals);
        onLCP(reportWebVitals);
        onTTFB(reportWebVitals);
        onINP(reportWebVitals); // INP é o substituto do FID em v5.x
      } catch (error) {
        console.warn('[Performance] Web Vitals não disponível:', error);
      }
    };

    // Otimizações de performance globais
    const applyPerformanceOptimizations = () => {
      // 1. Preload de recursos críticos
      const preloadCriticalResources = () => {
        const head = document.head;
        
        // Preload da fonte principal se não estiver carregada
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        fontLink.as = 'style';
        fontLink.crossOrigin = 'anonymous';
        head.appendChild(fontLink);

        // Preload da imagem principal (LCP)
        const imageLink = document.createElement('link');
        imageLink.rel = 'preload';
        imageLink.href = '/foto-psicologo-daniel-dantas.webp';
        imageLink.as = 'image';
        imageLink.type = 'image/webp';
        head.appendChild(imageLink);
      };

      // 2. Otimizações de renderização
      const optimizeRendering = () => {
        // Forçar reflow para elementos lazy
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            const lazyElements = document.querySelectorAll('[loading="lazy"]');
            lazyElements.forEach(element => {
              element.setAttribute('decoding', 'async');
            });
          });
        }
      };      // 3. Otimização de JavaScript
      const optimizeJavaScript = () => {
        // Defer non-critical scripts
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
          const scriptElement = script as HTMLScriptElement;
          if (!scriptElement.hasAttribute('async') && !scriptElement.hasAttribute('defer')) {
            if (!scriptElement.src.includes('gtm') && !scriptElement.src.includes('analytics')) {
              scriptElement.setAttribute('defer', '');
            }
          }
        });
      };

      // Aplicar otimizações
      preloadCriticalResources();
      optimizeRendering();
      optimizeJavaScript();
    };

    // Executar otimizações quando a página estiver carregada
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyPerformanceOptimizations);
    } else {
      applyPerformanceOptimizations();
    }

    // Carregar Web Vitals
    loadWebVitals();    // Observer para monitorar mudanças de layout
    const observeLayoutShifts = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as any;
            if (layoutShiftEntry.hadRecentInput) continue;
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[Layout Shift]', entry);
            }
          }
        });

        try {
          observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.warn('[Performance] Layout Shift Observer não suportado');
        }
      }
    };

    observeLayoutShifts();

    // Cleanup
    return () => {
      // Remover listeners se necessário
    };
  }, []);
  return (
    <>
      <Analytics />
    </>
  );
}

// Tipos globais para TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
