// Script para melhorar a interação no botão de scroll
const initMobileInteractions = () => {
  const scrollButton = document.getElementById('scroll-indicator-button');
  
  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      // Calcula a altura da seção hero
      const heroSection = document.getElementById('hero-section');
      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
      
      // Rolagem suave para o conteúdo abaixo do hero
      window.scrollTo({
        top: heroHeight,
        behavior: 'smooth'
      });
    });
  }

  // Função para detectar se o usuário prefere movimento reduzido
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Ajusta o comportamento das animações conforme a preferência do usuário
  if (prefersReducedMotion()) {
    const animatedElements = document.querySelectorAll('.animate-bounce, .animate-pulse, [class*="animate-["]');
    animatedElements.forEach(element => {
      element.style.animation = 'none';
      element.style.transition = 'none';
    });
  }

  // Melhoria de performance em dispositivos móveis
  function optimizeMobileElements() {
    if (window.innerWidth <= 768) {
      // Aplica carregamento otimizado para elementos não visíveis inicialmente
      const deferredElements = document.querySelectorAll('.content-visibility-auto');
      deferredElements.forEach(element => {
        element.style.contentVisibility = 'auto';
        element.style.containIntrinsicSize = '0 500px'; // Valor aproximado
      });
    }
  }

  optimizeMobileElements();
  window.addEventListener('resize', optimizeMobileElements);
};

// Exporta a função de inicialização
export default function initMobileInteractionsModule() {
  // Verifica se estamos no browser (client-side)
  if (typeof window !== 'undefined') {
    // Se o DOM já estiver carregado, inicializa imediatamente
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initMobileInteractions();
    } else {
      // Caso contrário, espera pelo evento DOMContentLoaded
      document.addEventListener('DOMContentLoaded', initMobileInteractions);
    }
  }
  return null;
}
