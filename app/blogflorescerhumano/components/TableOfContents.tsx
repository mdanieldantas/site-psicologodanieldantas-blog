'use client';

import { useState, useEffect } from 'react';

interface TableOfContentsProps {
  articleContentId: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ articleContentId }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Função para coletar os headings depois que o componente for montado
    const collectHeadings = () => {
      const articleContent = document.getElementById(articleContentId);
      if (!articleContent) return;

      // Busca todos os h2 e h3 dentro do conteúdo do artigo
      const headingElements = articleContent.querySelectorAll('h2, h3');
      if (!headingElements || headingElements.length < 3) return;

      // Transforma os elementos em um array de objetos com id, texto e nível
      const headingsData = Array.from(headingElements).map(heading => {
        // Garantir que todos os headings tenham IDs
        if (!heading.id) {
          const headingText = heading.textContent?.trim() || '';
          heading.id = headingText
            .toLowerCase()
            .replace(/[^\w\sáàâãéèêíïóôõöúçñ]/g, '')
            .replace(/\s+/g, '-') || `heading-${Math.random().toString(36).substring(2, 9)}`;
        }
        
        return {
          id: heading.id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName[1]) // h2 -> 2, h3 -> 3
        };
      });

      // Só exibe o índice se houver pelo menos 3 títulos
      if (headingsData.length >= 3) {
        setHeadings(headingsData);
        setVisible(true);
      }
    };

    // Executa a função após o componente ser montado
    // Pequeno delay para garantir que os IDs são processados
    setTimeout(collectHeadings, 100);
  }, [articleContentId]);

  // Conta o número de seções principais (h2)
  const mainSectionsCount = headings.filter(heading => heading.level === 2).length;

  // Se não houver headings ou não for visível, não renderiza nada
  if (!visible || headings.length === 0) {
    return null;
  }
  // Função para scrollar suavemente ao clicar nos links
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Compensar o header fixo
        behavior: 'smooth'
      });
      
      // Destacar brevemente o elemento clicado
      element.style.transition = 'background-color 0.5s ease';
      element.style.backgroundColor = 'rgba(193, 154, 107, 0.1)';
      setTimeout(() => {
        element.style.backgroundColor = 'transparent';
      }, 1500);
      
      // Atualizar URL com o hash
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div 
      className="mb-8 p-5 bg-[#F8F5F0] rounded-lg border border-[#C19A6B]/20 shadow-sm"
    >
      <h4 className="text-lg font-semibold mb-3 text-[#583B1F] flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2 text-[#C19A6B]" 
          fill="none"
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        Índice do artigo: <span className="text-sm font-normal text-[#735B43] ml-1">({mainSectionsCount} seções)</span>
      </h4>
      <ul className="pl-5 space-y-2">
        {headings.map((heading, index) => (
          <li key={index} className={heading.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleLinkClick(e, heading.id)}              className={
                heading.level === 2
                  ? "text-[#583B1F] hover:text-[#C19A6B] font-medium transition-colors flex items-center"
                  : "text-[#735B43] hover:text-[#C19A6B] text-sm flex items-center"
              }
              style={{ transition: 'padding-left 0.2s ease' }}
              onMouseOver={(e) => {
                e.currentTarget.style.paddingLeft = heading.level === 2 ? '4px' : '8px';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              {heading.level === 2 && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1.5 text-[#C19A6B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {heading.level === 3 && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-2 w-2 mr-1.5 text-[#735B43]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8" />
                </svg>
              )}
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
