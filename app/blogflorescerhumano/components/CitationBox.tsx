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
  };
  return (
    <div className="mt-4 mb-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center gap-2 text-base font-medium text-[#8C6D46] hover:text-[#C19A6B] transition-colors"
        >
          <FileText className="w-5 h-5" /> {/* Aumentado de w-4 h-4 para w-5 h-5 */}
          Como citar este post
        </button>        <button 
          onClick={handleShare}
          className="flex items-center gap-2 text-base font-medium text-[#8C6D46] hover:text-[#C19A6B] transition-colors"
          aria-label="Compartilhar este artigo"
        >
          <Share2 className="w-5 h-5" /> {/* Aumentado de w-4 h-4 para w-5 h-5 */}
          <span className="hidden sm:inline">Compartilhar</span>
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-3 p-4 bg-[#F8F5F0]/60 rounded-lg border border-[#C19A6B]/10">
          <h4 className="text-sm font-medium text-[#5D4427] mb-3">Formatos de citação</h4>
          
          <div className="space-y-4">
            {/* ABNT */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-xs font-medium text-[#8C6D46]">ABNT</h5>
                <button 
                  onClick={() => handleCopy(abntCitation, 'abnt')} 
                  className="text-xs flex items-center gap-1 text-[#8C6D46]/70 hover:text-[#8C6D46] transition-colors"
                >
                  {copied === 'abnt' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>              <div className="text-xs leading-relaxed text-[#5D4427]/90 bg-white/50 p-2 rounded border border-[#C19A6B]/5">
                <p dangerouslySetInnerHTML={{ __html: abntFormattedDisplay }} />
              </div>
            </div>
            
            {/* APA */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-xs font-medium text-[#8C6D46]">APA</h5>                <button 
                  onClick={() => handleCopy(apaCitation, 'apa')} 
                  className="text-xs flex items-center gap-1 text-[#8C6D46]/70 hover:text-[#8C6D46] transition-colors"
                >
                  {copied === 'apa' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>              <div className="text-xs leading-relaxed text-[#5D4427]/90 bg-white/50 p-2 rounded border border-[#C19A6B]/5">
                <p dangerouslySetInnerHTML={{ __html: apaFormattedDisplay }} />
              </div>
            </div>
            
            {/* Vancouver */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-xs font-medium text-[#8C6D46]">Vancouver</h5>                <button 
                  onClick={() => handleCopy(vancouverCitation, 'vancouver')} 
                  className="text-xs flex items-center gap-1 text-[#8C6D46]/70 hover:text-[#8C6D46] transition-colors"
                >
                  {copied === 'vancouver' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>              <div className="text-xs leading-relaxed text-[#5D4427]/90 bg-white/50 p-2 rounded border border-[#C19A6B]/5">
                <p>{vancouverCitation}</p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-[#8C6D46]/70 mt-4">
            Não se esqueça de verificar as normas específicas da sua instituição.
          </p>
        </div>
      )}
    </div>
  );
}
