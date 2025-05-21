'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

// Constantes para estilos
const MOBILE_ICON_SIZE = 36;
const DESKTOP_ICON_SIZE = 44;
const SHARE_BUTTON_BASE_CLASS = "transform transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
const CONTAINER_CLASS = "hidden sm:flex sm:flex-row items-center justify-center gap-2 mt-4 mb-6 w-full max-w-screen-lg mx-auto p-4 rounded-lg shadow-lg bg-white/80 backdrop-blur-sm";
const MOBILE_CONTAINER_CLASS = "sm:hidden fixed bottom-20 right-4 z-50";
const MOBILE_TRIGGER_CLASS = "group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg transform transition-all duration-300 active:scale-95 hover:scale-105 hover:bg-white";
const MODAL_OVERLAY_CLASS = "fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity";
const MODAL_CONTENT_CLASS = "fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 z-50 transform transition-transform duration-300";
const BUTTONS_GRID_CLASS = "grid grid-cols-3 gap-4 mt-4";
const TITLE_CLASS = "text-gray-700 font-semibold mb-3 sm:mb-0 sm:mr-4 whitespace-nowrap text-center text-lg";
const SOCIAL_LINK_CLASS = "rounded-full hover:opacity-80 transition-opacity duration-200 cursor-pointer overflow-hidden";

// Hook para detectar tamanho da tela
const useScreenSize = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    // Verifica tamanho inicial
    checkScreenSize();

    // Adiciona listener para mudanças de tamanho
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isDesktop;
};

// Componente de ícone de copiar link
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

// Componente do botão de compartilhamento
const ShareButton = React.memo(({ button, className }: { 
  button: { 
    platform: string; 
    icon: React.ReactNode; 
    onClick: () => void 
  }; 
  className?: string 
}) => (
  <div
    onClick={button.onClick}
    className={`${className || ''} flex flex-col items-center gap-2`}
    aria-label={`Compartilhar no ${button.platform}`}
  >
    <div className={`${SHARE_BUTTON_BASE_CLASS} cursor-pointer`}>
      {button.icon}
    </div>
    {className?.includes('flex-col') && (
      <span className="text-xs text-gray-600">{button.platform}</span>
    )}
  </div>
));

ShareButton.displayName = 'ShareButton';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = React.memo(({ url, title, summary }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const isDesktop = useScreenSize();

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

  const handleShare = async (platform: string, shareUrl: string) => {
    try {
      // Feedback tátil
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      if (platform === 'Copiar Link') {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para sua área de transferência.",
          variant: "default",
          duration: 2000,
        });
      } else {
        window.open(shareUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao tentar compartilhar. Por favor, tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const gmailUrl = useMemo(() => {
    const encodedSubject = encodeURIComponent(title);
    const emailBody = summary ? `${summary}\n\n${url}` : url;
    const encodedBody = encodeURIComponent(emailBody);
    return `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedSubject}&body=${encodedBody}`;
  }, [title, summary, url]);

  // Componentes de Compartilhamento
  const shareButtons = useMemo(() => [
    {
      platform: 'WhatsApp',
      icon: <WhatsappIcon size={isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE} round />,
      onClick: () => handleShare('WhatsApp', `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${summary}\n\n${url}`)}`)
    },
    {
      platform: 'Facebook',
      icon: <FacebookIcon size={isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE} round />,
      onClick: () => handleShare('Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
    },
    {
      platform: 'Twitter',
      icon: <TwitterIcon size={isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE} round />,
      onClick: () => handleShare('Twitter', `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)
    },
    {      platform: 'Telegram',
      icon: <svg style={{ width: isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE, height: isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE }} className="text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417 1.21.258 1.911.177-.184 3.247-2.977 3.307-3.233.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.49 -1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.466.141.145.118.181.344.203.483.023.139.039.424.026.595z"/></svg>,
      onClick: () => handleShare('Telegram', `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)
    },
    {
      platform: 'LinkedIn',
      icon: <LinkedinIcon size={isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE} round />,
      onClick: () => handleShare('LinkedIn', `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)
    },
    {
      platform: 'Gmail',
      icon: <Image
        src="/blogflorescerhumano/icons-blog/gmail.png"
        alt="Compartilhar via Gmail"
        width={isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE}
        height={isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE}
        className="object-contain"
      />,
      onClick: () => window.open(gmailUrl, '_blank')
    },
    {
      platform: 'Copiar Link',
      icon: <CopyLinkIcon 
        size={isDesktop ? DESKTOP_ICON_SIZE : MOBILE_ICON_SIZE}
        round 
        bgStyle={{
          backgroundColor: copyStatus === 'copied' ? '#22c55e' : '#C19A6B'
        }}
      />,
      onClick: handleCopy
    }
  ], [url, title, summary, copyStatus, gmailUrl, handleCopy, handleShare, isDesktop]);

  const renderShareButtons = useCallback((className?: string) => (
    shareButtons.map((button) => (
      <ShareButton
        key={button.platform}
        button={button}
        className={className}
      />
    ))
  ), [shareButtons]);

  return (
    <>
      {/* Versão Desktop */}
      <div className={CONTAINER_CLASS}>
        <span className={TITLE_CLASS}>
          Compartilhe:
        </span>
        <div className="flex items-center justify-center gap-3 w-auto">
          {renderShareButtons()}
        </div>
      </div>

      {/* Versão Mobile */}
      <div className={MOBILE_CONTAINER_CLASS}>
        {/* Botão Flutuante */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={MOBILE_TRIGGER_CLASS}
          aria-label="Abrir opções de compartilhamento"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Compartilhar</span>
        </button>

        {/* Modal com animações */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3, type: "spring", damping: 25 }}
                className="fixed z-50 inset-x-0 bottom-0 mx-auto bg-white rounded-t-2xl p-6 shadow-xl w-full max-w-lg"
              >
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Compartilhar artigo</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {renderShareButtons('flex-col')}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

ShareButtons.displayName = 'ShareButtons';

export default ShareButtons;
