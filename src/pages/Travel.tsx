import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { usePageSection } from "@/hooks/usePageSections";
import { useSectionCards } from "@/hooks/useSectionCards";
import { useActiveProducts } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { Store, Sparkles, ArrowRight, BookOpen, ShoppingBag, Package, BookMarked, Gift } from "lucide-react";
import FloatingIcons from "@/components/FloatingIcons";

const resolveCardLink = (raw?: string) => {
  const link = (raw ?? "").trim();
  if (!link || link === "#") return null;
  if (/^https?:\/\//i.test(link)) return { kind: "external" as const, href: link };
  if (link.startsWith("/")) return { kind: "internal" as const, to: link };
  return { kind: "internal" as const, to: `/blog/${link}` };
};

const Travel = () => {
  const { data: pageData, isLoading } = usePageSection("travel");
  const { data: sectionCards } = useSectionCards("travel_cards");
  const { data: products, isLoading: productsLoading } = useActiveProducts();

  const featuredCards = sectionCards?.content?.cards || [];
  const content = pageData?.content as
    | { section_title?: string; section_content?: string }
    | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-16 text-center space-y-6">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-8 w-full max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead
        title="Shop — Books & More"
        description="Browse our curated collection of books, guides, and resources."
        canonical="/travel"
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />
          <div className="absolute top-20 left-20 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/8 rounded-full blur-3xl" />
          <FloatingIcons icons={[
            { icon: BookOpen, top: '10%', left: '6%', size: 30, delay: '0s', duration: '16s', rotate: -10 },
            { icon: ShoppingBag, top: '12%', left: '90%', size: 28, delay: '2s', duration: '19s', rotate: 12 },
            { icon: Package, top: '62%', left: '5%', size: 24, delay: '1s', duration: '15s', rotate: -15 },
            { icon: BookMarked, top: '58%', left: '92%', size: 26, delay: '3s', duration: '18s', rotate: 8 },
            { icon: Gift, top: '30%', left: '94%', size: 22, delay: '4s', duration: '14s', rotate: -20 },
          ]} />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/60 mb-8 animate-slide-down">
              <Store className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Shop</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-down font-serif">
              {pageData?.title || "Shop"}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-slide-up stagger-1">
              {pageData?.subtitle || "Explore our curated collection of books, guides, and resources to fuel your journey."}
            </p>
          </div>
        </section>

        {/* Featured Cards */}
        {featuredCards.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold font-serif">Featured</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredCards.map((card, index) => {
                const resolved = resolveCardLink(card.link);
                const body = (
                  <div className="group relative rounded-2xl overflow-hidden bg-card border border-border/40 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500">
                    {card.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-base mb-1.5 group-hover:text-accent transition-colors duration-300">
                            {card.title}
                          </h3>
                          {card.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                              {card.description}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );

                const className = `block animate-slide-up stagger-${Math.min(index + 1, 6)}`;

                if (resolved?.kind === "external") {
                  return (
                    <a key={card.id || index} href={resolved.href} target="_blank" rel="noopener noreferrer" className={className}>
                      {body}
                    </a>
                  );
                }

                return (
                  <Link key={card.id || index} to={resolved?.to || "#"} className={className}>
                    {body}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Store className="w-4.5 h-4.5 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif">Our Collection</h2>
              {products && <p className="text-sm text-muted-foreground">{products.length} item{products.length !== 1 ? 's' : ''} available</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {productsLoading ? (
              [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
            ) : products?.map((product, index) => (
              <div key={product.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ProductCard
                  title={product.title}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  slug={product.slug}
                  author={product.author}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy Section */}
        {content?.section_content && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="relative rounded-3xl bg-card border border-border/40 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-secondary to-accent" />
              <div className="p-8 md:p-14 lg:p-16 max-w-4xl">
                <div className="inline-block px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                  Philosophy
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif leading-tight mb-6">
                  {content?.section_title || "Our Philosophy"}
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  {content.section_content.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Travel;
