import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useWhatsAppModal } from "../whatsapp-modal-context";

// Define as propriedades esperadas pelo componente Header
interface HeaderProps {
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  scrolledPastHero: boolean;
  toggleMobileMenu: () => void;
}

// Componente Header: Renderiza a barra de navegação superior
const Header: React.FC<HeaderProps> = ({
  
  isMobile,
  isMobileMenuOpen,
  scrolledPastHero,
  toggleMobileMenu,
}) => {
  const { openModal } = useWhatsAppModal();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="container mx-auto px-4 py-4">
        {/* Container da navegação com estilo condicional baseado no scroll */}
        <div
          className={`flex items-center justify-between mx-[4%] ${scrolledPastHero ? "bg-transparent" : "bg-transparent px-6 py-3"
            } transition-all duration-300`}
        >
          {/* Logo: Visível apenas no desktop antes de rolar para baixo */}
          {!isMobile && !scrolledPastHero && (
            <Link href="/" className="w-[200px]">
              <Image
                src="/navbar-logo-horizontal-navbar.png"
                alt="Daniel Dantas - Psicólogo"
                width={200}
                height={80}
                className="w-full h-auto"
              />
            </Link>
          )}

          {/* Botão do Menu Mobile: Visível em mobile OU após rolar para baixo no desktop */}
          {(isMobile || scrolledPastHero) && (
            <button
              onClick={toggleMobileMenu}
              // Simplificado: ml-auto sempre empurra para a direita quando este botão está visível
              className={`text-[#583B1F] focus:outline-none z-[101] ml-auto`}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Navegação Desktop: Visível apenas no desktop antes de rolar para baixo */}
          {!isMobile && !scrolledPastHero && (
            <div className="flex items-center space-x-6">
              <a href="#inicio" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                Início
              </a>
              <a href="#sobre" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                Sobre
              </a>
              <a href="#servicos" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                Serviços
              </a>
              <a href="#faq" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                FAQ
              </a>
              <a href="#blog" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                Blog
              </a>
              <a href="#footer" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                Contato
              </a>
<button
  type="button"
  onClick={openModal}
  className="rounded-md border border-[#735B43] px-8 py-2 text-sm text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0]"
>
  Agendar Consulta
</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
