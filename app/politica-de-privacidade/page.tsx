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
        <div className="container mx-auto">          <Link href="/" className="block">
            <Image
              src="/navbar-logo-horizontal-navbar-danieldantas.webp"
              alt="Daniel Dantas - Psicólogo"
              width={200}
              height={80}
              className="w-auto h-auto"
              style={{ width: 'auto', height: 'auto' }}
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
              <div className="w-20 h-1 bg-[#A57C3A] mb-8"></div>
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

              <h2 className="text-2xl font-medium mb-4">4. Newsletter e Comunicações por Email</h2>
              <p className="text-[#735B43] text-lg mb-3">
                Caso você se inscreva em nossa newsletter, utilizaremos seu endereço de email exclusivamente para enviar comunicações relacionadas aos nossos serviços, artigos e conteúdos sobre psicologia e bem-estar mental.
              </p>
              <p className="text-[#735B43] text-lg mb-3">
                Seus dados de email são armazenados em nossa base de dados com medidas rigorosas de segurança. O acesso a esses dados é estritamente limitado ao administrador do site, através de credenciais seguras e protocolos de segurança avançados.
              </p>
              <p className="text-[#735B43] text-lg mb-6">
                Você pode cancelar sua inscrição a qualquer momento através do link de cancelamento presente em todos os emails enviados. Após o cancelamento, seu email será removido da nossa lista de envios ativos.
              </p>

              <h2 className="text-2xl font-medium mb-4">5. Cookies e Tecnologias de Rastreamento</h2>
              <p className="text-[#735B43] text-lg mb-3">
                Utilizamos cookies e tecnologias semelhantes, incluindo o Google Tag Manager, para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar conteúdo.
              </p>
              <p className="text-[#735B43] text-lg mb-3">
                Os cookies podem ser classificados como:
              </p>
              <ul className="list-disc list-inside text-[#735B43] text-lg mb-3 pl-4">
                <li><span className="font-medium">Cookies Essenciais:</span> necessários para o funcionamento básico do site.</li>
                <li><span className="font-medium">Cookies Analíticos:</span> ajudam-nos a entender como os visitantes interagem com o site.</li>
              </ul>
              <p className="text-[#735B43] text-lg mb-6">
                Você pode gerenciar suas preferências de cookies através do banner de consentimento disponível em nosso site ou desativá-los nas configurações do seu navegador. No entanto, a desativação de alguns cookies pode afetar sua experiência de navegação.
              </p>

              <h2 className="text-2xl font-medium mb-4">6. Segurança</h2>
              <p className="text-[#735B43] text-lg mb-3">
                Adotamos medidas rigorosas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração ou divulgação.
              </p>
              <p className="text-[#735B43] text-lg mb-6">
                Para os dados de email coletados para nossa newsletter, implementamos as seguintes proteções:
              </p>
              <ul className="list-disc list-inside text-[#735B43] text-lg mb-6 pl-4">
                <li>Armazenamento em banco de dados seguro com criptografia</li>
                <li>Acesso restrito apenas ao administrador do site</li>
                <li>Credenciais de acesso protegidas</li>
                <li>Comunicação criptografada entre nosso site e o servidor</li>
              </ul>

              <h2 className="text-2xl font-medium mb-4">7. Seus Direitos</h2>
              <p className="text-[#735B43] text-lg mb-3">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-[#735B43] text-lg mb-6 pl-4">
                <li>Confirmar a existência de tratamento de seus dados pessoais</li>
                <li>Acessar seus dados</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Revogar o consentimento a qualquer momento (através do link de cancelamento nos emails)</li>
              </ul>

              <h2 className="text-2xl font-medium mb-4">8. Alterações nesta Política</h2>
              <p className="text-[#735B43] text-lg mb-6">
                Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos que você revise esta
                página regularmente para se manter informado sobre nossas práticas. Esta política foi atualizada pela última vez em: 15 de maio de 2025.
              </p>

              <h2 className="text-2xl font-medium mb-4">9. Contato e Responsável pelos Dados</h2>
              <p className="text-[#735B43] text-lg mb-3">
                O responsável pelo tratamento dos dados pessoais neste site é Daniel Dantas, Psicólogo, CRP 11/11854.
              </p>
              <p className="text-[#735B43] text-lg mb-8">
                Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer seus direitos relacionados aos seus dados pessoais, entre em contato conosco pelo e-mail{" "}
                <a href="mailto:contatomarcosdgomes@gmail.com" className="text-[#583B1F] underline">
                  contatomarcosdgomes@gmail.com
                </a>{" "}
                ou pelo telefone <span className="text-[#583B1F]">+55 (85) 98119-5546</span>.
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
          <div className="flex flex-col md:flex-row justify-between items-center">            <div className="mb-4 md:mb-0">              <Image
                src="/Daniel-Dantas-logo-footer-correta.webp"
                alt="Daniel Dantas - Psicólogo"
                width={150}
                height={60}
              />
            </div>
            <div className="text-sm text-center md:text-right">
              <p>Psicoterapia humanizada e acolhedora</p>
              <p className="mt-1">contatomarcosdgomes@gmail.com | +55 (85) 98119-5546</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}