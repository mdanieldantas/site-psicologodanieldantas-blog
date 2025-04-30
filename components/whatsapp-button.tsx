"use client"

import React, { useState } from "react";

interface WhatsAppButtonProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function WhatsAppButton({ isOpen, onClose }: WhatsAppButtonProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isFormOpen = typeof isOpen === 'boolean' ? isOpen : internalOpen;
  const handleOpen = () => (typeof isOpen === 'boolean' ? (onClose && onClose()) : setInternalOpen(true));
  const handleClose = () => (typeof isOpen === 'boolean' ? (onClose && onClose()) : setInternalOpen(false));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Dispara evento para o Google Tag Manager
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'whatsapp_formulario_enviado' });
    }
    const message = `Olá, Daniel! Meu nome é ${formData.name}.\n\nE-mail: ${formData.email}\nTelefone: ${formData.phone || "Não informado"}\n\nMensagem: ${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5585986013431?text=${encodedMessage}`, "_blank");
    handleClose();
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="whatsapp-button-container">
      {/* Botão principal do WhatsApp só aparece se for controle interno */}
      {typeof isOpen !== 'boolean' && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-[#25D366] p-4 rounded-full shadow-lg hover:bg-[#128C7E] transition-colors z-50"
          aria-label="Contato via WhatsApp"
        >
          <WhatsAppIcon />
        </button>
      )}
      {/* Modal do formulário */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <ModalHeader onClose={handleClose} />
            <div className="bg-gray-100 p-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-gray-700">Olá, tudo bem? Seja bem vindo! 😊</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-700 font-medium mb-4">Por gentileza preencha os campos abaixo 👇</p>
              <ContactForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componentes auxiliares
const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.6 6.31999C16.8 5.49999 15.8 4.89999 14.7 4.49999C13.6 4.09999 12.5 3.99999 11.3 4.09999C10.1 4.19999 9.00001 4.49999 8.00001 5.09999C7.00001 5.59999 6.10001 6.39999 5.50001 7.29999C4.80001 8.19999 4.40001 9.29999 4.10001 10.4C3.90001 11.5 3.90001 12.6 4.10001 13.7C4.30001 14.8 4.80001 15.9 5.40001 16.8L4.10001 19.8C4.00001 20 4.00001 20.2 4.10001 20.4C4.20001 20.6 4.30001 20.7 4.50001 20.8C4.60001 20.9 4.80001 20.9 5.00001 20.9C5.10001 20.9 5.20001 20.9 5.30001 20.8L8.30001 19.5C9.20001 20.1 10.2 20.5 11.3 20.8C12.3 21 13.5 21.1 14.6 20.9C15.7 20.7 16.8 20.3 17.8 19.7C18.8 19.1 19.6 18.3 20.3 17.3C20.9 16.3 21.3 15.3 21.6 14.1C21.8 13 21.9 11.8 21.7 10.7C21.5 9.59999 21.1 8.49999 20.5 7.59999C19.9 6.89999 18.8 6.19999 17.6 6.31999ZM16.8 16.9C16.4 17.5 15.8 17.9 15.2 18.3C14.6 18.6 13.9 18.7 13.3 18.7C12.7 18.7 12 18.6 11.4 18.4C10.8 18.2 10.2 17.9 9.60001 17.5C9.10001 17.1 8.50001 16.7 8.00001 16.2C7.50001 15.7 7.10001 15.2 6.70001 14.6C6.30001 14 6.00001 13.4 5.80001 12.8C5.60001 12.2 5.50001 11.5 5.50001 10.9C5.50001 10.3 5.60001 9.59999 5.90001 8.99999C6.20001 8.39999 6.60001 7.79999 7.20001 7.39999C7.90001 6.89999 8.60001 6.79999 9.20001 6.99999C9.40001 7.09999 9.60001 7.19999 9.70001 7.39999C9.80001 7.59999 10 7.89999 10.1 8.29999C10.2 8.69999 10.4 9.19999 10.5 9.79999C10.6 10.4 10.7 10.9 10.7 11.3C10.7 11.5 10.7 11.8 10.6 12C10.5 12.2 10.5 12.4 10.4 12.5C10.3 12.7 10.2 12.8 10.1 13C10 13.1 9.90001 13.3 9.80001 13.4C9.70001 13.5 9.60001 13.6 9.60001 13.7C9.50001 13.8 9.50001 13.9 9.60001 14C9.60001 14.1 9.70001 14.2 9.80001 14.3C9.90001 14.4 10 14.6 10.2 14.7C10.4 14.9 10.5 15 10.7 15.1C11 15.3 11.3 15.5 11.7 15.7C12 15.9 12.4 16 12.7 16.1C13 16.2 13.3 16.2 13.5 16.2C13.7 16.2 13.9 16.1 14.1 16C14.3 15.9 14.4 15.7 14.5 15.6C14.6 15.4 14.8 15.3 14.9 15.1C15 14.9 15.1 14.8 15.2 14.7C15.3 14.6 15.3 14.5 15.4 14.4C15.5 14.3 15.5 14.3 15.6 14.2C15.7 14.1 15.7 14.1 15.8 14.1C15.9 14.1 16.1 14.1 16.2 14.2C16.4 14.3 16.6 14.3 16.8 14.4C17.3 14.6 17.7 14.7 18.1 14.9C18.5 15 18.7 15.1 18.9 15.2C19.1 15.3 19.2 15.3 19.3 15.4C19.4 15.5 19.5 15.6 19.5 15.7C19.6 15.8 19.6 16 19.6 16.2C19.6 16.4 19.6 16.6 19.5 16.8C19.3 16.7 19.1 16.8 16.8 16.9Z"
      fill="white"
    />
  </svg>
);

const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="bg-[#25D366] p-3 flex items-center justify-between">
    <div className="flex items-center">
      <div className="bg-[#128C7E] text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
        <span>D</span>
      </div>
      <div>
        <h3 className="text-white font-medium">Psicólogo Daniel Dantas</h3>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          <span className="text-white text-xs">Online agora</span>
        </div>
      </div>
    </div>
    <button 
      onClick={onClose} 
      className="text-white" 
      aria-label="Fechar formulário"
    >
      <CloseIcon />
    </button>
  </div>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ContactForm = ({
  formData,
  handleChange,
  handleSubmit
}: {
  formData: { name: string; email: string; phone: string; message: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <InputField
      id="name"
      type="text"
      value={formData.name}
      onChange={handleChange}
      required
      placeholder="Seu nome"
    />
    <InputField
      id="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      required
      placeholder="Seu e-mail"
    />
    <InputField
      id="phone"
      type="tel"
      value={formData.phone}
      onChange={handleChange}
      placeholder="WhatsApp (não obrigatório)"
    />
    <InputField
      id="message"
      type="text"
      value={formData.message}
      onChange={handleChange}
      required
      placeholder="Como posso te ajudar?"
    />
    <SubmitButton />
  </form>
);

const InputField = ({
  id,
  type,
  value,
  onChange,
  required = false,
  placeholder
}: {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder: string;
}) => (
  <div>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full py-2 border-b border-gray-300 focus:border-[#25D366] focus:outline-none text-gray-700 bg-transparent placeholder-gray-500"
    />
  </div>
);

const SubmitButton = () => (
  <button
    type="submit"
    className="w-full py-3 bg-[#25D366] text-white font-medium rounded-full flex items-center justify-center"
  >
    Ir para WhatsApp
    <WhatsAppIconSmall />
  </button>
);

const WhatsAppIconSmall = () => (
  <svg
    className="ml-2 w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.6 6.32C16.8 5.5 15.8 4.9 14.7 4.5C13.6 4.1 12.5 4 11.3 4.1C10.1 4.2 9 4.5 8 5.1C7 5.6 6.1 6.4 5.5 7.3C4.8 8.2 4.4 9.3 4.1 10.4C3.9 11.5 3.9 12.6 4.1 13.7C4.3 14.8 4.8 15.9 5.4 16.8L4.1 19.8C4 20 4 20.2 4.1 20.4C4.2 20.6 4.3 20.7 4.5 20.8C4.6 20.9 4.8 20.9 5 20.9C5.1 20.9 5.2 20.9 5.3 20.8L8.3 19.5C9.2 20.1 10.2 20.5 11.3 20.8C12.3 21 13.5 21.1 14.6 20.9C15.7 20.7 16.8 20.3 17.8 19.7C18.8 19.1 19.6 18.3 20.3 17.3C20.9 16.3 21.3 15.3 21.6 14.1C21.8 13 21.9 11.8 21.7 10.7C21.5 9.6 21.1 8.5 20.5 7.6C19.9 6.9 18.8 6.2 17.6 6.32Z" />
  </svg>
);