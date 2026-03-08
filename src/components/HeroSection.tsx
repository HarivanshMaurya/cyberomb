import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { data: hero, isLoading } = useHeroContent();

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 animate-fade-in">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-40" />
          </div>
          <Skeleton className="aspect-[4/3] rounded-2xl" />
        </div>
      </section>
    );
  }

  const title = hero?.title || "Journey Through Life's Spectrum";
  const subtitle = hero?.subtitle || "A space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.";
  const backgroundImage = hero?.background_image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80";
  const buttonText = hero?.button_text || "Start Reading";
  const buttonLink = hero?.button_link || "#articles";

  return (
    <section className="py-16 md:py-24 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content */}
        <div className="space-y-6 md:space-y-8 order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight animate-slide-up">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg animate-slide-up stagger-1">
            {subtitle}
          </p>
          <div className="animate-slide-up stagger-2">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-sm font-medium gap-2 group"
              asChild
            >
              <a href={buttonLink}>
                {buttonText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="order-1 md:order-2 animate-scale-in">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
            <img
              src={backgroundImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
