import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageSection } from "@/hooks/usePageSections";
import { usePublishedWellnessArticles } from "@/hooks/useWellnessArticles";
import { Link } from "react-router-dom";
import { Heart, Leaf, Sun, Sparkles, ArrowRight, Clock, User } from "lucide-react";

import PageBackground from "@/components/PageBackground";
import FloatingIcons from "@/components/FloatingIcons";
import { Flower2, Droplets, Brain, Activity } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { Heart, Leaf, Sun, Sparkles };

const defaultPillars = [
  { icon: "Heart", title: "Mind", description: "Mental clarity, mindfulness, and emotional balance for inner peace." },
  { icon: "Leaf", title: "Body", description: "Nutrition, movement, and rest to fuel your physical vitality." },
  { icon: "Sun", title: "Soul", description: "Purpose, connection, and spiritual practices that nurture wholeness." },
  { icon: "Sparkles", title: "Lifestyle", description: "Daily rituals, habits, and environments that support your wellbeing." },
];

const Wellness = () => {
  const { data: pageData, isLoading } = usePageSection("wellness");
  const { data: wellnessArticles, isLoading: articlesLoading } = usePublishedWellnessArticles();

  const content = pageData?.content as Record<string, any> | undefined;

  const pillars = content?.pillars?.length ? content.pillars : defaultPillars;
  const heroBadge = content?.hero_badge || "Nurture Your Wellbeing";
  const pillarsHeading = content?.pillars_heading || "The Four Pillars";
  const pillarsSubheading = content?.pillars_subheading || "A holistic approach to living well, inside and out.";
  const sectionBadge = content?.section_badge || "Wellness Philosophy";
  const sectionTitle = content?.section_title || "Why Wellness Matters";
  const sectionContent = content?.section_content || "Taking care of yourself isn't a luxury — it's a necessity. Wellness encompasses every dimension of your life, from the food you eat and the way you move, to how you manage stress and nurture your relationships.\n\nWhen we prioritize wellbeing, we don't just feel better — we think more clearly, connect more deeply, and live more fully.";
  const ctaTitle = content?.cta_title || "Start Your Wellness Journey";
  const ctaDescription = content?.cta_description || "Explore our articles, guides, and curated resources to build a healthier, more balanced life.";
  const ctaButtonText = content?.cta_button_text || "Explore Articles";
  const ctaButtonLink = content?.cta_button_link || "/articles";
  const ctaSecondaryText = content?.cta_secondary_text || "Join Newsletter";
  const ctaSecondaryLink = content?.cta_secondary_link || "/newsletter";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-[400px] w-full rounded-3xl mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in relative">
      <SEOHead
        title="Wellness & Self-Care"
        description="Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing."
        canonical="/wellness"
      />
      <PageBackground />
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20 py-20 md:py-32">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        <FloatingIcons icons={[
          { icon: Heart, top: '8%', left: '6%', size: 30, delay: '0s', duration: '16s', rotate: -10 },
          { icon: Leaf, top: '12%', left: '90%', size: 28, delay: '2s', duration: '19s', rotate: 15 },
          { icon: Flower2, top: '65%', left: '5%', size: 26, delay: '1s', duration: '14s', rotate: -20 },
          { icon: Droplets, top: '55%', left: '92%', size: 24, delay: '3s', duration: '18s', rotate: 8 },
          { icon: Brain, top: '30%', left: '93%', size: 22, delay: '4s', duration: '15s', rotate: -5 },
          { icon: Activity, top: '75%', left: '12%', size: 20, delay: '5s', duration: '21s', rotate: 12 },
        ]} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-slide-down">
            <Heart className="h-4 w-4" />
            {heroBadge}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-down">
            {pageData?.title || "Wellness & Self-Care"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1">
            {pageData?.subtitle || "Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing."}
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Wellness Pillars */}
        <section className="py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{pillarsHeading}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{pillarsSubheading}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {pillars.map((pillar: any, index: number) => {
              const Icon = iconMap[pillar.icon] || Heart;
              return (
                <div
                  key={pillar.title || index}
                  className={`group relative rounded-2xl bg-card border border-border p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up stagger-${index + 1}`}
                >
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Wellness Articles */}
        <section className="pb-16 md:pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Wellness Articles</h2>
              <p className="text-muted-foreground mt-1">Curated reads for your wellness journey.</p>
            </div>
          </div>

          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-2xl" />)}
            </div>
          ) : !wellnessArticles?.length ? (
            <div className="text-center py-16 rounded-2xl bg-card border border-border">
              <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No wellness articles yet.</p>
              <p className="text-muted-foreground text-sm mt-1">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wellnessArticles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/wellness/${article.slug}`}
                  className={`block animate-slide-up stagger-${Math.min(index + 1, 6)}`}
                >
                  <div className="group/card relative rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {article.featured_image && (
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover/card:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {article.author_name && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {article.author_name}
                          </span>
                        )}
                        {article.read_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {article.read_time}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover/card:gap-2 transition-all">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Philosophy / Content Section */}
        <section className="pb-16 md:pb-20">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-border">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 via-accent/40 to-primary/60" />
            <div className="p-8 md:p-14">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                  <Leaf className="h-3.5 w-3.5" />
                  {sectionBadge}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8">{sectionTitle}</h2>
                <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
                  {sectionContent.split("\n\n").map((paragraph: string, index: number) => (
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{ctaTitle}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">{ctaDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ctaButtonLink} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                {ctaButtonText} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to={ctaSecondaryLink} className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-border bg-card text-foreground font-medium hover:bg-accent transition-colors">
                {ctaSecondaryText}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Wellness;
