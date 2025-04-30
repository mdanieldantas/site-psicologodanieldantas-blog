import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ButtonBlog from '@/app/blogflorescerhumano/components/ButtonBlog'; // Reutilizando o botão

// Dados estáticos para os posts fake
const fakePosts = [
  {
    slug: "fake-post-1",
    title: "A importância da empatia na terapia humanista",
    excerpt: "Explorando como a empatia genuína forma a base da relação terapêutica na abordagem centrada na pessoa...",
    // Use os nomes de arquivo que você tem na pasta /public
    imageUrl: "/importância-da-empatia-image-site.png",
  },
  {
    slug: "fake-post-2",
    title: "Focalização: conectando-se com a sabedoria do corpo", // Título da imagem
    excerpt: "Como a técnica de Focalização desenvolvida por Eugene Gendlin pode nos ajudar a acessar conhecimentos implícitos...",
    // Use os nomes de arquivo que você tem na pasta /public
    imageUrl: "/focalizacao-imagem.png", // Ajuste se tiver uma imagem melhor
  },
  {
    slug: "fake-post-3",
    title: "Mindfulness e autorregulação emocional",
    excerpt: "Práticas de atenção plena que podem ajudar no processo de regulação das emoções e redução do estresse...",
    // Use os nomes de arquivo que você tem na pasta /public
    imageUrl: "/mindfulness-imagem.png",
  },
];

// Componente FakeBlogPreviewSection
const FakeBlogPreviewSection: React.FC = () => {
  return (
    <section id="blog" className="py-16 bg-[#F5F2EE]">
      <div className="container mx-auto px-[10%]">
        <h2 className="text-3xl font-light mb-4 text-center">Blog Florescer Humano</h2>
        <p className="text-lg text-[#735B43] mb-12 text-center max-w-2xl mx-auto font-light">
          Artigos, reflexões e ferramentas práticas para apoiar seu bem-estar emocional, onde quer que você esteja.
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mx-auto relative"
        >
          <CarouselContent className="-ml-4">
            {fakePosts.map((post, index) => (
              <CarouselItem key={post.slug || index} className="pl-4 basis-full lg:basis-4/5 xl:basis-3/4">
                <div className="p-1 h-full">
                  <div className="bg-[#F8F5F0] rounded-lg shadow-md overflow-hidden h-full flex flex-col sm:flex-row border-l-4 border-[#C19A6B] min-h-[400px]">
                    {/* Link único envolvendo todo o card para /em-construcao */}
                    <Link href="/em-construcao" passHref className="cursor-pointer h-full flex flex-col sm:flex-row w-full">
                      <div className="relative w-full sm:min-w-[340px] sm:w-2/5 h-[220px] sm:h-[280px] md:h-[360px] mt-4 sm:mt-8 mb-4 sm:mb-8 mx-auto sm:ml-4">
                        <Image
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6 sm:p-10 flex flex-col flex-grow w-full sm:w-3/5 justify-center">
                        <h3 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4 text-[#583B1F]">{post.title}</h3>
                        <p className="text-[#735B43] font-light mb-4 sm:mb-6 line-clamp-4 sm:line-clamp-3 flex-grow text-base sm:text-lg">{post.excerpt}</p>
                        <span className="inline-flex items-center text-base sm:text-lg text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300 self-start mt-auto">
                          Ler mais <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-[-15px] sm:left-[-20px] md:left-[-30px] lg:left-[-40px] top-1/2 -translate-y-1/2 fill-[#583B1F] text-[#F8F5F0] bg-[#583B1F]/80 hover:bg-[#735B43] p-1 sm:p-2 rounded-full z-10 transition-all duration-200" />
          <CarouselNext className="absolute right-[-15px] sm:right-[-20px] md:right-[-30px] lg:right-[-40px] top-1/2 -translate-y-1/2 fill-[#583B1F] text-[#F8F5F0] bg-[#583B1F]/80 hover:bg-[#735B43] p-1 sm:p-2 rounded-full z-10 transition-all duration-200" />
        </Carousel>

        <div className="mt-12 flex justify-center">
          <Link href="/em-construcao" passHref>
            <ButtonBlog className="text-sm px-6 py-2 inline-flex items-center">
              Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonBlog>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FakeBlogPreviewSection;
