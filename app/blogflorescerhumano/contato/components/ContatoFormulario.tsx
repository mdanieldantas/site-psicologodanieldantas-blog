// app/blogflorescerhumano/contato/components/ContatoFormulario.tsx
"use client"; // Marca como Client Component

import React, { useState } from 'react';
import { Send } from 'lucide-react';

// Define o tipo das props esperadas
interface ContatoFormularioProps {
  contactInfo: {
    phone: string;
    // Adicione outros campos se forem necessários aqui
  };
}

export default function ContatoFormulario({ contactInfo }: ContatoFormularioProps) {
  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para lidar com o envio do formulário
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const phoneNumber = contactInfo.phone.replace(/\D/g, ''); // Usa a prop
      const whatsappMessage = `*Mensagem do Blog Florescer Humano*\n\n*Nome:* ${nome}\n*Email:* ${email}\n*Assunto:* ${assunto}\n\n*Mensagem:*\n${mensagem}`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nome" className="block text-[#583B1F] font-medium mb-2">Nome</label>
          <input
            type="text"
            id="nome"
            required
            className="w-full px-4 py-3 border border-[#C19A6B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19A6B] bg-[#F8F5F0]/50 text-[#735B43]"
            placeholder="Seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[#583B1F] font-medium mb-2">E-mail</label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-3 border border-[#C19A6B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19A6B] bg-[#F8F5F0]/50 text-[#735B43]"
            placeholder="seu.email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="assunto" className="block text-[#583B1F] font-medium mb-2">Assunto</label>
        <input
          type="text"
          id="assunto"
          required
          className="w-full px-4 py-3 border border-[#C19A6B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19A6B] bg-[#F8F5F0]/50 text-[#735B43]"
          placeholder="Sobre o que você gostaria de falar?"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="mensagem" className="block text-[#583B1F] font-medium mb-2">Mensagem</label>
        <textarea
          id="mensagem"
          rows={5}
          required
          className="w-full px-4 py-3 border border-[#C19A6B]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19A6B] bg-[#F8F5F0]/50 text-[#735B43] resize-none"
          placeholder="Digite sua mensagem aqui..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#583B1F] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#735B43] transition-all duration-300 shadow-md flex items-center justify-center gap-2 transform hover:translate-y-[-2px]"
      >
        <Send className="h-5 w-5" />
        {isSubmitting ? 'Enviando...' : 'Enviar mensagem via WhatsApp'}
      </button>
      
      <p className="text-sm text-[#735B43]/80 text-center">
        Ao clicar em "Enviar", você será redirecionado para o WhatsApp com sua mensagem pré-preenchida.
      </p>
    </form>
  );
}
