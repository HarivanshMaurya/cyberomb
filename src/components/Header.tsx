import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavbarConfig } from "@/hooks/useNavbarConfig";
import cyberomLogo from "@/assets/cyberom-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: navbarConfig } = useNavbarConfig();

  const siteName = navbarConfig?.site_name || 'Cyberom';
  const logoSrc = navbarConfig?.logo_url || cyberomLogo;
  const showLogo = navbarConfig?.show_logo ?? true;
  const showSiteName = navbarConfig?.show_site_name ?? true;
  const navLinks = (navbarConfig?.nav_links || [])
    .filter(l => l.visible)
    .sort((a, b) => a.order - b.order);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    if (shouldBeDark) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isAdminPage = location.pathname.startsWith('/admin');
  const isActive = (href: string) => location.pathname === href;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_3px_hsl(0_0%_0%/0.04)]' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            {showLogo && (
              <img src={logoSrc} alt={siteName} className="w-8 h-8 rounded-lg object-contain transition-transform duration-200 group-hover:scale-105" />
            )}
            {showSiteName && (
              <span className="text-base font-semibold tracking-tight">{siteName}</span>
            )}
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {!isAdminPage && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-1">
                    {isAdmin && (
                      <Button variant="ghost" size="sm" className="text-[13px] h-8 rounded-lg gap-1.5" onClick={() => navigate('/admin')}>
                        <LayoutDashboard className="h-3.5 w-3.5" />Dashboard
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-[13px] h-8 rounded-lg gap-1.5 text-muted-foreground" onClick={handleLogout}>
                      <LogOut className="h-3.5 w-3.5" />Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="hidden md:flex text-[13px] h-8 rounded-lg gap-1.5"
                    onClick={() => navigate('/login')}
                  >
                    <LogIn className="h-3.5 w-3.5" />Login
                  </Button>
                )}
              </>
            )}

            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/60 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.href) ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {!isAdminPage && (
                <div className="pt-2 mt-2 border-t border-border/50 space-y-1">
                  {user ? (
                    <>
                      {isAdmin && (
                        <Button variant="ghost" size="sm" className="w-full justify-start rounded-lg" onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />Dashboard
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="w-full justify-start rounded-lg text-muted-foreground" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                        <LogOut className="h-4 w-4 mr-2" />Logout
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="w-full rounded-lg" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                      <LogIn className="h-4 w-4 mr-2" />Login
                    </Button>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
