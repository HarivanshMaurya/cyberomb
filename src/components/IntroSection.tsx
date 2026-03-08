 import { useSiteSection } from "@/hooks/useSiteSections";
 import { Skeleton } from "@/components/ui/skeleton";
 
const IntroSection = () => {
   const { data: section, isLoading } = useSiteSection('intro');
 
   if (isLoading) {
     return (
       <section className="max-w-4xl mx-auto py-12 md:py-16 px-4">
         <div className="text-center space-y-6">
           <Skeleton className="h-12 w-full" />
           <Skeleton className="h-20 w-full" />
         </div>
       </section>
     );
   }
 
   const content = section?.content as { heading?: string; description?: string } | null;
   const heading = content?.heading || "Perspective is a space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.";
   const description = content?.description || "From mindful living and personal growth to travel experiences and creative pursuits, we share perspectives that enrich daily life. Join us as we explore topics that inspire curiosity and meaningful conversation.";
 
  return (
    <section className="max-w-4xl mx-auto py-12 md:py-16 px-4 animate-fade-in">
      <div className="text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight animate-slide-up">
           {heading}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-slide-up stagger-1">
           {description}
        </p>
      </div>
    </section>
  );
};

export default IntroSection;
