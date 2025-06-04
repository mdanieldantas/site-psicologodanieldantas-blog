// app/blogflorescerhumano/components/ElegantImageFrame.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface ElegantImageFrameProps {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  frameStyle?: 'classic' | 'modern' | 'elegant' | 'minimal';
}

const ElegantImageFrame: React.FC<ElegantImageFrameProps> = ({
  src,
  alt,
  title,
  subtitle,
  className = '',
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw",
  frameStyle = 'elegant'
}) => {
  const frameStyles = {
    classic: {
      container: "bg-gradient-to-br from-[#F8F5F0] via-[#F8F5F0] to-[#E8E0D6] p-6 border-2 border-[#C19A6B]/40 shadow-xl",
      innerFrame: "border-4 border-[#C19A6B]/20 bg-white/50 p-3",
      corners: "absolute w-6 h-6 border-2 border-[#C19A6B]",
      decoration: true
    },
    modern: {
      container: "bg-[#F8F5F0] p-4 border border-[#C19A6B]/30 shadow-lg",
      innerFrame: "border border-[#C19A6B]/10 bg-white/30 p-2",
      corners: "absolute w-4 h-4 border border-[#C19A6B]/60",
      decoration: false
    },
    elegant: {
      container: "bg-gradient-to-br from-[#F8F5F0]/90 via-[#F8F5F0] to-[#E8E0D6]/80 p-5 border border-[#C19A6B]/30 shadow-2xl backdrop-blur-sm",
      innerFrame: "border-2 border-[#C19A6B]/15 bg-gradient-to-t from-white/40 to-white/20 p-3",
      corners: "absolute w-5 h-5 border-l-2 border-t-2 border-[#C19A6B]/70",
      decoration: true
    },
    minimal: {
      container: "bg-[#F8F5F0]/60 p-3 border border-[#C19A6B]/20 shadow-md",
      innerFrame: "bg-white/20 p-2",
      corners: "absolute w-3 h-3 border border-[#C19A6B]/50",
      decoration: false
    }
  };

  const style = frameStyles[frameStyle];

  return (
    <div className={`relative rounded-2xl overflow-hidden ${style.container} ${className}`}>
      {/* Decorative corners */}
      {style.decoration && (
        <>
          {/* Top corners */}
          <div className={`${style.corners} top-2 left-2 border-b-0 border-r-0`}></div>
          <div className={`${style.corners} top-2 right-2 border-b-0 border-l-0 border-t-2 border-r-2`}></div>
          
          {/* Bottom corners */}
          <div className={`${style.corners} bottom-2 left-2 border-t-0 border-r-0 border-l-2 border-b-2`}></div>
          <div className={`${style.corners} bottom-2 right-2 border-t-0 border-l-0 border-r-2 border-b-2`}></div>
        </>
      )}

      {/* Inner frame */}
      <div className={`relative rounded-lg overflow-hidden ${style.innerFrame}`}>
        
        {/* Ornamental flourish (apenas para elegant e classic) */}
        {frameStyle === 'elegant' && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-8 h-1 bg-gradient-to-r from-transparent via-[#C19A6B]/50 to-transparent rounded-full"></div>
          </div>
        )}

        {/* Image container with aspect ratio */}
        <div className="relative w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[5/3]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            priority={priority}
            sizes={sizes}
          />
          
          {/* Subtle inner shadow for depth */}
          <div className="absolute inset-0 shadow-inner pointer-events-none rounded-lg"></div>
        </div>

        {/* Title and subtitle overlay */}
        {(title || subtitle) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#583B1F]/80 via-[#583B1F]/40 to-transparent p-4">
            {title && (
              <h3 className="text-white font-semibold text-sm md:text-base mb-1 drop-shadow-lg">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-white/90 text-xs md:text-sm drop-shadow-md">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Elegant border glow effect */}
      {frameStyle === 'elegant' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C19A6B]/10 via-transparent to-[#C19A6B]/5 pointer-events-none"></div>
      )}

      {/* Decorative ornaments for classic style */}
      {frameStyle === 'classic' && (
        <>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent"></div>
        </>
      )}
    </div>
  );
};

export default ElegantImageFrame;
