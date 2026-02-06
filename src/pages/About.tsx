import Header from "@/components/Header";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageSection } from "@/hooks/usePageSections";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutContent {
  story_title?: string;
  story_content?: string;
  mission_title?: string;
  mission_content?: string;
  mission_points?: string[];
  values?: Array<{ title: string; description: string }>;
  cta_title?: string;
  cta_description?: string;
}

const About = () => {
  const { data: pageData, isLoading } = usePageSection('about');
  const content = pageData?.content as AboutContent | undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-16 text-center space-y-6">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-8 w-full max-w-2xl mx-auto" />
          </div>
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-down">
            {pageData?.title || 'About Cyberom'}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed animate-slide-up stagger-1">
            {pageData?.subtitle || 'A space for exploring ideas, finding inspiration, and discovering new ways of seeing the world.'}
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-16 space-y-6 text-muted-foreground animate-slide-up stagger-2">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {content?.story_title || 'Our Story'}
          </h2>
          {(content?.story_content || '').split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        {/* Mission Section */}
        <section className="mb-16 rounded-2xl bg-card p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">
            {content?.mission_title || 'Our Mission'}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>{content?.mission_content || ''}</p>
            {content?.mission_points && content.mission_points.length > 0 && (
              <ul className="space-y-3 ml-6">
                {content.mission_points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Values Section */}
        {content?.values && content.values.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.values.map((value, index) => (
                <div key={index} className="p-6 rounded-xl bg-muted">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="text-center py-12 rounded-2xl bg-card">
          <h2 className="text-3xl font-bold mb-4">
            {content?.cta_title || 'Join Our Community'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {content?.cta_description || 'Subscribe to receive our latest articles, insights, and inspiration directly in your inbox.'}
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
            <Mail className="mr-2 h-4 w-4" />
            Subscribe Now
          </Button>
        </section>
      </main>
    </div>
  );
};

export default About;
