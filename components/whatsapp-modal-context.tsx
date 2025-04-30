"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface WhatsAppModalContextType {
  openModal: () => void;
}

const WhatsAppModalContext = createContext<WhatsAppModalContextType | undefined>(undefined);

export function WhatsAppModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    // Dispara evento para o Google Tag Manager
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'whatsapp_modal_aberto' });
    }
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <WhatsAppModalContext.Provider value={{ openModal }}>
      {children}
      {/* Modal do WhatsAppButton controlado globalmente */}
      <WhatsAppButtonGlobal isOpen={isOpen} onClose={closeModal} />
    </WhatsAppModalContext.Provider>
  );
}

export function useWhatsAppModal() {
  const context = useContext(WhatsAppModalContext);
  if (!context) {
    throw new Error("useWhatsAppModal deve ser usado dentro de WhatsAppModalProvider");
  }
  return context;
}

// Componente do WhatsAppButton adaptado para uso global
import WhatsAppButton from "./whatsapp-button";

function WhatsAppButtonGlobal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Reaproveita o modal do WhatsAppButton, mas controla via props
  // O WhatsAppButton original precisa ser adaptado para aceitar isOpen/onClose
  return <WhatsAppButton isOpen={isOpen} onClose={onClose} />;
}
