// filepath: c:\DevDriverRepo\landing-page-psiblog-vscode-insiders\components\landing-page\WorkSection.tsx
import { useWhatsAppModal } from "../whatsapp-modal-context";

// Componente WorkSection: Apresenta o vídeo sobre o trabalho do psicólogo
const WorkSection = () => {
  const { openModal } = useWhatsAppModal();
  return (
    <section id="trabalho" className="py-20 bg-[#F5F2EE]">
      <div className="container mx-auto px-6 md:px-[10%]">
        {/* Título da seção */}
        <h2 className="text-3xl font-light mb-4 text-[#583B1F]">Conheça Meu Trabalho</h2>

        {/* Grid para layout do texto e vídeo */}
        <div className="mt-8 grid gap-8 md:grid-cols-2 items-center">
          {/* Coluna de Texto e Lista */}
          <div className="md:order-1 order-1"> {/* Ordem no grid: texto primeiro */}
            <p className="text-[#735B43] mb-6 text-base font-light">
              Neste vídeo, compartilho minha jornada como psicólogo e apresento as abordagens terapêuticas que
              fundamentam meu trabalho: a Abordagem Centrada na Pessoa, a Focalização e o Mindfulness. Explico como
              estas técnicas se complementam para criar um processo terapêutico integrado e personalizado.
            </p>
            {/* Lista de pontos chave */}
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <div className="bg-[#C19A6B] rounded-full min-w-[24px] h-6 flex items-center justify-center mr-3 mt-1">
                  <span className="text-white">•</span> {/* Marcador visual */}
                </div>
                <p className="text-[#735B43] text-base font-light">
                  Descubra como a integração de diferentes abordagens pode potencializar seu processo terapêutico.
                </p>
              </li>
              <li className="flex items-start">
                <div className="bg-[#C19A6B] rounded-full min-w-[24px] h-6 flex items-center justify-center mr-3 mt-1">
                  <span className="text-white">•</span> {/* Marcador visual */}
                </div>
                <p className="text-[#735B43] text-base font-light">
                  Entenda como podemos trabalhar juntos em sua jornada de autoconhecimento e bem-estar.
                </p>
              </li>
            </ul>
            {/* Botão de CTA - Visível apenas em Desktop */}
            <button
              type="button"
              onClick={openModal}
              className="hidden md:inline-block px-6 py-2 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md mt-2"
            >
              Vamos iniciar sua jornada terapêutica?
            </button>
          </div>

          {/* Coluna do Vídeo e Botão Mobile */}
          <div className="md:order-2 order-2"> {/* Ordem no grid: vídeo depois */}
            {/* Container do vídeo com sombra */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              {/* Wrapper responsivo para manter a proporção do vídeo */}
              <div className="relative h-0 pb-[56.25%] rounded-lg overflow-hidden"> {/* Proporção 16:9 */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/8r22CAuoyPc" // URL do vídeo do YouTube
                  title="Conheça Meu Trabalho - Daniel Dantas"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            {/* Botão de CTA - Visível apenas em Mobile */}
            <div className="mt-6 md:hidden text-center">
              <button
                type="button"
                onClick={openModal}
                className="px-6 py-2 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md inline-block"
              >
                Vamos iniciar sua jornada terapêutica?
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
