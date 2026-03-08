import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { data: hero, isLoading } = useHeroContent();

  if (isLoading) {
    return (
      <section className="relative rounded-[2.5rem] overflow-hidden bg-muted my-12 animate-fade-in">
        <Skeleton className="h-[500px] md:h-[600px] w-full rounded-[2.5rem]" />
      </section>
    );
  }

  const title = hero?.title || "Journey Through Life's Spectrum";
  const subtitle = hero?.subtitle || "Welcome to Cyberom: A Realm of Reflection, Inspiration, and Discovery.";
  const backgroundImage = hero?.background_image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80";
  const buttonText = hero?.button_text || "Explore";
  const buttonLink = hero?.button_link || "#articles";

  return (
    <section className="relative rounded-[2.5rem] overflow-hidden my-12 animate-fade-in group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Hero"
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-8 right-8 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
      <div className="absolute top-12 right-12 w-24 h-24 border border-white/5 rounded-full" />
      <div className="absolute bottom-16 right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-14 lg:px-20 py-16 md:py-24 lg:py-32 min-h-[500px] md:min-h-[550px] flex flex-col justify-end">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 animate-slide-down">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-white/90 uppercase tracking-widest">Featured</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white animate-slide-down" style={{ animationDelay: '0.1s' }}>
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start gap-4 pt-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-white/10 group/btn"
              asChild
            >
              <a href={buttonLink} className="inline-flex items-center gap-2">
                {buttonText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-full px-8 py-6 text-base font-medium backdrop-blur-sm transition-all"
              asChild
            >
              <a href="/articles">Read Articles</a>
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { label: "Articles", value: "50+" },
              { label: "Authors", value: "10+" },
              { label: "Categories", value: "6+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/50 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
