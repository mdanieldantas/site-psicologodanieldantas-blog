'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
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

// Constantes para estilos
const ICON_SIZE = 44;
const SHARE_BUTTON_BASE_CLASS = "transform transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
const CONTAINER_CLASS = "flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 mb-6 w-full max-w-screen-lg mx-auto p-4 rounded-lg shadow-lg bg-white/80 backdrop-blur-sm";
const BUTTONS_CONTAINER_CLASS = "flex items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-2 flex-wrap sm:flex-nowrap";
const TITLE_CLASS = "text-gray-700 font-semibold mb-3 sm:mb-0 sm:mr-4 whitespace-nowrap text-center text-lg";
const SOCIAL_LINK_CLASS = "rounded-full hover:opacity-80 transition-opacity duration-200 cursor-pointer overflow-hidden";

// Componente de ícone de copiar link no estilo do react-share
interface CopyLinkIconProps {
  bgStyle?: React.CSSProperties;
  round?: boolean;
  size: number;
}

const CopyLinkIcon = React.memo<CopyLinkIconProps>(({ bgStyle = {}, round, size }) => {
  const baseStyle = useMemo(() => ({
    width: size,
    height: size,
    borderRadius: round ? '50%' : 0,
    backgroundColor: '#C19A6B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transform: 'scale(1)',
    transition: 'all 0.3s ease',
    ...bgStyle
  }), [size, round, bgStyle]);

  return (
    <div 
      style={baseStyle}
      className="hover:scale-110 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      <Image
        src="/blogflorescerhumano/icons-blog/icone-copiar-link.webp"
        alt="Copiar link"
        width={size}
        height={size}
        className="object-contain p-1.5"
      />
    </div>
  );
});

CopyLinkIcon.displayName = 'CopyLinkIcon';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = React.memo(({ url, title, summary }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Falha ao copiar link: ', err);
      setCopyStatus('idle');
    }
  }, [url]);

  const gmailUrl = useMemo(() => {
    const encodedSubject = encodeURIComponent(title);
    const emailBody = summary ? `${summary}\n\n${url}` : url;
    const encodedBody = encodeURIComponent(emailBody);
    return `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedBody}`;
  }, [title, summary, url]);

  return (
    <div className={CONTAINER_CLASS}>
      <span className={TITLE_CLASS}>
        Compartilhe:
      </span>
      <div className={BUTTONS_CONTAINER_CLASS}>
        {/* WhatsApp primeiro por ser mais popular no Brasil */}
        <WhatsappShareButton 
          url={url} 
          title={title} 
          separator=":: " 
          data-tooltip-id="tooltip-whatsapp" 
          data-tooltip-content="Compartilhar no WhatsApp"
          className={SHARE_BUTTON_BASE_CLASS}
        >
          <WhatsappIcon size={ICON_SIZE} round />
        </WhatsappShareButton>

        {/* Outras redes sociais */}
        <FacebookShareButton 
          url={url} 
          data-tooltip-id="tooltip-facebook" 
          data-tooltip-content="Compartilhar no Facebook"
          className={SHARE_BUTTON_BASE_CLASS}
        >
          <FacebookIcon size={ICON_SIZE} round />
        </FacebookShareButton>

        <LinkedinShareButton 
          url={url} 
          title={title} 
          summary={summary} 
          data-tooltip-id="tooltip-linkedin" 
          data-tooltip-content="Compartilhar no LinkedIn"
          className={SHARE_BUTTON_BASE_CLASS}
        >
          <LinkedinIcon size={ICON_SIZE} round />
        </LinkedinShareButton>

        <TwitterShareButton 
          url={url} 
          title={title} 
          data-tooltip-id="tooltip-twitter" 
          data-tooltip-content="Compartilhar no Twitter/X"
          className={SHARE_BUTTON_BASE_CLASS}
        >
          <TwitterIcon size={ICON_SIZE} round />
        </TwitterShareButton>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          data-tooltip-id="tooltip-instagram"
          data-tooltip-content="Abrir Instagram (copie o link primeiro!)"
          className={`${SHARE_BUTTON_BASE_CLASS} ${SOCIAL_LINK_CLASS}`}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        >
          <Image
            src="/blogflorescerhumano/icons-blog/instagram.png"
            alt="Abrir Instagram"
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="object-contain transform transition-transform duration-300 hover:scale-110"
          />
        </a>

        {/* Gmail */}
        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-tooltip-id="tooltip-email"
          data-tooltip-content="Compartilhar via Gmail"
          className={`${SHARE_BUTTON_BASE_CLASS} ${SOCIAL_LINK_CLASS}`}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        >
          <Image
            src="/blogflorescerhumano/icons-blog/gmail.png"
            alt="Compartilhar via Gmail"
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="object-contain transform transition-transform duration-300 hover:scale-110"
          />
        </a>
        
        {/* Botão Copiar Link */}
        <button
          onClick={handleCopy}
          className={`${SHARE_BUTTON_BASE_CLASS} relative`}
          data-tooltip-id="tooltip-copy"
          data-tooltip-content={copyStatus === 'idle' ? "Copiar link" : "Link copiado!"}
          aria-label={copyStatus === 'idle' ? "Copiar link do artigo" : "Link copiado!"}
        >
          <CopyLinkIcon 
            size={ICON_SIZE} 
            round 
            bgStyle={{
              backgroundColor: copyStatus === 'copied' ? '#22c55e' : '#C19A6B'
            }}
          />
          {copyStatus === 'copied' && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">
              ✓
            </span>
          )}
        </button>
      </div>

      {/* Tooltips estilizados */}
      <Tooltip id="tooltip-whatsapp" className="z-50 !bg-green-600 !opacity-100" place="top" />
      <Tooltip id="tooltip-facebook" className="z-50 !bg-blue-600 !opacity-100" place="top" />
      <Tooltip id="tooltip-linkedin" className="z-50 !bg-blue-700 !opacity-100" place="top" />
      <Tooltip id="tooltip-twitter" className="z-50 !bg-sky-500 !opacity-100" place="top" />
      <Tooltip id="tooltip-instagram" className="z-50 !bg-pink-600 !opacity-100" place="top" />
      <Tooltip id="tooltip-email" className="z-50 !bg-red-500 !opacity-100" place="top" />
      <Tooltip id="tooltip-copy" className="z-50 !bg-amber-700 !opacity-100" place="top" />
    </div>
  );
});

ShareButtons.displayName = 'ShareButtons';

export default ShareButtons;
