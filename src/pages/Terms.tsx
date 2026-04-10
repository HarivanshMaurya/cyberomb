import Header from "@/components/Header";
import SEOHead, { buildBreadcrumbJsonLd, SITE_URL } from "@/components/SEOHead";
import { Shield, FileText, Users, AlertTriangle, Lock, Globe, RefreshCw, Scale, Mail, ExternalLink } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "Agreement to Terms",
    content: "By accessing or using Cyberom's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.",
  },
  {
    icon: Lock,
    title: "Use License",
    content: "Permission is granted to temporarily access the materials on Cyberom's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.",
    list: [
      "Modify or copy the materials",
      "Use the materials for any commercial purpose or public display",
      "Attempt to decompile or reverse engineer any software on our website",
      "Remove any copyright or proprietary notations from the materials",
      "Transfer the materials to another person or mirror on any other server",
    ],
    listLabel: "Under this license you may not:",
  },
  {
    icon: Users,
    title: "User Content",
    content: "When you post comments or other content on our website, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content. You represent that you own or have the necessary rights to the content you post.",
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Uses",
    content: "You may not use our website:",
    list: [
      "In any way that violates any applicable law or regulation",
      "To transmit any harmful or malicious code",
      "To impersonate or attempt to impersonate Cyberom or any employee",
      "To harass, abuse, or harm another person",
      "To spam or send unsolicited communications",
    ],
  },
  {
    icon: Shield,
    title: "Intellectual Property",
    content: "All content on Cyberom, including articles, images, logos, and designs, is the property of Cyberom or its content creators and is protected by international copyright laws. Unauthorized use of our content may violate copyright, trademark, and other laws.",
  },
  {
    icon: Scale,
    title: "Disclaimer",
    content: "The materials on Cyberom's website are provided on an \"as is\" basis. Cyberom makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.",
  },
  {
    icon: AlertTriangle,
    title: "Limitations of Liability",
    content: "In no event shall Cyberom or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Cyberom's website.",
  },
  {
    icon: ExternalLink,
    title: "Links to Other Websites",
    content: "Our website may contain links to third-party websites that are not owned or controlled by Cyberom. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.",
  },
  {
    icon: RefreshCw,
    title: "Modifications",
    content: "Cyberom may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the current version of these Terms of Service.",
  },
  {
    icon: Globe,
    title: "Governing Law",
    content: "These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Terms of Service"
        description="Read the terms and conditions for using the Cyberom website. Understand your rights and responsibilities."
        canonical="/terms"
        noindex={false}
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Terms of Service", url: "/terms" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description: "Read the terms and conditions for using the Cyberom website.",
            url: `${SITE_URL}/terms`,
            dateModified: "2025-03-20",
            inLanguage: "en-US",
            isPartOf: { "@type": "WebSite", name: "Cyberom", url: SITE_URL },
          },
        ]}
      />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-secondary/20 py-20 md:py-28">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-down">
            <Shield className="w-4 h-4" />
            Legal Document
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Please read these terms carefully before using our services. Your access and use of Cyberom is subject to these terms.
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
                href={`#section-${i}`}
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
                id={`section-${index}`}
                className="group relative rounded-2xl border border-border bg-card p-8 md:p-10 hover:shadow-lg hover:border-primary/20 transition-all duration-300 scroll-mt-20 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Number badge */}
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
                    {section.listLabel && (
                      <p className="text-sm font-medium text-foreground">{section.listLabel}</p>
                    )}
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
            If you have any questions about these Terms of Service, please don't hesitate to reach out to us.
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
              href="/privacy"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-border bg-card font-medium hover:bg-muted transition-all"
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
