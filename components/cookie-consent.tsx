"use client";

import { useEffect, useState, useRef } from "react";
import CookieConsentComponent from "react-cookie-consent";
import Link from "next/link";

const GTM_ID = "GTM-P546DSSG";

// Usando uma interface única para não conflitar com declarações existentes
interface CustomWindow extends Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

export default function CookieConsent() {
  // Estado para controlar o modal de configurações avançadas
  const [showSettings, setShowSettings] = useState(false);
  
  // Estados para cada tipo de cookie
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [adsConsent, setAdsConsent] = useState(false);
  
  // Referências para foco nos modais (acessibilidade)
  const modalFirstFocusRef = useRef<HTMLButtonElement>(null);
  const mainConsentButtonRef = useRef<HTMLButtonElement>(null);
  
  // Função para verificar se o usuário já deu consentimento
  const checkExistingConsent = () => {
    if (typeof window === "undefined") return false;
    return document.cookie.split(';').some((item) => item.trim().startsWith('cookieConsent=true'));
  };
  
  // Função para carregar o GTM
  const loadGTM = (customWindow: CustomWindow) => {
    const gtmScriptId = `gtm-script-${GTM_ID}`;
    if (!document.getElementById(gtmScriptId)) {
      customWindow.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js"
      });

      const script = document.createElement("script");
      script.id = gtmScriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(script);
    }
  };

  // Inicializa o GTM e configura o consentimento padrão
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Cast window para nossa interface customizada
    const customWindow = window as unknown as CustomWindow;
    
    // Inicializa dataLayer
    customWindow.dataLayer = customWindow.dataLayer || [];
    
    // Define a função gtag
    if (typeof customWindow.gtag !== "function") {
      customWindow.gtag = function(...args) {
        customWindow.dataLayer.push(args);
      };
    }

    // Define o estado de consentimento padrão (negado para tudo)
    customWindow.gtag("consent", "default", {
      "analytics_storage": "denied",
      "ad_storage": "denied",
      "ad_user_data": "denied",
      "ad_personalization": "denied",
    });
    
    // Verifica se já existe consentimento
    const hasConsent = checkExistingConsent();
    
    // Só carrega o GTM se o usuário já consentiu anteriormente
    if (hasConsent) {
      loadGTM(customWindow);
    }
  }, []);

  // Focus no modal quando ele abrir (acessibilidade)
  useEffect(() => {
    if (showSettings && modalFirstFocusRef.current) {
      setTimeout(() => {
        modalFirstFocusRef.current?.focus();
      }, 100);
    }
  }, [showSettings]);
  
  // Focus no botão principal do modal de consentimento quando ele for exibido
  useEffect(() => {
    if (!checkExistingConsent() && mainConsentButtonRef.current) {
      setTimeout(() => {
        mainConsentButtonRef.current?.focus();
      }, 300);
    }
  }, []);

  // Função para lidar com aceitação de cookies
  const handleAccept = () => {
    if (typeof window !== "undefined") {
      const customWindow = window as unknown as CustomWindow;
      if (typeof customWindow.gtag === "function") {
        customWindow.gtag("consent", "update", {
          "analytics_storage": "granted",
          "ad_storage": "granted",
          "ad_user_data": "granted",
          "ad_personalization": "granted",
        });
      }
      
      // Carrega o GTM após consentimento
      loadGTM(customWindow);
      
      // Define o cookie de consentimento por 365 dias
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 365);
      document.cookie = `cookieConsent=true; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
      
      // Força a atualização do estado para esconder o banner
      setHasMounted(false);
      setTimeout(() => setHasMounted(true), 50);
    }
  };

  // Função para lidar com recusa de cookies
  const handleDecline = () => {
    if (typeof window !== "undefined") {
      const customWindow = window as unknown as CustomWindow;
      if (typeof customWindow.gtag === "function") {
        customWindow.gtag("consent", "update", {
          "analytics_storage": "denied",
          "ad_storage": "denied",
          "ad_user_data": "denied",
          "ad_personalization": "denied",
        });
      }
    }
  };
  
  // Função para lidar com preferências personalizadas
  const handleSavePreferences = () => {
    if (typeof window !== "undefined") {
      const customWindow = window as unknown as CustomWindow;
      if (typeof customWindow.gtag === "function") {
        customWindow.gtag("consent", "update", {
          "analytics_storage": analyticsConsent ? "granted" : "denied",
          "ad_storage": adsConsent ? "granted" : "denied",
          "ad_user_data": adsConsent ? "granted" : "denied",
          "ad_personalization": adsConsent ? "granted" : "denied",
        });
      }
      
      // Só carrega o GTM se pelo menos uma categoria for aceita
      if (analyticsConsent || adsConsent) {
        loadGTM(customWindow);
      }
      
      // Fecha o modal de configurações
      setShowSettings(false);
    }
  };
  
  // Função para tratar tecla ESC no modal
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowSettings(false);
    }
  };

  // Estado para controlar a renderização após montagem do componente
  const [hasMounted, setHasMounted] = useState(false);
  
  // Atualiza o estado após a montagem do componente para evitar erros de hidratação
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // Durante a renderização inicial, exibimos apenas o iframe GTM noscript
  if (!hasMounted) {
    return (
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    );
  }
  
  // Após montar no cliente, agora é seguro verificar cookies
  // Se o usuário já deu consentimento, não mostra nenhum modal
  if (checkExistingConsent()) {
    return (
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    );
  }

  return (
    <>
      {/* Modal principal de consentimento de cookies (em vez de banner) */}
      {!showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
        >
          <div className="bg-[#F8F5F1] rounded-lg shadow-xl w-full max-w-xl border border-[#D3BFA8] mx-3 sm:mx-auto animate-scale-in">
            <div className="p-5 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl mr-3 animate-bounce-subtle">🍪</span>
                <h2 
                  id="cookie-consent-title" 
                  className="text-lg sm:text-xl font-semibold text-[#583B1F]"
                >
                  Seu bem-estar está em primeiro lugar
                </h2>
              </div>
              
              <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed text-[#583B1F]">
                Utilizamos cookies para personalizar sua <strong>experiência terapêutica online</strong> e oferecer conteúdo adaptado às suas necessidades únicas em saúde mental. Isso nos ajuda a entender melhor como podemos <strong>apoiar sua jornada</strong>.
              </p>
              
              <div className="mb-3 sm:mb-4 space-y-2">
                <div className="flex items-center text-[#583B1F] text-xs sm:text-sm">
                  <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#4D8B31] rounded-full mr-2 opacity-80"></span>
                  <span>Cookies essenciais: Sempre ativos para o funcionamento do site</span>
                </div>
                <div className="flex items-center text-[#583B1F] text-xs sm:text-sm">
                  <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#583B1F] rounded-full mr-2 opacity-80"></span>
                  <span>Cookies analíticos: Personalizam seu atendimento</span>
                </div>
              </div>
              
              <div className="flex items-center text-xs sm:text-sm mb-5 sm:mb-6">
                <Link 
                  href="/politica-de-privacidade" 
                  className="text-[#583B1F] mr-4 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#D3BFA8] focus:ring-offset-1 rounded px-1"
                  aria-label="Ver nossa política de privacidade"
                  target="_blank"
                >
                  Política de privacidade
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSettings(true);
                  }}
                  className="text-[#583B1F] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#D3BFA8] focus:ring-offset-1 rounded px-1"
                  aria-label="Personalizar suas preferências de cookies"
                >
                  Personalizar opções
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
                <button
                  ref={mainConsentButtonRef}
                  onClick={handleAccept}
                  className="py-3 px-6 bg-gradient-to-r from-[#4D8B31] to-[#5ca13c] text-white rounded-md hover:from-[#3e6f27] hover:to-[#4d8831] font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] shadow-md focus:outline-none focus:ring-2 focus:ring-[#4D8B31] focus:ring-offset-2"
                  aria-label="Aceitar todos os cookies e melhorar sua experiência"
                >
                  Aceitar e Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de configurações personalizadas - Otimizado para mobile */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={(e) => {
            // Fechar apenas se clicar no fundo escuro
            if (e.target === e.currentTarget) {
              setShowSettings(false);
            }
          }}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
        >
          <div className="bg-[#F8F5F1] rounded-lg shadow-xl p-5 sm:p-7 w-full max-w-md border border-[#D3BFA8] mx-3 sm:mx-auto animate-scale-in">
            <h3 
              id="cookie-preferences-title" 
              className="text-lg sm:text-xl font-semibold text-[#583B1F] mb-2 sm:mb-3"
            >
              Suas Preferências de Privacidade
            </h3>
            <p className="text-xs sm:text-sm text-[#735B43] mb-4 sm:mb-5 leading-relaxed">
              Personalize suas preferências para uma experiência terapêutica online alinhada com suas necessidades. Você está no controle.
            </p>
            
            <div className="space-y-3.5 sm:space-y-4.5 mb-6 sm:mb-7">
              <div className="flex items-center justify-between py-2.5 sm:py-3.5 border-b border-[#D3BFA8] transition-colors hover:bg-[#f0ebe4] rounded px-2">
                <div className="pr-3">
                  <p className="font-medium text-sm sm:text-base text-[#583B1F]">Cookies Essenciais</p>
                  <p className="text-xs sm:text-sm text-[#735B43] leading-relaxed">
                    Necessários para o funcionamento básico do site e sua segurança
                  </p>
                </div>
                <div className="relative bg-[#EAE2D4] px-3 py-1 rounded-full flex items-center">
                  <input type="checkbox" checked disabled className="sr-only" />
                  <span className="text-xs text-[#583B1F] font-medium">
                    Sempre ativo
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2.5 sm:py-3.5 border-b border-[#D3BFA8] transition-colors hover:bg-[#f0ebe4] rounded px-2">
                <div className="pr-3">
                  <p className="font-medium text-sm sm:text-base text-[#583B1F]">Cookies Analíticos</p>
                  <p className="text-xs sm:text-sm text-[#735B43] leading-relaxed">
                    Nos ajudam a personalizar seu atendimento terapêutico online e melhorar nosso conteúdo para suas necessidades específicas
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="analytics-toggle">
                  <input 
                    id="analytics-toggle"
                    type="checkbox" 
                    checked={analyticsConsent}
                    onChange={() => setAnalyticsConsent(!analyticsConsent)}
                    className="sr-only peer" 
                    aria-label="Aceitar cookies analíticos"
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D3BFA8] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4D8B31]"></div>
                  <span className="sr-only">Aceitar cookies analíticos</span>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2.5 sm:py-3.5 transition-colors hover:bg-[#f0ebe4] rounded px-2">
                <div className="pr-3">
                  <p className="font-medium text-sm sm:text-base text-[#583B1F]">Cookies de Marketing</p>
                  <p className="text-xs sm:text-sm text-[#735B43] leading-relaxed">
                    Ajudam a oferecer recursos relevantes para sua jornada de autoconhecimento e bem-estar emocional
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="marketing-toggle">
                  <input 
                    id="marketing-toggle"
                    type="checkbox" 
                    checked={adsConsent}
                    onChange={() => setAdsConsent(!adsConsent)}
                    className="sr-only peer" 
                    aria-label="Aceitar cookies de marketing"
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D3BFA8] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4D8B31]"></div>
                  <span className="sr-only">Aceitar cookies de marketing</span>
                </label>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowSettings(false)}
                className="w-full sm:w-auto px-5 py-2.5 mt-2 sm:mt-0 border border-[#D3BFA8] rounded-md text-[#583B1F] hover:bg-[#f0ebe4] font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#D3BFA8]"
                aria-label="Cancelar e voltar ao banner de cookies"
              >
                Cancelar
              </button>
              <button
                ref={modalFirstFocusRef}
                onClick={handleSavePreferences}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#4D8B31] to-[#5ca13c] text-white rounded-md hover:from-[#3e6f27] hover:to-[#4d8831] font-medium text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-md focus:outline-none focus:ring-2 focus:ring-[#4D8B31]"
                aria-label="Salvar suas preferências de cookies"
              >
                Salvar minhas preferências
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}