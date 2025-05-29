import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonBlogProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/**
 * Botão padronizado do blog, usando tokens do Design System do blog.
 * - Fundo marrom escuro, texto claro, borda arredondada, hover marrom médio.
 */
const ButtonBlog: React.FC<ButtonBlogProps> = ({
  className,
  variant = 'primary',
  ...props
}) => {
  const base =
    'px-6 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blogPrimary focus:ring-offset-2';  const variants = {
    primary:
      'bg-[#583B1F] text-white border border-[#583B1F] hover:bg-[#6B7B3F]',
    secondary:
      'bg-transparent text-[#583B1F] border border-[#583B1F] hover:bg-[#F8F5F0]',
  };
  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
};

export default ButtonBlog;
