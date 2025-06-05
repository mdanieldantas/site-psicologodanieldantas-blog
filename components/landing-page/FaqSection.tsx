// Componente FaqSection: Exibe perguntas frequentes usando um acordeão
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, MessageCircle } from "lucide-react"; // Importa ícones adicionais
import { useWhatsAppModal } from "../whatsapp-modal-context";

const FaqSection = () => {
  const { openModal } = useWhatsAppModal();

  // Array com os dados das perguntas e respostas
  const faqItems = [
    {
      value: "item-1",
      question: "Como funciona a psicoterapia individual?",
      answer:
        "A psicoterapia individual é um processo de autoconhecimento e desenvolvimento pessoal, onde trabalhamos juntos para identificar e superar desafios emocionais, comportamentais e relacionais. As sessões são semanais e têm duração de 50 minutos.",
    },
    {
      value: "item-2",
      question: "Qual é a sua abordagem terapêutica?",
      answer:
        "Minha abordagem é baseada na Abordagem Centrada na Pessoa (ACP), que valoriza a empatia, a escuta ativa e o respeito pela singularidade de cada indivíduo. Também utilizo técnicas de Focalização para ajudar no processo de autoconhecimento e regulação emocional.",
    },
    {
      value: "item-3",
      question: "Você atende online?",
      answer:
        "Sim, ofereço atendimentos online para maior comodidade e acessibilidade. As sessões são realizadas por plataformas seguras e confiáveis.",
    },
    {
      value: "item-4",
      question: "Quanto tempo dura o processo terapêutico?",
      answer:
        "A duração do processo terapêutico varia conforme as necessidades e objetivos de cada pessoa. Alguns processos podem durar alguns meses, enquanto outros podem se estender por mais tempo. O importante é respeitar o tempo e o ritmo de cada indivíduo.",
    },
    {
      value: "item-5",
      question: "Como agendar uma consulta?",
      answer:
        "Você pode agendar uma consulta através do formulário de contato neste site, por telefone ou WhatsApp. Após o contato inicial, agendaremos um horário que seja conveniente para você.",
    },
  ];

  // CORREÇÃO: Dados estruturados corretos para resolver FAQPage duplicado
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 bg-[#F8F5F0]">
      {/* CORREÇÃO: Script com dados estruturados para evitar duplicação */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="container mx-auto px-4 sm:px-[10%] max-w-4xl">
        {/* Título da seção */}
        <h2 className="text-3xl font-light mb-4 text-center">
          Perguntas Frequentes
        </h2>
        {/* Subtítulo */}
        <p className="text-xl text-[#583B1F] mb-12 text-center max-w-2xl mx-auto font-light">
          Tire suas dúvidas sobre meus serviços e abordagem terapêutica.
        </p>
        {/* Container Principal do FAQ */}
        <div className="bg-[#F0EBE6] shadow-md p-6 sm:p-8 relative">
          {/* Ícone Centralizado - Maior e mais destacado */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#583B1F] p-4 rounded-full shadow-lg">
            <MessageSquare className="h-8 w-8 text-[#F8F5F0]" />
          </div>

          {/* Componente Acordeão com transição melhorada */}
          <Accordion type="single" collapsible className="w-full space-y-0 pt-10">
            {/* Mapeia os itens do FAQ */}
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className={`px-4 sm:px-6 ${
                  index < faqItems.length - 1
                    ? "border-b border-[#A57C3A]/40"
                    : "border-b-0"
                } transition-all duration-300`}
              >
                <AccordionTrigger
                  className="text-base sm:text-lg font-medium text-[#583B1F] hover:text-[#A57C3A] hover:no-underline text-left py-5 
                    focus:outline-none transition-all duration-300 data-[state=open]:text-[#A57C3A]"
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent
                  className="text-[#583B1F] pt-0 pb-5 font-light text-base sm:text-lg
                    leading-relaxed transition-all duration-500"
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Botão de Contato Abaixo do Container - Melhorado com ícone */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={openModal}
            className="px-4 py-2 sm:px-6 md:px-8 sm:py-3 md:py-4 text-sm sm:text-base bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-all duration-300 
              rounded-lg inline-flex items-center justify-center gap-1 sm:gap-2 shadow-md
              border border-transparent hover:border-[#A57C3A] focus:outline-none focus:ring-2 focus:ring-[#A57C3A]"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Ainda tem dúvidas? Entre em contato</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
