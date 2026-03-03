import Header from "@/components/Header";

import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import SEOHead, { buildWebsiteJsonLd } from "@/components/SEOHead";
import { useSiteSection } from "@/hooks/useSiteSections";


const Index = () => {
  const { data: newsletterSection } = useSiteSection('newsletter');
  const { data: footerSection } = useSiteSection('footer');

  const newsletterContent = newsletterSection?.content as { heading?: string; description?: string; button_text?: string } | null;
  const footerContent = footerSection?.content as { copyright?: string } | null;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead canonical="/" jsonLd={buildWebsiteJsonLd()} />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        <IntroSection />



        <section className="my-20 rounded-[2.5rem] bg-card p-12 md:p-16 text-center animate-scale-in" aria-label="Newsletter">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {newsletterContent?.heading || 'Stay inspired.'}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {newsletterContent?.description || 'Subscribe to receive our latest articles and insights directly in your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Your email" aria-label="Email address" className="flex-1 px-6 py-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
              <button className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all">
                {newsletterContent?.button_text || 'Subscribe'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8" aria-label="Footer navigation">
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
          </nav>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>{footerContent?.copyright || '© 2025 Cyberom. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
