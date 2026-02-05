import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
 import { useSiteSection } from "@/hooks/useSiteSections";
 import { useArticles } from "@/hooks/useArticles";
 import { articles as staticArticles } from "@/data/articles";

const Index = () => {
   const { data: dbArticles } = useArticles('published');
   const { data: newsletterSection } = useSiteSection('newsletter');
   const { data: footerSection } = useSiteSection('footer');
 
   // Use database articles if available, otherwise fall back to static
   const featuredArticles = dbArticles?.length
     ? dbArticles.slice(0, 6).map((article) => ({
         id: article.slug,
         title: article.title,
         excerpt: article.excerpt || '',
         image: article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
         category: article.category,
         author: article.author_name || 'Anonymous',
         date: new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
         readTime: article.read_time || '5 min read',
       }))
     : staticArticles.slice(0, 6);
 
   const newsletterContent = newsletterSection?.content as { heading?: string; description?: string; button_text?: string } | null;
   const footerContent = footerSection?.content as { copyright?: string } | null;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Intro Section */}
        <IntroSection />

        {/* Featured Articles Grid */}
        <section id="articles" className="py-12">
          <div className="flex items-center justify-between mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Articles</h2>
            <a href="#all" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors px-4 py-2 rounded-full hover:bg-muted/60">
              View all →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ArticleCard {...article} size="small" />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="my-20 rounded-[2.5rem] bg-card p-12 md:p-16 text-center animate-scale-in">
          <div className="max-w-2xl mx-auto space-y-8">
             <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
               {newsletterContent?.heading || 'Stay inspired.'}
             </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
               {newsletterContent?.description || 'Subscribe to receive our latest articles and insights directly in your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-6 py-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <button className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all">
                 {newsletterContent?.button_text || 'Subscribe'}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/wellness" className="hover:text-accent transition-colors">Wellness</a></li>
                <li><a href="/travel" className="hover:text-accent transition-colors">Travel</a></li>
                <li><a href="/creativity" className="hover:text-accent transition-colors">Creativity</a></li>
                <li><a href="/growth" className="hover:text-accent transition-colors">Growth</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-accent transition-colors">Our Story</a></li>
                <li><a href="/authors" className="hover:text-accent transition-colors">Authors</a></li>
                <li><a href="/contact" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/style-guide" className="hover:text-accent transition-colors">Style Guide</a></li>
                <li><a href="/#newsletter" className="hover:text-accent transition-colors">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-accent transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
             <p>{footerContent?.copyright || '© 2025 Perspective. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
