'use client';

import React, { useState } from 'react';
import Image from 'next/image'; // Garanta que Image está importado
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'react-share';

// SVG Icon for Copy Link (Alterado para ícone de Link)
const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
  </svg>
);

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, summary }) => {
  const iconSize = 32;
  const round = true;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

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
    <div className="flex items-center flex-wrap gap-2 mt-4 mb-6"> 
      <span className="text-gray-700 font-semibold mr-2">Compartilhe:</span>
      {/* --- Botões react-share --- */}
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

      {/* --- Botões Customizados --- */}
      {/* Link para Instagram com Logo PNG (Movido para antes do Gmail) */}
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        data-tooltip-id="tooltip-instagram"
        data-tooltip-content="Abrir Instagram (copie o link primeiro!)"
        className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity duration-200 cursor-pointer overflow-hidden"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        {/* Usando Image para o logo do Instagram */}
        <Image
          src="/blogflorescerhumano/icons-blog/instagram.png" // Caminho atualizado
          alt="Abrir Instagram"
          width={iconSize}
          height={iconSize}
          className="object-contain"
        />
      </a>

      {/* Link direto para Gmail com Logo PNG */}
      <a
        href={gmailUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-tooltip-id="tooltip-email"
        data-tooltip-content="Compartilhar via Gmail"
        className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity duration-200 cursor-pointer overflow-hidden"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        {/* Usando Image para o logo do Gmail */}
        <Image
          src="/blogflorescerhumano/icons-blog/gmail.png" // Caminho atualizado
          alt="Compartilhar via Gmail"
          width={iconSize}
          height={iconSize}
          className="object-contain"
        />
      </a>

      {/* Botão Copiar Link */}
      <button
        onClick={handleCopy}
         // Removido bg-gray-200, adicionado hover:opacity-80, padding p-1
        className="flex items-center justify-center p-1 rounded-full hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
        aria-label={copyStatus === 'idle' ? "Copiar link do artigo" : "Link copiado!"}
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
        data-tooltip-id="tooltip-copy"
        data-tooltip-content={copyStatus === 'idle' ? "Copiar link" : "Link copiado!"}
      >
        {copyStatus === 'idle' ? (
          <LinkIcon /> // Usa o novo ícone de Link
        ) : (
          <span className="text-xs font-semibold text-green-600">✓</span> // Feedback visual com cor
        )}
      </button>

      {/* Tooltips (Ordem ajustada) */}
      <Tooltip id="tooltip-twitter" />
      <Tooltip id="tooltip-facebook" />
      <Tooltip id="tooltip-whatsapp" />
      <Tooltip id="tooltip-linkedin" />
      <Tooltip id="tooltip-instagram" /> {/* Movido para antes do email */}
      <Tooltip id="tooltip-email" />
      <Tooltip id="tooltip-copy" />
    </div>
  );
};

export default ShareButtons;
