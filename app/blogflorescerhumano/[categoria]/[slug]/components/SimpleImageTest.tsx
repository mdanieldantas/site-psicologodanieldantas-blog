/**
 * Componente de imagem simples - versão mínima para teste
 */

'use client';

import Image from 'next/image';

interface SimpleImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function SimpleImageTest({
  src,
  alt,
  priority = true,
  className = ''
}: SimpleImageProps) {
  return (
    <div className={`w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={0}
        priority={priority}
        className="w-full h-auto"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px'
        }}
        quality={90}
      />
    </div>
  );
}
