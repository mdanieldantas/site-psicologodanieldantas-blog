export default function SchemaMarkup() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Daniel Dantas - Psicólogo Online",            image: "https://psicologodanieldantas.com/foto-psicologo-daniel-dantas.png",
            url: "https://psicologodanieldantas.com",
            telephone: "+5585986013431",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Fortaleza",
              addressRegion: "CE",
              addressCountry: "BR",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -3.7319,
              longitude: -38.5267,
            },
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "08:00",
              closes: "21:00",
            },
            sameAs: [
             "https://www.instagram.com/psicologodanieldantas",
              "https://www.facebook.com/psicologodanieldantas",
              "https://twitter.com/psidanieldantas",
              "https://www.linkedin.com/in/psicologodanieldantas",
              "https://www.youtube.com/@psidanieldantas",
              "https://www.tiktok.com/@psidanieldantas",
            ],
            priceRange: "$$",
            description:
              "Psicólogo humanista online Daniel Dantas (CRP 11/11854). Oferece psicoterapia online em um espaço acolhedor e inclusivo para ajudar com ansiedade, estresse e na jornada de autoconhecimento. Sua prática é fundamentada na Abordagem Centrada na Pessoa (ACP), Focalização e Mindfulness. Atendimento em português para brasileiros em qualquer lugar do mundo, com sensibilidade a questões étnico-raciais e para a comunidade LGBTQIA+.",
            serviceArea: [
              {
                "@type": "Country",
                "name": "BR"
              },
              {
                "@type": "Place",
                "name": "Atendimento online para brasileiros no exterior"
              },
              {
                "@type": "Place",
                "name": "Atendimento online para falantes de língua portuguesa globalmente"
              }
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Serviços de Psicoterapia",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Psicoterapia Individual Online",
                    description:
                      "Atendimento individual focado em autoconhecimento, superação de desafios emocionais e promoção da saúde mental.",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Grupos Psicoterapêuticos",
                    description:
                      "Oficinas e grupos terapêuticos para práticas de regulação emocional e autoconhecimento.",
                  },
                },
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Como funciona a psicoterapia individual?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A psicoterapia individual é um processo de autoconhecimento e desenvolvimento pessoal, onde trabalhamos juntos para identificar e superar desafios emocionais, comportamentais e relacionais. As sessões são semanais e têm duração de 50 minutos.",
                },
              },
              {
                "@type": "Question",
                name: "Qual é a sua abordagem terapêutica?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Minha abordagem é baseada na Abordagem Centrada na Pessoa (ACP), que valoriza a empatia, a escuta ativa e o respeito pela singularidade de cada indivíduo. Também utilizo técnicas de Focalização para ajudar no processo de autoconhecimento e regulação emocional.",
                },
              },
              {
                "@type": "Question",
                name: "Você atende online?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim, ofereço atendimentos online para maior comodidade e acessibilidade. As sessões são realizadas por plataformas seguras e confiáveis.",
                },
              },
              {
                "@type": "Question",
                name: "Quanto tempo dura o processo terapêutico?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A duração do processo terapêutico varia conforme as necessidades e objetivos de cada pessoa. Alguns processos podem durar alguns meses, enquanto outros podem se estender por mais tempo. O importante é respeitar o tempo e o ritmo de cada indivíduo.",
                },
              },              {
                "@type": "Question",
                name: "Como agendar uma consulta?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Você pode agendar uma consulta através do formulário de contato neste site, por telefone ou WhatsApp. Após o contato inicial, agendaremos um horário que seja conveniente para você.",
                },
              },
              {
                "@type": "Question",
                name: "Você atende a comunidade LGBTQIA+?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sim, ofereço um espaço seguro, acolhedor e afirmativo para pessoas lésbicas, gays, bissexuais, transgêneros, queer, intersexo, assexuais e qualquer pessoa da comunidade LGBTQIA+. Sou psicólogo com formação em terapia afirmativa e trabalho respeitando a diversidade de identidades de gênero e orientações sexuais.",
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}

