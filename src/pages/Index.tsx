import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import SEOHead, { buildWebsiteJsonLd } from "@/components/SEOHead";
import { useSiteSection } from "@/hooks/useSiteSections";
import { useArticles } from "@/hooks/useArticles";
import { articles as staticArticles } from "@/data/articles";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { data: dbArticles } = useArticles('published');
  const { data: newsletterSection } = useSiteSection('newsletter');
  const { data: footerSection } = useSiteSection('footer');

  const featuredArticles = dbArticles?.length
    ? dbArticles.slice(0, 6).map((article) => ({
        id: article.slug,
        title: article.title,
        excerpt: article.excerpt || '',
        image: article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
        category: article.category,
        author: article.author_name || 'Anonymous',
        date: new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: article.read_time || '5 min read',
      }))
    : staticArticles.slice(0, 6);

  const newsletterContent = newsletterSection?.content as { heading?: string; description?: string; button_text?: string } | null;
  const footerContent = footerSection?.content as { copyright?: string } | null;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead canonical="/" jsonLd={buildWebsiteJsonLd()} />
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <HeroSection />
        <IntroSection />

        {/* Articles */}
        <section id="articles" className="py-12 md:py-16 border-t border-border/50" aria-label="Featured Articles">
          <div className="flex items-center justify-between mb-10 animate-slide-up">
            <h2 className="text-2xl font-semibold tracking-tight">Featured Articles</h2>
            <a
              href="/articles"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ArticleCard {...article} size="small" />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="my-16 md:my-20 py-16 md:py-20 border-t border-b border-border/50 animate-scale-in" aria-label="Newsletter">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {newsletterContent?.heading || 'Stay inspired.'}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {newsletterContent?.description || 'Subscribe to receive our latest articles and insights directly in your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Your email"
                aria-label="Email address"
                className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
              />
              <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                {newsletterContent?.button_text || 'Subscribe'}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <nav className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10" aria-label="Footer navigation">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Explore</h3>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/wellness" className="text-muted-foreground hover:text-foreground transition-colors">Wellness</a></li>
                <li><a href="/travel" className="text-muted-foreground hover:text-foreground transition-colors">Travel</a></li>
                <li><a href="/creativity" className="text-muted-foreground hover:text-foreground transition-colors">Creativity</a></li>
                <li><a href="/growth" className="text-muted-foreground hover:text-foreground transition-colors">Growth</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">About</h3>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Our Story</a></li>
                <li><a href="/authors" className="text-muted-foreground hover:text-foreground transition-colors">Authors</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Resources</h3>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/style-guide" className="text-muted-foreground hover:text-foreground transition-colors">Style Guide</a></li>
                <li><a href="/newsletter" className="text-muted-foreground hover:text-foreground transition-colors">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Legal</h3>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </nav>
          <div className="pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
            <p>{footerContent?.copyright || '© 2025 Cyberom. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
