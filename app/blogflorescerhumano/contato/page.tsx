// app/blogflorescerhumano/contato/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import ContatoFormulario from './components/ContatoFormulario';

export const metadata: Metadata = {
  title: 'Contato | Blog Florescer Humano',
  description: 'Entre em contato com o Blog Florescer Humano para dúvidas, sugestões ou parcerias. Adoraríamos ouvir você!',
  alternates: {
    canonical: '/blogflorescerhumano/contato',
  },
  openGraph: {
    title: 'Contato | Blog Florescer Humano',
    description: 'Envie sua mensagem para o Blog Florescer Humano.',
    url: '/blogflorescerhumano/contato',
    siteName: 'Blog Florescer Humano',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contato | Blog Florescer Humano',
    description: 'Envie sua mensagem para o Blog Florescer Humano.',
  },
};

export default function ContatoPage() {
  // Informações de contato
  const contactInfo = {
    phone: "+55 (85) 98601-3431",
    email: "contatomarcosdgomes@gmail.com",
    address: "Brazil, Fortaleza-CE",
    facebookUrl: "https://www.facebook.com/psicologodanieldantas",
    instagramUrl: "https://www.instagram.com/psidanieldantas",
    youtubeUrl: "https://www.youtube.com/@psidanieldantas",
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Entre em Contato
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Informações de Contato (como antes) */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-sm space-y-8"> {/* Adicionado space-y-8 */}
          <div> {/* Div para Fale Conosco e texto */}
            <h2 className="text-2xl font-semibold mb-6 text-teal-700">Fale Conosco</h2>
            <p className="text-lg text-gray-700 mb-4">
              Tem alguma dúvida, sugestão, ou gostaria de propor uma parceria?
              Utilize o formulário ao lado ou entre em contato diretamente.
            </p>
          </div>

          <div> {/* Div para Informações de Contato */}
            <h3 className="text-xl font-semibold mb-4 text-teal-800 border-b pb-2">Informações de Contato</h3>
            <ul className="space-y-4 mt-4">
              <li className="flex items-start">
                <div className="bg-teal-600 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-800">Telefone</span>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                    className="text-gray-600 hover:text-teal-700 text-sm"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-teal-600 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-800">E-mail</span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-gray-600 hover:text-teal-700 text-sm"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-teal-600 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-800">Endereço</span>
                  <p className="text-gray-600 text-sm">{contactInfo.address}</p>
                </div>
              </li>
            </ul>
          </div>

          <div> {/* Div para Redes Sociais */}
            <h3 className="text-xl font-semibold mb-4 text-teal-800 border-b pb-2">Redes Sociais</h3>
            <div className="flex space-x-4 mt-4">
              <Link href={contactInfo.facebookUrl} passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer" className="bg-teal-700 p-2 rounded-full hover:bg-teal-800 transition-colors">
                  <Facebook className="h-5 w-5 text-white" />
                </a>
              </Link>
              <Link href={contactInfo.instagramUrl} passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer" className="bg-teal-700 p-2 rounded-full hover:bg-teal-800 transition-colors">
                  <Instagram className="h-5 w-5 text-white" />
                </a>
              </Link>
              <Link href={contactInfo.youtubeUrl} passHref legacyBehavior>
                <a target="_blank" rel="noopener noreferrer" className="bg-teal-700 p-2 rounded-full hover:bg-teal-800 transition-colors">
                  <Youtube className="h-5 w-5 text-white" />
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Formulário de Contato (agora um componente separado) */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Envie sua Mensagem</h2>
          {/* Renderiza o Client Component, passando as props necessárias */}
          <ContatoFormulario contactInfo={contactInfo} />
        </div>
      </div>
    </main>
  );
}
