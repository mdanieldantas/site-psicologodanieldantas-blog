import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Importar componentes do carrossel
import ButtonBlog from '@/app/blogflorescerhumano/components/ButtonBlog';

// Define a estrutura esperada para cada post do blog
// Adicionada a propriedade 'date' e 'id' (opcional, mas presente nos dados de exemplo)
interface BlogPost {
  id?: number; // Adicionado id opcional
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date?: string; // Adicionada data opcional
  category?: string; // Adicionada categoria opcional
}

// Define as propriedades esperadas pelo componente BlogPreviewSection
interface BlogPreviewSectionProps {
  posts: BlogPost[]; // Array de posts a serem exibidos
}

// Componente BlogPreviewSection: Exibe uma prévia dos posts recentes do blog em um carrossel
const BlogPreviewSection: React.FC<BlogPreviewSectionProps> = ({ posts }) => {
  // Se não houver posts, não renderiza a seção
  if (!posts || posts.length === 0) {
    console.warn("BlogPreviewSection: Nenhum post fornecido.");
    return null;
  }
  return (
    <section id="blog" className="py-16 bg-[#F5F2EE]">
      <div className="container mx-auto px-[10%]">
        <h2 className="text-3xl font-light mb-4 text-center">Blog Florescer Humano</h2>
        <p className="text-lg text-[#735B43] mb-12 text-center max-w-2xl mx-auto font-light"> {/* Aumentado mb */}
          Artigos, reflexões e ferramentas práticas para apoiar seu bem-estar emocional, onde quer que você esteja.
        </p>

        {/* Filtros rápidos */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button className="px-4 py-2 bg-[#C19A6B] text-white rounded-full hover:bg-[#583B1F] transition-colors duration-300">
            Todos
          </button>
          <button className="px-4 py-2 bg-white text-[#583B1F] rounded-full hover:bg-[#F8F5F0] transition-colors duration-300">
            Autoconhecimento
          </button>
          <button className="px-4 py-2 bg-white text-[#583B1F] rounded-full hover:bg-[#F8F5F0] transition-colors duration-300">
            Relacionamentos
          </button>
          <button className="px-4 py-2 bg-white text-[#583B1F] rounded-full hover:bg-[#F8F5F0] transition-colors duration-300">
            Bem-estar
          </button>
        </div>

        {/* Carrossel para os cards dos posts */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mx-auto relative"
        >          <CarouselContent className="-ml-4">
            {posts.map((post, index) => (
              <CarouselItem key={post.id || post.slug || index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">{/* Card com sombra e efeitos de hover aprimorados */}
                  <div className="article-card-animate bg-[#F8F5F0] rounded-lg shadow-md hover:shadow-lg overflow-hidden h-full flex flex-col border-l-4 border-[#C19A6B] transform transition-all duration-300 hover:-translate-y-1">
                    <Link href="/em-construcao" passHref aria-label={`Ler artigo: ${post.title}`}> {/* Alterado href para /em-construcao */}
                      <div className="cursor-pointer h-full flex flex-col group">
                        <div className="relative h-52"> {/* Altura padronizada da imagem */}
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading={index === 0 ? "eager" : "lazy"}
                            priority={index === 0}
                          />
                          {/* Overlay de hover na imagem */}
                          <div className="absolute inset-0 bg-[#583B1F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          {/* Tag e tempo de leitura */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-block px-3 py-1 bg-[#F5F2EE] text-[#735B43] text-xs rounded-full">
                              {post.category || "Psicologia"}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 bg-[#F5F2EE] text-[#735B43] text-xs rounded-full">
                              <Clock className="h-3 w-3 mr-1" />
                              {Math.ceil((post.excerpt?.length || 0) / 200) + 2} min
                            </span>
                          </div>
                          {post.date && (
                            <p className="text-sm text-[#C19A6B] mb-2">{post.date}</p>
                          )}
                          <h3 className="text-xl font-light mb-3 text-[#583B1F] group-hover:text-[#C19A6B] transition-colors duration-300">{post.title}</h3>
                          <p className="text-[#735B43] font-light mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                          <span className="inline-flex items-center text-sm font-medium text-[#583B1F] group-hover:text-[#C19A6B] transition-colors duration-300 self-start mt-auto">
                            Ler mais <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Botões de navegação com posicionamento responsivo fora dos cards */}
          <CarouselPrevious className="absolute left-[-15px] sm:left-[-20px] md:left-[-30px] lg:left-[-40px] top-1/2 -translate-y-1/2 fill-[#583B1F] text-[#F8F5F0] bg-[#583B1F]/80 hover:bg-[#735B43] p-1 sm:p-2 rounded-full z-10 transition-all duration-200 shadow-md" />
          <CarouselNext className="absolute right-[-15px] sm:right-[-20px] md:right-[-30px] lg:right-[-40px] top-1/2 -translate-y-1/2 fill-[#583B1F] text-[#F8F5F0] bg-[#583B1F]/80 hover:bg-[#735B43] p-1 sm:p-2 rounded-full z-10 transition-all duration-200 shadow-md" />
        </Carousel>        {/* Indicadores de navegação do carrossel aprimorados */}
        <div className="flex justify-center mt-6 space-x-2">
          <button 
            className="w-8 h-2 rounded-full bg-[#C19A6B] shadow-sm transition-all duration-300"
            aria-label="Ir para slide 1"
            role="button"
          ></button>
          <button 
            className="w-2 h-2 rounded-full bg-[#C19A6B]/40 hover:bg-[#C19A6B]/70 hover:w-6 transition-all duration-300"
            aria-label="Ir para slide 2"
            role="button"
          ></button>
          <button 
            className="w-2 h-2 rounded-full bg-[#C19A6B]/40 hover:bg-[#C19A6B]/70 hover:w-6 transition-all duration-300"
            aria-label="Ir para slide 3"
            role="button"
          ></button>
        </div>

        {/* Botão para ver todos os posts */}
        <div className="mt-12 flex justify-center">
          <Link href="/em-construcao" passHref>
            <ButtonBlog className="text-sm px-8 py-3 inline-flex items-center shadow-md hover:shadow-lg transform transition-transform hover:-translate-y-1 group">
              Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </ButtonBlog>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
