import { useSiteSection } from "@/hooks/useSiteSections";
import { Skeleton } from "@/components/ui/skeleton";

const IntroSection = () => {
  const { data: section, isLoading } = useSiteSection('intro');

  if (isLoading) {
    return (
      <section className="max-w-3xl mx-auto py-16 md:py-20 px-4">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </section>
    );
  }

  const content = section?.content as { heading?: string; description?: string } | null;
  const heading = content?.heading || "Perspective is a space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.";
  const description = content?.description || "From mindful living and personal growth to travel experiences and creative pursuits, we share perspectives that enrich daily life.";

  return (
    <section className="py-16 md:py-20 border-t border-border/50 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-medium leading-relaxed text-foreground animate-slide-up">
          {heading}
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-slide-up stagger-1">
          {description}
        </p>
      </div>
    </section>
  );
};

export default IntroSection;
