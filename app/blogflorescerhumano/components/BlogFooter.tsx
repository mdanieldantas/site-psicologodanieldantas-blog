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

  return (
    <footer className="bg-[#583B1F] text-[#F8F5F0] mt-12 border-t border-[#735B43]">      {/* Seção principal do footer */}
      <div className="container mx-auto px-4 py-12">        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Seção da Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Mantenha-se Atualizado</h3>
            <p className="text-[#E8E6E2] mb-6 text-sm leading-relaxed">
              Receba conteúdos sobre desenvolvimento pessoal e bem-estar emocional.
            </p>
            <NewsletterBlogForm />
          </div>

          {/* Seção Central - Logo e Conecte-se */}
          <div className="text-center space-y-4">
            {/* Logo do Blog */}            <div className="flex justify-center mb-4">
              <Image
                src="/blogflorescerhumano/logos-blog/logo-com-fundo-branco.webp"
                alt="Logo Florescer Humano"
                width={150}
                height={150}
                className="rounded-full shadow-md bg-white p-2"
                priority
              />
            </div>
            
            {/* Slogan */}
            <p className="text-[#E8E6E2] text-lg font-serif italic mb-4">
              "Oferecendo um jardim de reflexão"
            </p>

            {/* Conecte-se Conosco */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#F8F5F0]">Conecte-se Conosco</h3>
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-[#E8E6E2] hover:text-[#A57C3A] transition-colors duration-200 text-sm hover:underline"
              >
                {contactInfo.email}
              </a>
            </div>

            {/* Redes Sociais Centralizadas */}
            <div className="flex justify-center gap-3 mt-4">
              <a 
                href={contactInfo.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href={contactInfo.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href={contactInfo.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a 
                href={`mailto:${contactInfo.email}`}
                aria-label="Email"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>{/* Seção de Agendamento */}
          <div>
            <div className="bg-[#F8F5F0] rounded-lg p-6 text-[#583B1F] shadow-sm border border-[#E8E6E2]">
              <h3 className="text-lg font-semibold mb-4 text-[#583B1F]">Gostaria de agendar uma sessão?</h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">                <div className="relative overflow-hidden w-20 h-20 rounded-full border-2 border-[#A57C3A] flex-shrink-0 shadow-md">
                  <Image 
                    src={contactInfo.profileImage} 
                    alt="Dr. Daniel Dantas - Psicólogo" 
                    width={80} 
                    height={80} 
                    className="object-cover"
                    priority
                    onError={(e) => {
                      // Fallback para quando a imagem falhar
                      const imgElement = e.currentTarget as HTMLImageElement;
                      imgElement.src = "/placeholder-user.jpg";
                    }}
                  />
                </div>
                <p className="text-sm leading-relaxed text-[#7D6E63] text-center sm:text-left">
                  Se você está considerando buscar um espaço para você, te convido a entrar em contato. Ficarei feliz em te receber para conversarmos.
                </p>
              </div>
                <AgendamentoBotao 
                variant="primary" 
                size="md" 
                fullWidth={true}
                className="bg-[#583B1F] hover:bg-[#5B3E22]"
              >
                Agendar primeira sessão
              </AgendamentoBotao>
            </div>
          </div>
        </div>        {/* Seção inferior - Copyright */}
        <div className="mt-12 pt-8 border-t border-[#735B43]">
          <div className="text-center">
            <p className="text-sm text-[#E8E6E2]">
              &copy; {new Date().getFullYear()} Psicólogo Marcos Daniel Gomes Dantas - CRP 11/11854
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
