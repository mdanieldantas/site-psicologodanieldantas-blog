// app/blogflorescerhumano/contato/components/ContatoFormulario.tsx
"use client"; // Marca como Client Component

import React, { useState } from 'react';

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

  // Função para lidar com o envio do formulário
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phoneNumber = contactInfo.phone.replace(/\D/g, ''); // Usa a prop
    const whatsappMessage = `*Mensagem do Blog Florescer Humano*\n\n*Nome:* ${nome}\n*Email:* ${email}\n*Assunto:* ${assunto}\n\n*Mensagem:*\n${mensagem}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    // O JSX do <form> vem aqui
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">Nome</label>
        <input
          type="text"
          id="nome"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">E-mail</label>
        <input
          type="email"
          id="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="assunto" className="block text-gray-700 font-medium mb-2">Assunto</label>
        <input
          type="text"
          id="assunto"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Sobre o que você gostaria de falar?"
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="mensagem" className="block text-gray-700 font-medium mb-2">Mensagem</label>
        <textarea
          id="mensagem"
          rows={5}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Digite sua mensagem aqui..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300 shadow-md"
      >
        Enviar via WhatsApp
      </button>
    </form>
  );
}
