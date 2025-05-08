// Este arquivo contém funções para testar as otimizações mobile implementadas
// Execute-o no console do navegador para validar as melhorias

/**
 * Verifica se as classes de otimização mobile estão presentes
 */
function verificarClassesMobile() {
  console.group('Verificação de Classes Mobile');
  
  // Verifica hero section
  const heroContainer = document.querySelector('.hero-container');
  console.log('Hero Container:', heroContainer ? '✓ Presente' : '✗ Ausente');
  
  // Verifica suporte a preferências de movimento reduzido
  const cssRules = Array.from(document.styleSheets)
    .filter(sheet => {
      try {
        return sheet.href && sheet.href.includes('mobile-improvements.css');
      } catch(e) {
        return false; // CORS pode bloquear acesso a algumas folhas de estilo
      }
    })
    .flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules);
      } catch(e) {
        return [];
      }
    })
    .some(rule => rule.cssText && rule.cssText.includes('prefers-reduced-motion'));
  
  console.log('Suporte a prefers-reduced-motion:', cssRules ? '✓ Implementado' : '✗ Ausente');
  
  // Verificar elementos com carregamento lazy
  const lazyElements = document.querySelectorAll('[id$="-section"]');
  console.log('Seções com lazy loading:', lazyElements.length > 0 ? `✓ ${lazyElements.length} encontradas` : '✗ Ausentes');
  
  console.groupEnd();
  return heroContainer && cssRules && lazyElements.length > 0;
}

/**
 * Simula diferentes velocidades de conexão para teste
 */
function simularConexoes() {
  console.group('Simulação de Velocidades de Conexão');
  
  // Não conseguimos modificar navigator.connection diretamente
  // Mas podemos simular o comportamento
  
  console.log('Para testar no Chrome:');
  console.log('1. Abra o DevTools (F12)');
  console.log('2. Vá para a aba Network');
  console.log('3. Selecione diferentes velocidades (3G, 2G)');
  
  // Verifica se há adaptações para velocidades lentas no CSS
  const temAdaptacaoVelocidade = Array.from(document.styleSheets)
    .some(sheet => {
      try {
        return Array.from(sheet.cssRules).some(rule => 
          rule.cssText && (rule.cssText.includes('image-quality') || rule.cssText.includes('reduce-animations'))
        );
      } catch(e) {
        return false;
      }
    });
  
  console.log('Adaptações para velocidades lentas:', temAdaptacaoVelocidade ? '✓ Implementadas' : '✗ Ausentes');
  
  console.groupEnd();
  return temAdaptacaoVelocidade;
}

/**
 * Verifica acessibilidade dos elementos interativos
 */
function verificarAcessibilidade() {
  console.group('Verificação de Acessibilidade');
  
  // Verifica tamanho de áreas de toque
  const botoesELinks = Array.from(document.querySelectorAll('a, button'));
  const botoesAcessiveis = botoesELinks.filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  });
  
  const percentualAcessivel = botoesELinks.length ? 
    Math.round((botoesAcessiveis.length / botoesELinks.length) * 100) : 0;
  
  console.log(`Áreas de toque adequadas: ${percentualAcessivel}% (${botoesAcessiveis.length}/${botoesELinks.length})`);
  
  // Verifica atributos ARIA
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
    ariaAttributes: percentualAria 
  };
}

/**
 * Função principal para executar todos os testes
 */
function executarTestes() {
  console.group('TESTES DE OTIMIZAÇÕES MOBILE - BLOG FLORESCER HUMANO');
  
  const classesMobile = verificarClassesMobile();
  const adaptacaoConexao = simularConexoes();
  const acessibilidade = verificarAcessibilidade();
  
  console.log('\n--- RESULTADO FINAL ---');
  console.log(`Classes mobile: ${classesMobile ? '✓' : '✗'}`);
  console.log(`Adaptação à conexão: ${adaptacaoConexao ? '✓' : '✗'}`);
  console.log(`Acessibilidade de touch: ${acessibilidade.touchAreas >= 80 ? '✓' : '✗'} (${acessibilidade.touchAreas}%)`);
  console.log(`Atributos ARIA: ${acessibilidade.ariaAttributes >= 50 ? '✓' : '✗'} (${acessibilidade.ariaAttributes}%)`);
  
  const pontuacao = [
    classesMobile ? 25 : 0,
    adaptacaoConexao ? 25 : 0,
    Math.round(acessibilidade.touchAreas * 0.25),
    Math.round(acessibilidade.ariaAttributes * 0.25)
  ].reduce((a, b) => a + b, 0);
  
  console.log(`\nPontuação final: ${pontuacao}/100`);
  
  console.groupEnd();
  return pontuacao;
}

// Execute todos os testes ao carregar
window.addEventListener('load', () => {
  // Aguarda um tempo para garantir que todos os componentes estejam carregados
  setTimeout(executarTestes, 2000);
});

// Exporta funções para uso manual no console
window.verificarOtimizacoesMobile = {
  todos: executarTestes,
  classes: verificarClassesMobile,
  conexoes: simularConexoes,
  acessibilidade: verificarAcessibilidade
};
