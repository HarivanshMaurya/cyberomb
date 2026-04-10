import { Link } from "react-router-dom";
import { BookOpen, ArrowUpRight, Star, Eye } from "lucide-react";

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
    <div className="group relative rounded-2xl overflow-hidden bg-card/80 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            width={600}
            height={800}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
            <BookOpen className="w-14 h-14 text-muted-foreground/15" />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Top shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Price Badge - glass */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 rounded-xl bg-background/70 backdrop-blur-xl text-foreground text-xs font-bold shadow-lg border border-border/20">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {/* Quick action buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
            <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-bold shadow-lg">
              <Eye className="w-3.5 h-3.5" />
              View Details
            </div>
            <div className="w-9 h-9 rounded-xl bg-background/80 backdrop-blur-md flex items-center justify-center border border-border/20 shadow-lg">
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-1.5">
        <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        {author && (
          <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
            <Star className="w-3 h-3 text-primary/40" />
            <span className="text-foreground/60">{author}</span>
          </p>
        )}
        {description && (
          <p className="text-muted-foreground text-[11px] line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );

  if (slug) {
    return <Link to={`/product/${slug}`} className="block">{content}</Link>;
  }

  return content;
};

export default ProductCard;
