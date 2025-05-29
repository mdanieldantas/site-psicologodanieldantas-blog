import React from 'react';
import { cn } from '@/lib/utils';


interface ButtonBlogProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primaryButtonBrown' | 'secondaryButtonBrown' | 'goldButton';
}

/**
 * Botão padronizado do blog Florescer Humano.
 * Variantes disponíveis:
 * - primaryButtonBrown: Fundo marrom escuro (#583B1F), texto branco, hover verde oliva (#6B7B3F), texto permanece branco
 * - secondaryButtonBrown: Fundo branco, borda marrom escuro, texto marrom escuro, hover bege claro (#F8F5F0) com texto dourado (#A57C3A)
 * - goldButton: Fundo marrom claro/dourado (#A57C3A), texto branco, hover marrom escuro (#583B1F) com texto dourado (#A57C3A)
 *
 * Exemplo de uso:
 * <ButtonBlog variant="primaryButtonBrown">Explorar Artigos</ButtonBlog>
 * <ButtonBlog variant="secondaryButtonBrown">Ver Categorias</ButtonBlog>
 * <ButtonBlog variant="goldButton">Entre em Contato</ButtonBlog>
 */
const ButtonBlog: React.FC<ButtonBlogProps> = ({
  className,
  variant = 'primaryButtonBrown',
  ...props
}) => {
  const base =
    'px-6 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#583B1F] focus:ring-offset-2';
  const variants: Record<string, string> = {
    primaryButtonBrown:
      'bg-[#583B1F] text-white border border-[#583B1F] hover:bg-[#6B7B3F] hover:text-white',
    secondaryButtonBrown:
      'bg-white text-[#583B1F] border-2 border-[#583B1F] hover:bg-[#F8F5F0] hover:text-[#A57C3A]',
    goldButton:
      'bg-[#A57C3A] text-white border border-[#A57C3A] hover:bg-[#583B1F] hover:text-[#A57C3A]',
  };
  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
};

export default ButtonBlog;
