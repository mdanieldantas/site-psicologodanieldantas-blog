import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import MaterialCard, { MaterialCardProps } from './MaterialCard';
import ButtonBlog from './ButtonBlog'; // Adicionar importação

// Interface para dados do material compatível com MaterialCard
interface Material extends Omit<MaterialCardProps, 'imageUrl'> {
  imageUrl?: string;
  description?: string;
  tags?: string[];
  fileSize?: string;
  format?: string;
  downloadCount?: number;
  rating?: number;
}

const sampleMaterials: Material[] = [
  {
    id: 1,
    title: 'Guia Prático de Escuta Ativa',
    type: 'E-book',
    description: 'Um guia completo para desenvolver habilidades de escuta ativa na prática clínica e no desenvolvimento pessoal.',
    imageUrl: '/blogflorescerhumano/test-image.webp',
    featured: true,
    tags: ['Escuta', 'Comunicação', 'Terapia'],
    fileSize: '2.5 MB',
    format: 'PDF',
    downloadCount: 1250,
    rating: 4.8
  },
  {
    id: 2,
    title: 'Cartas para Reflexão Humanista',
    type: 'Kit Digital',
    description: 'Um conjunto de cartas inspiradoras para práticas de autoconhecimento e reflexão baseadas na abordagem humanista.',
    imageUrl: '/blogflorescerhumano/test-image.webp',
    tags: ['Autoconhecimento', 'Reflexão', 'Humanismo'],
    fileSize: '15 MB',
    format: 'ZIP',
    downloadCount: 890,
    rating: 4.6
  },
  {
    id: 3,
    title: 'Meditação Guiada: Encontrando seu Felt Sense',
    type: 'Áudio',
    description: 'Uma meditação guiada baseada na Terapia Corporal para conectar-se com suas sensações internas e sabedoria do corpo.',
    imageUrl: '/blogflorescerhumano/test-image.webp',
    tags: ['Meditação', 'Felt Sense', 'Corpo'],
    fileSize: '45 MB',
    format: 'MP3',
    downloadCount: 1450,
    rating: 4.9
  },
];

export default function RecentMaterials() {
  return (
    <section className="py-16 bg-[#F8F5F0] relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#A57C3A]/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#6B7B3F]/5 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">        {/* Header da seção */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-[#583B1F] font-['Old_Roman'] mb-4">
            Materiais Recentes
          </h2>
          <p className="text-[#7D6E63] text-lg max-w-3xl mx-auto">
            Descubra nossos recursos gratuitos mais recentes para apoiar sua jornada de crescimento e desenvolvimento pessoal
          </p>
        </div>        {/* Grid de materiais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              {...material}
              downloadUrl="/blogflorescerhumano/materiais"
            />
          ))}
        </div>        {/* Botão Ver todos os materiais */}
        <div className="mt-12 text-center">
          <Link href="/blogflorescerhumano/materiais" passHref legacyBehavior>
            <ButtonBlog variant="primary" className="px-8 py-3 inline-flex items-center gap-3 whitespace-nowrap">
              <span>Ver todos os materiais</span>
              <ArrowRight className="h-5 w-5 flex-shrink-0" />
            </ButtonBlog>
          </Link>
        </div>
      </div>
    </section>
  );
}
