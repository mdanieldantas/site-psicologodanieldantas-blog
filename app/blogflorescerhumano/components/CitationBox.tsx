'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, Share2 } from 'lucide-react';

interface CitationBoxProps {
  title: string;
  author: string;
  date: string;
  url: string;
}

export default function CitationBox({ title, author, date, url }: CitationBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  // Estado para armazenar a data de acesso atual - será calculada apenas uma vez quando o componente for montado
  const [accessDate] = useState(() => {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear()
    };
  });
    
  // Parse date to get year
  const publishYear = new Date(date).getFullYear();
  
  // Tratamento especial para o autor específico do blog
  let authorLastName = "Dantas";
  let authorFirstName = "Marcos Daniel Gomes";
  
  // Se o nome passado na props não é o padrão, usamos a lógica normal de split
  if (author !== "Marcos Daniel Gomes Dantas" && author !== "Daniel Dantas") {
    authorLastName = author.split(' ').pop() || author;
    authorFirstName = author.split(' ').shift() || '';
  }
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Meses abreviados conforme ABNT
  const abntMonths = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
  
  const currentDay = accessDate.day;
  const currentMonth = abntMonths[accessDate.month];
  const currentYear = accessDate.year;
  
  // Iniciais do nome formatadas corretamente
  const nameInitials = authorFirstName.split(' ')
    .map(name => `${name[0].toUpperCase()}.`)
    .join(' ');
    // Data de publicação formatada
  const pubDate = new Date(date);
  const pubDay = pubDate.getDate();
  const pubMonth = abntMonths[pubDate.getMonth()];
  const pubYear = pubDate.getFullYear();
  // Meses abreviados para Vancouver (em inglês conforme padrão internacional)
  const vancouverMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const vancouverCurrentMonth = vancouverMonths[accessDate.month];
  
  // Iniciais sem pontos para Vancouver
  const vancouverNameInitials = authorFirstName.split(' ').map(name => name[0]).join('');
    // Meses por extenso em português para APA
  const apaMonths = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];  const apaMonth = apaMonths[pubDate.getMonth()];
  
  // Format citations
  // ABNT NBR 6023:2018  // SOBRENOME, Iniciais. Título do artigo. Nome do site/revista, [s.l.], dia mês ano. Disponível em: URL. Acesso em: dia mês abreviado. ano.
  const abntCitation = `${authorLastName.toUpperCase()}, ${nameInitials} ${title}. Florescer Humano, [s.l.], ${pubDay} ${pubMonth} ${pubYear}. Disponível em: ${url}. Acesso em: ${currentDay} ${currentMonth} ${currentYear}.`;
  
  // Versão para cópia para ABNT (com < > em volta da URL)
  const abntCopyVersion = `${authorLastName.toUpperCase()}, ${nameInitials} ${title}. Florescer Humano, [s.l.], ${pubDay} ${pubMonth} ${pubYear}. Disponível em: <${url}>. Acesso em: ${currentDay} ${currentMonth} ${currentYear}.`;
  
  // Versão de exibição formatada para ABNT
  const abntFormattedDisplay = `${authorLastName.toUpperCase()}, ${nameInitials} <strong>${title}</strong>. <em>Florescer Humano</em>, [s.l.], ${pubDay} ${pubMonth} ${pubYear}. Disponível em: ${url}. Acesso em: ${currentDay} ${currentMonth} ${currentYear}.`;
  
  // APA 7ª Edição (2019)
  // Sobrenome, Iniciais. (Ano, Mês Dia). Título do artigo. Nome do Site. URL
  const apaCitation = `${authorLastName}, ${nameInitials} (${pubYear}, ${apaMonth} ${pubDay}). ${title}. Florescer Humano. ${url}`;
  
  // Versão de exibição formatada para APA
  const apaFormattedDisplay = `${authorLastName}, ${nameInitials} (${pubYear}, ${apaMonth} ${pubDay}). <em>${title}</em>. Florescer Humano. ${url}`;
  
  // Vancouver (ICMJE)
  // Sobrenome Iniciais. Título do artigo. Nome do site [Internet]. Ano [citado AAAA Mês Dia]. Disponível em: URL
  const vancouverCitation = `${authorLastName} ${vancouverNameInitials}. ${title}. Florescer Humano [Internet]. ${pubYear} [citado ${currentYear} ${vancouverCurrentMonth} ${currentDay}]. Disponível em: ${url}`;  const handleCopy = (text: string, format: string) => {
    // Seleciona o texto apropriado para cada formato de citação
    let plainText = text;
    
    // Para ABNT, usa a versão com os sinais < > ao redor da URL
    if (format === 'abnt') {
      plainText = abntCopyVersion;
    } 
    // Para APA, usa o formato padrão
    else if (format === 'apa') {
      plainText = apaCitation;
    }
    // Para Vancouver, usa o formato padrão
    else {
      plainText = vancouverCitation;
    }
    navigator.clipboard.writeText(plainText);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  // Web Share API handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Artigo de ${author}: ${title}`,
          url: url
        });
        console.log('Conteúdo compartilhado com sucesso');
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      alert('Seu navegador não suporta compartilhamento nativo. Por favor, copie o link e compartilhe manualmente.');
    }
  };  return (
    <div className="mt-4 mb-6">
      {/* Header melhorado para mobile */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center justify-center sm:justify-start gap-2 text-base font-medium text-[#8C6D46] hover:text-[#C19A6B] transition-colors w-full sm:w-auto py-2 sm:py-0"
        >
          <FileText className="w-5 h-5" />
          Como citar este post
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center justify-center sm:justify-start gap-2 text-base font-medium text-[#8C6D46] hover:text-[#C19A6B] transition-colors w-full sm:w-auto py-2 sm:py-0"
          aria-label="Compartilhar este artigo"
        >
          <Share2 className="w-5 h-5" />
          <span>Compartilhar</span>
        </button>
      </div>
        {isOpen && (
        <div className="mt-3 p-3 sm:p-4 bg-[#F8F5F0]/60 rounded-lg border border-[#C19A6B]/10">
          <h4 className="text-sm font-medium text-[#5D4427] mb-3">Formatos de citação</h4>
          
          <div className="space-y-3 sm:space-y-4">
            {/* ABNT - Layout mobile otimizado */}
            <div>
              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-2">
                <h5 className="text-xs font-medium text-[#8C6D46] mb-1 xs:mb-0">ABNT (NBR 6023:2018)</h5>
                <button 
                  onClick={() => handleCopy(abntCitation, 'abnt')} 
                  className="text-xs flex items-center justify-center xs:justify-start gap-1 text-[#8C6D46]/70 hover:text-[#8C6D46] transition-colors bg-white/50 px-2 py-1 rounded border border-[#C19A6B]/20 w-full xs:w-auto"
                >
                  {copied === 'abnt' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar ABNT</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Container scrollável para citações longas em mobile */}
              <div className="text-xs leading-relaxed text-[#5D4427]/90 bg-white/50 p-3 rounded border border-[#C19A6B]/5 overflow-x-auto">
                <p 
                  dangerouslySetInnerHTML={{ __html: abntFormattedDisplay }} 
                  className="whitespace-pre-wrap break-words"
                />
              </div>
            </div>
            
            {/* APA - Layout mobile otimizado */}
            <div>
              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-2">
                <h5 className="text-xs font-medium text-[#8C6D46] mb-1 xs:mb-0">APA (7ª Edição)</h5>
                <button 
                  onClick={() => handleCopy(apaCitation, 'apa')} 
                  className="text-xs flex items-center justify-center xs:justify-start gap-1 text-[#8C6D46]/70 hover:text-[#8C6D46] transition-colors bg-white/50 px-2 py-1 rounded border border-[#C19A6B]/20 w-full xs:w-auto"
                >
                  {copied === 'apa' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar APA</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-xs leading-relaxed text-[#5D4427]/90 bg-white/50 p-3 rounded border border-[#C19A6B]/5 overflow-x-auto">
                <p 
                  dangerouslySetInnerHTML={{ __html: apaFormattedDisplay }} 
                  className="whitespace-pre-wrap break-words"
                />
              </div>
            </div>
            
            {/* Vancouver - Layout mobile otimizado */}
            <div>
              <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-2">
                <h5 className="text-xs font-medium text-[#8C6D46] mb-1 xs:mb-0">Vancouver (ICMJE)</h5>
                <button 
                  onClick={() => handleCopy(vancouverCitation, 'vancouver')} 
                  className="text-xs flex items-center justify-center xs:justify-start gap-1 text-[#8C6D46]/70 hover:text-[#8C6D46] transition-colors bg-white/50 px-2 py-1 rounded border border-[#C19A6B]/20 w-full xs:w-auto"
                >
                  {copied === 'vancouver' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Vancouver</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-xs leading-relaxed text-[#5D4427]/90 bg-white/50 p-3 rounded border border-[#C19A6B]/5 overflow-x-auto">
                <p className="whitespace-pre-wrap break-words">{vancouverCitation}</p>
              </div>
            </div>
          </div>
          
          {/* Nota informativa melhorada */}
          <div className="mt-4 p-2 bg-[#C19A6B]/5 rounded border border-[#C19A6B]/15">
            <p className="text-xs text-[#8C6D46]/70 flex items-start gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mt-0.5 flex-shrink-0 text-[#C19A6B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Verifique as normas específicas da sua instituição antes de usar.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
