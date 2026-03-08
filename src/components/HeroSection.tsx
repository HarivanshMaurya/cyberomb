import { useState, useEffect, useRef } from "react";
import { Instagram, Facebook, Linkedin, Twitter, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { data: hero, isLoading } = useHeroContent();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  if (isLoading) {
    return (
      <section className="relative overflow-hidden my-6 md:my-10">
        <div className="min-h-[85vh] p-6 md:p-12 lg:p-16">
          <div className="grid md:grid-cols-2 gap-8 h-full items-center">
            <div className="flex flex-col justify-center space-y-6">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>
            <Skeleton className="aspect-square rounded-[2rem]" />
          </div>
        </div>
      </section>
    );
  }

  const title = hero?.title || "Journey Through Life's Spectrum";
  const subtitle = hero?.subtitle || "Welcome to Perspective's Blog: A Realm of Reflection, Inspiration, and Discovery.";
  const backgroundImage = hero?.background_image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80";
  const buttonText = hero?.button_text || "Explore";
  const buttonLink = hero?.button_link || "#articles";
  const instagramUrl = hero?.instagram_url || "";
  const facebookUrl = hero?.facebook_url || "";
  const linkedinUrl = hero?.linkedin_url || "";
  const twitterUrl = hero?.twitter_url || "";
  const hasSocials = !!(instagramUrl || facebookUrl || linkedinUrl || twitterUrl);

  const socialLinks = [
    { url: instagramUrl, icon: Instagram, label: "Instagram" },
    { url: facebookUrl, icon: Facebook, label: "Facebook" },
    { url: linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { url: twitterUrl, icon: Twitter, label: "Twitter / X" },
  ].filter(s => !!s.url);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden my-6 md:my-10"
      onMouseMove={handleMouseMove}
    >
      {/* ─── Background Layer ─── */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.08] via-background to-secondary/[0.12]" />
        
        {/* Animated blobs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 bg-accent/30"
          style={{
            top: '10%',
            right: '5%',
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            transition: 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 bg-secondary/40"
          style={{
            bottom: '5%',
            left: '10%',
            transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
            transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-10 bg-primary/20"
          style={{
            top: '50%',
            left: '40%',
            transform: `translate(${mousePos.x * 8}px, ${mousePos.y * -8}px)`,
            transition: 'transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* ─── Main Content ─── */}
      <div className="min-h-[85vh] md:min-h-[90vh] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* ─── Left: Text Content ─── */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-8 md:space-y-10">

              {/* Animated badge */}
              <div
                className={`transition-all duration-700 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <span className="inline-flex items-center gap-2.5 bg-accent/10 border border-accent/20 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Story
                </span>
              </div>

              {/* Title - each line animates separately */}
              <div
                className={`transition-all duration-1000 delay-200 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-7xl font-bold font-serif leading-[1.05] tracking-tight text-foreground">
                  {title.split(' ').map((word, i) => (
                    <span
                      key={i}
                      className="inline-block mr-[0.3em] transition-all duration-500 hover:text-accent cursor-default"
                      style={{
                        transitionDelay: `${200 + i * 80}ms`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </h1>
              </div>

              {/* Subtitle with accent bar */}
              <div
                className={`flex gap-4 transition-all duration-1000 delay-500 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="w-1 rounded-full bg-gradient-to-b from-accent via-accent/50 to-transparent flex-shrink-0" />
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md">
                  {subtitle}
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-wrap items-center gap-4 transition-all duration-1000 delay-700 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <Button
                  className="group/btn relative bg-foreground hover:bg-foreground/90 text-background rounded-full px-8 py-6 md:px-10 md:py-7 text-sm md:text-base font-semibold transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_60px_-15px_hsl(var(--foreground)/0.3)] overflow-hidden"
                  asChild
                >
                  <a href={buttonLink}>
                    <span className="relative z-10 flex items-center gap-2.5">
                      {buttonText}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                    </span>
                  </a>
                </Button>

                <a
                  href="#articles"
                  className="group/link flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 px-4 py-3"
                >
                  <span className="underline underline-offset-4 decoration-border group-hover/link:decoration-foreground transition-colors">
                    Browse Articles
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                </a>
              </div>

              {/* Social links */}
              {hasSocials && (
                <div
                  className={`flex items-center gap-2 transition-all duration-1000 delay-[900ms] ease-out ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 font-semibold mr-1">
                    Follow
                  </span>
                  <div className="w-6 h-px bg-border/60 mr-1" />
                  {socialLinks.map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/social w-9 h-9 rounded-full border border-border/40 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 flex items-center justify-center hover:scale-110"
                      aria-label={label}
                    >
                      <Icon className="w-3.5 h-3.5 text-muted-foreground/50 group-hover/social:text-accent transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Right: Image Composition ─── */}
            <div className="lg:col-span-6 xl:col-span-5 hidden lg:flex items-center justify-center">
              <div
                className={`relative w-full max-w-md transition-all duration-1000 delay-400 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
                }`}
              >
                {/* Decorative ring */}
                <div
                  className="absolute -inset-6 rounded-[2.5rem] border border-border/15"
                  style={{
                    transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 4}px)`,
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                />
                <div
                  className="absolute -inset-12 rounded-[3rem] border border-border/8"
                  style={{
                    transform: `translate(${mousePos.x * 7}px, ${mousePos.y * 7}px)`,
                    transition: 'transform 0.9s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                />

                {/* Main image container */}
                <div
                  className="relative rounded-[2rem] overflow-hidden shadow-2xl"
                  style={{
                    transform: `perspective(800px) rotateY(${mousePos.x * -2}deg) rotateX(${mousePos.y * 2}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                >
                  <img
                    src={backgroundImage}
                    alt="Hero"
                    className="w-full aspect-[4/5] object-cover"
                  />
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-foreground/5" />

                  {/* Floating glass card at bottom */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="bg-background/70 dark:bg-background/60 backdrop-blur-xl rounded-2xl border border-border/30 p-4 flex items-center gap-4">
                      <div className="flex -space-x-2.5">
                        {['🌍', '✨', '📖'].map((emoji, i) => (
                          <div
                            key={i}
                            className="w-9 h-9 rounded-full bg-accent/15 border-2 border-background flex items-center justify-center text-sm"
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground">5K+ Readers</p>
                        <p className="text-[11px] text-muted-foreground">Join our community</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating accent dot */}
                <div
                  className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-accent shadow-lg shadow-accent/30"
                  style={{
                    transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                />
              </div>
            </div>

            {/* ─── Mobile Image ─── */}
            <div className="lg:hidden">
              <div
                className={`relative rounded-2xl overflow-hidden transition-all duration-1000 delay-300 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <img
                  src={backgroundImage}
                  alt="Hero"
                  className="w-full aspect-[16/9] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom edge fade ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
