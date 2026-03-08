import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useArticles } from '@/hooks/useArticles';
import { usePages } from '@/hooks/usePages';
import { useMedia } from '@/hooks/useMedia';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeInvalidation } from '@/hooks/useRealtimeQuery';
import {
  Newspaper, FileText, Image, Globe, Mail, Users, BookOpen,
  ShoppingCart, MessageSquare, TrendingUp, Clock, Plus,
  ArrowUpRight, Activity, Eye, Heart, BarChart3, Zap,
  CalendarDays, Sparkles, ExternalLink, PenLine, Settings,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: articles } = useArticles();
  const { data: pages } = usePages();
  const { data: media } = useMedia();

  const { data: subscribers } = useQuery({
    queryKey: ['dash-subscribers'],
    queryFn: async () => {
      const { data } = await supabase.from('newsletter_subscribers').select('*');
      return data ?? [];
    },
  });

  const { data: products } = useQuery({
    queryKey: ['dash-products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*');
      return data ?? [];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ['dash-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data ?? [];
    },
  });

  const { data: contactMessages } = useQuery({
    queryKey: ['dash-contacts'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_messages').select('*');
      return data ?? [];
    },
  });

  const { data: wellnessArticles } = useQuery({
    queryKey: ['dash-wellness'],
    queryFn: async () => {
      const { data } = await supabase.from('wellness_articles').select('*');
      return data ?? [];
    },
  });

  const { data: readingData } = useQuery({
    queryKey: ['dash-reading'],
    queryFn: async () => {
      const { data } = await supabase.from('reading_analytics').select('*');
      return data ?? [];
    },
  });

  // Real-time subscriptions — auto-invalidate on DB changes
  useRealtimeInvalidation('articles', ['dash-articles']);
  useRealtimeInvalidation('newsletter_subscribers', ['dash-subscribers']);
  useRealtimeInvalidation('contact_messages', ['dash-contacts']);
  useRealtimeInvalidation('products', ['dash-products']);
  useRealtimeInvalidation('wellness_articles', ['dash-wellness']);
  useRealtimeInvalidation('profiles', ['dash-profiles']);

  const publishedArticles = articles?.filter(a => a.status === 'published') ?? [];
  const draftArticles = articles?.filter(a => a.status === 'draft') ?? [];
  const unreadMessages = contactMessages?.filter(m => !m.is_read) ?? [];
  const activeProducts = products?.filter(p => p.is_active) ?? [];
  const totalContent = (articles?.length ?? 0) + (wellnessArticles?.length ?? 0);

  const thisMonthSubs = useMemo(() => {
    const now = new Date();
    return subscribers?.filter(s => {
      const d = new Date(s.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }) ?? [];
  }, [subscribers]);

  const avgCompletion = readingData?.length
    ? Math.round(readingData.reduce((sum, r) => sum + Number(r.completion_percent), 0) / readingData.length)
    : 0;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const recentArticles = articles?.slice(0, 5) ?? [];
  const recentWellness = wellnessArticles?.slice(0, 3) ?? [];

  const quickActions = [
    { label: 'New Article', icon: PenLine, href: '/admin/articles/new' },
    { label: 'Add Product', icon: ShoppingCart, href: '/admin/products' },
    { label: 'Media Library', icon: Image, href: '/admin/media' },
    { label: 'Site Settings', icon: Settings, href: '/admin/site-settings' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-6 md:p-8">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {greeting} 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's what's happening with your site today
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Live Updates
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map(action => (
                <Link key={action.label} to={action.href}>
                  <Button variant="outline" size="sm" className="gap-2 bg-background/80 backdrop-blur-sm hover:bg-background">
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Content"
          value={totalContent}
          subtitle={`${publishedArticles.length} published`}
          icon={Newspaper}
          href="/admin/articles"
          trend={publishedArticles.length > 0 ? 'up' : undefined}
        />
        <KPICard
          title="Subscribers"
          value={subscribers?.length ?? 0}
          subtitle={`+${thisMonthSubs.length} this month`}
          icon={Mail}
          href="/admin/subscribers"
          trend={thisMonthSubs.length > 0 ? 'up' : undefined}
        />
        <KPICard
          title="Registered Users"
          value={profiles?.length ?? 0}
          subtitle="Total accounts"
          icon={Users}
          href="/admin/users"
        />
        <KPICard
          title="Products"
          value={products?.length ?? 0}
          subtitle={`${activeProducts.length} active`}
          icon={BookOpen}
          href="/admin/products"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat icon={FileText} label="Pages" value={pages?.length ?? 0} />
        <MiniStat icon={Image} label="Media Files" value={media?.length ?? 0} />
        <MiniStat icon={MessageSquare} label="Messages" value={contactMessages?.length ?? 0} badge={unreadMessages.length > 0 ? `${unreadMessages.length} new` : undefined} />
        <MiniStat icon={Heart} label="Wellness Posts" value={wellnessArticles?.length ?? 0} />
      </div>

      {/* Reading & Engagement Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Read Completion</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCompletion}%</div>
            <Progress value={avgCompletion} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">{readingData?.length ?? 0} reading sessions</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content Status</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <StatusBar label="Published" count={publishedArticles.length} total={totalContent} variant="primary" />
              <StatusBar label="Drafts" count={draftArticles.length} total={totalContent} variant="warning" />
              <StatusBar label="Wellness" count={wellnessArticles?.filter(a => a.status === 'published').length ?? 0} total={totalContent} variant="accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unreadMessages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">out of {contactMessages?.length ?? 0} total</p>
            {unreadMessages.length > 0 && (
              <Link to="/admin/contact-messages">
                <Button variant="outline" size="sm" className="mt-3 w-full gap-2 text-xs">
                  <Eye className="h-3 w-3" /> View Messages
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                Recent Articles
              </CardTitle>
              <CardDescription>Latest content across your site</CardDescription>
            </div>
            <Link to="/admin/articles">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentArticles.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">No articles yet</p>
                <Link to="/admin/articles/new">
                  <Button size="sm" className="mt-3 gap-2">
                    <Plus className="h-4 w-4" /> Create First Article
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentArticles.map(article => (
                  <Link key={article.id} to={`/admin/articles/${article.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors group cursor-pointer">
                      {article.featured_image ? (
                        <img src={article.featured_image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6 text-primary/50" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-primary transition-colors">{article.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground capitalize">{article.category}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(article.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="shrink-0">
                        {article.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Subscribers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                New Subscribers
              </CardTitle>
              <Link to="/admin/subscribers">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!subscribers?.length ? (
                <p className="text-muted-foreground text-center py-4 text-sm">No subscribers yet</p>
              ) : (
                <div className="space-y-2.5">
                  {subscribers.slice(0, 5).map(sub => (
                    <div key={sub.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{sub.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(sub.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      {sub.is_active ? (
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wellness Articles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Wellness Posts
              </CardTitle>
              <Link to="/admin/wellness-articles">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  All <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentWellness.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-sm">No wellness articles</p>
              ) : (
                <div className="space-y-2.5">
                  {recentWellness.map(article => (
                    <div key={article.id} className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <p className="text-sm font-medium truncate">{article.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                        <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {article.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Navigation Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Navigation
          </CardTitle>
          <CardDescription>Jump to any section of your CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Articles', icon: Newspaper, href: '/admin/articles' },
              { label: 'Wellness', icon: Heart, href: '/admin/wellness-articles' },
              { label: 'Pages', icon: FileText, href: '/admin/pages' },
              { label: 'Products', icon: ShoppingCart, href: '/admin/products' },
              { label: 'Media', icon: Image, href: '/admin/media' },
              { label: 'Subscribers', icon: Mail, href: '/admin/subscribers' },
              { label: 'Messages', icon: MessageSquare, href: '/admin/contact-messages' },
              { label: 'Users', icon: Users, href: '/admin/users' },
              { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
              { label: 'SEO', icon: Globe, href: '/admin/seo' },
              { label: 'Settings', icon: Settings, href: '/admin/settings' },
              { label: 'Site Settings', icon: TrendingUp, href: '/admin/site-settings' },
            ].map(item => (
              <Link key={item.label} to={item.href}>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer group text-center">
                  <item.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Sub-components ── */

function KPICard({ title, value, subtitle, icon: Icon, href, trend }: {
  title: string; value: number; subtitle: string; icon: any; href: string; trend?: 'up' | 'down';
}) {
  return (
    <Link to={href}>
      <Card className="relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{value}</span>
            {trend === 'up' && (
              <span className="flex items-center text-xs font-medium text-green-600 mb-1">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function MiniStat({ icon: Icon, label, value, badge }: {
  icon: any; label: string; value: number; badge?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
      {badge && <Badge variant="destructive" className="text-xs shrink-0">{badge}</Badge>}
    </div>
  );
}

function StatusBar({ label, count, total, variant }: {
  label: string; count: number; total: number; variant: 'primary' | 'warning' | 'accent';
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = {
    primary: 'bg-primary',
    warning: 'bg-yellow-500',
    accent: 'bg-accent',
  };
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{count} ({pct}%)</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className={`${colors[variant]} rounded-full h-1.5 transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
