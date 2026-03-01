import { useState, useRef } from "react";
import { Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranslatedData {
  title: string;
  content: string;
  excerpt: string;
}

interface LanguageToggleProps {
  title: string;
  content: string;
  excerpt: string | null;
  onTranslated: (data: TranslatedData) => void;
  onReset: () => void;
  onLoadingChange: (loading: boolean) => void;
}

const LanguageToggle = ({ title, content, excerpt, onTranslated, onReset, onLoadingChange }: LanguageToggleProps) => {
  const [activeLang, setActiveLang] = useState<"en" | "hi">("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const cacheRef = useRef<TranslatedData | null>(null);

  const handleLanguageChange = async (lang: "en" | "hi") => {
    if (lang === activeLang || isTranslating) return;

    if (lang === "en") {
      setActiveLang("en");
      onReset();
      return;
    }

    // Use cache if available
    if (cacheRef.current) {
      setActiveLang("hi");
      onTranslated(cacheRef.current);
      return;
    }

    setIsTranslating(true);
    onLoadingChange(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-article", {
        body: { title, content, excerpt: excerpt || "", targetLang: "hi" },
      });

      if (error) throw error;

      const result: TranslatedData = {
        title: data.title || title,
        content: data.content || content,
        excerpt: data.excerpt || excerpt || "",
      };

      cacheRef.current = result;
      setActiveLang("hi");
      onTranslated(result);
      toast.success("Article translated to Hindi");
    } catch (err: any) {
      console.error("Translation failed:", err);
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
      onLoadingChange(false);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1 shadow-sm">
      <button
        onClick={() => handleLanguageChange("en")}
        disabled={isTranslating}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeLang === "en"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange("hi")}
        disabled={isTranslating}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeLang === "hi"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {isTranslating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Translating…
          </>
        ) : (
          <>
            <Languages className="w-3.5 h-3.5" />
            हिंदी
          </>
        )}
      </button>
    </div>
  );
};

export default LanguageToggle;
