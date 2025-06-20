// app/blogflorescerhumano/blog-client-layout.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BlogHeader from './components/BlogHeader';
import BlogFooter from './components/BlogFooter';
import ContentWrapper from './components/ContentWrapper';
import ScrollButton from './components/ScrollButton';
import { ConnectionQualityAdjuster } from './components/ConnectionQualityAdjuster';
import { PageContext } from './page-context';
import './ui/globalsBlog.css';
import './ui/mobile-improvements.css';

// Removida a exportação de metadata daqui

export default function BlogClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/blogflorescerhumano';
  
  // 🎯 LÓGICA ULTRA-SIMPLES: Schema Blog só em páginas apropriadas
  // ✅ Home: /blogflorescerhumano
  // ✅ Categorias: /blogflorescerhumano/categoria/[categoria]
  // ✅ Tags: /blogflorescerhumano/tag/[tag]
  // ❌ Artigos: /blogflorescerhumano/[slug] (mais de 2 segmentos = artigo)
  const pathSegments = pathname.split('/').filter(Boolean);
  const shouldShowBlogSchema = pathSegments.length <= 3; // /blogflorescerhumano, /categoria/x, /tag/x
    // Carrega scripts quando o componente monta
  React.useEffect(() => {
    // Importação dinâmica do script de interações mobile
    import('./scripts/mobile-interactions').then(module => {
      // Chama a função exportada para inicializar as interações
      if (module.default) module.default();
    }).catch(err => {
      console.error('Erro ao carregar script de interações mobile:', err);
    });
      // Função para executar os testes manualmente no console
    if (process.env.NODE_ENV === 'development') {
      // Define as funções de teste separadamente para facilitar o reuso
      function verificarClassesMobile() {
        console.group('Verificação de Classes Mobile');
        const heroContainer = document.querySelector('.hero-container');
        console.log('Hero Container:', heroContainer ? '✓ Presente' : '✗ Ausente');
        
        const cssRules = Array.from(document.styleSheets).some(sheet => {
          try {
            return Array.from(sheet.cssRules).some(rule => 
              rule.cssText && rule.cssText.includes('prefers-reduced-motion'));
          } catch(e) {
            return false;
          }
        });
        console.log('Suporte a prefers-reduced-motion:', cssRules ? '✓ Implementado' : '✗ Ausente');
        
        const lazyElements = document.querySelectorAll('[id$="-section"]');
        console.log('Seções com lazy loading:', lazyElements.length > 0 ? `✓ ${lazyElements.length} encontradas` : '✗ Ausentes');
        console.groupEnd();
        return { 
          resultado: heroContainer && cssRules && lazyElements.length > 0,
          heroContainer: heroContainer ? true : false,
          cssRules,
          lazyElements: lazyElements.length
        };
      }
      
      function verificarAcessibilidade() {
        console.group('Verificação de Acessibilidade');
        const botoesELinks = Array.from(document.querySelectorAll('a, button'));
        const botoesAcessiveis = botoesELinks.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44;
        });
        
        const percentualAcessivel = botoesELinks.length ? 
          Math.round((botoesAcessiveis.length / botoesELinks.length) * 100) : 0;
        
        console.log(`Áreas de toque adequadas: ${percentualAcessivel}% (${botoesAcessiveis.length}/${botoesELinks.length})`);
        
        const elementosInterativos = Array.from(document.querySelectorAll('a[href], button, [role="button"]'));
        const comAria = elementosInterativos.filter(el => 
          el.hasAttribute('aria-label') || 
          el.hasAttribute('aria-labelledby') || 
          el.hasAttribute('aria-describedby')
        );
        
        const percentualAria = elementosInterativos.length ?
          Math.round((comAria.length / elementosInterativos.length) * 100) : 0;
        
        console.log(`Elementos com atributos ARIA: ${percentualAria}% (${comAria.length}/${elementosInterativos.length})`);
        console.groupEnd();
        
        return { 
          touchAreas: percentualAcessivel, 
          ariaAttributes: percentualAria,
          totalElementos: botoesELinks.length,
          elementosAcessiveis: botoesAcessiveis.length
        };
      }
      
      function executarTodosTestes() {
        console.group('TESTES DE OTIMIZAÇÕES MOBILE - BLOG FLORESCER HUMANO');
        
        const classesMobile = verificarClassesMobile();
        const acessibilidade = verificarAcessibilidade();
        
        // Exibir resultados
        console.log('\n--- RESULTADO FINAL ---');
        console.log(`Classes mobile: ${classesMobile.resultado ? '✓' : '✗'}`);
        console.log(`Acessibilidade de touch: ${acessibilidade.touchAreas >= 80 ? '✓' : '✗'} (${acessibilidade.touchAreas}%)`);
        console.log(`Atributos ARIA: ${acessibilidade.ariaAttributes >= 50 ? '✓' : '✗'} (${acessibilidade.ariaAttributes}%)`);
        
        const pontuacao = [
          classesMobile.resultado ? 40 : 0,
          Math.round(acessibilidade.touchAreas * 0.3),
          Math.round(acessibilidade.ariaAttributes * 0.3)
        ].reduce((a, b) => a + b, 0);
        
        console.log(`\nPontuação final: ${pontuacao}/100`);
        
        if (pontuacao >= 80) {
          console.log('%cExcelente! Otimizações mobile implementadas com sucesso!', 'color: green; font-weight: bold; font-size: 14px;');
        } else if (pontuacao >= 60) {
          console.log('%cBom! A maioria das otimizações está implementada.', 'color: blue; font-weight: bold; font-size: 14px;');
        } else {
          console.log('%cPrecisa de melhorias nas otimizações mobile.', 'color: orange; font-weight: bold; font-size: 14px;');
        }
        
        console.groupEnd();
        return pontuacao;
      }
      
      // Anexa as funções ao objeto global window
      window.verificarOtimizacoesMobile = {
        todos: executarTodosTestes,
        classes: verificarClassesMobile,
        acessibilidade: verificarAcessibilidade
      };
        // Exibe instruções no console
      console.log('%cTestes de otimizações mobile disponíveis!', 'color: #C19A6B; font-weight: bold; font-size: 14px;');
      console.log('Digite %cverificarOtimizacoesMobile.todos()%c para executar todos os testes.', 'color: #583B1F; font-weight: bold;', 'color: inherit;');
      console.log('Ou use %cverificarOtimizacoesMobile.acessibilidade()%c para testar apenas a acessibilidade.', 'color: #583B1F; font-weight: bold;', 'color: inherit;');
      console.log('Ou use %cverificarOtimizacoesMobile.classes()%c para verificar classes e estrutura mobile.', 'color: #583B1F; font-weight: bold;', 'color: inherit;');
      
      // Executa os testes automaticamente após 3 segundos se estiver em desenvolvimento
      setTimeout(() => {
        console.log('%c\nExecutando testes automaticamente...', 'color: #C19A6B; font-size: 12px;');
        executarTodosTestes();
      }, 3000);
    }
  }, []);  return (
    <PageContext.Provider value={{ shouldShowBlogSchema }}>
      {/* Componente que ajusta a qualidade baseado na conexão do usuário */}
      <ConnectionQualityAdjuster />
      
      <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
        {/* Navbar */}
        <BlogHeader />

        {/* Conteúdo Principal com wrapper para controle de padding */}
        <ContentWrapper isHome={isHome}>
          <main className="flex-grow">
            {children}
          </main>
        </ContentWrapper>

        {/* Footer */}
        <BlogFooter />
          {/* Botão de Scroll */}        <ScrollButton />
      </div>
    </PageContext.Provider>
  );
}
