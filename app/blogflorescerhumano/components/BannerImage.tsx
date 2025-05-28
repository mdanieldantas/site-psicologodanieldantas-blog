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
  // Inicialize com o caminho base sem parâmetros de consulta
  const [imagePath, setImagePath] = useState(bannerPath);
  const [imageError, setImageError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Primeiro efeito para marcar quando estamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Segundo efeito para verificar a existência da imagem, executado apenas após a hidratação
  useEffect(() => {
    if (!isClient) return; // Não executa no servidor ou durante a hidratação

    const checkImageExists = async () => {
      try {
        // Usa no-cache para evitar que o fetch pegue versões em cache
        const res = await fetch(bannerPath, {
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        });
        
        if (!res.ok) {
          console.warn(`Banner ${bannerPath} não encontrado, usando fallback`);
          setImagePath(fallbackPath);
        }
      } catch (error) {
        console.error(`Erro ao verificar banner ${bannerPath}:`, error);
        setImagePath(fallbackPath);
      }
    };
    
    checkImageExists();
  }, [bannerPath, fallbackPath, isClient]);  return (
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
        setImagePath(fallbackPath);
      }}
    />
  );
}
