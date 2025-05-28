// Componente Footer específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogFooter.tsx
import React from 'react';
import Link from 'next/link';
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

const BlogFooter = () => {
  // Informações de contato e redes sociais
  const contactInfo = {
    email: 'contatomarcosdgomes@gmail.com',
    instagramUrl: 'https://www.instagram.com/psidanieldantas',
    linkedinUrl: 'https://www.linkedin.com/in/psidanieldantas',
    youtubeUrl: 'https://youtube.com/@psidanieldantas',
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
          </div>

          {/* Seção de Agendamento */}
          <div>
            <div className="bg-[#E8E6E2] rounded-lg p-6 text-[#583B1F]">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-[#6B7B3F]" />
                <h3 className="text-lg font-semibold">Agende sua Consulta</h3>
              </div>
              <p className="text-sm mb-4 leading-relaxed">
                Se você está considerando buscar um espaço para você, te convido a entrar em contato.
              </p>
              <AgendamentoBotao 
                variant="primary" 
                size="md" 
                fullWidth={true}
                className="bg-[#583B1F] hover:bg-[#5B3E22]"
              >
                Agendar Primeira Sessão
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
