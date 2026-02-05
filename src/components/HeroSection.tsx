import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
 import { useHeroContent } from "@/hooks/useHeroContent";
 import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
   const { data: hero, isLoading } = useHeroContent();
 
   if (isLoading) {
     return (
       <section className="relative rounded-[2.5rem] overflow-hidden bg-muted my-12 animate-fade-in">
         <div className="grid md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-12 lg:p-16">
           <Skeleton className="aspect-[4/3] md:aspect-auto rounded-[2rem]" />
           <div className="flex flex-col justify-center space-y-6 md:space-y-8">
             <div className="space-y-4">
               <Skeleton className="h-16 w-full" />
               <Skeleton className="h-24 w-full" />
             </div>
             <Skeleton className="h-12 w-40" />
           </div>
         </div>
       </section>
     );
   }
 
   const title = hero?.title || "Journey Through Life's Spectrum";
   const subtitle = hero?.subtitle || "Welcome to Perspective's Blog: A Realm of Reflection, Inspiration, and Discovery.";
   const backgroundImage = hero?.background_image || "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80";
   const buttonText = hero?.button_text || "Join Now";
   const buttonLink = hero?.button_link || "#";
 
  return (
    <section className="relative rounded-[2.5rem] overflow-hidden bg-muted my-12 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-12 lg:p-16">
        {/* Left side - Image */}
        <div className="relative aspect-[4/3] md:aspect-auto rounded-[2rem] overflow-hidden animate-scale-in">
          <img
             src={backgroundImage}
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>

        {/* Right side - Content */}
        <div className="flex flex-col justify-center space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight animate-slide-down">
               {title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl animate-slide-up stagger-1">
               {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-4 animate-slide-up stagger-2">
             <Button
               className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-4 md:px-10 md:py-6 text-base font-medium transition-all hover:scale-105 w-full sm:w-auto"
               asChild
             >
               <a href="/admin/login">Admin Login</a>
             </Button>

            <div className="flex items-center gap-4">
              <a
                href="#instagram"
                className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#facebook"
                className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#linkedin"
                className="w-12 h-12 rounded-full border-2 border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
