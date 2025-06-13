/**
 * Componente de imagem hero extremamente simples - SEM borderRadius configurável
 */

'use client';

import Image from 'next/image';

interface SimpleHeroImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function SimpleHeroImage({
  src,
  alt,
  priority = true,
  className = ''
}: SimpleHeroImageProps) {
  return (
    <div className={`w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={0}
        priority={priority}
        className="w-full h-auto rounded-lg"
        quality={90}
      />
    </div>
  );
}
