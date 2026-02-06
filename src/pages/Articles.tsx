import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
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
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-down">
            All Articles
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Explore our collection of articles covering wellness, travel, creativity, personal growth, and more. 
            Find inspiration and insights to enrich your life.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center animate-slide-up stagger-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full transition-all",
              selectedCategory === null && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categoriesLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </>
          ) : (
            categories?.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-full transition-all",
                  selectedCategory?.toLowerCase() === category.slug.toLowerCase() &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => setSelectedCategory(category.slug)}
              >
                {category.name}
              </Button>
            ))
          )}
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ArticleCard
                  id={article.slug}
                  title={article.title}
                  category={article.category}
                  date={new Date(article.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  image={article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80'}
                  size="small"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No articles found{selectedCategory ? ` in ${selectedCategory}` : ''}.
            </p>
            {selectedCategory && (
              <Button className="mt-4" onClick={() => setSelectedCategory(null)}>
                View all articles
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Articles;
