/**
 * Componente de imagem mais simples possível - SEM estilos de borda
 */

'use client';

import Image from 'next/image';

interface MinimalImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function MinimalImage({
  src,
  alt,
  priority = true,
  className = ''
}: MinimalImageProps) {
  return (
    <div className={`w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={0}
        priority={priority}
        className="w-full h-auto"
        quality={90}
      />
    </div>
  );
}
