import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      <main className="flex items-center justify-center px-4 py-24 md:py-32">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-6xl font-bold font-serif mb-2 text-foreground">404</h1>
            <p className="text-xl text-muted-foreground">Page not found</p>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="outline" className="rounded-xl gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
