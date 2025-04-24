"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function PoliticaDePrivacidade() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F0] font-['Kaisei_Opti'] text-[#583B1F] flex flex-col">
      {/* Header com logo */}
      <header className="w-full py-6 px-8">
        <div className="container mx-auto">
          <Link href="/" className="w-[200px] block">
            <Image
              src="/navbar-logo-horizontal-navbar.png"
              alt="Daniel Dantas - Psicólogo"
              width={200}
              height={80}
              className="w-full h-auto"
            />
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid gap-12 items-start">
            <div
              className={`transition-all duration-700 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="text-4xl md:text-5xl font-light mb-6">Política de Privacidade</h1>
              <div className="w-20 h-1 bg-[#C19A6B] mb-8"></div>
              <p className="text-[#735B43] text-lg mb-8">
                Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais ao
                utilizar nosso site. Ao acessar e utilizar este site, você concorda com os termos descritos abaixo.
              </p>

              <h2 className="text-2xl font-medium mb-4">1. Informações Coletadas</h2>
              <p className="text-[#735B43] text-lg mb-6">
                Podemos coletar informações pessoais, como nome, e-mail e número de telefone, quando você preenche
                formulários em nosso site. Também coletamos informações de navegação, como endereço IP, tipo de
                navegador e páginas acessadas, para melhorar sua experiência.
              </p>

              <h2 className="text-2xl font-medium mb-4">2. Uso das Informações</h2>
              <p className="text-[#735B43] text-lg mb-6">
                As informações coletadas são utilizadas para:
              </p>
              {/* Lista movida para fora do parágrafo */}
              <ul className="list-disc list-inside text-[#735B43] text-lg mb-6 pl-4">
                <li>Entrar em contato com você para responder a solicitações.</li>
                <li>Melhorar nossos serviços e sua experiência no site.</li>
                <li>Enviar comunicações relacionadas aos nossos serviços, caso você tenha consentido.</li>
              </ul>

              <h2 className="text-2xl font-medium mb-4">3. Compartilhamento de Informações</h2>
              <p className="text-[#735B43] text-lg mb-6">
                Não compartilhamos suas informações pessoais com terceiros, exceto quando exigido por lei ou para
                proteger nossos direitos legais.
              </p>

              <h2 className="text-2xl font-medium mb-4">4. Cookies</h2>
              <p className="text-[#735B43] text-lg mb-6">
                Utilizamos cookies para melhorar sua experiência de navegação. Você pode desativar os cookies nas
                configurações do seu navegador, mas isso pode afetar algumas funcionalidades do site.
              </p>

              <h2 className="text-2xl font-medium mb-4">5. Segurança</h2>
              <p className="text-[#735B43] text-lg mb-6">
                Adotamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado,
                alteração ou divulgação.
              </p>

              <h2 className="text-2xl font-medium mb-4">6. Alterações nesta Política</h2>
              <p className="text-[#735B43] text-lg mb-6">
                Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise esta
                página regularmente para se manter informado sobre nossas práticas.
              </p>

              <h2 className="text-2xl font-medium mb-4">7. Contato</h2>
              <p className="text-[#735B43] text-lg mb-8">
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail{" "}
                <a href="mailto:contatomarcosdgomes@gmail.com" className="text-[#583B1F] underline">
                  contatomarcosdgomes@gmail.com
                </a>{" "}
                ou pelo telefone <span className="text-[#583B1F]">+55 (85) 98601-3431</span>.
              </p>

              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar para a página inicial
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simplificado */}
      <footer className="bg-[#583B1F] text-[#F8F5F0] py-8">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image
                src="/Daniel-Dantas-logo-footer-correta.png"
                alt="Daniel Dantas - Psicólogo"
                width={150}
                height={60}
                className="w-[150px] h-auto"
              />
            </div>
            <div className="text-sm text-center md:text-right">
              <p>Psicoterapia humanizada e acolhedora</p>
              <p className="mt-1">contatomarcosdgomes@gmail.com | +55 (85) 98601-3431</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

