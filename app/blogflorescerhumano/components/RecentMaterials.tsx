import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Material {
  id: number;
  title: string;
  type: 'E-book' | 'Kit Digital' | 'Áudio';
  imageUrl: string;
}

const sampleMaterials: Material[] = [
  {
    id: 1,
    title: 'Guia Prático de Escuta Ativa',
    type: 'E-book',
    imageUrl: '/blogflorescerhumano/materiais/guia-escuta-ativa.jpg',
  },
  {
    id: 2,
    title: 'Cartas para Reflexão Humanista',
    type: 'Kit Digital',
    imageUrl: '/blogflorescerhumano/materiais/cartas-reflexao.jpg',
  },
  {
    id: 3,
    title: 'Meditação Guiada: Encontrando seu Felt Sense',
    type: 'Áudio',
    imageUrl: '/blogflorescerhumano/materiais/meditacao-felt-sense.jpg',
  },
];

export default function RecentMaterials() {
  return (
    <section className="py-12 bg-[#F8F5F0]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-light text-[#583B1F] font-['Old Roman']">
            Materiais Recentes
          </h2>
          <Link 
            href="/blogflorescerhumano/materiais"
            className="text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
          >
            Ver todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleMaterials.map((material) => (
            <div 
              key={material.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="relative h-48">
                  <Image
                    src={material.imageUrl}
                    alt={material.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="inline-block px-3 py-1 bg-[#EAE6E1] text-[#583B1F] text-sm rounded-full mb-3">
                    {material.type}
                  </span>
                  <h3 className="text-xl font-light text-[#583B1F] mb-4">
                    {material.title}
                  </h3>
                  <Link
                    href="/blogflorescerhumano/materiais"
                    className="mt-auto px-4 py-2 bg-[#583B1F] text-white rounded-md text-center hover:bg-[#735B43] transition-colors duration-300"
                  >
                    Download Gratuito
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
