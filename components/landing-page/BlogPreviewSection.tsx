import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Importar componentes do carrossel

// Define a estrutura esperada para cada post do blog
// Adicionada a propriedade 'date' e 'id' (opcional, mas presente nos dados de exemplo)
interface BlogPost {
  id?: number; // Adicionado id opcional
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date?: string; // Adicionada data opcional
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

        {/* Carrossel para os cards dos posts */}
        <Carousel
          opts={{
            align: "start",
            loop: true, // Opcional: fazer o carrossel ser infinito
          }}
          // Removido max-w-* específicos, deixando o container controlar a largura
          className="w-full mx-auto relative" // Adicionado relative para posicionar botões
        >
          <CarouselContent className="-ml-4"> {/* Ajuste de margem negativa comum em shadcn/ui Carousel */}
            {posts.map((post, index) => (
              // Ajustado basis para mostrar 1 item em mobile/tablet, 3 em large
              <CarouselItem key={post.id || post.slug || index} className="pl-4 basis-full lg:basis-1/3">
                <div className="p-1 h-full"> {/* Wrapper para espaçamento se necessário */}
                  {/* Card com borda esquerda */}
                  <div className="bg-[#F8F5F0] rounded-lg shadow-md overflow-hidden h-full flex flex-col border-l-4 border-[#C19A6B]">
                    <Link href={`/blogflorescerhumano/artigos/${post.slug}`} passHref> {/* Link para o post real */}
                      <div className="cursor-pointer h-full flex flex-col">
                        <div className="relative h-48"> {/* Altura da imagem */}
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 33vw" // Ajustado sizes para refletir a mudança
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow"> {/* Padding */}
                          {post.date && (
                            <p className="text-sm text-[#C19A6B] mb-2">{post.date}</p> /* Data */
                          )}
                          <h3 className="text-xl font-light mb-3 text-[#583B1F]">{post.title}</h3> {/* Título */}
                          <p className="text-[#735B43] font-light mb-4 line-clamp-3 flex-grow">{post.excerpt}</p> {/* Excerpt com line-clamp e flex-grow */}
                          <span className="inline-flex items-center text-sm text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300 self-start mt-auto"> {/* Link "Ler mais" */}
                            Ler mais <ArrowRight className="ml-2 h-4 w-4" />
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
          <CarouselPrevious className="absolute left-[-15px] sm:left-[-20px] md:left-[-30px] lg:left-[-40px] top-1/2 -translate-y-1/2 fill-[#583B1F] text-[#F8F5F0] bg-[#583B1F]/80 hover:bg-[#735B43] p-1 sm:p-2 rounded-full z-10 transition-all duration-200" />
          <CarouselNext className="absolute right-[-15px] sm:right-[-20px] md:right-[-30px] lg:right-[-40px] top-1/2 -translate-y-1/2 fill-[#583B1F] text-[#F8F5F0] bg-[#583B1F]/80 hover:bg-[#735B43] p-1 sm:p-2 rounded-full z-10 transition-all duration-200" />
        </Carousel>

        {/* Botão para ver todos os posts */}
        <div className="mt-12 flex justify-center"> {/* Aumentado mt */}
          <Link href="/blogflorescerhumano" passHref> {/* Link para a página do blog */}
            <span className="px-6 py-2 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 inline-flex items-center rounded-md cursor-pointer">
              Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
