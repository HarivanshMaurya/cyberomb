import { ExternalLink, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  title: string;
  description?: string | null;
  image?: string | null;
  price: number;
  buyLink: string;
}

const ProductCard = ({ title, description, image, price, buyLink }: ProductCardProps) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 opacity-30" />
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
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Buy Button */}
        <a
          href={buyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Buy Now
          <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-60" />
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
