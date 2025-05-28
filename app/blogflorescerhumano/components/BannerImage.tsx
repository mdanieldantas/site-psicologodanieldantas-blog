"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface BannerImageProps {
  bannerPath: string;
  fallbackPath: string;
  alt: string;
  className?: string;
}

export default function BannerImage({ 
  bannerPath, 
  fallbackPath, 
  alt,
  className = "brightness-75"
}: BannerImageProps) {
  // Adiciona um parâmetro de cache busting para forçar o recarregamento da imagem
  const timestamp = Date.now();
  const [imagePath, setImagePath] = useState(`${bannerPath}?v=${timestamp}`);
  const [imageError, setImageError] = useState(false);

  // Verificação prévia da existência da imagem com cache-busting
  useEffect(() => {
    const checkImageExists = async () => {
      try {
        // Usa no-cache para evitar que o fetch pegue versões em cache
        const res = await fetch(bannerPath, {
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        });
        
        if (!res.ok) {
          console.warn(`Banner ${bannerPath} não encontrado, usando fallback`);
          setImagePath(`${fallbackPath}?v=${timestamp}`);
        }
      } catch (error) {
        console.error(`Erro ao verificar banner ${bannerPath}:`, error);
        setImagePath(`${fallbackPath}?v=${timestamp}`);
      }
    };
    
    checkImageExists();
  }, [bannerPath, fallbackPath, timestamp]);

  return (
    <Image
      src={imagePath}
      alt={alt}
      fill
      priority
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
      }}
      className={className}
      onError={() => {
        // Este tratamento é um fallback adicional caso o useEffect não funcione
        console.log('Usando banner alternativo após erro de carregamento');
        setImageError(true);
        setImagePath(`${fallbackPath}?v=${timestamp}`);
      }}
    />
  );
}
