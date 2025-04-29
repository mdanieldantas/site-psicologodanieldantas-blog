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
    'px-6 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blogPrimary focus:ring-offset-2';
  const variants = {
    primary:
      'bg-blogPrimary text-blogPrimary-foreground border border-blogPrimary hover:bg-blogPrimary-foreground hover:text-blogPrimary',
    secondary:
      'bg-blogSecondary text-blogSecondary-foreground border border-blogBorder hover:bg-blogMuted',
  };
  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
};

export default ButtonBlog;
