"use client"

import { useState } from "react"
import { MessageSquare, X, ArrowRight } from "lucide-react"

export default function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Olá! Sou o assistente virtual do Daniel. Como posso ajudar você hoje?", sender: "bot" },
  ])
  const [input, setInput] = useState("")

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSend = () => {
    if (input.trim() === "") return

    // Adiciona mensagem do usuário
    setMessages([...messages, { text: input, sender: "user" }])

    // Processa resposta do bot
    setTimeout(() => {
      const botResponse = { text: "Não entendi sua pergunta. Pode reformular?", sender: "bot" }

      // Respostas simples para perguntas comuns
      if (
        input.toLowerCase().includes("preço") ||
        input.toLowerCase().includes("valor") ||
        input.toLowerCase().includes("custo")
      ) {
        botResponse.text =
          "O valor da sessão é de R$ 150,00. Oferecemos pacotes com desconto para sessões recorrentes. Gostaria de mais informações?"
      } else if (input.toLowerCase().includes("duração") || input.toLowerCase().includes("tempo")) {
        botResponse.text = "As sessões têm duração de 50 minutos e geralmente são realizadas semanalmente."
      } else if (
        input.toLowerCase().includes("online") ||
        input.toLowerCase().includes("remoto") ||
        input.toLowerCase().includes("distância")
      ) {
        botResponse.text =
          "Sim, realizo atendimentos online via plataformas seguras como Zoom ou Google Meet. A terapia online é tão eficaz quanto a presencial!"
      } else if (
        input.toLowerCase().includes("começar") ||
        input.toLowerCase().includes("iniciar") ||
        input.toLowerCase().includes("marcar")
      ) {
        botResponse.text =
          "Para agendar sua primeira sessão, você pode preencher o formulário de contato ou me enviar uma mensagem direta pelo WhatsApp. Ficarei feliz em encontrar um horário que funcione para você!"
      }

      setMessages((prev) => [...prev, botResponse])
    }, 1000)

    setInput("")
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 bg-[#583B1F] p-4 rounded-full shadow-lg hover:bg-[#735B43] transition-colors z-50"
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
          <div className="bg-[#583B1F] text-white p-4">
            <h3 className="font-medium">Assistente Virtual</h3>
            <p className="text-xs opacity-80">Respondo em segundos</p>
          </div>

          <div className="flex-1 p-4 h-80 overflow-y-auto flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.sender === "bot" ? "bg-[#F5F2EE] self-start" : "bg-[#583B1F] text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua pergunta..."
              className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#583B1F]"
            />
            <button onClick={handleSend} className="bg-[#583B1F] text-white p-2 rounded-md hover:bg-[#735B43]">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

