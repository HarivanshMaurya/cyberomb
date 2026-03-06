import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";

interface ProductDetail {
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
      } as ProductDetail;
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
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-[3/4] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
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
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Book not found</h1>
          <p className="text-muted-foreground mb-6">The book you're looking for doesn't exist or is no longer available.</p>
          <Link to="/travel">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
              {allImages.length > 0 ? (
                <img
                  src={allImages[activeImage]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-20 h-20 text-muted-foreground/30" />
                </div>
              )}

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => (p === 0 ? allImages.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow hover:bg-background transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => (p === allImages.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow hover:bg-background transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImage
                        ? "border-primary shadow-md scale-105"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Book Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                {product.title}
              </h1>
              {product.author && (
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> by{" "}
                  <span className="font-medium text-foreground">{product.author}</span>
                </p>
              )}
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2">
              {product.language && (
                <Badge variant="secondary" className="gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {product.language}
                </Badge>
              )}
              {product.pages_count > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> {product.pages_count} Pages
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> eBook
              </Badge>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed text-base">
                {product.description}
              </p>
            )}

            {/* Buy Button */}
            <a
              href={product.buy_link !== "#" ? product.buy_link : undefined}
              target={product.buy_link !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                size="lg"
                className="w-full text-base py-6 rounded-xl gap-3 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now — ₹{product.price.toLocaleString("en-IN")}
                {product.buy_link !== "#" && <ExternalLink className="w-4 h-4 ml-auto opacity-60" />}
              </Button>
            </a>

            {/* Long Description */}
            {product.long_description && (
              <div className="pt-4 border-t border-border">
                <h2 className="text-xl font-semibold mb-3">About this Book</h2>
                <div className="prose prose-sm text-muted-foreground max-w-none whitespace-pre-line leading-relaxed">
                  {product.long_description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table of Contents */}
        {product.table_of_contents.length > 0 && (
          <section className="mt-16 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                Table of Contents
              </h2>
              <ol className="space-y-1">
                {product.table_of_contents.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-sm font-mono text-muted-foreground w-8">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </span>
                    {item.page && (
                      <span className="text-sm text-muted-foreground">p. {item.page}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
