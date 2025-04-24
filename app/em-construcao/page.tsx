"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

export default function EmConstrucao() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h1 className="text-4xl md:text-5xl font-light mb-6">Página em Construção</h1>
              <div className="w-20 h-1 bg-[#C19A6B] mb-8"></div>
              <p className="text-[#735B43] text-lg mb-8">
                Esta página está em construção, mas o conteúdo estará disponível em breve. Enquanto isso, você pode
                visitar nossa página inicial para conhecer mais sobre nossos serviços de psicoterapia.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar para a página inicial
              </Link>
            </div>

            <div
              className={`relative h-[400px] rounded-lg overflow-hidden shadow-xl transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <Image
                src="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=1287&auto=format&fit=crop"
                alt="Planta desabrochando - Crescimento e desenvolvimento"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-[#583B1F] bg-opacity-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#583B1F] to-transparent">
                <p className="text-[#F8F5F0] text-lg font-light">"O crescimento é um processo. Dê tempo a si mesmo."</p>
              </div>
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
  )
}

