 import { useParams, Navigate } from "react-router-dom";
 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import Header from "@/components/Header";
 import ArticleCard from "@/components/ArticleCard";
 import ArticleHeader from "@/components/blog/ArticleHeader";
 import CategorySidebar from "@/components/blog/CategorySidebar";
 import MobileShareButtons from "@/components/blog/MobileShareButtons";
 import { ArrowLeft, Loader2 } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 const BlogArticle = () => {
   const { slug } = useParams<{ slug: string }>();
   
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
 
   if (isLoading) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <div className="flex items-center justify-center h-[60vh]">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
 
   return (
     <div className="min-h-screen bg-background animate-fade-in">
       <Header />
       
       <main>
         {/* Back Navigation */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           <a
             href="/"
             className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
           >
             <ArrowLeft className="w-4 h-4" />
             Back to articles
           </a>
         </div>
 
         {/* Hero Image */}
         {article.featured_image && (
           <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-12">
             <img
               src={article.featured_image}
               alt={article.title}
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
           </div>
         )}
 
         {/* Main Content with Sidebar */}
         <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${article.featured_image ? '-mt-32 relative z-10' : 'pt-8'}`}>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Article Content */}
             <article className="lg:col-span-8">
               <ArticleHeader
                 title={article.title}
                 excerpt={article.excerpt}
                 category={article.category}
                 authorName={article.author_name}
                 formattedDate={formattedDate}
                 readTime={article.read_time}
                 getCategoryClass={getCategoryClass}
               />
 
               {/* Article Content */}
               {article.content && (
                 <div 
                   className="prose prose-lg max-w-none mb-16 animate-slide-up stagger-2"
                   dangerouslySetInnerHTML={{ __html: article.content }}
                 />
               )}
 
               {/* Mobile Share Buttons */}
               <MobileShareButtons title={article.title} />
 
               {/* Newsletter CTA */}
               <div className="mb-16 rounded-2xl bg-card p-8 md:p-12 text-center">
                 <h3 className="text-2xl md:text-3xl font-bold mb-4">Enjoyed this article?</h3>
                 <p className="text-muted-foreground mb-6">
                   Subscribe to receive more insights like this directly in your inbox.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                   <input
                     type="email"
                     placeholder="Your email"
                     className="flex-1 px-4 py-3 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                   />
                   <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                     Subscribe
                   </Button>
                 </div>
               </div>
             </article>
 
             {/* Category Sidebar */}
             <div className="lg:col-span-4">
               <CategorySidebar 
                 currentCategory={article.category} 
                 currentSlug={slug || ''} 
               />
             </div>
           </div>
         </div>
 
         {/* Related Articles */}
         {relatedArticles && relatedArticles.length > 0 && (
           <section className="bg-muted py-16 animate-fade-in">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <h2 className="text-3xl font-bold mb-8 animate-slide-up">You might also like</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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