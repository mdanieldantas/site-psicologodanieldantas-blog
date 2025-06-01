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
  return (    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-hidden ${
      scrolledPastHero ? "bg-[#F8F5F0]/80 backdrop-blur-sm shadow-sm py-2" : "bg-transparent py-4"
    }`}>
      <nav className="container mx-auto px-4">        {/* Container da navegação com estilo condicional baseado no scroll */}
        <div
          className={`flex items-center justify-between transition-all duration-300`}
        >          {/* Logo: Visível sempre em desktop, muda de tamanho conforme scroll */}          {!isMobile && (            <Link href="/" className="transition-all duration-300"><Image
                src="/navbar-logo-horizontal-navbar-danieldantas.webp"
                alt="Daniel Dantas - Psicólogo"
                width={240}
                height={96}
                className="w-auto transition-all duration-300"
                priority
                style={{ 
                  width: 'auto', 
                  height: scrolledPastHero ? '3rem' : '5rem' 
                }}
              />
            </Link>
          )}          {isMobile && (
            <div className="flex items-center justify-between w-full">              <Link href="/">
                <Image
                  src="/navbar-logo-horizontal-navbar-danieldantas.webp"
                  alt="Daniel Dantas - Psicólogo"
                  width={140}
                  height={56}
                  className="w-auto"
                  style={{ width: 'auto', height: '3rem' }}
                  priority
                />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className={`text-[#583B1F] focus:outline-none focus:ring-2 focus:ring-[#A57C3A] focus:ring-opacity-50 rounded-md p-1 z-[101] transition-all`}
                aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
            {/* Navegação Desktop: Sempre visível em desktop, com design adaptado ao scroll */}
          {!isMobile && (
            <div className="flex items-center space-x-6">              <a href="#inicio" className={`text-base ${scrolledPastHero ? 'text-[#583B1F]' : 'text-[#735B43]'} hover:text-[#583B1F] transition-colors duration-200 relative group px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A57C3A]`}>
                Início
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A57C3A] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#sobre" className={`text-base ${scrolledPastHero ? 'text-[#583B1F]' : 'text-[#735B43]'} hover:text-[#583B1F] transition-colors duration-200 relative group px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A57C3A]`}>
                Sobre
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A57C3A] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#servicos" className={`text-base ${scrolledPastHero ? 'text-[#583B1F]' : 'text-[#735B43]'} hover:text-[#583B1F] transition-colors duration-200 relative group px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A57C3A]`}>
                Serviços
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A57C3A] transition-all duration-300 group-hover:w-full"></span>
              </a>              <a href="#faq" className={`text-base ${scrolledPastHero ? 'text-[#583B1F]' : 'text-[#735B43]'} hover:text-[#583B1F] transition-colors duration-200 relative group px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A57C3A]`}>
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A57C3A] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#blog" className={`text-base ${scrolledPastHero ? 'text-[#583B1F]' : 'text-[#735B43]'} hover:text-[#583B1F] transition-colors duration-200 relative group px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A57C3A]`}>
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A57C3A] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#footer" className={`text-base ${scrolledPastHero ? 'text-[#583B1F]' : 'text-[#735B43]'} hover:text-[#583B1F] transition-colors duration-200 relative group px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A57C3A]`}>
                Contato
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A57C3A] transition-all duration-300 group-hover:w-full"></span>
              </a>
                {/* CTA mais destacado */}
              <button
                type="button"
                onClick={openModal}
                className={`rounded-md ${
                  scrolledPastHero 
                  ? "bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] shadow-md" 
                  : "border-2 border-[#735B43] text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0]"
                } px-8 py-2 text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] transform hover:scale-[1.02]`}
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
