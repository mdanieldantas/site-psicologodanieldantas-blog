import Image from "next/image"; // Adiciona a importação correta do Image

// Componente AboutSection: Apresenta informações sobre o psicólogo
const AboutSection = () => {
  return (
    <section id="sobre" className="py-12 md:py-20 bg-[#F5F2EE]">
      <div className="container mx-auto px-6 md:px-[10%]">
        {/* Título da seção */}
        <h2 className="text-2xl md:text-3xl font-light mb-8 md:mb-12 border-b border-[#583B1F] pb-4 inline-block">
          Sobre Daniel Dantas
        </h2>

        {/* Container Principal: Layout flexível para desktop e mobile */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Imagem - Visível apenas em Mobile (aparece antes do texto) */}
          <div className="lg:hidden w-full flex justify-center mb-6">
            <div className="relative w-[250px] h-[250px]">
              <Image
                src="/foto-psicologo-daniel-dantas.png"
                alt="Daniel Dantas - Psicólogo"
                fill
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>

          {/* Conteúdo de Texto */}
          <div className="lg:w-2/3 space-y-6">
            <p className="text-[#735B43] text-base font-light">
              Sabe aquela sensação de que o que a gente sente é tão grande que as palavras parecem pequenas demais?
              Ou, às vezes, uma dor que a gente carrega, mas que ainda não encontrou um nome?
            </p>
            {/* Citação em destaque */}
            <div className="pl-4 border-l-4 border-[#C19A6B] italic">
              <p className="text-[#735B43] text-lg">
                Algumas dores não cabem em palavras. Outras precisam ser nomeadas para serem curadas.
              </p>
            </div>
            <p className="text-[#735B43] text-base font-light">
              Essa frase me acompanha porque acredito muito no poder do espaço terapêutico para transformar o que
              sentimos, seja a ansiedade que aperta o peito, a angústia que tira o sono, ou qualquer outra
              dificuldade que esteja sentindo.
            </p>
            <p className="text-[#735B43] text-base font-light">
              Meu nome é Daniel Dantas, sou psicólogo clínico humanista, pós-graduado em Saúde Mental, Psicopatologia
              e Atenção Psicossocial. Minha prática clínica se apoia na Abordagem Centrada na Pessoa e Focalização,
              nas quais tenho formação, e nas práticas de Mindfulness. Como psicólogo, caminhei por diferentes
              lugares. Desde trabalhos com grupos, contextos de violação de direitos humanos, saúde coletiva entre
              outros. Cada um desses encontros, vivências e formações me fez ser o profissional que sou hoje, com um
              olhar mais sensível para cada história, com carinho e muito respeito.
            </p>
            <p className="text-[#735B43] text-base font-light">
              Dar o primeiro passo nem sempre é fácil, mas pode ser o início de uma grande transformação. Se você
              está considerando buscar um espaço para você, te convido a entrar em contato. Ficarei feliz em te
              receber para conversarmos.
            </p>
          </div>

          {/* Imagem - Visível apenas em Desktop (aparece à direita) */}
          <div className="hidden lg:flex lg:w-1/3 justify-end lg:pl-8">
            <div className="relative w-[350px] h-[350px]">
              <Image
                src="/foto-psicologo-daniel-dantas.png"
                alt="Daniel Dantas - Psicólogo"
                fill
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
