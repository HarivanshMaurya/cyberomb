import { useState, useEffect, useRef, useCallback } from "react";
import { Instagram, Facebook, Linkedin, Twitter, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Skeleton } from "@/components/ui/skeleton";

const useAnimatedCounter = (target: number, duration = 2000, startDelay = 1000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return count;
};

const AnimatedWord = ({ word, index, isVisible }: { word: string; index: number; isVisible: boolean }) => (
  <span
    className="inline-block mr-[0.3em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent hover:-translate-y-1 cursor-default"
    style={{
      transitionDelay: `${300 + index * 100}ms`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0) rotateX(0)' : 'translateY(40px) rotateX(20deg)',
      filter: isVisible ? 'blur(0px)' : 'blur(8px)',
    }}
  >
    {word}
  </span>
);

const FloatingOrb = ({ className, mousePos, factor, delay }: { 
  className: string; mousePos: { x: number; y: number }; factor: number; delay: string 
}) => (
  <div
    className={`absolute rounded-full blur-[100px] transition-transform ${className}`}
    style={{
      transform: `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`,
      transitionDuration: delay,
      transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    }}
  />
);

const SocialLink = ({ url, icon: Icon, label }: { url: string; icon: typeof Instagram; label: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group/social relative w-10 h-10 rounded-xl border border-border/30 hover:border-accent/40 bg-card/30 backdrop-blur-sm transition-all duration-500 flex items-center justify-center hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10"
    aria-label={label}
  >
    <Icon className="w-4 h-4 text-muted-foreground/50 group-hover/social:text-accent transition-colors duration-300" />
  </a>
);

const HeroSection = () => {
  const { data: hero, isLoading } = useHeroContent();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const readerCount = useAnimatedCounter(5000, 2500, 1300);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
    });
  };

  if (isLoading) {
    return (
      <section className="relative overflow-hidden my-6 md:my-10">
        <div className="min-h-[90vh] p-6 md:p-12 lg:p-16 flex items-center">
          <div className="w-full grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-14 w-48 rounded-full" />
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
      className="relative overflow-hidden my-4 md:my-8"
      onMouseMove={handleMouseMove}
    >
      {/* ─── Ambient Background ─── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <FloatingOrb
          className="w-[500px] h-[500px] opacity-[0.07] bg-accent top-[-10%] right-[-5%]"
          mousePos={mousePos}
          factor={-12}
          delay="1.2s"
        />
        <FloatingOrb
          className="w-[400px] h-[400px] opacity-[0.05] bg-secondary bottom-[0%] left-[5%]"
          mousePos={mousePos}
          factor={8}
          delay="1.5s"
        />
        <FloatingOrb
          className="w-[250px] h-[250px] opacity-[0.04] bg-primary top-[40%] left-[35%]"
          mousePos={mousePos}
          factor={-6}
          delay="1.8s"
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ─── Content ─── */}
      <div className="min-h-[90vh] md:min-h-[92vh] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* ─── Left Column ─── */}
            <div className="lg:col-span-7 space-y-8 md:space-y-12">

              {/* Badge */}
              <div
                className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'
                }`}
              >
                <span className="inline-flex items-center gap-2.5 bg-accent/8 border border-accent/15 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Featured Story
                </span>
              </div>

              {/* Title */}
              <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold font-serif leading-[1.02] tracking-[-0.02em] text-foreground"
                style={{ perspective: '600px' }}
              >
                {title.split(' ').map((word, i) => (
                  <AnimatedWord key={i} word={word} index={i} isVisible={isVisible} />
                ))}
              </h1>

              {/* Subtitle */}
              <div
                className={`transition-all duration-1000 delay-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'
                }`}
              >
                <div className="flex gap-5 items-start">
                  <div className="w-[3px] rounded-full bg-gradient-to-b from-accent via-accent/40 to-transparent flex-shrink-0 min-h-[60px] self-stretch" />
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80 leading-[1.7] max-w-lg font-light">
                    {subtitle}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div
                className={`flex flex-wrap items-center gap-5 transition-all duration-1000 delay-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'
                }`}
              >
                <Button
                  className="group/btn relative bg-foreground hover:bg-foreground/90 text-background rounded-full px-9 py-7 text-[15px] font-semibold transition-all duration-500 hover:scale-[1.04] hover:shadow-[0_25px_60px_-15px_hsl(var(--foreground)/0.35)] active:scale-[0.98] overflow-hidden"
                  asChild
                >
                  <a href={buttonLink}>
                    <span className="relative z-10 flex items-center gap-3">
                      {buttonText}
                      <ArrowRight className="w-4 h-4 transition-all duration-500 group-hover/btn:translate-x-2" />
                    </span>
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    </div>
                  </a>
                </Button>

                <a
                  href="#articles"
                  className="group/link flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-500 px-4 py-3 rounded-full hover:bg-card/50"
                >
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-foreground after:transition-all after:duration-500 group-hover/link:after:w-full">
                    Browse Articles
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-500" />
                </a>
              </div>

              {/* Social links */}
              {hasSocials && (
                <div
                  className={`flex items-center gap-3 transition-all duration-1000 delay-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-semibold">
                    Follow
                  </span>
                  <div className="w-8 h-px bg-gradient-to-r from-border/60 to-transparent" />
                  {socialLinks.map(link => (
                    <SocialLink key={link.label} {...link} />
                  ))}
                </div>
              )}
            </div>

            {/* ─── Right Column: Image ─── */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
              <div
                className={`relative w-full transition-all duration-[1.2s] delay-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-90'
                }`}
              >
                {/* Parallax decorative rings */}
                <div
                  className="absolute -inset-5 rounded-[2.5rem] border border-border/10 transition-transform"
                  style={{
                    transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px) rotate(2deg)`,
                    transitionDuration: '0.8s',
                  }}
                />
                <div
                  className="absolute -inset-10 rounded-[3rem] border border-border/5 transition-transform"
                  style={{
                    transform: `translate(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px) rotate(-1deg)`,
                    transitionDuration: '1.1s',
                  }}
                />

                {/* Image card */}
                <div
                  className="relative rounded-[2rem] overflow-hidden"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePos.x * -0.12}deg) rotateX(${mousePos.y * 0.12}deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    boxShadow: `
                      0 30px 60px -15px hsl(var(--foreground) / 0.12),
                      0 0 0 1px hsl(var(--border) / 0.1),
                      ${mousePos.x * 0.3}px ${mousePos.y * 0.3}px 40px -10px hsl(var(--accent) / 0.06)
                    `,
                  }}
                >
                  {/* Image loading skeleton */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse rounded-[2rem]" />
                  )}
                  
                  <img
                    src={backgroundImage}
                    alt="Hero"
                    className={`w-full aspect-[4/5] object-cover transition-all duration-[1.5s] ease-out ${
                      imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-foreground/5 pointer-events-none" />

                  {/* Glass stats card */}
                  <div
                    className={`absolute bottom-5 left-5 right-5 transition-all duration-1000 delay-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isVisible && imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                  >
                    <div className="bg-background/60 dark:bg-background/50 backdrop-blur-2xl rounded-2xl border border-border/20 p-4 flex items-center gap-4 shadow-xl">
                      <div className="flex -space-x-2.5">
                        {['🌍', '✨', '📖'].map((emoji, i) => (
                          <div
                            key={i}
                            className="w-9 h-9 rounded-full bg-accent/10 border-2 border-background flex items-center justify-center text-sm shadow-sm"
                            style={{
                              transitionDelay: `${1400 + i * 100}ms`,
                              opacity: isVisible ? 1 : 0,
                              transform: isVisible ? 'scale(1)' : 'scale(0)',
                              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground tabular-nums">{readerCount.toLocaleString()}+ Readers</p>
                        <p className="text-[11px] text-muted-foreground">Join our community</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating accent orb */}
                <div
                  className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-accent shadow-lg shadow-accent/40 transition-transform"
                  style={{
                    transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px)`,
                    transitionDuration: '0.6s',
                  }}
                />
                <div
                  className="absolute bottom-10 -left-4 w-3 h-3 rounded-full bg-secondary/60 shadow-md transition-transform"
                  style={{
                    transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
                    transitionDuration: '0.9s',
                  }}
                />
              </div>
            </div>

            {/* ─── Mobile Image ─── */}
            <div className="lg:hidden">
              <div
                className={`relative rounded-2xl overflow-hidden transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-10 blur-sm'
                }`}
              >
                <img
                  src={backgroundImage}
                  alt="Hero"
                  className="w-full aspect-[16/9] object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent rounded-2xl" />
                
                {/* Mobile glass card */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-background/60 backdrop-blur-xl rounded-xl border border-border/20 p-3 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {['🌍', '✨', '📖'].map((emoji, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-accent/10 border-2 border-background flex items-center justify-center text-xs">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground tabular-nums">{readerCount.toLocaleString()}+ Readers</p>
                      <p className="text-[10px] text-muted-foreground">Join our community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
