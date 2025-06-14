import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Calendar } from "lucide-react"; // Adicionado Calendar
import { useWhatsAppModal } from "../whatsapp-modal-context";

// Componente Footer: Renderiza o rodapé da página com informações de contato, links e copyright
const Footer = () => {
  const { openModal } = useWhatsAppModal();
  // --- INÍCIO: INFORMAÇÕES ATUALIZADAS ---
  const whatsappNumber = "5585986013431"; // Número do WhatsApp com código do país
  const formattedPhoneNumber = "+55 (85) 98601-3431"; // Número formatado para exibição
  const emailAddress = "contatomarcosdgomes@gmail.com"; // Endereço de e-mail profissional
  const facebookUrl = "https://www.facebook.com/psicologodanieldantas"; // Link do Facebook
  const instagramUrl = "https://www.instagram.com/psidanieldantas"; // Link do Instagram
  const youtubeUrl = "https://www.youtube.com/@psidanieldantas"; // Link do YouTube
  const crpNumber = "11/11854"; // Número de CRP
  // --- FIM: INFORMAÇÕES ATUALIZADAS ---
  const currentYear = new Date().getFullYear(); // Pega o ano atual dinamicamente
  
  return (
    <footer id="footer" className="bg-[#583B1F] text-[#F8F5F0] py-14 mt-16 shadow-2xl overflow-hidden">
      {/* Padding ajustado para mobile-first */}
      <div className="container mx-auto px-4 sm:px-6 md:px-[10%]">
        {/* Grid com divisores verticais no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 mb-10 md:divide-x md:divide-[#735B43]">
          {/* Coluna 1: Logo e Descrição - Centralizada */}          <div className="space-y-4 flex flex-col items-center md:pr-10">
            <Link href="/" className="inline-block w-full max-w-[500px]">
              <div className="relative w-full h-[180px]">
                <Image
                  src="/Daniel-Dantas-logo-footer-correta.webp"
                  alt="Daniel Dantas - Psicólogo Logo Rodapé"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, 500px"
                  quality={90}
                />
              </div>
            </Link>
            {/* Cor do texto do parágrafo ajustada e texto centralizado */}
            <p className="text-base font-light text-[#EAE6E1] text-center">
              Psicoterapia humanizada cultivando a compreensão.
            </p>            {/* Ícones Sociais - Cores ajustadas e centralizados */}
            <div className="flex space-x-4 pt-2 justify-center">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 bg-[#F8F5F0]/10 hover:bg-[#F8F5F0]/20 text-[#F8F5F0] rounded-full transition-colors">
                <Facebook size={18} />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-[#F8F5F0]/10 hover:bg-[#F8F5F0]/20 text-[#F8F5F0] rounded-full transition-colors">
                <Instagram size={18} />
              </a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 bg-[#F8F5F0]/10 hover:bg-[#F8F5F0]/20 text-[#F8F5F0] rounded-full transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="md:px-10">
            {/* Título com tipografia melhorada */}
            <h4 className="font-semibold mb-4 text-[#F8F5F0] pb-2 border-b border-[#735B43] tracking-wide text-lg uppercase"> 
              Links Rápidos
            </h4>
            {/* Lista: removido inline-block text-left */}            <ul className="space-y-2 text-base font-light mt-2"> 
              {/* Cores dos links ajustadas */}
              <li><a href="#inicio" className="text-[#EAE6E1] hover:text-[#A57C3A] flex items-center"><span className="mr-2">•</span>Início</a></li>
              <li><a href="#sobre" className="text-[#EAE6E1] hover:text-[#A57C3A] flex items-center"><span className="mr-2">•</span>Sobre</a></li>
              <li><a href="#servicos" className="text-[#EAE6E1] hover:text-[#A57C3A] flex items-center"><span className="mr-2">•</span>Serviços</a></li>
              <li><a href="#faq" className="text-[#EAE6E1] hover:text-[#A57C3A] flex items-center"><span className="mr-2">•</span>FAQ</a></li>
              <li><Link href="/em-construcao" className="text-[#EAE6E1] hover:text-[#A57C3A] flex items-center"><span className="mr-2">•</span>Blog</Link></li>
              <li><a href="#contato" className="text-[#EAE6E1] hover:text-[#A57C3A] flex items-center"><span className="mr-2">•</span>Contato</a></li>
              <li><Link href="/politica-de-privacidade" className="text-[#EAE6E1] hover:text-[#A57C3A] flex items-center"><span className="mr-2">•</span>Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div className="md:pl-10">
            {/* Título com tipografia melhorada */}
            <h4 className="font-semibold mb-4 text-[#F8F5F0] pb-2 border-b border-[#735B43] tracking-wide text-lg uppercase"> 
              Contato
            </h4>
            {/* Lista: removido inline-block text-left */}
            <ul className="space-y-3 text-base font-light mt-2"> 
              {/* Cores dos ícones e links ajustadas */}              <li className="flex items-start">
                <Phone size={16} className="mr-2 mt-1 text-[#A57C3A] flex-shrink-0" />
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-[#EAE6E1] hover:text-[#A57C3A]">
                  {formattedPhoneNumber}
                </a>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="mr-2 mt-1 text-[#A57C3A] flex-shrink-0" />
                <a href={`mailto:${emailAddress}`} className="text-[#EAE6E1] hover:text-[#A57C3A] break-all">{emailAddress}</a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-[#A57C3A] flex-shrink-0" />
                {/* Cor do texto ajustada */}
                <span className="text-[#EAE6E1]">Brazil, Fortaleza-CE</span>
              </li>
            </ul>            {/* Botão Agende sua Consulta (centralizado) */}            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center px-7 py-3 bg-[#6B5139] text-[#F8F5F0] hover:bg-[#7D5F47] transition-all duration-300 rounded-lg text-base font-semibold shadow-lg focus:ring-2 focus:ring-[#735B43] scale-100 hover:scale-105"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agende sua Consulta
              </button>
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        {/* Cor da borda e texto ajustados */}
        <div className="border-t border-[#735B43] pt-6 text-center text-sm font-light text-[#EAE6E1] opacity-80">
          &copy; {currentYear} Site criado por Psicólogo Marcos Daniel Gomes Dantas. Todos os direitos reservados. CRP {crpNumber}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
