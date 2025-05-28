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
    <footer className="bg-[#583B1F] text-[#F8F5F0] mt-12 border-t border-[#735B43]">
      {/* Seção principal do footer */}
      <div className="container mx-auto px-4 py-12">        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Seção da Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Mantenha-se Atualizado</h3>
            <p className="text-[#E8E6E2] mb-6 text-sm leading-relaxed">
              Receba conteúdos sobre desenvolvimento pessoal e bem-estar emocional.
            </p>
            <NewsletterBlogForm />
          </div>          {/* Seção de Agendamento */}
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
                className="bg-[#583B1F] hover:bg-[#5B3E22] flex items-center justify-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Agendar primeira sessão
              </AgendamentoBotao>
            </div>
          </div>
        </div>

        {/* Seção inferior - Redes sociais e copyright */}
        <div className="mt-12 pt-8 border-t border-[#735B43]">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-6">
            {/* Redes Sociais */}
            <div className="flex gap-4">
              <a 
                href={contactInfo.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={contactInfo.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href={contactInfo.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href={`mailto:${contactInfo.email}`}
                aria-label="Email"
                className="p-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#6B7B3F] transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-sm">
              <p>&copy; {new Date().getFullYear()} Psicólogo Marcos Daniel Gomes Dantas - CRP 11/11854</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
