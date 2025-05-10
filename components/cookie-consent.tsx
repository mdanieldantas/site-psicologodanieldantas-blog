"use client";

import { useEffect, useState } from "react";

const GTM_ID = "GTM-P546DSSG";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Garantimos que este código só rodará no navegador (client-side)
    if (typeof window === 'undefined') return;
    
    console.log("Antes da inicialização:", window.dataLayer); // Log 1
    // Garante que dataLayer e gtag estejam inicializados
    window.dataLayer = window.dataLayer || [];
    console.log("Após a inicialização:", window.dataLayer); // Log 2
    
    // Garante que a função gtag esteja definida para chamadas subsequentes
    // Esta função enviará os argumentos diretamente para o dataLayer
    if (typeof (window as any).gtag !== 'function') {
      (window as any).gtag = function(...args: any[]) {
        console.log("Dentro da função gtag, antes do push:", window.dataLayer); // Log 3
        // Empurra os argumentos um por um para o dataLayer,
        // e.g., gtag('consent', 'default', {...}) se torna dataLayer.push('consent', 'default', {...})
        if (!Array.isArray(window.dataLayer)) {
          console.error("ERRO: window.dataLayer NÃO é um array antes do push!", window.dataLayer);
          // Se não for um array, inicialize aqui para evitar erro no push
          window.dataLayer = []; 
        }
        window.dataLayer.push(...args); // Removida a asserção !, a verificação acima deve ser suficiente
        console.log("Dentro da função gtag, após o push:", window.dataLayer); // Log 4
      };
    }

    // Define o estado de consentimento padrão ANTES do script GTM e ANTES de verificar o localStorage.
    // Isso garante que o GTM conheça o estado padrão imediatamente no carregamento.
    console.log("Antes da chamada gtag('consent', 'default'):", window.dataLayer); // Log 5
    (window as any).gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      // Considere outros tipos como 'functionality_storage': 'granted' ou 'security_storage': 'granted'
      // se forem necessários para funcionalidades básicas do site ou segurança e não dependerem de rastreamento.
    });
    console.log("Após a chamada gtag('consent', 'default'):", window.dataLayer); // Log 6

    const consent = localStorage.getItem("cookieConsent");
    if (consent === "accepted") {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
      });
    } else if (consent === "declined") {
      // Se recusado, o padrão 'denied' já está definido, mas uma atualização explícita também é boa.
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
      });
    } else { // consent === null ou qualquer outro valor não reconhecido
      setShowBanner(true);
    }

    // IMPORTANTE: Executamos o carregamento do GTM em um setTimeout para garantir
    // que todas as configurações do dataLayer e consentimento estejam prontas
    // Este pequeno atraso ajuda em aplicações React/Next.js onde o ciclo de vida
    // e a hidratação podem causar problemas de timing
    setTimeout(() => {
      // Carrega o script do GTM. Ele agora respeitará os estados de consentimento definidos acima.
      // Verifica se o script GTM já foi carregado para evitar duplicatas.
      const gtmScriptId = `gtm-script-${GTM_ID}`;
      if (!document.getElementById(gtmScriptId)) {
        console.log("Tentando adicionar o script GTM ao head (após setTimeout)...");

        // Primeiro, preparamos o dataLayer com o evento gtm.js e gtm.start
        // Isso é parte do que o snippet original do GTM faz antes de carregar o script externo.
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });

        // Agora criamos e adicionamos o script GTM de forma mais direta
        const script = document.createElement("script");
        script.id = gtmScriptId;
        script.async = true;
        
        // Adicionamos eventos para monitorar o carregamento do script
        script.onload = function() {
          console.log("Script GTM carregado com sucesso!");
        };
        
        script.onerror = function() {
          console.error("Erro ao carregar o script GTM!");
        };
        
        script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`; // Adiciona o GTM_ID diretamente ao src
        
        // O script do GTM é carregado de forma assíncrona.
        // As chamadas gtag('consent', ...) anteriores já prepararam o dataLayer.
        document.head.appendChild(script);
        console.log("Script GTM teoricamente adicionado:", script);
      } else {
        console.log("Script GTM já existe (ID: " + gtmScriptId + "), não foi adicionado novamente.");
      }
    }, 50); // Pequeno atraso para garantir que tudo esteja pronto
  }, []); // Executa uma vez na montagem do componente

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
      });
    }
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
      });
    }
    setShowBanner(false);
  };

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      {/* End Google Tag Manager (noscript) */}

      {/* Banner de Consentimento de Cookies */}
      {showBanner && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#2B373B",
            color: "#ffffff",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            maxWidth: "300px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "12px", margin: "0" }}>
            Este site utiliza cookies para melhorar sua experiência. Ao
              continuar navegando, você concorda com nossa política de
              privacidade.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={handleAccept}
              style={{
                padding: "8px 15px",
                background: "#4CAF50",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                fontSize: "12px",
              }}
            >
              Aceitar
            </button>
            <button
              onClick={handleDecline}
              style={{
                padding: "8px 15px",
                background: "#f44336",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                fontSize: "12px",
              }}
            >
              Recusar
            </button>
          </div>
        </div>
      )}
    </>
  );
}