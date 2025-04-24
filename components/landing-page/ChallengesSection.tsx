import { Heart, Users, Compass } from "lucide-react";
// Importar componentes do carrossel
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

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
  return (
    <section id="desafios" className="py-24 bg-[#F8F5F0]">
      <div className="container mx-auto px-[10%]">
        {/* Título e subtítulo da seção */}
        <h2 className="text-3xl font-light mb-4 text-center">Desafios que Podemos Enfrentar Juntos</h2>
        <p className="text-xl text-[#735B43] mb-12 text-center max-w-2xl mx-auto">
          Independentemente de onde você esteja, alguns desafios são universais. Estou aqui para te acompanhar nessa
          jornada.
        </p>

        {/* Wrapper para o Carrossel/Grid */}
        <div className="relative"> {/* Adicionado relative para posicionar botões */}
          <Carousel
            opts={{
              align: "start",
              loop: true, // Manter loop para mobile/tablet
            }}
            // Em telas grandes (lg), o container não precisa de classes de carrossel
            className="w-full max-w-6xl mx-auto lg:max-w-none"
          >
            {/* Em telas grandes (lg), o content vira um grid */}
            <CarouselContent className="-ml-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:ml-0">
              {challenges.map((challenge, index) => (
                // Em telas grandes (lg), o item se ajusta ao grid
                <CarouselItem key={index} className="pl-4 basis-full lg:basis-auto lg:pl-0">
                  {/* Card individual */}
                  <div className="bg-[#F8F5F0] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"> {/* Adicionado h-full e flex flex-col */}
                    <div className="flex items-center mb-4">
                      {/* Ícone */}
                      <div className="bg-[#C19A6B] p-3 rounded-full mr-4 flex-shrink-0"> {/* Adicionado flex-shrink-0 */}
                        <challenge.icon className="h-6 w-6 text-[#F8F5F0]" />
                      </div>
                      <h3 className="text-xl font-medium text-[#583B1F]">{challenge.title}</h3>
                    </div>
                    {/* Adicionado flex-grow para empurrar texto para baixo se necessário */}
                    <p className="text-[#4A3114] font-light flex-grow"> 
                      {challenge.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Botões de navegação escondidos em telas grandes (lg) */}
            <CarouselPrevious className="absolute left-[-15px] sm:left-[-20px] top-1/2 -translate-y-1/2 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-colors duration-300 focus:outline-none lg:hidden" />
            <CarouselNext className="absolute right-[-15px] sm:right-[-20px] top-1/2 -translate-y-1/2 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-colors duration-300 focus:outline-none lg:hidden" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ChallengesSection;
