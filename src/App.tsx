import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { AuthProvider } from "@/contexts/AuthContext";
 import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
 import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Article from "./pages/Article";
import Wellness from "./pages/Wellness";
import Travel from "./pages/Travel";
import Creativity from "./pages/Creativity";
import Growth from "./pages/Growth";
import About from "./pages/About";
import Authors from "./pages/Authors";
import Contact from "./pages/Contact";
import StyleGuide from "./pages/StyleGuide";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Articles from "./pages/Articles";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HeroEditor from "./pages/admin/HeroEditor";
import ArticlesList from "./pages/admin/ArticlesList";
import ArticleEditor from "./pages/admin/ArticleEditor";
import PagesList from "./pages/admin/PagesList";
import PageEditor from "./pages/admin/PageEditor";
import SiteSections from "./pages/admin/SiteSections";
import MediaLibrary from "./pages/admin/MediaLibrary";
import SEOSettings from "./pages/admin/SEOSettings";
import Settings from "./pages/admin/Settings";
import DynamicPage from "./pages/DynamicPage";
import BlogArticle from "./pages/BlogArticle";
import CategoryPage from "./pages/CategoryPage";
import PageSectionsEditor from "./pages/admin/PageSectionsEditor";
import CategoriesManager from "./pages/admin/CategoriesManager";
import SectionCardsManager from "./pages/admin/SectionCardsManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
     <AuthProvider>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/article/:id" element={<Article />} />
             <Route path="/wellness" element={<Wellness />} />
             <Route path="/travel" element={<Travel />} />
             <Route path="/creativity" element={<Creativity />} />
             <Route path="/growth" element={<Growth />} />
             <Route path="/about" element={<About />} />
             <Route path="/authors" element={<Authors />} />
             <Route path="/contact" element={<Contact />} />
             <Route path="/style-guide" element={<StyleGuide />} />
             <Route path="/privacy" element={<Privacy />} />
             <Route path="/terms" element={<Terms />} />
             <Route path="/page/:slug" element={<DynamicPage />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
               <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
 
              {/* Admin Login - redirect to unified login */}
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
               <Route path="hero" element={<HeroEditor />} />
              <Route path="articles" element={<ArticlesList />} />
              <Route path="articles/:id" element={<ArticleEditor />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="pages" element={<PagesList />} />
              <Route path="pages/:id" element={<PageEditor />} />
              <Route path="page-sections" element={<PageSectionsEditor />} />
              <Route path="section-cards" element={<SectionCardsManager />} />
              <Route path="sections" element={<SiteSections />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="seo" element={<SEOSettings />} />
              <Route path="settings" element={<Settings />} />
            </Route>
 
             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
             <Route path="*" element={<NotFound />} />
           </Routes>
         </BrowserRouter>
       </TooltipProvider>
     </AuthProvider>
  </QueryClientProvider>
);

export default App;
