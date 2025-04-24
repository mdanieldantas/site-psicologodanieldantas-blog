"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [gtmEnabled, setGtmEnabled] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === null) {
      // Exibe o banner se o consentimento ainda não foi dado
      setShowBanner(true);
    } else if (consent === "accepted") {
      // Ativa o Google Tag Manager se o consentimento foi aceito
      setGtmEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (gtmEnabled) {
      const script = document.createElement("script");
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-P546DSSG');`;
      document.head.appendChild(script);
    }
  }, [gtmEnabled]);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setGtmEnabled(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-P546DSSG"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      {/* End Google Tag Manager */}

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

