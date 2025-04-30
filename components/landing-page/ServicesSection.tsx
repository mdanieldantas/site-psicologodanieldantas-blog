import Image from "next/image";
// Adiciona os ícones necessários para a seção "Outros Serviços"
import { Video, Calendar, ChevronLeft, ChevronRight, Heart, Users, Home, Presentation } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"; // Importar componentes do shadcn/ui
import { useWhatsAppModal } from "../whatsapp-modal-context"; // Importar o hook

// Define as propriedades esperadas pelo componente ServicesSection
interface ServicesSectionProps {
  isMobile: boolean; // Manter se ainda for útil para alguma lógica condicional fora do carrossel
}

// Dados de exemplo para os cards de demandas (mantendo apenas os 6 originais)
const demandas = [
  {
    title: "Ansiedade e Estresse",
    imgSrc: "/Ansiedade-e-Estresse-image.png",
    description: "Ajudar você a identificar as causas da ansiedade e do estresse, promovendo autoconhecimento e técnicas de regulação emocional através da Focalização e da ACP.",
  },
  {
    title: "Regulação Emocional",
    imgSrc: "/Regulacao-Emocional-image.png",
    description: "Desenvolver habilidades para lidar com emoções intensas, compreendendo seus gatilhos e aprendendo estratégias saudáveis de enfrentamento.",
  },
  {
    title: "Autoconhecimento",
    imgSrc: "/Autoconhecimento-e-Crescimento-Pessoal-image.png",
    description: "Explorar seus valores, crenças e padrões de comportamento para promover um maior entendimento de si mesmo e facilitar o crescimento pessoal.",
  },
  {
    title: "Relacionamentos",
    imgSrc: "/Dificuldades-em-Relacionamentos.png",
    description: "Melhorar a comunicação, estabelecer limites saudáveis e construir relações mais significativas e satisfatórias.",
  },
  {
    title: "Autoestima",
    imgSrc: "/Dificuldades-de-Autoaceitacao-e-Autoestima-image.png",    description: "Fortalecer a autoaceitação e a confiança em suas próprias capacidades, cultivando uma relação mais positiva consigo mesmo.",
  },
  {
    title: "Transições de Vida",
    imgSrc: "/psicologodanieldantas/Transicoes-de-Vida-e-Mudancas-image.png",
    description: "Navegar por mudanças importantes (carreira, luto, relacionamentos) com mais segurança e resiliência, encontrando novas perspectivas.",
  },
];

// Componente ServicesSection: Detalha os serviços oferecidos
const ServicesSection: React.FC<ServicesSectionProps> = ({ isMobile }) => {
  const { openModal } = useWhatsAppModal(); // Obter a função openModal
  return (
    <section id="servicos" className="py-20 bg-[#F5F2EE]">
      <div className="container mx-auto px-[10%]">
        {/* Título e subtítulo */}
        <h2 className="text-3xl font-light mb-4 text-center">Serviços</h2>
        <p className="text-xl text-[#735B43] mb-12 text-center max-w-2xl mx-auto">
          Ofereço atendimento personalizado para ajudar você a encontrar equilíbrio e bem-estar.
        </p>

        {/* Banner Psicoterapia Online (sem alterações) */}
        <div className="bg-[#583B1F] rounded-lg shadow-xl mb-16 overflow-hidden">
          {/* ... conteúdo do banner ... */}
          <div className="grid md:grid-cols-2">
            {/* Conteúdo Texto */}
            <div className="p-8 md:p-10 text-[#F8F5F0]">
              <div className="flex items-center mb-6">
                <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                  <Video className="h-6 w-6 text-[#F8F5F0]" />
                </div>
                <h3 className="text-2xl font-medium">Psicoterapia Online</h3>
              </div>
              <p className="mb-6 font-light leading-relaxed">
                A terapia online elimina barreiras geográficas e oferece a mesma qualidade e profundidade do
                atendimento presencial. No conforto do seu espaço, podemos estabelecer uma conexão significativa e
                trabalhar questões importantes para seu bem-estar e desenvolvimento pessoal - independentemente da
                distância.
              </p>
              <ul className="mb-6 space-y-2 font-light">
                <li className="flex items-center">
                  <span className="mr-2 text-[#C19A6B]">•</span>
                  <span>Sessões por videochamada em plataformas seguras</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#C19A6B]">•</span>
                  <span>Flexibilidade de horários e localização</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-[#C19A6B]">•</span>
                  <span>Mesmo acolhimento e eficácia da terapia presencial</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={openModal} // Chamar openModal no clique
                className="mt-4 px-8 py-3 bg-[#C19A6B] text-[#F8F5F0] hover:bg-[#D1AA7B] transition-colors duration-300 flex items-center rounded-md text-sm"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar primeira sessão
              </button>
            </div>
            {/* Imagem */}
            <div className="relative h-64 md:h-auto">
              <Image src="/atendimento-online-image.png" alt="Psicoterapia Online" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Seção Demandas com Carrossel shadcn/ui */}
        <div className="bg-[#F5F2EE] rounded-lg shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-medium text-[#583B1F] text-center mb-4">
            Eu posso te ajudar na travessia de demandas como:
          </h3>
          <p className="text-[#735B43] text-center mb-12 max-w-3xl mx-auto font-light">
            Utilizando a Abordagem Centrada na Pessoa (ACP) e a Focalização, ofereço um espaço seguro e acolhedor
            para que você possa explorar suas emoções, superar desafios e encontrar caminhos para uma vida mais
            equilibrada e significativa.
          </p>

          {/* Carrossel shadcn/ui */}
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {demandas.map((demanda, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                  {/* Card com borda esquerda adicionada */}
                  <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full flex flex-col">
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-full h-40 relative mb-4 rounded-lg overflow-hidden"> {/* Adicionado overflow-hidden */}
                        <Image
                          src={demanda.imgSrc}
                          alt={demanda.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <h4 className="text-lg font-medium text-[#583B1F] text-center">{demanda.title}</h4>
                    </div>
                    <p className="text-[#735B43] text-sm flex-grow">{demanda.description}</p> {/* Adicionado flex-grow */}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-colors duration-300 focus:outline-none" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-colors duration-300 focus:outline-none" />
          </Carousel>
        </div>

        {/* Seção Outros Serviços - Adicionada */}
        <div className="mt-16">
          <h3 className="text-2xl font-medium text-[#583B1F] text-center mb-12">
            Outros Serviços
          </h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Psicoterapia Individual */}
            <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#C19A6B] p-3 rounded-full">
                  <Heart className="h-7 w-7 text-[#F8F5F0]" />
                </div>
              </div>
              <h4 className="text-lg font-medium text-[#583B1F] mb-2">Psicoterapia Individual</h4>
              <p className="text-[#735B43] text-sm font-light">
                Atendimento focado nas suas necessidades, promovendo autoconhecimento e bem-estar.
              </p>
            </div>

            {/* Card 2: Grupos Psicoterapêuticos */}
            <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#C19A6B] p-3 rounded-full">
                  <Users className="h-7 w-7 text-[#F8F5F0]" />
                </div>
              </div>
              <h4 className="text-lg font-medium text-[#583B1F] mb-2">Grupos Psicoterapêuticos</h4>
              <p className="text-[#735B43] text-sm font-light">
                Espaços de troca e crescimento coletivo, abordando temas específicos em um ambiente seguro.
              </p>
            </div>

            {/* Card 3: Atendimento Comunitário */}
            <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#C19A6B] p-3 rounded-full">
                  <Home className="h-7 w-7 text-[#F8F5F0]" /> {/* Usando Home como ícone */}
                </div>
              </div>
              <h4 className="text-lg font-medium text-[#583B1F] mb-2">Atendimento Comunitário</h4>
              <p className="text-[#735B43] text-sm font-light">
                Projetos e parcerias para levar o cuidado psicológico a diferentes comunidades.
              </p>
            </div>

            {/* Card 4: Workshops e Palestras */}
            <div className="bg-[#F8F5F0] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#C19A6B] p-3 rounded-full">
                  <Presentation className="h-7 w-7 text-[#F8F5F0]" />
                </div>
              </div>
              <h4 className="text-lg font-medium text-[#583B1F] mb-2">Workshops e Palestras</h4>
              <p className="text-[#735B43] text-sm font-light">
                Eventos educativos sobre saúde mental, bem-estar e desenvolvimento pessoal.
              </p>
            </div>
          </div>
        </div>

      </div> {/* Fim do container principal */}
    </section>
  );
};

export default ServicesSection;
