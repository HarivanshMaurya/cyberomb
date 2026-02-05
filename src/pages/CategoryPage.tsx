 import { useParams, Navigate } from "react-router-dom";
 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import Header from "@/components/Header";
 import ArticleCard from "@/components/ArticleCard";
 import { useCategories } from "@/hooks/useCategories";
 import { Button } from "@/components/ui/button";
 import { Skeleton } from "@/components/ui/skeleton";
 import { Loader2 } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 const CategoryPage = () => {
   const { slug } = useParams<{ slug: string }>();
   const { data: categories, isLoading: categoriesLoading } = useCategories();
 
   // Find current category
   const currentCategory = categories?.find(
     (cat) => cat.slug.toLowerCase() === slug?.toLowerCase()
   );
 
   // Fetch articles by category
   const { data: articles, isLoading: articlesLoading } = useQuery({
     queryKey: ['category-articles', slug],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('articles')
         .select('*')
         .eq('status', 'published')
         .ilike('category', slug || '')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       return data;
     },
     enabled: !!slug,
   });
 
   if (!slug) {
     return <Navigate to="/" replace />;
   }
 
   const isLoading = categoriesLoading || articlesLoading;
 
   return (
     <div className="min-h-screen bg-background animate-fade-in">
       <Header />
       
       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Category Header */}
         <div className="mb-12">
           <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
             {currentCategory?.name || slug}
           </h1>
           {currentCategory?.description && (
             <p className="text-xl text-muted-foreground">
               {currentCategory.description}
             </p>
           )}
         </div>
 
         {/* Category Filter Pills */}
         <div className="mb-8 flex flex-wrap gap-2">
           <Button
             variant="outline"
             size="sm"
             className="rounded-full"
             asChild
           >
             <a href="/">All</a>
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
                   slug?.toLowerCase() === category.slug.toLowerCase() &&
                   "bg-primary text-primary-foreground hover:bg-primary/90"
                 )}
                 asChild
               >
                 <a href={`/category/${category.slug}`}>{category.name}</a>
               </Button>
             ))
           )}
         </div>
 
         {/* Articles Grid */}
         {isLoading ? (
           <div className="flex items-center justify-center h-[40vh]">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
         ) : articles && articles.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {articles.map((article, index) => (
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
               No articles found in this category.
             </p>
             <Button className="mt-4" asChild>
               <a href="/">Browse all articles</a>
             </Button>
           </div>
         )}
       </main>
     </div>
   );
 };
 
 export default CategoryPage;