import React from "react";
import ContactForm from "@/components/contact-form";
import LazyMap from "@/components/lazy-map";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

// Componente ContactSection: Exibe o formulário de contato e informações adicionais
const ContactSection = () => {
  // Informações de contato e redes sociais com links corretos
  const contactInfo = {
    phone: "+55 (85) 98601-3431",
    email: "contatomarcosdgomes@gmail.com",
    address: "Brazil, Fortaleza-CE",
    facebookUrl: "https://www.facebook.com/psicologodanieldantas", // Link correto
    instagramUrl: "https://www.instagram.com/psidanieldantas", // Link correto
    youtubeUrl: "https://www.youtube.com/@psidanieldantas", // Link correto
  };

  return (
    <section id="contato" className="py-16 md:py-24 bg-[#F8F5F0]">
      <div className="container mx-auto px-[10%]">
        {/* Título e Subtítulo Corrigidos */}
        <h2 className="text-3xl font-light mb-4 text-center">Entre em Contato</h2>
        <p className="text-lg text-[#735B43] mb-12 text-center max-w-2xl mx-auto font-light">
          Agende uma consulta ou tire suas dúvidas.
        </p>

        {/* Grid para layout do formulário e informações */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Coluna do Formulário */}
          <div className="space-y-4">
            {/* Título e Texto do Formulário Corrigidos */}
            <h3 className="text-xl font-light text-[#583B1F] mb-2 border-b border-[#C19A6B] pb-2 inline-block">
              Envie uma mensagem
            </h3>
            <p className="text-[#735B43] font-light mb-6">
              Estou aqui para te ouvir e auxiliar em sua jornada
            </p>
            {/* Componente do Formulário de Contato */}
            <ContactForm />
          </div>

          {/* Coluna de Informações Adicionais, Redes Sociais e Mapa */}
          <div className="space-y-8">
            {/* Informações de Contato Corrigidas */}
            <div>
              <h3 className="text-xl font-light text-[#583B1F] mb-4 border-b border-[#C19A6B] pb-2 inline-block">
                Informações de Contato
              </h3>
              <ul className="space-y-4 mt-4">
                <li className="flex items-start">
                  <div className="bg-[#C19A6B] p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                    <Phone className="h-4 w-4 text-[#F8F5F0]" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#583B1F]">Telefone</span>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} // Link de telefone
                      className="text-[#735B43] hover:text-[#583B1F] text-sm font-light"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#C19A6B] p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                    <Mail className="h-4 w-4 text-[#F8F5F0]" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#583B1F]">E-mail</span>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-[#735B43] hover:text-[#583B1F] text-sm font-light"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#C19A6B] p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                    <MapPin className="h-4 w-4 text-[#F8F5F0]" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#583B1F]">Endereço</span>
                    <p className="text-[#735B43] text-sm font-light">{contactInfo.address}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Redes Sociais Adicionadas */}
            <div>
              <h3 className="text-xl font-light text-[#583B1F] mb-4 border-b border-[#C19A6B] pb-2 inline-block">
                Redes Sociais
              </h3>
              <div className="flex space-x-4 mt-4">
                <Link href={contactInfo.facebookUrl} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" className="bg-[#583B1F] p-2 rounded-full hover:bg-[#735B43] transition-colors">
                    <Facebook className="h-5 w-5 text-[#F8F5F0]" />
                  </a>
                </Link>
                <Link href={contactInfo.instagramUrl} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" className="bg-[#583B1F] p-2 rounded-full hover:bg-[#735B43] transition-colors">
                    <Instagram className="h-5 w-5 text-[#F8F5F0]" />
                  </a>
                </Link>
                <Link href={contactInfo.youtubeUrl} passHref legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" className="bg-[#583B1F] p-2 rounded-full hover:bg-[#735B43] transition-colors">
                    <Youtube className="h-5 w-5 text-[#F8F5F0]" />
                  </a>
                </Link>
              </div>
            </div>

            {/* Mapa (Carregamento Preguiçoso) */}
            <div className="mt-6"> {/* Adicionado espaçamento acima do mapa */}
              {/* Título do mapa removido conforme imagem */}
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg border border-[#E0D9CF]"> {/* Borda ajustada */}
                {/* Componente LazyMap */}
                <LazyMap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
