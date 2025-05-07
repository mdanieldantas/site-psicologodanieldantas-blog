import Image from "next/image"; // Adiciona a importação correta do Image

// Componente de separador para usar entre parágrafos
const Divider = () => (
  <div className="flex justify-center my-3">
    <div className="flex items-center space-x-1">
      <div className="h-1 w-1 rounded-full bg-[#C19A6B]"></div>
      <div className="h-1 w-3 rounded-full bg-[#C19A6B]"></div>
      <div className="h-1 w-1 rounded-full bg-[#C19A6B]"></div>
    </div>
  </div>
);

// Componente AboutSection: Apresenta informações sobre o psicólogo
const AboutSection = () => {
  return (    <section id="sobre" className="py-14 md:py-24 bg-[#F5F2EE]">
      <div className="container mx-auto px-6 sm:px-8 md:px-[10%]">
        {/* Título da seção */}
        <h2 className="text-2xl md:text-3xl font-light mb-8 md:mb-12 border-b border-[#583B1F] pb-4 inline-block">
          Sobre Daniel Dantas
        </h2>        {/* Container Principal: Layout flexível para desktop e mobile */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">{/* Imagem - Visível apenas em Mobile (aparece antes do texto) */}
          <div className="lg:hidden w-full flex justify-center mb-10">
            <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px]">
              <Image
                src="/foto-psicologo-daniel-dantas.png"
                alt="Daniel Dantas - Psicólogo"
                fill
                className="rounded-lg object-cover shadow-lg"
                priority={true}
              />
            </div>
          </div>{/* Conteúdo de Texto */}
          <div className="lg:w-2/3 space-y-8 md:space-y-10">
            <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed">
              Sabe aquela sensação de que o que a gente sente é tão grande que as palavras parecem pequenas demais?
              Ou, às vezes, uma dor que a gente carrega, mas que ainda não encontrou um nome?
            </p>
            
            {/* Citação em destaque */}
            <div className="pl-4 border-l-4 border-[#C19A6B] italic my-8 md:my-10">
              <p className="text-[#735B43] text-lg md:text-xl">
                Algumas dores não cabem em palavras. Outras precisam ser nomeadas para serem curadas.
              </p>
            </div>
            
            <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed">
              Essa frase me acompanha porque acredito muito no poder do espaço terapêutico para transformar o que
              sentimos, seja a ansiedade que aperta o peito, a angústia que tira o sono, ou qualquer outra
              dificuldade que esteja sentindo.
            </p>
            
            <Divider />
            
            <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed">
              Meu nome é Daniel Dantas, sou psicólogo clínico humanista, pós-graduado em Saúde Mental, Psicopatologia
              e Atenção Psicossocial. Minha prática clínica se apoia na Abordagem Centrada na Pessoa e Focalização,
              nas quais tenho formação, e nas práticas de Mindfulness. Como psicólogo, caminhei por diferentes
              lugares. Desde trabalhos com grupos, contextos de violação de direitos humanos, saúde coletiva entre
              outros. Cada um desses encontros, vivências e formações me fez ser o profissional que sou hoje, com um
              olhar mais sensível para cada história, com carinho e muito respeito.
            </p>
            
            <Divider />
            
            <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed px-1 md:px-2">
              Dar o primeiro passo nem sempre é fácil, mas pode ser o início de uma grande transformação. Se você
              está considerando buscar um espaço para você, te convido a entrar em contato. Ficarei feliz em te
              receber para conversarmos.
            </p>
          </div>          {/* Imagem - Visível apenas em Desktop (aparece à direita) */}
          <div className="hidden lg:flex lg:w-1/3 justify-end lg:pl-10">
            <div className="relative w-[450px] h-[450px]">
              <Image
                src="/foto-psicologo-daniel-dantas.png"
                alt="Daniel Dantas - Psicólogo"
                fill
                className="rounded-lg object-cover shadow-xl"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
