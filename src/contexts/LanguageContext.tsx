import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Header Nav
  "nav.home": { en: "Home", hi: "होम" },
  "nav.articles": { en: "Articles", hi: "लेख" },
  "nav.wellness": { en: "Wellness", hi: "स्वास्थ्य" },
  "nav.travel": { en: "Travel", hi: "यात्रा" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.login": { en: "Login", hi: "लॉगिन" },
  "nav.logout": { en: "Logout", hi: "लॉगआउट" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },

  // Index page
  "home.featured": { en: "Featured Articles", hi: "विशेष लेख" },
  "home.viewAll": { en: "View all →", hi: "सभी देखें →" },
  "home.stayInspired": { en: "Stay inspired.", hi: "प्रेरित रहें।" },
  "home.subscribeDesc": { en: "Subscribe to receive our latest articles and insights directly in your inbox.", hi: "हमारे नवीनतम लेख और जानकारी सीधे अपने इनबॉक्स में प्राप्त करने के लिए सब्सक्राइब करें।" },
  "home.subscribe": { en: "Subscribe", hi: "सब्सक्राइब" },
  "home.emailPlaceholder": { en: "Your email", hi: "आपका ईमेल" },

  // Footer
  "footer.explore": { en: "Explore", hi: "एक्सप्लोर" },
  "footer.about": { en: "About", hi: "जानकारी" },
  "footer.resources": { en: "Resources", hi: "संसाधन" },
  "footer.legal": { en: "Legal", hi: "कानूनी" },
  "footer.ourStory": { en: "Our Story", hi: "हमारी कहानी" },
  "footer.authors": { en: "Authors", hi: "लेखक" },
  "footer.contact": { en: "Contact", hi: "संपर्क" },
  "footer.styleGuide": { en: "Style Guide", hi: "स्टाइल गाइड" },
  "footer.newsletter": { en: "Newsletter", hi: "न्यूज़लेटर" },
  "footer.privacy": { en: "Privacy Policy", hi: "गोपनीयता नीति" },
  "footer.terms": { en: "Terms of Service", hi: "सेवा की शर्तें" },

  // Blog Article
  "blog.backToArticles": { en: "Back to articles", hi: "लेखों पर वापस जाएं" },
  "blog.enjoyed": { en: "Enjoyed this article?", hi: "यह लेख पसंद आया?" },
  "blog.subscribeMore": { en: "Subscribe to receive more insights like this directly in your inbox.", hi: "इस तरह की और जानकारी सीधे अपने इनबॉक्स में प्राप्त करने के लिए सब्सक्राइब करें।" },
  "blog.relatedArticles": { en: "You might also like", hi: "आपको यह भी पसंद आ सकता है" },

  // Articles page
  "articles.title": { en: "All Articles", hi: "सभी लेख" },
  "articles.search": { en: "Search articles...", hi: "लेख खोजें..." },

  // Common
  "common.readMore": { en: "Read more", hi: "और पढ़ें" },
  "common.minRead": { en: "min read", hi: "मिनट पढ़ें" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("site-language");
    return (saved === "hi" ? "hi" : "en") as Language;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("site-language", lang);
  }, []);

  const t = useCallback((key: string) => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
