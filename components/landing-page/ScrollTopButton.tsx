import { ArrowUp } from "lucide-react";

// Define as propriedades esperadas pelo componente ScrollTopButton
interface ScrollTopButtonProps {
  show: boolean; // Controla a visibilidade do botão
  scrollToTop: () => void; // Função a ser chamada no clique
}

// Componente ScrollTopButton: Botão flutuante para rolar a página de volta ao topo
const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ show, scrollToTop }) => {

  // Renderiza o botão apenas se a prop 'show' for verdadeira
  if (!show) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop} // Usa a função passada via props
      className="fixed bottom-6 left-6 bg-[#583B1F] text-[#F8F5F0] p-3 rounded-full shadow-lg hover:bg-[#735B43] transition-colors duration-300 z-50"
      aria-label="Voltar ao topo"
    >
      <ArrowUp size={24} />
    </button>
  );
};

export default ScrollTopButton;
