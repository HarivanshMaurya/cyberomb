import { Link } from "react-router-dom";
import { ShoppingCart, BookOpen } from "lucide-react";

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
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <BookOpen className="w-12 h-12 opacity-30" />
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1.5">
        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {author && (
          <p className="text-xs text-muted-foreground">by {author}</p>
        )}
        {description && (
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* View Details */}
        <div className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm">
          <ShoppingCart className="w-4 h-4" />
          View Details
        </div>
      </div>
    </div>
  );

  if (slug) {
    return <Link to={`/product/${slug}`}>{content}</Link>;
  }

  return content;
};

export default ProductCard;
