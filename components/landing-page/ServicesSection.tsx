import Image from "next/image";
// Adiciona os ícones necessários para a seção "Outros Serviços"
import { Video, Calendar, ChevronLeft, ChevronRight, Heart, Users, Home, Presentation } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel"; // Importar componentes do shadcn/ui
import { useWhatsAppModal } from "../whatsapp-modal-context"; // Importar o hook
import { useState, useRef, useCallback, useEffect } from "react"; // Importações React

// Componente decorativo para separação visual
const Divider = () => (
  <div className="flex justify-center my-3">
    <div className="flex items-center space-x-1">
      <div className="h-1 w-1 rounded-full bg-[#C19A6B]/80"></div>
      <div className="h-1 w-3 rounded-full bg-[#C19A6B]/80"></div>
      <div className="h-1 w-1 rounded-full bg-[#C19A6B]/80"></div>
    </div>
  </div>
);

// Componente para os ícones personalizados da lista
const ListIcon = () => (
  <div className="bg-[#C19A6B]/20 p-1.5 rounded-full min-w-[28px] h-7 flex items-center justify-center mr-3 transition-all duration-300 group-hover:bg-[#C19A6B]/40">
    <span className="text-[#C19A6B] text-xs">✦</span>
  </div>
);

// Define as propriedades esperadas pelo componente ServicesSection
interface ServicesSectionProps {
  isMobile: boolean; // Manter se ainda for útil para alguma lógica condicional fora do carrossel
}

// Dados de exemplo para os cards de demandas (mantendo apenas os 6 originais)
const demandas = [
  {
    title: "Ansiedade e Estresse",
    imgSrc: "/Ansiedade-e-Estresse-image.webp",
    description: "Ajudar você a identificar as causas da ansiedade e do estresse, promovendo autoconhecimento e técnicas de regulação emocional através da Focalização e da ACP.",
  },
  {
    title: "Regulação Emocional",
    imgSrc: "/Regulacao-Emocional-image.png",
    description: "Desenvolver habilidades para lidar com emoções intensas, compreendendo seus gatilhos e aprendendo estratégias saudáveis de enfrentamento.",
  },  {
    title: "Autoconhecimento",
    imgSrc: "/Autoconhecimento-e-Crescimento-Pessoal-image.webp",
    description: "Explorar seus valores, crenças e padrões de comportamento para promover um maior entendimento de si mesmo e facilitar o crescimento pessoal.",
  },
  {
    title: "Relacionamentos",
    imgSrc: "/Dificuldades-em-Relacionamentos.png",
    description: "Melhorar a comunicação, estabelecer limites saudáveis e construir relações mais significativas e satisfatórias.",
  },
  {
    title: "Autoestima",
    imgSrc: "/Dificuldades-de-Autoaceitacao-e-Autoestima-image.png",
    description: "Fortalecer a autoaceitação e a confiança em suas próprias capacidades, cultivando uma relação mais positiva consigo mesmo.",
  },
  {
    title: "Transições de Vida",
    imgSrc: "/Transicoes-de-Vida-e-Mudancas-image.png", // Caminho corrigido
    description: "Navegar por mudanças importantes (carreira, luto, relacionamentos) com mais segurança e resiliência, encontrando novas perspectivas.",
  },
];

// Componente ServicesSection: Detalha os serviços oferecidos
const ServicesSection: React.FC<ServicesSectionProps> = ({ isMobile }) => {
  const { openModal } = useWhatsAppModal(); // Obter a função openModal
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
    // Referência para a API do carrossel
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  
  // Função para navegar diretamente para um slide específico
  const goToSlide = useCallback((index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  }, [carouselApi]);
  
  // Atualiza o índice ativo quando o carrossel muda
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    
    // Define o slide inicial
    onSelect();

    // Registra o listener para eventos de mudança
    carouselApi.on("select", onSelect);
    
    // Limpa o listener quando o componente for desmontado
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <section id="servicos" className="py-14 md:py-24 bg-[#F5F2EE]">
      <div className="container mx-auto px-6 sm:px-8 md:px-[10%]">
        {/* Título e subtítulo */}
        <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8 border-b border-[#583B1F] pb-4 inline-block">
          Serviços
        </h2>
          <p className="text-base md:text-lg text-[#735B43] mb-8 md:mb-10 max-w-2xl font-light leading-relaxed">
          Ofereço atendimento personalizado para ajudar você a encontrar equilíbrio e bem-estar.
        </p>

        <Divider />

        {/* Banner Psicoterapia Online - Redesenhado */}
        <div className="bg-[#583B1F] rounded-lg shadow-xl mb-16 overflow-hidden relative">
          {/* Elementos decorativos */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#C19A6B] opacity-5 rounded-full hidden md:block"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#C19A6B] opacity-5 rounded-full hidden md:block"></div>          {/* Grid adaptativo para melhor responsividade - Proporção equalizada 50/50 */}
          <div className="grid md:grid-cols-2">
            {/* Conteúdo Texto - Ocupa metade (1/2) em desktop */}
            <div className="p-8 md:p-10 text-[#F8F5F0] relative z-10">
              <div className="flex items-center mb-6 md:mb-8">
                <div className="bg-[#C19A6B] p-3 rounded-full mr-5 shadow-md flex-shrink-0 transform transition-all duration-300 hover:scale-110">
                  <Video className="h-6 w-6 md:h-7 md:w-7 text-[#F8F5F0]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-medium border-b border-[#C19A6B]/30 pb-2">
                  Psicoterapia Online
                </h3>              </div>
              <p className="mb-6 font-light leading-relaxed text-base">
                A terapia online elimina barreiras geográficas e oferece a mesma qualidade e profundidade do
                atendimento presencial. No conforto do seu espaço, podemos estabelecer uma conexão significativa e
                trabalhar questões importantes para seu bem-estar.
              </p>
              
              <Divider />
              
              {/* Lista com ícones personalizados */}
              <ul className="mb-8 space-y-4 font-light">
                <li className="flex items-start group">
                  <ListIcon />
                  <span className="pt-1 group-hover:text-white transition-colors duration-300">
                    Sessões por videochamada em plataformas seguras
                  </span>
                </li>
                <li className="flex items-start group">
                  <ListIcon />
                  <span className="pt-1 group-hover:text-white transition-colors duration-300">
                    Flexibilidade de horários e localização
                  </span>
                </li>
                <li className="flex items-start group">
                  <ListIcon />
                  <span className="pt-1 group-hover:text-white transition-colors duration-300">
                    Mesmo acolhimento e eficácia da terapia presencial
                  </span>
                </li>
              </ul>
              
              {/* Botão CTA aprimorado */}              <button
                type="button"
                onClick={openModal}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="mt-4 px-8 py-4 bg-[#6B5139] text-[#F8F5F0] rounded-md shadow-md flex items-center justify-center group transition-all duration-300 hover:bg-[#7D5F47] hover:shadow-lg hover:transform hover:-translate-y-1 w-full md:w-auto relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#735B43] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                <Calendar className="mr-3 h-5 w-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-base font-medium relative z-10 text-[#F8F5F0]">Agendar primeira sessão</span>
                <span className={`ml-2 relative z-10 transform transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-1' : 'opacity-0 -translate-x-2'}`}>→</span>
              </button>            </div>              {/* Imagem - Ocupa metade (1/2) em desktop, escondida em mobile onde é substituída por versão abaixo */}            <div className="relative h-auto min-h-[300px] hidden md:block">
              <div className="absolute inset-0 bg-[#583B1F]/10 z-10"></div><Image                src="/atendimento-online-image.webp" 
                alt="Psicoterapia Online" 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-105" 
                priority={true}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
          
          {/* Versão mobile da imagem - melhor integração */}          <div className="md:hidden relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-[#583B1F]/10 z-10"></div><Image 
              src="/atendimento-online-image.webp" 
              alt="Psicoterapia Online" 
              fill 
              className="object-cover" 
              priority={true}
              sizes="100vw"
            />
          </div>
        </div>        {/* Seção Demandas com Carrossel shadcn/ui */}
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-10 mb-16 relative">
          {/* Elementos decorativos */}
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#C19A6B] opacity-5 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-[#C19A6B] opacity-5 rounded-full"></div>
          
          <h3 className="text-2xl md:text-3xl font-light mb-6 border-b border-[#583B1F] pb-4 inline-block">
            Eu posso te ajudar na travessia de demandas como:
          </h3>
          
          <p className="text-[#735B43] text-base md:text-lg mb-8 max-w-3xl font-light leading-relaxed">
            Utilizando a Abordagem Centrada na Pessoa (ACP) e a Focalização, ofereço um espaço seguro e acolhedor
            para que você possa explorar suas emoções, superar desafios e encontrar caminhos para uma vida mais
            equilibrada e significativa.
          </p>
          
          <Divider />

          {/* Carrossel shadcn/ui aprimorado */}          <div className="mt-8">            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
              setApi={setCarouselApi}
              data-carousel-container
            >
              <CarouselContent>
                {demandas.map((demanda, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                    {/* Card com design aprimorado */}
                    <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 border-l-4 border-[#C19A6B] h-full flex flex-col group relative overflow-hidden">
                      {/* Elemento decorativo que aparece em hover */}
                      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#C19A6B] opacity-5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                      
                      <div className="flex flex-col items-center mb-4 relative z-10">
                        <div className="w-full h-40 relative mb-4 rounded-lg overflow-hidden shadow-md transform transition-all duration-500 group-hover:shadow-lg">
                          <Image
                            src={demanda.imgSrc}
                            alt={demanda.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <h4 className="text-lg font-medium text-[#583B1F] text-center transition-colors duration-300 group-hover:text-[#735B43]">
                          {demanda.title}
                        </h4>
                      </div>
                      
                      <Divider />
                      
                      <p className="text-[#735B43] text-base leading-relaxed flex-grow relative z-10">
                        {demanda.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Botões de navegação aprimorados */}              <CarouselPrevious 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-all duration-300 focus:outline-none hover:scale-110"
                data-carousel-prev
              />
              <CarouselNext 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-all duration-300 focus:outline-none hover:scale-110"
                data-carousel-next
              />
            </Carousel>
              {/* Indicadores dinâmicos de navegação */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                {demandas.map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentSlide ? "w-12 bg-[#C19A6B]" : "w-6 bg-[#C19A6B]/50 hover:bg-[#C19A6B]/70"
                    }`}
                    role="button"
                    aria-label={`Ir para o slide ${index + 1}`}
                    tabIndex={0}                    onClick={() => {
                      // Usa a função de navegação direta que criamos
                      goToSlide(index);
                    }}
                  ></div>
                ))}
              </div>
            </div>
              {/* Adiciona dicas de acessibilidade para usuários de dispositivos móveis */}
            <p className="text-center text-xs text-[#5A4632] mt-4 md:hidden">
              Deslize para navegar entre os serviços
            </p>
          </div>
        </div>        {/* Seção Outros Serviços - Aprimorada */}        <div className="mt-16 relative pb-12">
          {/* Elementos decorativos aprimorados */}
          <div className="absolute -top-10 -left-10 w-36 h-36 bg-[#C19A6B] opacity-5 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#C19A6B] opacity-5 rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-[#583B1F] opacity-5 rounded-full hidden lg:block"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 bg-[#583B1F] opacity-5 rounded-full hidden lg:block"></div>
          
          {/* Título com design aprimorado */}          <h3 className="text-2xl md:text-3xl font-light mb-6 md:mb-8 border-b border-[#583B1F] pb-4 inline-block relative">
            <span className="relative z-10">Outros Serviços</span>
            
          </h3>
          
          <p className="text-[#735B43] text-base md:text-lg mb-8 max-w-3xl font-light leading-relaxed">
            Além da psicoterapia individual, ofereço outras modalidades de atendimento e serviços para promover o bem-estar psicológico.
          </p>
          
          {/* Grid com melhor aproveitamento de espaço e design mais moderno */}
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4 mt-10">
            {/* Card 1: Psicoterapia Individual - Agora com melhor contraste e interatividade */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 text-center group border-t-4 border-[#C19A6B] relative overflow-hidden transform hover:-translate-y-2 hover:bg-[#FFFAF5] cursor-pointer">
              {/* Elementos decorativos aprimorados */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C19A6B] opacity-5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C19A6B]/30 to-transparent transform scaleX-0 group-hover:scaleX-100 transition-transform duration-500 origin-left"></div>
              
              {/* Ícone com efeito de foco melhorado */}
              <div className="flex justify-center mb-5">
                <div className="bg-[#C19A6B] p-4 rounded-full shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-[#B38A5B]">
                  <Heart className="h-7 w-7 text-[#F8F5F0]" />
                </div>
              </div>

              {/* Título com melhor hierarquia visual */}
              <h4 className="text-xl font-medium text-[#583B1F] mb-4 transition-colors duration-300 group-hover:text-[#583B1F]">
                Psicoterapia Individual
              </h4>
              
              {/* Linha decorativa para separação visual */}
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent mx-auto mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Texto com melhor leiturabilidade */}
              <p className="text-[#735B43] text-base font-light leading-relaxed mx-auto">
                Atendimento focado nas suas necessidades, promovendo autoconhecimento e bem-estar.
              </p>
            </div>

            {/* Card 2: Grupos Psicoterapêuticos - Com mesmo padrão de design aprimorado */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 text-center group border-t-4 border-[#C19A6B] relative overflow-hidden transform hover:-translate-y-2 hover:bg-[#FFFAF5] cursor-pointer">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C19A6B] opacity-5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C19A6B]/30 to-transparent transform scaleX-0 group-hover:scaleX-100 transition-transform duration-500 origin-left"></div>
              
              <div className="flex justify-center mb-5">
                <div className="bg-[#C19A6B] p-4 rounded-full shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-[#B38A5B]">
                  <Users className="h-7 w-7 text-[#F8F5F0]" />
                </div>
              </div>

              <h4 className="text-xl font-medium text-[#583B1F] mb-4 transition-colors duration-300 group-hover:text-[#583B1F]">
                Grupos Psicoterapêuticos
              </h4>
              
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent mx-auto mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <p className="text-[#735B43] text-base font-light leading-relaxed mx-auto">
                Espaços de troca e crescimento coletivo, abordando temas específicos em um ambiente seguro.
              </p>
            </div>

            {/* Card 3: Atendimento Comunitário */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 text-center group border-t-4 border-[#C19A6B] relative overflow-hidden transform hover:-translate-y-2 hover:bg-[#FFFAF5] cursor-pointer">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C19A6B] opacity-5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C19A6B]/30 to-transparent transform scaleX-0 group-hover:scaleX-100 transition-transform duration-500 origin-left"></div>
              
              <div className="flex justify-center mb-5">
                <div className="bg-[#C19A6B] p-4 rounded-full shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-[#B38A5B]">
                  <Home className="h-7 w-7 text-[#F8F5F0]" />
                </div>
              </div>

              <h4 className="text-xl font-medium text-[#583B1F] mb-4 transition-colors duration-300 group-hover:text-[#583B1F]">
                Atendimento Comunitário
              </h4>
              
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent mx-auto mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <p className="text-[#735B43] text-base font-light leading-relaxed mx-auto">
                Projetos e parcerias para levar o cuidado psicológico a diferentes comunidades.
              </p>
            </div>

            {/* Card 4: Workshops e Palestras */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 text-center group border-t-4 border-[#C19A6B] relative overflow-hidden transform hover:-translate-y-2 hover:bg-[#FFFAF5] cursor-pointer">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#C19A6B] opacity-5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C19A6B]/30 to-transparent transform scaleX-0 group-hover:scaleX-100 transition-transform duration-500 origin-left"></div>
              
              <div className="flex justify-center mb-5">
                <div className="bg-[#C19A6B] p-4 rounded-full shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-[#B38A5B]">
                  <Presentation className="h-7 w-7 text-[#F8F5F0]" />
                </div>
              </div>

              <h4 className="text-xl font-medium text-[#583B1F] mb-4 transition-colors duration-300 group-hover:text-[#583B1F]">
                Workshops e Palestras
              </h4>
              
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent mx-auto mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <p className="text-[#735B43] text-base font-light leading-relaxed mx-auto">
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
