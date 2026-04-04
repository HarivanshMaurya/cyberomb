import { useState } from "react";
import { Languages, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TranslatedData {
  title: string;
  content: string;
  excerpt: string;
}

interface LanguageToggleProps {
  articleId: string;
  title: string;
  content: string;
  excerpt: string | null;
  onTranslated: (data: TranslatedData) => void;
  onReset: () => void;
  onLoadingChange: (loading: boolean) => void;
}

const LanguageToggle = ({ articleId, title, content, excerpt, onTranslated, onReset, onLoadingChange }: LanguageToggleProps) => {
  const [activeLang, setActiveLang] = useState<string>("original");
  const [isTranslating, setIsTranslating] = useState(false);

  const { data: languages } = useQuery({
    queryKey: ['translation-languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translation_languages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === activeLang || isTranslating) return;

    if (langCode === "original") {
      setActiveLang("original");
      onReset();
      return;
    }

    // Check for cached translation in the article
    try {
      const { data: articleData } = await supabase
        .from('articles')
        .select('translations')
        .eq('id', articleId)
        .maybeSingle();

      const cached = articleData?.translations as Record<string, TranslatedData> | null;
      if (cached && cached[langCode]) {
        setActiveLang(langCode);
        onTranslated(cached[langCode]);
        return;
      }
    } catch {}

    // Translate via edge function
    setIsTranslating(true);
    onLoadingChange(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-article", {
        body: { title, content, excerpt: excerpt || "", targetLang: langCode },
      });

      if (error) throw error;

      const result: TranslatedData = {
        title: data.title || title,
        content: data.content || content,
        excerpt: data.excerpt || excerpt || "",
      };

      // Cache the translation in DB
      try {
        const { data: current } = await supabase
          .from('articles')
          .select('translations')
          .eq('id', articleId)
          .maybeSingle();
        
        const existing = (current?.translations as Record<string, TranslatedData>) || {};
        existing[langCode] = result;
        
        await supabase
          .from('articles')
          .update({ translations: existing as any })
          .eq('id', articleId);
      } catch {}

      setActiveLang(langCode);
      onTranslated(result);
      const langLabel = languages?.find(l => l.code === langCode)?.label || langCode;
      toast.success(`Translated to ${langLabel}`);
    } catch (err: any) {
      console.error("Translation failed:", err);
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
      onLoadingChange(false);
    }
  };

  const activeLabel = activeLang === "original" 
    ? "Original" 
    : languages?.find(l => l.code === activeLang)?.label || activeLang;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isTranslating}>
          <button className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted/40 transition-all">
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating…
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                {activeLabel}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          <DropdownMenuItem
            onClick={() => handleLanguageChange("original")}
            className={activeLang === "original" ? "bg-primary/10 font-semibold" : ""}
          >
            Original (English)
          </DropdownMenuItem>
          {languages?.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={activeLang === lang.code ? "bg-primary/10 font-semibold" : ""}
            >
              {lang.label} — {lang.sublabel}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageToggle;
