import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageSection } from "@/hooks/usePageSections";
import { useSectionCards } from "@/hooks/useSectionCards";
import { Link } from "react-router-dom";
import { Heart, Leaf, Sun, Sparkles, ArrowRight } from "lucide-react";

const resolveCardLink = (raw?: string) => {
  const link = (raw ?? "").trim();
  if (!link || link === "#") return null;
  if (/^https?:\/\//i.test(link)) return { kind: "external" as const, href: link };
  if (link.startsWith("/")) return { kind: "internal" as const, to: link };
  return { kind: "internal" as const, to: `/blog/${link}` };
};

const wellnessPillars = [
  { icon: Heart, title: "Mind", description: "Mental clarity, mindfulness, and emotional balance for inner peace." },
  { icon: Leaf, title: "Body", description: "Nutrition, movement, and rest to fuel your physical vitality." },
  { icon: Sun, title: "Soul", description: "Purpose, connection, and spiritual practices that nurture wholeness." },
  { icon: Sparkles, title: "Lifestyle", description: "Daily rituals, habits, and environments that support your wellbeing." },
];

const Wellness = () => {
  const { data: pageData, isLoading } = usePageSection("wellness");
  const { data: sectionCards } = useSectionCards("wellness_cards");

  const featuredCards = sectionCards?.content?.cards || [];
  const content = pageData?.content as
    | { section_title?: string; section_content?: string }
    | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-[400px] w-full rounded-3xl mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead
        title="Wellness & Self-Care"
        description="Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing."
        canonical="/wellness"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20 py-20 md:py-32">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-slide-down">
            <Heart className="h-4 w-4" />
            Nurture Your Wellbeing
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-down">
            {pageData?.title || "Wellness & Self-Care"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1">
            {pageData?.subtitle ||
              "Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing."}
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Wellness Pillars */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">The Four Pillars</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A holistic approach to living well, inside and out.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {wellnessPillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className={`group relative rounded-2xl bg-card border border-border p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up stagger-${index + 1}`}
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Cards from Admin */}
        {featuredCards.length > 0 && (
          <section className="pb-16 md:pb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Featured Stories</h2>
                <p className="text-muted-foreground mt-1">Curated reads for your wellness journey.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCards.map((card, index) => {
                const resolved = resolveCardLink(card.link);
                const body = (
                  <div className="group/card relative rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {card.image && (
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover/card:text-primary transition-colors line-clamp-2">
                        {card.title}
                      </h3>
                      {card.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {card.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover/card:gap-2 transition-all">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                );

                const cls = `block animate-slide-up stagger-${Math.min(index + 1, 6)}`;

                if (resolved?.kind === "external") {
                  return (
                    <a key={card.id || index} href={resolved.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {body}
                    </a>
                  );
                }

                return (
                  <Link key={card.id || index} to={resolved?.to || "#"} className={cls}>
                    {body}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Why Wellness Matters - Content Section */}
        <section className="pb-16 md:pb-20">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-border">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-accent/40 to-primary/60" />
            <div className="p-8 md:p-14">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                  <Leaf className="h-3.5 w-3.5" />
                  Wellness Philosophy
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8">
                  {content?.section_title || "Why Wellness Matters"}
                </h2>
                <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                  {(content?.section_content || "Taking care of yourself isn't a luxury — it's a necessity. Wellness encompasses every dimension of your life, from the food you eat and the way you move, to how you manage stress and nurture your relationships.\n\nWhen we prioritize wellbeing, we don't just feel better — we think more clearly, connect more deeply, and live more fully. It's about small, intentional choices that compound into a life of balance and vitality.").split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 md:pb-28">
          <div className="text-center rounded-3xl bg-card border border-border p-10 md:p-16">
            <Sun className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your Wellness Journey</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Explore our articles, guides, and curated resources to build a healthier, more balanced life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/articles"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Explore Articles <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/newsletter"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-accent transition-colors"
              >
                Join Newsletter
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Wellness;
