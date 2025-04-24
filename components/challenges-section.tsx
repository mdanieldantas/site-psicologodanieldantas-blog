import { Heart, Users, Compass } from "lucide-react"

export default function ChallengesSection() {
  return (
    <section id="desafios" className="py-24 bg-[#F5F2EE]">
      <div className="container mx-auto px-[10%]">
        <h2 className="text-3xl font-light mb-4 text-center">Desafios que Podemos Enfrentar Juntos</h2>
        <p className="text-xl text-[#735B43] mb-12 text-center max-w-2xl mx-auto">
          Independentemente de onde você esteja, alguns desafios são universais. Estou aqui para te acompanhar nessa
          jornada.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-[#F8F5F0] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                <Heart className="h-6 w-6 text-[#F8F5F0]" />
              </div>
              <h3 className="text-xl font-medium text-[#583B1F]">Adaptação a Mudanças</h3>
            </div>
            <p className="text-[#4A3114] font-light">
              Mudanças significativas na vida, como morar em um novo país ou cidade, mudar de carreira ou enfrentar
              transições importantes, podem despertar sentimentos de insegurança e ansiedade. Juntos, podemos trabalhar
              para que você encontre equilíbrio e significado nessas novas fases.
            </p>
          </div>

          <div className="bg-[#F8F5F0] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-[#F8F5F0]" />
              </div>
              <h3 className="text-xl font-medium text-[#583B1F]">Distância e Conexões</h3>
            </div>
            <p className="text-[#4A3114] font-light">
              A distância física de entes queridos e a construção de novas relações podem trazer desafios emocionais
              significativos. Trabalharemos juntos para fortalecer sua capacidade de manter conexões significativas e
              construir novas relações saudáveis, independentemente da distância.
            </p>
          </div>

          <div className="bg-[#F8F5F0] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                <Compass className="h-6 w-6 text-[#F8F5F0]" />
              </div>
              <h3 className="text-xl font-medium text-[#583B1F]">Identidade e Propósito</h3>
            </div>
            <p className="text-[#4A3114] font-light">
              Questões sobre identidade, propósito e pertencimento são comuns, especialmente em momentos de transição.
              Através da nossa jornada terapêutica, você poderá explorar essas questões em um espaço seguro e acolhedor,
              encontrando clareza e direcionamento.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

