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

// Componente de ícone de copiar link no estilo do react-share
interface CopyLinkIconProps {
  bgStyle?: React.CSSProperties;
  round?: boolean;
  size: number;
}

const CopyLinkIcon: React.FC<CopyLinkIconProps> = ({ bgStyle = {}, round, size }) => {
  const baseStyle = {
    width: size,
    height: size,
    borderRadius: round ? '50%' : 0,
    backgroundColor: '#C19A6B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...bgStyle
  };

  return (
    <div style={baseStyle}>
      <Image
        src="/blogflorescerhumano/icons-blog/icone-copiar-link.webp"
        alt="Copiar link"
        width={size}
        height={size}
        className="object-contain p-1.5"
      />
    </div>
  );
};

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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mt-4 mb-6 w-full overflow-x-auto">
      <span className="text-gray-700 font-semibold mb-2 sm:mb-0 sm:mr-2 whitespace-nowrap text-center">Compartilhe:</span>
      <div className="flex items-center justify-center gap-0.5 sm:gap-1 w-full sm:w-auto px-1">
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
        
        {/* Botão Copiar Link no estilo react-share */}
        <button
          onClick={handleCopy}
          className="cursor-pointer focus:outline-none hover:opacity-90 transition-opacity"
          data-tooltip-id="tooltip-copy"
          data-tooltip-content={copyStatus === 'idle' ? "Copiar link" : "Link copiado!"}
          aria-label={copyStatus === 'idle' ? "Copiar link do artigo" : "Link copiado!"}
        >
          <CopyLinkIcon 
            size={iconSize} 
            round={round} 
            bgStyle={{
              backgroundColor: copyStatus === 'copied' ? '#22c55e' : '#C19A6B'
            }}
          />
        </button>
      </div>

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
