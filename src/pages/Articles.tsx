import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import SEOHead from "@/components/SEOHead";
import { useArticles } from "@/hooks/useArticles";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Articles = () => {
  const { data: articles, isLoading: articlesLoading } = useArticles('published');
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? articles?.filter(article => article.category.toLowerCase() === selectedCategory.toLowerCase())
    : articles;

  const isLoading = articlesLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead
        title="All Articles"
        description="Explore our collection of articles covering wellness, travel, creativity, personal growth, and more."
        canonical="/articles"
      />
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Header */}
        <header className="mb-12 space-y-3 animate-slide-down">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            All Articles
          </h1>
          <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
            Explore our collection of articles covering wellness, travel, creativity, personal growth, and more.
          </p>
        </header>

        {/* Category Filter */}
        <nav className="mb-10 flex flex-wrap gap-1.5 animate-slide-up stagger-1" aria-label="Category filter">
          <button
            className={cn(
              "text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors",
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categoriesLoading ? (
            <>{[1,2,3,4].map(i => <Skeleton key={i} className="h-8 w-16 rounded-lg" />)}</>
          ) : (
            categories?.map(category => (
              <button
                key={category.id}
                className={cn(
                  "text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors",
                  selectedCategory?.toLowerCase() === category.slug.toLowerCase()
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </button>
            ))
          )}
        </nav>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[40vh]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10" aria-label="Articles list">
            {filteredArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ArticleCard
                  id={article.slug}
                  title={article.title}
                  category={article.category}
                  date={new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  image={article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'}
                  size="small"
                />
              </div>
            ))}
          </section>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No articles found{selectedCategory ? ` in "${selectedCategory}"` : ''}.</p>
            {selectedCategory && (
              <button className="mt-3 text-sm font-medium text-foreground underline underline-offset-4" onClick={() => setSelectedCategory(null)}>
                View all articles
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Articles;
