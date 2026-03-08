import { useState } from "react";
import { Facebook, Twitter, Linkedin, Link2, Mail, MessageCircle, Share2, Check, X } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  variant?: "inline" | "floating";
}

const ShareButtons = ({ title, variant = "inline" }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch { /* user cancelled */ }
    } else {
      setIsOpen(true);
    }
  };

  const shareLinks = [
    {
      name: "Twitter / X",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/30",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      color: "hover:bg-accent hover:text-accent-foreground hover:border-accent",
    },
  ];

  // Desktop inline version
  if (variant === "inline") {
    return (
      <div className="hidden md:flex items-center gap-1.5">
        {shareLinks.slice(0, 4).map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative w-10 h-10 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${link.color}`}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {link.name}
            </span>
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className={`group relative w-10 h-10 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
            copied 
              ? "border-green-500/50 bg-green-500/10 text-green-500" 
              : "hover:bg-accent hover:border-accent hover:text-accent-foreground"
          }`}
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4 animate-in zoom-in duration-200" />
          ) : (
            <Link2 className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
          )}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {copied ? "Copied!" : "Copy link"}
          </span>
        </button>
      </div>
    );
  }

  // Mobile floating version
  return (
    <div className="md:hidden mb-12">
      {/* Share trigger button */}
      <button
        onClick={handleNativeShare}
        className="w-full py-3.5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-semibold">Share this article</span>
      </button>

      {/* Expanded share panel */}
      {isOpen && (
        <div className="mt-3 p-4 rounded-2xl bg-card border border-border/60 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share via</span>
            <button onClick={() => setIsOpen(false)} className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-transparent transition-all duration-300 ${link.color}`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{link.name.split(" ")[0]}</span>
              </a>
            ))}
          </div>
          <button
            onClick={handleCopyLink}
            className={`mt-3 w-full py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium ${
              copied
                ? "border-green-500/50 bg-green-500/10 text-green-500"
                : "border-border/60 hover:border-primary/30 hover:bg-muted"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
