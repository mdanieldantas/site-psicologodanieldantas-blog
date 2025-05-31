import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonBlogProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'golden' | 'green';
}

/**
 * Botão padronizado do blog, usando tokens do Design System do blog.
 * Variantes disponíveis:
 * - primary: Marrom escuro (#583B1F) com hover verde oliva (#6B7B3F)
 * - secondary: Branco com borda marrom e hover bege (#F8F5F0)
 * - golden: Dourado (#A57C3A) com hover marrom escuro (#583B1F)
 * - green: Verde oliva (#6B7B3F) com hover verde escuro (#5B6B35)
 */
const ButtonBlog: React.FC<ButtonBlogProps> = ({
  className,
  variant = 'primary',
  ...props
}) => {  const base =
    'px-6 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blogPrimary focus:ring-offset-2 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl';  const variants = {
    primary:
      'bg-[#583B1F] text-white border border-[#583B1F] hover:bg-[#6B7B3F]',
    secondary:
      'bg-white text-[#583B1F] border border-[#583B1F] hover:bg-[#F8F5F0]',
    golden:
      'bg-[#A57C3A] text-white border border-[#A57C3A] hover:bg-[#583B1F]',
    green:
      'bg-[#6B7B3F] text-white border border-[#6B7B3F] hover:bg-[#5B6B35]',
  };
  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
};

export default ButtonBlog;
