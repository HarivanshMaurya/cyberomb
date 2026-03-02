import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const GlobalLanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      className="flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full hover:bg-muted/60 transition-all text-sm font-medium"
      aria-label="Toggle language"
      title={language === "en" ? "हिंदी में बदलें" : "Switch to English"}
    >
      <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="hidden sm:inline text-xs">
        {language === "en" ? "हि" : "EN"}
      </span>
    </button>
  );
};

export default GlobalLanguageToggle;
