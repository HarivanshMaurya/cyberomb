import { useState } from "react";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { Mail, ArrowRight, Sparkles, Heart, Eye, Users, BookOpen, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveAuthors } from "@/hooks/useAuthors";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AboutContent {
  story_title?: string;
  story_content?: string;
  mission_title?: string;
  mission_content?: string;
  mission_points?: string[];
  values?: Array<{ title: string; description: string }>;
  cta_title?: string;
  cta_description?: string;
}

const valueIcons = [Sparkles, Heart, Eye, Users, BookOpen, Globe];

const About = () => {
  const { data: pageData, isLoading } = usePageSection('about');
  const { data: authors } = useActiveAuthors();
  const content = pageData?.content as AboutContent | undefined;
  const [ctaEmail, setCtaEmail] = useState('');
  const [ctaLoading, setCtaLoading] = useState(false);

  const handleCtaSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaEmail.trim()) { toast.error('Please enter your email'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ctaEmail)) { toast.error('Please enter a valid email'); return; }
    setCtaLoading(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').upsert({ email: ctaEmail.trim(), categories: [] }, { onConflict: 'email' });
      if (error) throw error;
      toast.success('Subscribed successfully! 🎉');
      setCtaEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setCtaLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-16 text-center space-y-6">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-8 w-full max-w-2xl mx-auto" />
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead
        title="About Cyberom"
        description="A space for exploring ideas, finding inspiration, and discovering new ways of seeing the world."
        canonical="/about"
      />
      <Header />

      <main>
        {/* Hero Section - Full width dramatic */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/60 mb-8 animate-slide-down">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">About Us</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-down font-serif">
              {pageData?.title || 'About Cyberom'}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-slide-up stagger-1">
              {pageData?.subtitle || 'A space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.'}
            </p>
          </div>
        </section>

        {/* Story Section - Split layout */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2 lg:sticky lg:top-28">
              <div className="inline-block px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif leading-tight">
                {content?.story_title || 'Our Story'}
              </h2>
            </div>
            <div className="lg:col-span-3 space-y-6">
              {(content?.story_content || 'We started Cyberom with a simple belief — that the right words at the right time can change the way you see the world.').split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-muted-foreground text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section - Card with accent */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative rounded-3xl bg-card border border-border/40 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-secondary to-accent" />
            <div className="p-8 md:p-14 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div>
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                    Mission
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-serif leading-tight mb-6">
                    {content?.mission_title || 'Our Mission'}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {content?.mission_content || ''}
                  </p>
                </div>
                {content?.mission_points && content.mission_points.length > 0 && (
                  <div className="space-y-4">
                    {content.mission_points.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-background/60 border border-border/30 hover:border-accent/30 transition-colors duration-300"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center mt-0.5">
                          <span className="text-sm font-bold text-accent">{index + 1}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Modern grid */}
        {content?.values && content.values.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                Values
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif">Our Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length];
                return (
                  <div
                    key={index}
                    className="group relative p-6 md:p-8 rounded-2xl bg-card border border-border/40 hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:shadow-accent/5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-500">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Team / Authors Section */}
        {authors && authors.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                Team
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif">Meet Our Authors</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="group relative p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/30 transition-all duration-500 text-center hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-muted border-2 border-border/40 group-hover:border-accent/40 transition-colors duration-500">
                    {author.image ? (
                      <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground">{author.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{author.name}</h3>
                  {author.role && (
                    <p className="text-sm text-accent font-medium mb-3">{author.role}</p>
                  )}
                  {author.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{author.bio}</p>
                  )}
                  {(author.twitter || author.instagram) && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                      {author.twitter && (
                        <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-accent transition-colors">Twitter</a>
                      )}
                      {author.instagram && (
                        <a href={author.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-accent transition-colors">Instagram</a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)/0.15),transparent_60%)]" />
            
            <div className="relative p-10 md:p-16 lg:p-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground mb-4">
                {content?.cta_title || 'Join Our Community'}
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                {content?.cta_description || 'Subscribe to receive our latest articles, insights, and inspiration directly in your inbox.'}
              </p>
              <form onSubmit={handleCtaSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={ctaEmail}
                  onChange={e => setCtaEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 backdrop-blur-sm"
                />
                <Button type="submit" disabled={ctaLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6 py-3.5 font-semibold disabled:opacity-50">
                  {ctaLoading ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
