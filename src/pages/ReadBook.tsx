import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EbookReader } from "@/components/ebook/EbookReader";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";

interface ReaderProduct {
  title: string;
  slug: string | null;
  chapters: { title: string; content: string }[];
}

const ReadBook = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-read", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products" as any)
        .select("title, slug, chapters")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      const raw = data as any;
      return {
        title: raw.title,
        slug: raw.slug,
        chapters: Array.isArray(raw.chapters) ? raw.chapters : [],
      } as ReaderProduct;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!product || product.chapters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SEOHead title="Book not found" />
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {product ? "No content available" : "Book not found"}
          </h1>
          <p className="text-muted-foreground">
            {product
              ? "This book doesn't have readable content yet."
              : "The book you're looking for doesn't exist."}
          </p>
          <Link to={product ? `/product/${slug}` : "/travel"}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={`Reading: ${product.title}`} />
      <EbookReader
        chapters={product.chapters}
        bookTitle={product.title}
        onClose={() => window.history.back()}
      />
    </>
  );
};

export default ReadBook;
