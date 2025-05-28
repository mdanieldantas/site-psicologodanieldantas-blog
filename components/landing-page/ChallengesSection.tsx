import { Heart, Users, Compass } from "lucide-react";
import { useState, useEffect } from "react";
// Importar componentes do carrossel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Componente de separador para usar entre seções e conteúdo
const Divider = () => (
  <div className="flex justify-center my-3">
    <div className="flex items-center space-x-1">      <div className="h-1 w-1 rounded-full bg-[#A57C3A]"></div>
      <div className="h-1 w-3 rounded-full bg-[#A57C3A]"></div>
      <div className="h-1 w-1 rounded-full bg-[#A57C3A]"></div>
    </div>
  </div>
);

// Componente de indicador de progresso do carrossel
const CarouselIndicator = ({
  slides,
  activeIndex,
  onClick,
}: {
  slides: number;
  activeIndex: number;
  onClick: (index: number) => void;
}) => {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: slides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activeIndex === index
              ? "bg-[#583B1F] w-6"
              : "bg-[#A57C3A]/50 hover:bg-[#A57C3A]"
          }`}
          aria-label={`Ir para slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

// Dados dos desafios
const challenges = [
  {
    icon: Heart,
    title: "Adaptação a Mudanças",
    description:
      "Mudanças significativas na vida, como morar em um novo país ou cidade, mudar de carreira ou enfrentar transições importantes, podem despertar sentimentos de insegurança e ansiedade. Juntos, podemos trabalhar para que você encontre equilíbrio e significado nessas novas fases.",
  },
  {
    icon: Users,
    title: "Distância e Conexões",
    description:
      "A distância física de entes queridos e a construção de novas relações podem trazer desafios emocionais significativos. Trabalharemos juntos para fortalecer sua capacidade de manter conexões significativas e construir novas relações saudáveis, independentemente da distância.",
  },
  {
    icon: Compass,
    title: "Identidade e Propósito",
    description:
      "Questões sobre identidade, propósito e pertencimento são comuns, especialmente em momentos de transição. Através da nossa jornada terapêutica, você poderá explorar essas questões em um espaço seguro e acolhedor, encontrando clareza e direcionamento.",
  },
];

// Componente ChallengesSection: Descreve os desafios comuns abordados na terapia
const ChallengesSection = () => {
  // Estado para controlar o slide ativo do carrossel
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  // Atualiza o índice ativo quando o carrossel muda
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Função para navegar para um slide específico
  const scrollTo = (index: number) => {
    if (carouselApi) carouselApi.scrollTo(index);
  };

  return (
    <section id="desafios" className="py-14 md:py-24 bg-[#F8F5F0]">
      <div className="container mx-auto px-6 sm:px-8 md:px-[10%]">
        {/* Título e subtítulo da seção */}
        <h2 className="text-2xl md:text-3xl font-light mb-6 md:mb-8 border-b border-[#583B1F] pb-4 inline-block">
          Desafios que Podemos Enfrentar Juntos
        </h2>

        <p className="text-base md:text-lg text-[#735B43] mb-8 md:mb-10 max-w-3xl font-light leading-relaxed">
          Independentemente de onde você esteja, alguns desafios são universais.
          Estou aqui para te acompanhar nessa jornada.
        </p>

        <Divider />

        {/* Wrapper para o Carrossel/Grid */}
        <div className="relative mt-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setCarouselApi}
            className="w-full max-w-6xl mx-auto lg:max-w-none"
          >
            {/* Em telas grandes (lg), o content vira um grid */}
            <CarouselContent className="-ml-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:ml-0">
              {challenges.map((challenge, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full sm:basis-2/3 md:basis-1/2 lg:basis-auto lg:pl-0"
                >
                  {/* Card individual com efeitos hover aprimorados */}
                  <div
                    className="bg-white p-6 md:p-8 rounded-xl shadow-md transition-all duration-500 h-full flex flex-col border-l-4 border-[#A57C3A] relative overflow-hidden group"
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    {/* Elementos decorativos */}                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#A57C3A] opacity-5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                    <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#A57C3A] opacity-5 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100"></div>

                    {/* Cabeçalho com ícone */}
                    <div className="flex items-center mb-6 relative z-10">
                      <div
                        className={`bg-[#A57C3A] p-3 rounded-full mr-4 flex-shrink-0 shadow-md transition-all duration-300 ${
                          isHovered === index ? "scale-110" : ""
                        }`}
                      >
                        <challenge.icon className="h-6 w-6 text-[#F8F5F0]" />
                      </div>
                      <h3 className="text-xl font-medium text-[#583B1F] transition-colors duration-300 group-hover:text-[#735B43]">
                        {challenge.title}
                      </h3>
                    </div>

                    <Divider />

                    {/* Descrição */}
                    <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed flex-grow relative z-10">
                      {challenge.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Botões de navegação aprimorados */}
            <CarouselPrevious className="absolute left-[-15px] sm:left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-all duration-300 focus:outline-none hover:scale-110 lg:hidden" />
            <CarouselNext className="absolute right-[-15px] sm:right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-all duration-300 focus:outline-none hover:scale-110 lg:hidden" />
          </Carousel>

          {/* Indicadores de navegação - visíveis apenas em dispositivos móveis */}
          <div className="lg:hidden">
            <CarouselIndicator
              slides={challenges.length}
              activeIndex={activeIndex}
              onClick={scrollTo}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
