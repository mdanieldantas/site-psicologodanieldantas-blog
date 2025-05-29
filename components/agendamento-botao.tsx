"use client";

import React from 'react';
import { Calendar } from 'lucide-react';
import { useWhatsAppModal } from './whatsapp-modal-context';

interface AgendamentoBotaoProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  icon?: boolean;
  children?: React.ReactNode;
}

/**
 * Componente de botão de agendamento reutilizável
 * 
 * @param variant - Variante de estilo do botão ('primary', 'secondary', 'ghost')
 * @param size - Tamanho do botão ('sm', 'md', 'lg')
 * @param fullWidth - Define se o botão deve ocupar a largura total
 * @param className - Classes CSS adicionais
 * @param icon - Define se o ícone de calendário deve ser mostrado
 * @param children - Conteúdo do botão (texto)
 */
export default function AgendamentoBotao({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  icon = true,
  children = 'Agendar primeira sessão'
}: AgendamentoBotaoProps) {
  const { openModal } = useWhatsAppModal();
  // Definições de estilos base - seguindo padrões do ButtonBlog
  const baseStyles = "font-medium rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 transform hover:scale-105 hover:-translate-y-1 hover:shadow-xl";
  
  // Estilos de variante - seguindo padrões do designer guide
  const variantStyles = {
    primary: "bg-[#583B1F] text-white hover:bg-[#6B7B3F]",
    secondary: "bg-white text-[#583B1F] border border-[#583B1F] hover:bg-[#F8F5F0]",
    ghost: "bg-transparent text-[#583B1F] border border-[#583B1F] hover:bg-[#583B1F]/10"
  };
  
  // Estilos de tamanho
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  // Estilo de largura
  const widthStyle = fullWidth ? "w-full" : "";

  // Combinar todos os estilos
  const buttonStyle = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;

  return (
    <button
      onClick={openModal}
      className={buttonStyle}
      aria-label="Agendar sessão com o psicólogo"
    >
      {icon && <Calendar className="h-5 w-5" />}
      {children}
    </button>
  );
}
