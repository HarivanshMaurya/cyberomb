import { Link } from "react-router-dom";
import { ShoppingCart, BookOpen, ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  description?: string | null;
  image?: string | null;
  price: number;
  slug?: string | null;
  author?: string | null;
}

const ProductCard = ({ title, description, image, price, slug, author }: ProductCardProps) => {
  const content = (
    <div className="group relative rounded-3xl overflow-hidden bg-card border border-border/40 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
            <BookOpen className="w-14 h-14 text-muted-foreground/20" />
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3.5 py-1.5 rounded-xl bg-background/90 backdrop-blur-md text-foreground text-sm font-bold shadow-lg border border-border/30">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Floating arrow button */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Quick action on hover */}
        <div className="absolute bottom-4 left-4 right-16 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/90 backdrop-blur-md border border-border/30 text-sm font-semibold shadow-lg">
            <ShoppingCart className="w-3.5 h-3.5" />
            View Details
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-2">
        <h3 className="font-bold text-base leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        {author && (
          <p className="text-xs text-muted-foreground font-medium">
            by <span className="text-foreground/70">{author}</span>
          </p>
        )}
        {description && (
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (slug) {
    return <Link to={`/product/${slug}`} className="block">{content}</Link>;
  }

  return content;
};

export default ProductCard;
