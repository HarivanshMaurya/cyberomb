import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Eager-load only the landing page for fast first paint
import Index from "./pages/Index";

// Lazy-load everything else
const Article = lazy(() => import("./pages/Article"));
const Wellness = lazy(() => import("./pages/Wellness"));
const Travel = lazy(() => import("./pages/Travel"));
const Creativity = lazy(() => import("./pages/Creativity"));
const Growth = lazy(() => import("./pages/Growth"));
const About = lazy(() => import("./pages/About"));
const Authors = lazy(() => import("./pages/Authors"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Articles = lazy(() => import("./pages/Articles"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ReadBook = lazy(() => import("./pages/ReadBook"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const WellnessArticlePage = lazy(() => import("./pages/WellnessArticle"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const NavbarEditor = lazy(() => import("./pages/admin/NavbarEditor"));
const HeroEditor = lazy(() => import("./pages/admin/HeroEditor"));
const ArticlesList = lazy(() => import("./pages/admin/ArticlesList"));
const ArticleEditor = lazy(() => import("./pages/admin/ArticleEditor"));
const CategoriesManager = lazy(() => import("./pages/admin/CategoriesManager"));
const PagesList = lazy(() => import("./pages/admin/PagesList"));
const PageEditor = lazy(() => import("./pages/admin/PageEditor"));
const PageSectionsEditor = lazy(() => import("./pages/admin/PageSectionsEditor"));
const SectionCardsManager = lazy(() => import("./pages/admin/SectionCardsManager"));
const AuthorsManager = lazy(() => import("./pages/admin/AuthorsManager"));
const SiteSections = lazy(() => import("./pages/admin/SiteSections"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const SEOSettings = lazy(() => import("./pages/admin/SEOSettings"));
const ProductsManager = lazy(() => import("./pages/admin/ProductsManager"));
const SubscribersManager = lazy(() => import("./pages/admin/SubscribersManager"));
const ContactMessages = lazy(() => import("./pages/admin/ContactMessages"));
const DatabaseBrowser = lazy(() => import("./pages/admin/DatabaseBrowser"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AnalyticsDashboard = lazy(() => import("./pages/admin/AnalyticsDashboard"));
const SiteSettingsHub = lazy(() => import("./pages/admin/SiteSettingsHub"));
const WellnessArticlesList = lazy(() => import("./pages/admin/WellnessArticlesList"));
const WellnessArticleEditor = lazy(() => import("./pages/admin/WellnessArticleEditor"));
const Settings = lazy(() => import("./pages/admin/Settings"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/wellness/:slug" element={<WellnessArticlePage />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/creativity" element={<Creativity />} />
              <Route path="/growth" element={<Growth />} />
              <Route path="/about" element={<About />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/page/:slug" element={<DynamicPage />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/read/:slug" element={<ReadBook />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/404" element={<NotFound />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<Login />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="navbar" element={<NavbarEditor />} />
                <Route path="hero" element={<HeroEditor />} />
                <Route path="articles" element={<ArticlesList />} />
                <Route path="articles/:id" element={<ArticleEditor />} />
                <Route path="categories" element={<CategoriesManager />} />
                <Route path="pages" element={<PagesList />} />
                <Route path="pages/:id" element={<PageEditor />} />
                <Route path="page-sections" element={<PageSectionsEditor />} />
                <Route path="section-cards" element={<SectionCardsManager />} />
                <Route path="authors" element={<AuthorsManager />} />
                <Route path="sections" element={<SiteSections />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="seo" element={<SEOSettings />} />
                <Route path="products" element={<ProductsManager />} />
                <Route path="subscribers" element={<SubscribersManager />} />
                <Route path="contact-messages" element={<ContactMessages />} />
                <Route path="database" element={<DatabaseBrowser />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="site-settings" element={<SiteSettingsHub />} />
                <Route path="wellness-articles" element={<WellnessArticlesList />} />
                <Route path="wellness-articles/:id" element={<WellnessArticleEditor />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
