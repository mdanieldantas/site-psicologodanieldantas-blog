// Componente FaqSection: Exibe perguntas frequentes usando um acordeão
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare } from "lucide-react"; // Importa o ícone

const FaqSection = () => {
  // Array com os dados das perguntas e respostas CORRIGIDO conforme texto fornecido
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

  return (
    <section id="faq" className="py-20 bg-[#F8F5F0]">
      <div className="container mx-auto px-[10%] max-w-4xl"> {/* Aumentada a largura máxima */}
        {/* Título da seção */}
        <h2 className="text-3xl font-light mb-4 text-center">Perguntas Frequentes</h2>
        {/* Subtítulo Corrigido */}
        <p className="text-xl text-[#735B43] mb-12 text-center max-w-2xl mx-auto font-light">
          Tire suas dúvidas sobre meus serviços e abordagem terapêutica.
        </p>

        {/* Container Principal do FAQ */}
        <div className="bg-[#F0EBE6] rounded-lg shadow-lg p-8 relative">
          {/* Ícone Centralizado */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#583B1F] p-3 rounded-full shadow-md"> {/* Corrigida a cor de fundo do ícone */}
            <MessageSquare className="h-6 w-6 text-[#F8F5F0]" />
          </div>

          {/* Componente Acordeão */}
          <Accordion type="single" collapsible className="w-full space-y-0 pt-8"> {/* Ajuste no padding top e space-y */}
            {/* Mapeia os itens do FAQ */}
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className={`px-6 ${index < faqItems.length - 1 ? 'border-b border-[#C19A6B]' : 'border-b-0'}`} // Corrigida a cor da borda
                 // Remove bg e shadow individuais, adiciona borda inferior
              >
                <AccordionTrigger className="text-lg font-medium text-[#583B1F] hover:no-underline text-left py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#735B43] pt-0 pb-4 font-light">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Botão de Contato Abaixo do Container */}
        <div className="mt-12 text-center">
          <a
            href="#contato"
            className="px-8 py-3 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md inline-block"
          >
            Ainda tem dúvidas? Entre em contato
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
