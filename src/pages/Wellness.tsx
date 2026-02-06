import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import { useArticles } from "@/hooks/useArticles";
import { usePageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";

const Wellness = () => {
  const { data: articles } = useArticles('published');
  const { data: pageData, isLoading } = usePageSection('wellness');

  const wellnessArticles = articles?.filter(article => 
    article.category.toLowerCase() === "wellness"
  ) || [];

  const content = pageData?.content as { section_title?: string; section_content?: string } | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-16 text-center space-y-6">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-24 w-full max-w-3xl mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-down">
            {pageData?.title || 'Wellness & Self-Care'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-1">
            {pageData?.subtitle || 'Discover practices, insights, and strategies to nurture your physical, mental, and emotional wellbeing.'}
          </p>
        </div>

        {/* Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellnessArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 2, 6)}`}>
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
                />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Content */}
        <section className="mt-16 rounded-2xl bg-card p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {content?.section_title || 'Why Wellness Matters'}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              {(content?.section_content || '').split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Wellness;
