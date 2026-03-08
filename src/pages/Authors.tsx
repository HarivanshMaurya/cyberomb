import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { useActiveAuthors } from "@/hooks/useAuthors";
import { Mail, Instagram, Twitter, Users, Pen, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Authors = () => {
  const { data: authors, isLoading } = useActiveAuthors();
  const location = useLocation();

  useEffect(() => {
    if (authors && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [authors, location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Our Authors" description="Meet the voices behind Cyberom." canonical="/authors" />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20 py-20 md:py-28">
        <div className="absolute top-10 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-down">
            <Users className="w-4 h-4" />
            Our Team
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            Meet Our Authors
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            The voices behind Cyberom—experienced writers, practitioners, and thoughtful explorers
            who bring diverse perspectives and genuine insights to every article.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      {!isLoading && authors && authors.length > 0 && (
        <div className="border-b border-border bg-card">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center gap-10 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{authors.length}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Authors</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">∞</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Perspectives</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-3xl font-bold text-primary">24/7</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Inspired</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Authors Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : !authors?.length ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No authors yet.</p>
          </div>
        ) : (
          <section className="grid md:grid-cols-2 gap-8">
            {authors.map((author, index) => (
              <div
                key={author.id}
                id={author.id}
                className={`group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-500 scroll-mt-20 animate-slide-up ${
                  location.hash === `#${author.id}` ? 'ring-2 ring-primary/40' : ''
                }`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

                <div className="p-8">
                  {/* Author header */}
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative">
                      {author.image ? (
                        <img
                          src={author.image}
                          alt={author.name}
                          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary ring-2 ring-border group-hover:ring-primary/30 transition-all">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      {/* Online dot */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#34A853] border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors truncate">
                        {author.name}
                      </h3>
                      {author.role && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <Pen className="w-3 h-3" />
                          {author.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {author.bio && (
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {author.bio}
                    </p>
                  )}

                  {/* Social links */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                        aria-label="Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                    )}
                    {author.twitter && (
                      <a
                        href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                        Twitter
                      </a>
                    )}
                    {author.instagram && (
                      <a
                        href={`https://instagram.com/${author.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* CTA Section */}
        <div className="mt-20 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-primary/20 p-10 md:p-14 text-center animate-scale-in">
          <div className="inline-flex items-center gap-2 w-14 h-14 rounded-2xl bg-primary/15 justify-center mb-6">
            <Pen className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Contribute?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            We're always looking for thoughtful voices to join our community. If you have insights
            to share, we'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  );
};

export default Authors;
