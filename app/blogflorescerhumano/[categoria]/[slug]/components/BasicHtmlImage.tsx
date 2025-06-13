/**
 * Componente de imagem usando HTML puro - para debug
 */

interface BasicImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BasicHtmlImage({
  src,
  alt,
  className = ''
}: BasicImageProps) {
  return (
    <div className={`w-full ${className}`}>
      <img 
        src={src}
        alt={alt}
        className="w-full h-auto rounded-lg"
        style={{
          width: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
}
