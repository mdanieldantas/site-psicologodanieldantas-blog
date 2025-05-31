'use client'

import React from 'react'
import ButtonBlog from './ButtonBlog'
import SafeButtonWrapper from '@/components/SafeButtonWrapper'

/**
 * Exemplo de uso do ButtonBlog com Error Boundary
 * Demonstra todas as automações e o sistema de tratamento de erros
 */
export const ButtonBlogExample: React.FC = () => {
  const handleNewsletterSubscribe = async () => {
    // Simula uma operação que pode falhar
    const random = Math.random()
    if (random < 0.3) {
      throw new Error('Falha na conexão com o servidor')
    }
    
    console.log('Newsletter subscription successful!')
    return 'success'
  }

  const handleAnalyticsAction = () => {
    // Simula tracking de analytics
    console.log('Analytics event tracked')
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#583B1F]">
        Exemplos do ButtonBlog com Error Boundary
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Exemplo 1: Button com Auto Scroll */}
        <div className="space-y-2">
          <h3 className="font-semibold">Auto Scroll para Seção</h3>
          <SafeButtonWrapper>
            <ButtonBlog
              variant="primary"
              autoScroll={{
                target: "#artigos",
                behavior: "smooth",
                offset: 80
              }}
              autoTrack={{
                event: "scroll_to_section",
                properties: { section: "artigos" }
              }}
            >
              Ver Artigos
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>

        {/* Exemplo 2: Button com Newsletter + Analytics */}
        <div className="space-y-2">
          <h3 className="font-semibold">Newsletter com Analytics</h3>          <SafeButtonWrapper>
            <ButtonBlog
              variant="golden"
              autoSubmit={{
                form: "newsletter-form"
              }}
              autoNotify={{
                type: "success",
                message: "Inscrito com sucesso!"
              }}
              autoTrack={{
                event: "newsletter_subscribe",
                properties: { location: "hero" }
              }}
              autoDebounce={2000}
              onClick={handleNewsletterSubscribe}
            >
              Inscrever Newsletter
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>

        {/* Exemplo 3: Button com Auto Save */}
        <div className="space-y-2">
          <h3 className="font-semibold">Auto Save Preferências</h3>          <SafeButtonWrapper>
            <ButtonBlog
              variant="green"
              autoSave={{
                key: "user_preferences",
                value: { theme: "dark", notifications: true }
              }}
              autoNotify={{
                type: "success",
                message: "Preferências salvas!"
              }}
              autoVibrate={[100]}
            >
              Salvar Preferências
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>

        {/* Exemplo 4: Button com Auto Copy */}
        <div className="space-y-2">
          <h3 className="font-semibold">Copiar Link do Artigo</h3>          <SafeButtonWrapper>
            <ButtonBlog
              variant="secondary"
              autoCopy={{
                text: "https://psicologodanieldantas.com.br/artigo-exemplo",
                successMessage: "Link copiado!"
              }}
              autoNotify={{
                type: "info",
                message: "Link copiado!"
              }}
              autoTrack={{
                event: "article_share",
                properties: { method: "copy_link" }
              }}
            >
              Compartilhar Artigo
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>

        {/* Exemplo 5: Button com Auto Toggle */}
        <div className="space-y-2">
          <h3 className="font-semibold">Toggle Tema</h3>          <SafeButtonWrapper>
            <ButtonBlog
              variant="primary"
              autoToggle={{
                target: "body",
                className: "dark-theme"
              }}
              autoSave={{
                key: "theme_preference",
                value: "toggle"
              }}
              autoTrack={{
                event: "theme_toggle",
                properties: { from: "header" }
              }}
            >
              🌙 Alternar Tema
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>

        {/* Exemplo 6: Button com Auto Counter */}
        <div className="space-y-2">
          <h3 className="font-semibold">Contador de Likes</h3>          <SafeButtonWrapper>
            <ButtonBlog
              variant="golden"
              autoCounter={{
                key: "article_likes",
                max: 10,
                onMax: () => console.log("Máximo de likes atingido!")
              }}
              autoNotify={{
                type: "success",
                message: "Like adicionado!"
              }}
              autoVibrate={[50]}
              autoAnimate={{
                animation: "pulse",
                duration: 300
              }}
            >
              ❤️ Like
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>

        {/* Exemplo 7: Link Button */}
        <div className="space-y-2">
          <h3 className="font-semibold">Link para Página</h3>
          <SafeButtonWrapper>
            <ButtonBlog
              href="/contato"
              variant="green"
              autoTrack={{
                event: "page_navigation",
                properties: { destination: "contato" }
              }}
            >
              Entre em Contato
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>

        {/* Exemplo 8: Button com Simulação de Erro */}
        <div className="space-y-2">
          <h3 className="font-semibold">Teste Error Boundary</h3>          <SafeButtonWrapper>
            <ButtonBlog
              variant="secondary"
              autoSubmit={{
                form: "error-test-form"
              }}
              autoNotify={{
                type: "error",
                message: "Algo deu errado!"
              }}
              onClick={async () => {
                // Força um erro para demonstrar o error boundary
                throw new Error("Erro simulado para demonstração")
              }}
            >
              🚨 Simular Erro
            </ButtonBlog>
          </SafeButtonWrapper>
        </div>
      </div>

      {/* Seção de destino para auto scroll */}
      <div id="artigos" className="mt-16 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-[#583B1F]">
          📄 Seção de Artigos
        </h2>
        <p className="text-gray-600 mt-2">
          Esta é a seção de artigos que foi alvo do auto scroll.
        </p>
      </div>
    </div>
  )
}
