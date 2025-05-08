import { X } from "lucide-react";
import { useWhatsAppModal } from "../whatsapp-modal-context";

// Define as propriedades esperadas pelo componente MobileMenu
interface MobileMenuProps {
  isOpen: boolean; // Adiciona a propriedade para controlar se o menu está aberto
  closeMenu: () => void;
}

// Componente MobileMenu: Renderiza o menu de navegação para dispositivos móveis
const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, closeMenu }) => {
  // Função auxiliar para fechar o menu ao clicar em um link
  const handleLinkClick = () => {
    closeMenu();
  };

  // Renderiza o menu apenas se isOpen for true
  if (!isOpen) {
    return null;
  }
const { openModal } = useWhatsAppModal();
  return (
    <div className="fixed inset-0 bg-[#F8F5F0] z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Botão para fechar o menu */}      <button
        onClick={closeMenu}
        className="absolute top-6 right-4 text-[#583B1F] focus:outline-none z-[101]"
        aria-label="Fechar menu"
      >
        <X size={24} />
      </button>
      {/* Links de navegação */}
      <div className="flex flex-col items-center space-y-6">
        <a
          href="#inicio"
          className="text-xl text-[#583B1F] hover:text-[#735B43]"
          onClick={handleLinkClick}
        >
          Início
        </a>
        <a
          href="#sobre"
          className="text-xl text-[#583B1F] hover:text-[#735B43]"
          onClick={handleLinkClick}
        >
          Sobre
        </a>
        <a
          href="#servicos"
          className="text-xl text-[#583B1F] hover:text-[#735B43]"
          onClick={handleLinkClick}
        >
          Serviços
        </a>
        <a
          href="#faq"
          className="text-xl text-[#583B1F] hover:text-[#735B43]"
          onClick={handleLinkClick}
        >
          FAQ
        </a>
        <a
          href="#blog"
          className="text-xl text-[#583B1F] hover:text-[#735B43]"
          onClick={handleLinkClick}
        >
          Blog
        </a>
        <a
          href="#footer"
          className="text-xl text-[#583B1F] hover:text-[#735B43]"
          onClick={handleLinkClick}
        >
          Contato
        </a>
        {/* Botão de Agendar Consulta */}
<button
  type="button"
  className="mt-4 rounded-md border border-[#735B43] px-8 py-3 text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0]"
  onClick={() => { closeMenu(); openModal(); }}
>
  Agendar Consulta
</button>
      </div>
    </div>
  );
};

export default MobileMenu;
