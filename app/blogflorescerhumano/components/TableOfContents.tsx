'use client';

import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  articleContentId: string;
}

export default function TableOfContents({ articleContentId }: TableOfContentsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [sectionCount, setSectionCount] = useState(0);

  useEffect(() => {
    const articleContent = document.querySelector(`#${articleContentId}`);
    if (!articleContent) return;

    const headings = articleContent.querySelectorAll('h2, h3');
    if (!headings || headings.length < 3) return;

    const tocList = document.createElement('ul');
    tocList.className = 'pl-5 space-y-2';
    
    // Adicionar contador para o número de seções
    let h2Count = 0;
    
    headings.forEach((heading, index) => {
      // Os headings já devem ter IDs semânticos
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }
      
      // Conta apenas os H2 para saber o número de seções principais
      if (heading.tagName === 'H2') {
        h2Count++;
      }
      
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.className = heading.tagName === 'H2' 
        ? 'text-[#583B1F] hover:text-[#C19A6B] font-medium transition-colors' 
        : 'text-[#735B43] hover:text-[#C19A6B] text-sm pl-4 inline-block transition-colors';
      
      // Adicionar efeito de hover suave 
      link.addEventListener('mouseover', () => {
        link.style.paddingLeft = heading.tagName === 'H2' ? '4px' : '8px';
      });
      
      link.addEventListener('mouseout', () => {
        link.style.paddingLeft = heading.tagName === 'H2' ? '0' : '4px';
      });
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
    
    // Limpar qualquer conteúdo existente no elemento tocContainer
    const tocContainer = document.getElementById('toc-container');
    if (tocContainer) {
      // Limpar conteúdo anterior, se houver
      while (tocContainer.firstChild) {
        tocContainer.removeChild(tocContainer.firstChild);
      }
      
      // Adicionar a nova lista
      tocContainer.appendChild(tocList);
    }
    
    // Atualizar o estado
    setSectionCount(h2Count);
    setIsVisible(true);
  }, [articleContentId]);

  if (!isVisible) return null;

  return (
    <div className="mb-8 p-5 bg-[#F8F5F0] rounded-lg border border-[#C19A6B]/20 shadow-sm">
      <h4 className="text-lg font-semibold mb-3 text-[#583B1F]">
        Índice do artigo: <span className="text-sm font-normal text-[#735B43]">({sectionCount} seções)</span>
      </h4>
      <div id="toc-container"></div>
    </div>
  );
}
