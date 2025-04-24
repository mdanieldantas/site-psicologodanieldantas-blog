"use client"

import { useState } from "react"

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Preparar a mensagem para o WhatsApp
    const message = `Olá, Daniel! Meu nome é ${formState.name}.\n\nE-mail: ${formState.email}\nTelefone: ${formState.phone || "Não informado"}\n\nMensagem: ${formState.message}`

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message)

    // Redirecionar para o WhatsApp com a mensagem
    window.open(`https://wa.me/5585986013431?text=${encodedMessage}`, "_blank")

    // Limpar o formulário
    setFormState({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#583B1F] mb-1">
          Seu nome
        </label>
        <input
          type="text"
          id="name"
          value={formState.name}
          onChange={handleChange}
          required
          placeholder="Como gostaria de ser chamado(a)?"
          className="w-full p-3 border border-[#C19A6B] bg-[#F8F5F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#583B1F]"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#583B1F] mb-1">
          E-mail para contato
        </label>
        <input
          type="email"
          id="email"
          value={formState.email}
          onChange={handleChange}
          required
          placeholder="Seu melhor e-mail"
          className="w-full p-3 border border-[#C19A6B] bg-[#F8F5F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#583B1F]"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#583B1F] mb-1">
          Telefone (opcional)
        </label>
        <input
          type="tel"
          id="phone"
          value={formState.phone}
          onChange={handleChange}
          placeholder="Para contato via WhatsApp, se preferir"
          className="w-full p-3 border border-[#C19A6B] bg-[#F8F5F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#583B1F]"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#583B1F] mb-1">
          Como posso te ajudar?
        </label>
        <textarea
          id="message"
          rows={4}
          value={formState.message}
          onChange={handleChange}
          required
          className="w-full p-3 border border-[#C19A6B] bg-[#F8F5F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#583B1F]"
          placeholder="Como posso te auxiliar?"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full px-8 py-3 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 relative rounded-md"
      >
        Iniciar Nossa Conversa
      </button>
    </form>
  )
}

