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
import ArticleCardBlog from '@/app/blogflorescerhumano/components/ArticleCardBlog';

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
  categorySlug?: string; // Adicionado slug da categoria
  tags?: Array<{ id: number; nome: string; slug: string; }>; // Adicionado tags
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
          <button className="px-4 py-2 bg-[#A57C3A] text-white rounded-full hover:bg-[#583B1F] transition-colors duration-300">
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
                <div className="p-1 h-full">
                  <ArticleCardBlog
                    titulo={post.title}
                    resumo={post.excerpt}
                    slug={post.slug}
                    categoriaSlug={post.categorySlug || 'sem-categoria'}
                    imagemUrl={post.imageUrl}
                    tags={post.tags ?? []}
                    autor={{
                      nome: "Psicólogo Daniel Dantas",
                      fotoUrl: "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                    }}
                    tempoLeitura={Math.ceil((post.excerpt?.length || 0) / 200) + 3}
                    numeroComentarios={0}
                    tipoConteudo="artigo"
                    dataPublicacao={post.date}
                  />
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
            className="w-8 h-2 rounded-full bg-[#A57C3A] shadow-sm transition-all duration-300"
            aria-label="Ir para slide 1"
            role="button"
          ></button>
          <button 
            className="w-2 h-2 rounded-full bg-[#A57C3A]/40 hover:bg-[#A57C3A]/70 hover:w-6 transition-all duration-300"
            aria-label="Ir para slide 2"
            role="button"
          ></button>
          <button 
            className="w-2 h-2 rounded-full bg-[#A57C3A]/40 hover:bg-[#A57C3A]/70 hover:w-6 transition-all duration-300"
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
