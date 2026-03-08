import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { useActiveAuthors } from "@/hooks/useAuthors";
import { Mail, Instagram, Twitter } from "lucide-react";
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
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead title="Our Authors" description="Meet the voices behind Cyberom." canonical="/authors" />
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-down">
            Meet Our Authors
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            The voices behind Cyberom—experienced writers, practitioners, and thoughtful explorers
            who bring diverse perspectives and genuine insights to every article.
          </p>
        </div>

        {/* Authors Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : !authors?.length ? (
          <p className="text-center text-muted-foreground py-12">No authors yet.</p>
        ) : (
          <section className="grid md:grid-cols-2 gap-8 mb-16">
            {authors.map((author, index) => (
              <div
                key={author.id}
                className={`rounded-2xl bg-card p-8 hover:shadow-xl transition-all duration-300 animate-slide-up stagger-${Math.min(index + 2, 6)}`}
              >
                <div className="flex items-start gap-6 mb-6">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                      {author.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{author.name}</h3>
                    {author.role && <p className="text-accent font-medium mb-3">{author.role}</p>}
                  </div>
                </div>
                {author.bio && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">{author.bio}</p>
                )}
                <div className="flex items-center gap-3">
                  {author.email && (
                    <a
                      href={`mailto:${author.email}`}
                      className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {author.twitter && (
                    <a
                      href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {author.instagram && (
                    <a
                      href={`https://instagram.com/${author.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Join Section */}
        <section className="text-center py-12 rounded-2xl bg-muted">
          <h2 className="text-3xl font-bold mb-4">Want to Contribute?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for thoughtful voices to join our community. If you have insights
            to share, we'd love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </section>
      </main>
    </div>
  );
};

export default Authors;
