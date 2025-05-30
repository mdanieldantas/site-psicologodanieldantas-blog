"use client";

// Componente Footer específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogFooter.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsletterBlogForm } from './NewsletterBlogForm';
import AgendamentoBotao from './agendamento-botao';
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Calendar,
  BookOpen
} from 'lucide-react';

const BlogFooter = () => {  // Informações de contato e redes sociais
  const contactInfo = {
    email: 'contatomarcosdgomes@gmail.com',
    instagramUrl: 'https://www.instagram.com/psidanieldantas',
    linkedinUrl: 'https://www.linkedin.com/in/psidanieldantas',
    youtubeUrl: 'https://youtube.com/@psidanieldantas',
    profileImage: '/blogflorescerhumano/autores/autores-daniel-psi-blog.webp', // Caminho correto para a imagem do perfil
  };  // Informações para o rodapé

  return (    <footer className="bg-[#583B1F] text-[#F8F5F0] mt-12 border-t border-[#735B43]">
      {/* Seção principal do footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Primeira Coluna - Newsletter (prioridade mobile) */}
          <div className="order-2 md:order-1 lg:order-1">
            <h3 className="text-lg font-semibold mb-2 text-[#F8F5F0]">Mantenha-se Atualizado</h3>
            <p className="text-[#E8E6E2] mb-4 text-sm leading-relaxed">
              Receba conteúdos sobre desenvolvimento pessoal e bem-estar emocional.
            </p>
            <NewsletterBlogForm />
          </div>

          {/* Segunda Coluna - Agendamento (destaque mobile) */}
          <div className="order-1 md:order-2 lg:order-2 lg:border-l lg:border-r lg:border-[#735B43] lg:px-6">
            <div className="bg-[#F8F5F0] rounded-lg p-4 text-[#583B1F] shadow-sm border border-[#E8E6E2]">
              <h3 className="text-lg font-semibold mb-3 text-[#583B1F] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Gostaria de agendar uma sessão?
              </h3>              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-3">
                <div className="relative overflow-hidden w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#A57C3A] flex-shrink-0 shadow-md">                  <Image 
                    src={contactInfo.profileImage} 
                    alt="Dr. Daniel Dantas - Psicólogo" 
                    width={96} 
                    height={96} 
                    className="object-cover"
                    onError={(e) => {
                      // Fallback para quando a imagem falhar
                      const imgElement = e.currentTarget as HTMLImageElement;
                      imgElement.src = "/placeholder-user.jpg";
                    }}
                  />
                </div>
                <div className="flex items-center justify-center sm:justify-start h-full">
                  <p className="text-xs leading-relaxed text-[#7D6E63] text-center sm:text-left">
                    Se você está considerando buscar um espaço para você, te convido a entrar em contato.
                  </p>
                </div>
              </div><AgendamentoBotao 
                variant="primary" 
                size="sm" 
                fullWidth={true}
                className="bg-[#583B1F] hover:bg-[#5B3E22]"
              >
                Agendar primeira sessão
              </AgendamentoBotao>
            </div>
          </div>

          {/* Terceira Coluna - Logo e Conecte-se */}
          <div className="order-3 text-center space-y-3">
            {/* Logo do Blog - tamanho reduzido */}            <div className="flex justify-center mb-2">
              <Image
                src="/blogflorescerhumano/logos-blog/logo-com-fundo-branco.webp"
                alt="Logo Florescer Humano"
                width={100}
                height={100}
                className="rounded-full shadow-md bg-white p-1"
              />
            </div>
            
            {/* Slogan */}
            <p className="text-[#E8E6E2] text-sm font-serif italic mb-3">
              "Oferecendo um jardim de reflexão"
            </p>

            {/* Conecte-se Conosco */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#F8F5F0]">Conecte-se Conosco</h3>
              
              {/* Redes Sociais */}
              <div className="flex justify-center gap-3 mb-2">
                <a 
                  href={contactInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8E6E2] hover:text-[#A57C3A] transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href={contactInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8E6E2] hover:text-[#A57C3A] transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={contactInfo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8E6E2] hover:text-[#A57C3A] transition-colors duration-200"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-[#E8E6E2] hover:text-[#A57C3A] transition-colors duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>              </div>
                {/* Email como texto para facilitar cópia */}
              <div className="text-center mt-2">
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="inline text-[#E8E6E2] text-sm"
                >
                  <span className="select-all cursor-text">{contactInfo.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Link para voltar ao site principal e política */}
        <div className="mt-6 pt-4 border-t border-[#735B43]">
          <div className="flex justify-center items-center gap-4 mb-3 flex-wrap">
            <Link 
              href="/" 
              className="text-xs text-[#E8E6E2] hover:text-[#A57C3A] transition-colors duration-200 hover:underline flex items-center"
            >
              Voltar ao site principal
            </Link>
            <span className="text-xs text-[#735B43]">|</span>
            <Link 
              href="/politica-de-privacidade" 
              className="text-xs text-[#E8E6E2] hover:text-[#A57C3A] transition-colors duration-200 hover:underline flex items-center"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>

        {/* Seção inferior - Copyright compacta */}
        <div className="mt-4 pt-4 border-t border-[#735B43]">
          <div className="text-center">
            <p className="text-xs text-[#E8E6E2]">
              &copy; {new Date().getFullYear()} Psicólogo Marcos Daniel Gomes Dantas - CRP 11/11854 | Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
