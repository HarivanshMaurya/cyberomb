import { ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  size?: "small" | "large";
}

const ArticleCard = ({ id, title, category, date, image, size = "small" }: ArticleCardProps) => {
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

  return (
    <a
      href={`/blog/${id}`}
      className={`group block ${size === "large" ? "col-span-1 md:col-span-2 row-span-2" : ""}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-muted mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />

        {/* Arrow button */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getCategoryClass(category)}`}>
            {category}
          </span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <h3 className="text-base font-medium leading-snug group-hover:text-muted-foreground transition-colors line-clamp-2">
          {title}
        </h3>
      </div>
    </a>
  );
};

export default ArticleCard;
