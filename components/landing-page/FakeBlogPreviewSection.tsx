import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Share2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import ButtonBlog from '@/app/blogflorescerhumano/components/ButtonBlog'; // Reutilizando o botão
import { useState } from "react";

// Dados estáticos para os posts fake com categorias adicionadas
const fakePosts = [
  {
    slug: "fake-post-1",
    title: "A importância da empatia na terapia humanista",
    excerpt: "Explorando como a empatia genuína forma a base da relação terapêutica na abordagem centrada na pessoa...",
    imageUrl: "/importância-da-empatia-image-site.png",
    category: "Terapia Humanista"
  },
  {
    slug: "fake-post-2",
    title: "Focalização: conectando-se com a sabedoria do corpo",
    excerpt: "Como a técnica de Focalização desenvolvida por Eugene Gendlin pode nos ajudar a acessar conhecimentos implícitos...",
    imageUrl: "/focalizacao-imagem.png",
    category: "Técnicas Terapêuticas"
  },
  {
    slug: "fake-post-3",
    title: "Mindfulness e autorregulação emocional",
    excerpt: "Práticas de atenção plena que podem ajudar no processo de regulação das emoções e redução do estresse...",
    imageUrl: "/mindfulness-imagem.png",
    category: "Mindfulness"
  },
];

// Componente FakeBlogPreviewSection
const FakeBlogPreviewSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (    <section id="blog" className="py-16 bg-[#F5F2EE] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-[5%] md:px-[8%] lg:px-[10%]">
        <h2 className="text-3xl font-light mb-4 text-center">Blog Florescer Humano</h2>
        <p className="text-lg text-[#735B43] mb-12 text-center max-w-2xl mx-auto font-light">
          Artigos, reflexões e ferramentas práticas para apoiar seu bem-estar emocional, onde quer que você esteja.
        </p>        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mx-auto relative overflow-hidden"
          setApi={(api) => {
            api?.on("select", () => {
              setCurrentIndex(api?.selectedScrollSnap() || 0);
            });
          }}
        >
          <CarouselContent className="-ml-4">
            {fakePosts.map((post, index) => (
              <CarouselItem key={post.slug || index} className="pl-4 basis-full lg:basis-4/5 xl:basis-3/4">
                <div className="p-1 h-full">
                  <div className="bg-[#F8F5F0] rounded-lg shadow-md overflow-hidden h-full flex flex-col sm:flex-row border-l-4 border-[#C19A6B] min-h-[400px] hover:shadow-lg transition-all duration-300">
                    {/* Link principal para /em-construcao */}
                    <div className="cursor-pointer h-full flex flex-col sm:flex-row w-full">
                      <div className="relative w-full sm:min-w-[340px] sm:w-2/5 h-[240px] sm:h-[280px] md:h-[360px] mx-auto">
                        <Link href="/em-construcao" passHref className="block w-full h-full">
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover rounded-t-lg sm:rounded-tr-none sm:rounded-l-lg"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-[#583B1F]/90 text-white hover:bg-[#735B43] px-3 py-1 text-xs">
                              {post.category}
                            </Badge>
                          </div>
                        </Link>
                      </div>
                      <div className="p-6 sm:p-8 flex flex-col flex-grow w-full sm:w-3/5 justify-center">
                        <Link href="/em-construcao" passHref>
                          <h3 className="text-2xl sm:text-3xl font-light mb-3 sm:mb-4 text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300">{post.title}</h3>
                        </Link>
                        <p className="text-[#735B43] font-light mb-6 sm:mb-8 line-clamp-4 sm:line-clamp-3 flex-grow text-base sm:text-lg">{post.excerpt}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <Link href="/em-construcao" passHref>
                            <ButtonBlog 
                              className="text-sm px-4 py-1.5 inline-flex items-center bg-[#583B1F] text-white hover:bg-[#735B43] rounded-full"
                            >
                              Ler mais <ArrowRight className="ml-2 h-4 w-4" />
                            </ButtonBlog>
                          </Link>
                          <button 
                            aria-label="Compartilhar artigo"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Funcionalidade de compartilhar em desenvolvimento");
                            }}
                            className="p-2 rounded-full hover:bg-[#C19A6B]/20 transition-colors"
                          >
                            <Share2 className="h-5 w-5 text-[#583B1F]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
            <CarouselPrevious className="absolute left-0 sm:left-2 md:left-2 top-1/2 -translate-y-1/2 text-white bg-[#583B1F]/90 hover:bg-[#735B43] p-2 sm:p-3 rounded-full z-10 transition-all duration-200 border-2 border-white shadow-md" />
          <CarouselNext className="absolute right-0 sm:right-2 md:right-2 top-1/2 -translate-y-1/2 text-white bg-[#583B1F]/90 hover:bg-[#735B43] p-2 sm:p-3 rounded-full z-10 transition-all duration-200 border-2 border-white shadow-md" />
        </Carousel>

        {/* Indicadores de posição do carrossel */}
        <div className="flex justify-center gap-2 mt-6">
          {fakePosts.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? "w-8 bg-[#C19A6B]" 
                  : "w-2 bg-[#C19A6B]/40"
              }`}
              aria-label={`Slide ${index + 1} de ${fakePosts.length}`}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/em-construcao" passHref>
            <ButtonBlog className="text-base px-8 py-3 inline-flex items-center shadow-md">
              Ver todos os artigos <ArrowRight className="ml-2 h-5 w-5" />
            </ButtonBlog>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FakeBlogPreviewSection;
