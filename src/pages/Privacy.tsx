import Header from "@/components/Header";
import SEOHead, { buildBreadcrumbJsonLd, SITE_URL } from "@/components/SEOHead";
import { Shield, Eye, Database, Cookie, Lock, UserCheck, ExternalLink, Baby, RefreshCw, Mail } from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "Introduction",
    content: "At Cyberom, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and subscribe to our newsletter.",
  },
  {
    icon: Database,
    title: "Information We Collect",
    content: "We may collect personal information that you voluntarily provide to us when you interact with our services.",
    subsections: [
      {
        subtitle: "Personal Information",
        list: [
          "Subscribe to our newsletter",
          "Contact us through our contact form",
          "Comment on our articles",
          "Create an account on our website",
        ],
        note: "This information may include your name, email address, and any other information you choose to provide.",
      },
      {
        subtitle: "Automatically Collected Information",
        text: "When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies installed on your device.",
      },
    ],
  },
  {
    icon: Shield,
    title: "How We Use Your Information",
    content: "We use the information we collect to:",
    list: [
      "Send you our newsletter and marketing communications",
      "Respond to your comments and questions",
      "Improve our website and content",
      "Analyze usage patterns and trends",
      "Protect against fraudulent or illegal activity",
    ],
  },
  {
    icon: Cookie,
    title: "Cookies and Tracking Technologies",
    content: "We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content: "We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    content: "Depending on your location, you may have certain rights regarding your personal information, including:",
    list: [
      "The right to access your personal information",
      "The right to rectification of inaccurate information",
      "The right to erasure of your personal information",
      "The right to withdraw consent",
      "The right to data portability",
    ],
  },
  {
    icon: ExternalLink,
    title: "Third-Party Services",
    content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices of these third-party sites. We encourage you to read their privacy policies.",
  },
  {
    icon: Baby,
    title: "Children's Privacy",
    content: "Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.",
  },
  {
    icon: RefreshCw,
    title: "Changes to This Privacy Policy",
    content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date.",
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Policy"
        description="Learn how Cyberom collects, uses, and protects your personal information. We value transparency and your data rights."
        canonical="/privacy"
        noindex={false}
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Privacy Policy", url: "/privacy" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: "Learn how Cyberom collects, uses, and protects your personal information.",
            url: `${SITE_URL}/privacy`,
            dateModified: "2025-03-20",
            inLanguage: "en-US",
            isPartOf: { "@type": "WebSite", name: "Cyberom", url: SITE_URL },
          },
        ]}
      />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20 py-20 md:py-28">
        <div className="absolute top-10 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-down">
            <Lock className="w-4 h-4" />
            Your Data, Your Rights
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            We believe in transparency. Here's exactly how we handle your data and protect your privacy.
          </p>
          <p className="mt-6 text-sm text-muted-foreground/70 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Last updated: March 20, 2025
          </p>
        </div>
      </section>

      {/* Quick Nav */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {sections.slice(0, 6).map((s, i) => (
              <a
                key={i}
                href={`#privacy-${i}`}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all whitespace-nowrap"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <section
                key={index}
                id={`privacy-${index}`}
                className="group relative rounded-2xl border border-border bg-card p-8 md:p-10 hover:shadow-lg hover:border-primary/20 transition-all duration-300 scroll-mt-20 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-md">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex items-start gap-5">
                  <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-primary/10 items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">{section.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>

                    {section.list && (
                      <ul className="space-y-2 ml-1">
                        {section.list.map((item, li) => (
                          <li key={li} className="flex items-start gap-3 text-muted-foreground">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.subsections?.map((sub, si) => (
                      <div key={si} className="mt-4 p-5 rounded-xl bg-muted/40 border border-border/50 space-y-3">
                        <h3 className="font-semibold text-base">{sub.subtitle}</h3>
                        {sub.text && <p className="text-muted-foreground text-sm leading-relaxed">{sub.text}</p>}
                        {sub.list && (
                          <ul className="space-y-1.5 ml-1">
                            {sub.list.map((item, li) => (
                              <li key={li} className="flex items-start gap-3 text-muted-foreground text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        {sub.note && <p className="text-muted-foreground text-sm">{sub.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-primary/20 p-10 md:p-14 text-center animate-scale-in">
          <div className="inline-flex items-center gap-2 w-14 h-14 rounded-2xl bg-primary/15 justify-center mb-6">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Privacy Questions?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
            If you have any questions about this Privacy Policy or how we handle your data, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </a>
            <a
              href="/terms"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-border bg-card font-medium hover:bg-muted transition-all"
            >
              <Shield className="w-4 h-4" />
              Terms of Service
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
