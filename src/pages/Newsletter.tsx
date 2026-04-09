import { useState } from 'react';
import Header from '@/components/Header';
import SEOHead, { buildBreadcrumbJsonLd, SITE_NAME, SITE_URL } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Mail, Sparkles, BookOpen, TrendingUp, Heart, ArrowRight,
  Check, Zap, Globe, Users, Star, Send
} from 'lucide-react';

const CATEGORIES = [
  { id: 'wellness', label: 'Wellness', icon: Heart, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
  { id: 'travel', label: 'Travel', icon: Globe, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400' },
  { id: 'creativity', label: 'Creativity', icon: Sparkles, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
  { id: 'growth', label: 'Growth', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
];

const BENEFITS = [
  { icon: BookOpen, title: 'Curated Content', description: 'Hand-picked articles and insights delivered weekly' },
  { icon: Zap, title: 'Early Access', description: 'Be the first to read new articles and features' },
  { icon: Users, title: 'Community', description: 'Join a community of like-minded readers' },
  { icon: Star, title: 'Exclusive Tips', description: "Tips and resources you won't find on the blog" },
];

const PAST_EDITIONS = [
  { title: 'The Art of Mindful Living', date: 'Mar 1, 2026', reads: '2.4k' },
  { title: 'Hidden Gems: Southeast Asia', date: 'Feb 22, 2026', reads: '3.1k' },
  { title: 'Creative Habits That Stick', date: 'Feb 15, 2026', reads: '1.8k' },
  { title: 'Growth Mindset in Practice', date: 'Feb 8, 2026', reads: '2.7k' },
];

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email: email.trim(), categories: selectedCategories },
          { onConflict: 'email' }
        );

      if (error) throw error;

      setIsSubscribed(true);
      toast.success('Welcome aboard! 🎉');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Newsletter — Stay Inspired"
        description="Subscribe to Cyberom's free newsletter for curated articles on wellness, travel, creativity, and personal growth delivered weekly to your inbox."
        canonical="/newsletter"
        keywords="newsletter, subscribe, cyberom newsletter, wellness newsletter, weekly inspiration, email updates"
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Newsletter", url: "/newsletter" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Newsletter — Stay Inspired | ${SITE_NAME}`,
            description: "Subscribe to curated articles on wellness, travel, creativity, and personal growth.",
            url: `${SITE_URL}/newsletter`,
            isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
            potentialAction: {
              "@type": "SubscribeAction",
              target: `${SITE_URL}/newsletter`,
              name: "Subscribe to Newsletter",
            },
          },
        ]}
      />
      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Animated background blobs */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-accent/8 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s]" />

          {/* Floating decorative elements */}
          <div className="absolute top-32 left-[15%] opacity-20 animate-[bounce_3s_ease-in-out_infinite]">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div className="absolute top-48 right-[20%] opacity-15 animate-[bounce_4s_ease-in-out_infinite_1s]">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <div className="absolute bottom-32 left-[25%] opacity-15 animate-[bounce_5s_ease-in-out_infinite_0.5s]">
            <Star className="h-7 w-7 text-primary" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 text-sm font-medium mb-8 animate-fade-in backdrop-blur-sm border border-primary/10">
              <Send className="h-4 w-4" />
              Free weekly newsletter
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 animate-fade-in">
              Stories that
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                inspire action.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
              Join thousands of curious minds. Get the best of wellness, travel, creativity, and growth — delivered every week.
            </p>

            {/* Subscribe form */}
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="max-w-lg mx-auto animate-fade-in">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 px-6 rounded-full text-base bg-card border-border shadow-sm focus:shadow-md transition-shadow"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="h-14 px-8 rounded-full text-base gap-2 shrink-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">No spam, unsubscribe anytime. We respect your privacy.</p>
              </form>
            ) : (
              <div className="max-w-lg mx-auto bg-card border border-border rounded-2xl p-8 animate-scale-in shadow-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-[bounce_1s_ease-in-out]">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">You're in! 🎉</h3>
                <p className="text-muted-foreground">Check your inbox to confirm your subscription. Welcome to the community!</p>
              </div>
            )}

            {/* Social proof */}
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground animate-fade-in">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium shadow-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Join <strong className="text-foreground">5,000+</strong> subscribers</span>
            </div>
          </div>
        </section>

        {/* Category Preferences */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Choose your interests</h2>
            <p className="text-muted-foreground text-lg">Personalize your newsletter experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-center animate-fade-in ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-scale-in">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium text-sm">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-muted/30 py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Why subscribe?</h2>
              <p className="text-muted-foreground text-lg">More than just a newsletter</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div
                    key={i}
                    style={{ animationDelay: `${i * 150}ms` }}
                    className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in group"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110 group-hover:rotate-6 duration-300">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Past Editions */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Past editions</h2>
            <p className="text-muted-foreground text-lg">See what you've been missing</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {PAST_EDITIONS.map((ed, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 100}ms` }}
                className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 group cursor-pointer animate-fade-in hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate group-hover:text-primary transition-colors">{ed.title}</p>
                  <p className="text-xs text-muted-foreground">{ed.date} · {ed.reads} reads</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-muted/20 py-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '5,000+', label: 'Subscribers' },
                { value: '150+', label: 'Editions' },
                { value: '98%', label: 'Open Rate' },
                { value: '4.9/5', label: 'Reader Rating' },
              ].map((stat, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/50" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full blur-3xl" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Ready to stay inspired?</h2>
            <p className="text-lg opacity-80 mb-8">One email per week. Always valuable. Never spammy.</p>
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-13 px-6 rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    disabled={isLoading}
                    className="h-13 px-8 rounded-full shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    {isLoading ? '...' : 'Subscribe'}
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-lg font-medium">✓ You're already subscribed!</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
