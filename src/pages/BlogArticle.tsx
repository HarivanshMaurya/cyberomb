import { useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import ArticleHeader from "@/components/blog/ArticleHeader";
import CategorySidebar from "@/components/blog/CategorySidebar";
import MobileShareButtons from "@/components/blog/MobileShareButtons";
import LanguageToggle from "@/components/blog/LanguageToggle";
import SEOHead, { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/components/SEOHead";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const [translated, setTranslated] = useState<{ title: string; content: string; excerpt: string } | null>(null);
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ['related-articles', article?.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .eq('category', article?.category || '')
        .neq('slug', slug)
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!article?.category,
  });

  const getCategoryClass = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes("financ")) return "tag-financing";
    if (normalized.includes("lifestyle")) return "tag-lifestyle";
    if (normalized.includes("community")) return "tag-community";
    if (normalized.includes("wellness")) return "tag-wellness";
    if (normalized.includes("travel")) return "tag-travel";
    if (normalized.includes("creativ")) return "tag-creativity";
    if (normalized.includes("growth")) return "tag-growth";
    return "tag-lifestyle";
  };

  const handleTranslated = useCallback((data: { title: string; content: string; excerpt: string }) => {
    setTranslated(data);
  }, []);

  const handleReset = useCallback(() => {
    setTranslated(null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return <Navigate to="/404" replace />;
  }

  const formattedDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const articleJsonLd = buildArticleJsonLd({
    title: article.title,
    description: article.meta_description || article.excerpt || undefined,
    image: article.og_image || article.featured_image || undefined,
    slug: article.slug,
    publishedAt: article.published_at || article.created_at,
    updatedAt: article.updated_at,
    authorName: article.author_name || undefined,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Articles", url: "/articles" },
    { name: article.title, url: `/blog/${article.slug}` },
  ]);

  const displayTitle = translated?.title || article.title;
  const displayContent = translated?.content || article.content;
  const displayExcerpt = translated?.excerpt || article.excerpt;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead
        title={article.meta_title || article.title}
        description={article.meta_description || article.excerpt || `Read ${article.title} on Cyberom.`}
        canonical={`/blog/${article.slug}`}
        ogType="article"
        ogImage={article.og_image || article.featured_image || undefined}
        article={{
          publishedTime: article.published_at || article.created_at,
          modifiedTime: article.updated_at,
          author: article.author_name || undefined,
          category: article.category,
        }}
        jsonLd={[articleJsonLd, breadcrumbJsonLd] as unknown as Record<string, unknown>}
      />
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-6" aria-label="Breadcrumb">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to articles
          </a>
        </nav>

        {/* Featured image */}
        {article.featured_image && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-muted">
              <img src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <article className="lg:col-span-8">
              {/* Language Toggle */}
              <div className="mb-6 flex justify-end">
                <LanguageToggle
                  title={article.title}
                  content={article.content || ""}
                  excerpt={article.excerpt}
                  onTranslated={handleTranslated}
                  onReset={handleReset}
                  onLoadingChange={setIsTranslatingContent}
                />
              </div>

              <ArticleHeader
                title={displayTitle}
                excerpt={displayExcerpt}
                category={article.category}
                authorName={article.author_name}
                formattedDate={formattedDate}
                readTime={article.read_time}
                getCategoryClass={getCategoryClass}
              />

              {isTranslatingContent ? (
                <div className="space-y-3 mb-16 animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <p className="text-sm text-muted-foreground text-center pt-4">Translating to Hindi… please wait</p>
                </div>
              ) : displayContent ? (
                <div 
                  className="prose prose-neutral dark:prose-invert prose-lg max-w-none mb-16 animate-slide-up stagger-2"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              ) : null}

              <MobileShareButtons title={article.title} />

              {/* Subscribe CTA */}
              <aside className="mb-16 rounded-xl border border-border/50 p-8 md:p-10 text-center">
                <h3 className="text-xl font-semibold mb-2">Enjoyed this article?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Subscribe to receive more insights directly in your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                  <input type="email" placeholder="Your email" aria-label="Email address" className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
                  <Button size="sm" className="rounded-lg px-6">Subscribe</Button>
                </div>
              </aside>
            </article>

            <aside className="lg:col-span-4">
              <CategorySidebar currentCategory={article.category} currentSlug={slug || ''} />
            </aside>
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="border-t border-border/50 py-16 mt-8 animate-fade-in" aria-label="Related articles">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-semibold mb-8 animate-slide-up">You might also like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {relatedArticles.map((relatedArticle, index) => (
                  <div key={relatedArticle.id} className={`animate-slide-up stagger-${Math.min(index + 1, 3)}`}>
                    <ArticleCard
                      id={relatedArticle.slug}
                      title={relatedArticle.title}
                      category={relatedArticle.category}
                      date={new Date(relatedArticle.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      image={relatedArticle.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'}
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BlogArticle;
