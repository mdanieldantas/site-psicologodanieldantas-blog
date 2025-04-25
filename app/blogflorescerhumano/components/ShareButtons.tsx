'use client';

import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';

// SVG Icon for Copy Link
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876V5.25a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125Zm-1.5-10.124a.75.75 0 0 0-1.5 0v2.25a.75.75 0 0 0 1.5 0v-2.25Z" />
  </svg>
);

// SVG Icon for Instagram (Simplified)
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string; // Opcional para Email
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, summary }) => {
  const iconSize = 32; // Tamanho dos ícones
  const round = true; // Ícones arredondados
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle'); // Estado para feedback

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reseta após 2 segundos
    } catch (err) {
      console.error('Falha ao copiar link: ', err);
      // Poderia adicionar um estado de erro aqui
    }
  };

  // Constrói a URL do Gmail
  const encodedSubject = encodeURIComponent(title);
  const emailBody = summary ? `${summary}\n\n${url}` : url;
  const encodedBody = encodeURIComponent(emailBody);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedBody}`;

  console.log("Gmail URL Gerada:", gmailUrl);

  return (
    <div className="flex items-center flex-wrap gap-2 mt-4 mb-6"> {/* Usar flex-wrap e gap */} 
      <span className="text-gray-700 font-semibold mr-2">Compartilhe:</span>
      <TwitterShareButton url={url} title={title} data-tooltip-id="tooltip-twitter" data-tooltip-content="Compartilhar no Twitter/X">
        <TwitterIcon size={iconSize} round={round} />
      </TwitterShareButton>

      <FacebookShareButton url={url} data-tooltip-id="tooltip-facebook" data-tooltip-content="Compartilhar no Facebook">
        <FacebookIcon size={iconSize} round={round} />
      </FacebookShareButton>

      <WhatsappShareButton url={url} title={title} separator=":: " data-tooltip-id="tooltip-whatsapp" data-tooltip-content="Compartilhar no WhatsApp">
        <WhatsappIcon size={iconSize} round={round} />
      </WhatsappShareButton>

      <LinkedinShareButton url={url} title={title} summary={summary} data-tooltip-id="tooltip-linkedin" data-tooltip-content="Compartilhar no LinkedIn">
        <LinkedinIcon size={iconSize} round={round} />
      </LinkedinShareButton>

      {/* Link direto para Gmail */}
      <a
        href={gmailUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-tooltip-id="tooltip-email"
        data-tooltip-content="Compartilhar via Gmail"
        className="flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        <EmailIcon size={iconSize} round={round} />
      </a>

      {/* Link para Instagram */}
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        data-tooltip-id="tooltip-instagram"
        data-tooltip-content="Abrir Instagram (copie o link primeiro!)"
        className="flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        <InstagramIcon />
      </a>

      {/* Botão Copiar Link */}
      <button
        onClick={handleCopy}
        className="flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        aria-label={copyStatus === 'idle' ? "Copiar link do artigo" : "Link copiado!"}
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }} // Garante tamanho consistente
        data-tooltip-id="tooltip-copy"
        data-tooltip-content={copyStatus === 'idle' ? "Copiar link" : "Link copiado!"}
      >
        {copyStatus === 'idle' ? (
          <CopyIcon />
        ) : (
          <span className="text-xs font-semibold">✓</span> // Feedback visual simples
        )}
      </button>

      {/* Componente Tooltip (requer instalação de react-tooltip) */}
      <Tooltip id="tooltip-twitter" />
      <Tooltip id="tooltip-facebook" />
      <Tooltip id="tooltip-whatsapp" />
      <Tooltip id="tooltip-linkedin" />
      <Tooltip id="tooltip-email" /> {/* Garantindo que está descomentado */}
      <Tooltip id="tooltip-instagram" /> {/* Tooltip para Instagram */}
      <Tooltip id="tooltip-copy" />
    </div>
  );
};

export default ShareButtons;
