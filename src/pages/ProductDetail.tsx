import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileText,
  User,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface ProductDetailData {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  image: string | null;
  price: number;
  buy_link: string;
  is_active: boolean;
  author: string | null;
  pages_count: number;
  language: string | null;
  gallery_images: string[];
  table_of_contents: { title: string; page?: string }[];
  slug: string | null;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      const raw = data as any;
      return {
        ...raw,
        gallery_images: Array.isArray(raw.gallery_images) ? raw.gallery_images : [],
        table_of_contents: Array.isArray(raw.table_of_contents) ? raw.table_of_contents : [],
      } as ProductDetailData;
    },
    enabled: !!slug,
  });

  const allImages = product
    ? [product.image, ...(product.gallery_images || [])].filter(Boolean) as string[]
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-[3/4] rounded-3xl" />
            <div className="space-y-4 pt-8">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-serif mb-2">Book not found</h1>
          <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist or is no longer available.</p>
          <Link to="/travel">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead
        title={`${product.title} — Buy Now`}
        description={product.description || product.title}
        canonical={`/product/${product.slug}`}
      />
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        {/* Breadcrumb */}
        <Link
          to="/travel"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-10 group"
        >
          <div className="w-8 h-8 rounded-lg bg-card border border-border/40 flex items-center justify-center group-hover:border-accent/30 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-muted border border-border/40 shadow-2xl shadow-black/5">
              {allImages.length > 0 ? (
                <img
                  src={allImages[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
                  <BookOpen className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p === 0 ? allImages.length - 1 : p - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-background/80 backdrop-blur-md border border-border/30 shadow-lg hover:bg-background hover:border-accent/30 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p === allImages.length - 1 ? 0 : p + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-background/80 backdrop-blur-md border border-border/30 shadow-lg hover:bg-background hover:border-accent/30 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/30 text-xs font-medium">
                  {activeImage + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      i === activeImage
                        ? "border-accent shadow-lg shadow-accent/10 scale-105"
                        : "border-border/40 opacity-50 hover:opacity-100 hover:border-border"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Book Info */}
          <div className="space-y-6 md:pt-4">
            {/* Title & Author */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 font-serif">
                {product.title}
              </h1>
              {product.author && (
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" /> by{" "}
                  <span className="font-medium text-foreground">{product.author}</span>
                </p>
              )}
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2">
              {product.language && (
                <Badge variant="secondary" className="gap-1.5 rounded-lg px-3 py-1.5">
                  <Globe className="w-3.5 h-3.5 text-accent" /> {product.language}
                </Badge>
              )}
              {product.pages_count > 0 && (
                <Badge variant="secondary" className="gap-1.5 rounded-lg px-3 py-1.5">
                  <FileText className="w-3.5 h-3.5 text-accent" /> {product.pages_count} Pages
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1.5 rounded-lg px-3 py-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent" /> eBook
              </Badge>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-2">
              <span className="text-5xl font-bold text-foreground">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed text-base">
                {product.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={product.buy_link !== "#" ? product.buy_link : undefined}
                target={product.buy_link !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  size="lg"
                  className="w-full text-base py-6 rounded-2xl gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now — ₹{product.price.toLocaleString("en-IN")}
                  {product.buy_link !== "#" && <ExternalLink className="w-4 h-4 ml-auto opacity-60" />}
                </Button>
              </a>

              <Button
                size="lg"
                variant="outline"
                className="w-full text-base py-6 rounded-2xl gap-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-border/60 hover:border-accent/30"
                onClick={() => navigate(`/read/${product.slug}`)}
              >
                <BookOpen className="w-5 h-5 text-accent" />
                Read Now
              </Button>
            </div>

            {/* Long Description */}
            {product.long_description && (
              <div className="pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h2 className="text-xl font-bold font-serif">About this Book</h2>
                </div>
                <div className="prose prose-sm text-muted-foreground max-w-none whitespace-pre-line leading-relaxed">
                  {product.long_description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table of Contents */}
        {product.table_of_contents.length > 0 && (
          <section className="mt-20 max-w-3xl mx-auto">
            <div className="relative rounded-3xl border border-border/40 bg-card overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-secondary to-accent" />
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold font-serif">Table of Contents</h2>
                </div>
                <ol className="space-y-1">
                  {product.table_of_contents.map((item, i) => (
                    <li
                      key={i}
                      className="group flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-accent/5 transition-colors duration-300"
                    >
                      <span className="flex items-center gap-4">
                        <span className="text-sm font-mono text-accent/60 w-8 group-hover:text-accent transition-colors">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-medium">{item.title}</span>
                      </span>
                      {item.page && (
                        <span className="text-sm text-muted-foreground font-mono">p. {item.page}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
