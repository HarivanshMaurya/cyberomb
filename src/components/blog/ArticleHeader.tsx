import { toast } from "sonner";
import ShareButtons from "./ShareButtons";
 
interface ArticleHeaderProps {
  title: string;
  excerpt: string | null;
  category: string;
  authorName: string | null;
  authorImage: string | null;
  authorId?: string | null;
  formattedDate: string;
  readTime: string | null;
  getCategoryClass: (cat: string) => string;
}
 
const ArticleHeader = ({
  title,
  excerpt,
  category,
  authorName,
  authorImage,
  formattedDate,
  readTime,
  getCategoryClass,
}: ArticleHeaderProps) => {
   const handleCopyLink = () => {
     navigator.clipboard.writeText(window.location.href);
     toast.success("Link copied to clipboard!");
   };
 
   return (
     <div className="mb-12 animate-slide-up">
       <div className="flex items-center gap-3 mb-6 flex-wrap">
         <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryClass(category)}`}>
           {category}
         </span>
         <span className="text-sm text-muted-foreground">{formattedDate}</span>
         {readTime && (
           <>
             <span className="text-sm text-muted-foreground">•</span>
             <span className="text-sm text-muted-foreground">{readTime}</span>
           </>
         )}
       </div>
 
       <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
         {title}
       </h1>
       
       {excerpt && (
         <p className="text-xl text-muted-foreground mb-8">
           {excerpt}
         </p>
       )}
 
       {/* Author Info */}
       <div className="flex items-center justify-between border-t border-b border-border py-6">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {authorImage ? (
                <img src={authorImage} alt={authorName || 'Author'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">
                  {authorName?.charAt(0) || 'A'}
                </span>
              )}
            </div>
           <div>
             <p className="font-semibold">{authorName || 'Anonymous'}</p>
             <p className="text-sm text-muted-foreground">Author</p>
           </div>
         </div>
 
          <ShareButtons title={title} variant="inline" />
       </div>
     </div>
   );
 };
 
 export default ArticleHeader;