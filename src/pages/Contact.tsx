import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { Mail, MapPin, Phone, Send, MessageSquare, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { usePageSection } from "@/hooks/usePageSections";
import { supabase } from "@/integrations/supabase/client";
import PageBackground from "@/components/PageBackground";

const Contact = () => {
  const { data: pageSection } = usePageSection('contact');
  const content = pageSection?.content as Record<string, any> | null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      if (error) throw error;

      // Email notification is best-effort, don't block on it


      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    { icon: Mail, title: "Email", value: content?.email || "hello@cyberom.blog", sub: content?.email_sub || "We'll respond within 24 hours", color: "text-[#EA4335]", bg: "bg-[#EA4335]/10" },
    { icon: MapPin, title: "Location", value: content?.location || "India", sub: content?.location_sub || "Remote-first team", color: "text-accent", bg: "bg-accent/10" },
    { icon: Phone, title: "Phone", value: content?.phone || "+91 98765 43210", sub: content?.phone_sub || "Mon-Fri, 9am-6pm IST", color: "text-[#34A853]", bg: "bg-[#34A853]/10" },
  ];

  const defaultFaqs = [
    { q: "Can I contribute to Cyberom?", a: "Yes! We welcome guest contributions. Please use the form to submit your pitch or article idea." },
    { q: "How do I advertise with you?", a: "For advertising inquiries, email us with details about your brand and goals." },
    { q: "Can I republish your content?", a: "Please contact us for permissions and licensing. We're generally open to republishing with proper attribution." },
  ];
  const faqs = content?.faqs?.length ? content.faqs : defaultFaqs;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <SEOHead
        title="Contact Us"
        description="Have a question, suggestion, or just want to say hello? Get in touch with the Cyberom team."
        canonical="/contact"
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/60 mb-8 animate-slide-down">
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {content?.hero_badge || 'Contact'}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-down font-serif">
              {pageSection?.title || 'Get in Touch'}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-slide-up stagger-1">
              {pageSection?.subtitle || "Have a question, suggestion, or just want to say hello? We'd love to hear from you."}
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid sm:grid-cols-3 gap-4">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-card border border-border/40 hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-1">{item.title}</h3>
                <p className="font-semibold text-lg mb-0.5">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Form + FAQ Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="relative rounded-3xl bg-card border border-border/40 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-secondary to-accent" />
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Send className="w-4.5 h-4.5 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif">{content?.form_title || 'Send a Message'}</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold mb-2">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold mb-2">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-6 rounded-2xl text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {submitting ? 'Sending...' : (content?.button_text || 'Send Message')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MessageSquare className="w-4.5 h-4.5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold font-serif">{content?.faq_title || 'FAQ'}</h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq: any, i: number) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-card border border-border/40 overflow-hidden hover:border-accent/20 transition-colors duration-300"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-start justify-between gap-3 p-5 text-left"
                      >
                        <span className="font-semibold text-sm leading-snug">{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground transition-transform duration-300 ${
                            openFaq === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openFaq === i ? "max-h-40 pb-5" : "max-h-0"
                        }`}
                      >
                        <p className="px-5 text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
