 import { useCategories, useArticlesByCategory } from "@/hooks/useCategories";
 import { Button } from "@/components/ui/button";
 import { Skeleton } from "@/components/ui/skeleton";
 import { cn } from "@/lib/utils";
 
 interface CategorySidebarProps {
   currentCategory: string;
   currentSlug: string;
 }
 
 const CategorySidebar = ({ currentCategory, currentSlug }: CategorySidebarProps) => {
   const { data: categories, isLoading: categoriesLoading } = useCategories();
   const { data: relatedArticles, isLoading: articlesLoading } = useArticlesByCategory(currentCategory);
 
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
 
   // Filter out the current article from related articles
   const filteredArticles = relatedArticles?.filter(article => article.slug !== currentSlug) || [];
 
   return (
     <aside className="lg:sticky lg:top-8 space-y-8">
       {/* Categories Filter */}
       <div className="bg-card rounded-2xl p-6 border border-border">
         <h3 className="font-semibold text-lg mb-4">Browse Categories</h3>
         {categoriesLoading ? (
           <div className="space-y-2">
             {[1, 2, 3, 4].map((i) => (
               <Skeleton key={i} className="h-10 w-full rounded-full" />
             ))}
           </div>
         ) : (
           <div className="flex flex-wrap gap-2">
             <Button
               variant="outline"
               size="sm"
               className={cn(
                 "rounded-full transition-all",
                 !currentCategory && "bg-primary text-primary-foreground hover:bg-primary/90"
               )}
               asChild
             >
               <a href="/">All</a>
             </Button>
             {categories?.map((category) => (
               <Button
                 key={category.id}
                 variant="outline"
                 size="sm"
                 className={cn(
                   "rounded-full transition-all",
                   currentCategory.toLowerCase() === category.slug.toLowerCase() && 
                   "bg-primary text-primary-foreground hover:bg-primary/90"
                 )}
                 asChild
               >
                 <a href={`/category/${category.slug}`}>{category.name}</a>
               </Button>
             ))}
           </div>
         )}
       </div>
 
       {/* Related Articles in Same Category */}
       {filteredArticles.length > 0 && (
         <div className="bg-card rounded-2xl p-6 border border-border">
           <h3 className="font-semibold text-lg mb-4">
             More in <span className={`capitalize ${getCategoryClass(currentCategory)}`}>{currentCategory}</span>
           </h3>
           {articlesLoading ? (
             <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="space-y-2">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-3 w-2/3" />
                 </div>
               ))}
             </div>
           ) : (
             <div className="space-y-4">
               {filteredArticles.slice(0, 5).map((article) => (
                 <a
                   key={article.id}
                   href={`/blog/${article.slug}`}
                   className="block group"
                 >
                   <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                     {article.title}
                   </h4>
                   <p className="text-xs text-muted-foreground mt-1">
                     {new Date(article.created_at).toLocaleDateString('en-US', { 
                       month: 'short', 
                       day: 'numeric' 
                     })}
                   </p>
                 </a>
               ))}
             </div>
           )}
         </div>
       )}
     </aside>
   );
 };
 
 export default CategorySidebar;