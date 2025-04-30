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
    // Cor de fundo e texto principal ajustados
    <footer id="footer" className="bg-[#583B1F] text-[#F8F5F0] py-12 mt-16">
      {/* Padding ajustado para mobile-first */}
      <div className="container mx-auto px-6 md:px-[10%]">
        {/* Alterado para grid de 3 colunas em telas médias e maiores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8"> {/* Aumentado gap no desktop */}
          {/* Coluna 1: Logo e Descrição - Centralizada */}
          <div className="space-y-4 flex flex-col items-center">
            <Link href="/" className="inline-block mb-2">
              <Image
                src="/Daniel-Dantas-logo-footer-correta.png" // Verifique se o caminho está correto
                alt="Daniel Dantas - Psicólogo Logo Rodapé"
                width={150} // Ajuste o tamanho conforme necessário
                height={75} // Ajuste o tamanho conforme necessário
                className="h-auto"
              />
            </Link>
            {/* Cor do texto do parágrafo ajustada e texto centralizado */}
            <p className="text-sm font-light text-[#EAE6E1] text-center">
              Psicoterapia humanizada e acolhedora para ajudar você em sua jornada de autoconhecimento e bem-estar emocional.
            </p>
            {/* Ícones Sociais - Cores ajustadas e centralizados */}
            <div className="flex space-x-4 pt-2 justify-center">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#EAE6E1] hover:text-[#C19A6B] bg-[#735B43] p-2 rounded-full transition-colors">
                <Facebook size={18} />
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#EAE6E1] hover:text-[#C19A6B] bg-[#735B43] p-2 rounded-full transition-colors">
                <Instagram size={18} />
              </a>
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-[#EAE6E1] hover:text-[#C19A6B] bg-[#735B43] p-2 rounded-full transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            {/* Título ajustado: removido inline-block md:inline */}
            <h4 className="font-medium mb-4 text-[#F8F5F0] pb-2 border-b border-[#735B43]"> 
              Links Rápidos
            </h4>
            {/* Lista: removido inline-block text-left */}
            <ul className="space-y-2 text-sm font-light mt-2"> 
              {/* Cores dos links ajustadas */}
              <li><a href="#inicio" className="text-[#EAE6E1] hover:text-[#C19A6B] flex items-center"><span className="mr-2">•</span>Início</a></li>
              <li><a href="#sobre" className="text-[#EAE6E1] hover:text-[#C19A6B] flex items-center"><span className="mr-2">•</span>Sobre</a></li>
              <li><a href="#servicos" className="text-[#EAE6E1] hover:text-[#C19A6B] flex items-center"><span className="mr-2">•</span>Serviços</a></li>
              <li><a href="#faq" className="text-[#EAE6E1] hover:text-[#C19A6B] flex items-center"><span className="mr-2">•</span>FAQ</a></li>
              <li><Link href="/blogflorescerhumano" className="text-[#EAE6E1] hover:text-[#C19A6B] flex items-center"><span className="mr-2">•</span>Blog</Link></li>
              <li><a href="#contato" className="text-[#EAE6E1] hover:text-[#C19A6B] flex items-center"><span className="mr-2">•</span>Contato</a></li>
              <li><Link href="/politica-de-privacidade" className="text-[#EAE6E1] hover:text-[#C19A6B] flex items-center"><span className="mr-2">•</span>Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            {/* Título ajustado: removido inline-block md:inline */}
            <h4 className="font-medium mb-4 text-[#F8F5F0] pb-2 border-b border-[#735B43]"> 
              Contato
            </h4>
            {/* Lista: removido inline-block text-left */}
            <ul className="space-y-3 text-sm font-light mt-2"> 
              {/* Cores dos ícones e links ajustadas */}
              <li className="flex items-start">
                <Phone size={16} className="mr-2 mt-1 text-[#C19A6B] flex-shrink-0" />
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-[#EAE6E1] hover:text-[#C19A6B]">
                  {formattedPhoneNumber}
                </a>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="mr-2 mt-1 text-[#C19A6B] flex-shrink-0" />
                <a href={`mailto:${emailAddress}`} className="text-[#EAE6E1] hover:text-[#C19A6B] break-all">{emailAddress}</a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-[#C19A6B] flex-shrink-0" />
                {/* Cor do texto ajustada */}
                <span className="text-[#EAE6E1]">Brazil, Fortaleza-CE</span>
              </li>
            </ul>
            {/* Botão Agende sua Consulta (centralizado) */}
            <div className="mt-6 flex justify-center"> {/* Adicionado flex justify-center */}
<div className="mt-6 flex justify-center">
  <button
    type="button"
    onClick={openModal}
    className="inline-flex items-center px-6 py-3 bg-[#C19A6B] text-[#583B1F] hover:bg-[#D1AA7B] transition-colors duration-300 rounded-md text-sm font-medium"
  >
    <Calendar className="mr-2 h-4 w-4" />
    Agende sua Consulta
  </button>
</div>
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        {/* Cor da borda e texto ajustados */}
        <div className="border-t border-[#735B43] pt-6 text-center text-sm font-light text-[#EAE6E1]">
          &copy; {currentYear} Site criado por Psicólogo Marcos Daniel Gomes Dantas. Todos os direitos reservados. CRP {crpNumber}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
