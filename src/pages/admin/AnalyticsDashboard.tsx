import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3, Users, Eye, BookOpen, Mail, Newspaper,
  TrendingUp, Clock, FileText
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { data: articles } = useQuery({
    queryKey: ['analytics-articles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('articles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: subscribers } = useQuery({
    queryKey: ['analytics-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: readingData } = useQuery({
    queryKey: ['analytics-reading'],
    queryFn: async () => {
      const { data, error } = await supabase.from('reading_analytics').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ['analytics-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ['analytics-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const publishedArticles = articles?.filter(a => a.status === 'published') ?? [];
  const draftArticles = articles?.filter(a => a.status === 'draft') ?? [];
  const totalReadingTime = readingData?.reduce((sum, r) => sum + r.total_reading_time_seconds, 0) ?? 0;
  const avgCompletion = readingData?.length
    ? Math.round(readingData.reduce((sum, r) => sum + Number(r.completion_percent), 0) / readingData.length)
    : 0;

  const thisMonthSubs = subscribers?.filter(s => {
    const d = new Date(s.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }) ?? [];

  // Category distribution
  const categoryCount: Record<string, number> = {};
  articles?.forEach(a => {
    categoryCount[a.category] = (categoryCount[a.category] ?? 0) + 1;
  });
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Subscriber interest distribution
  const interestCount: Record<string, number> = {};
  subscribers?.forEach(s => {
    (s.categories as string[] || []).forEach((cat: string) => {
      interestCount[cat] = (interestCount[cat] ?? 0) + 1;
    });
  });

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Overview of your content performance and audience</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Articles', value: articles?.length ?? 0, icon: Newspaper, desc: `${publishedArticles.length} published` },
          { title: 'Subscribers', value: subscribers?.length ?? 0, icon: Mail, desc: `+${thisMonthSubs.length} this month` },
          { title: 'Registered Users', value: profiles?.length ?? 0, icon: Users, desc: 'Total accounts' },
          { title: 'Books/Products', value: products?.length ?? 0, icon: BookOpen, desc: 'In catalog' },
        ].map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reading Time</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTime(totalReadingTime)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all readers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Completion</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCompletion}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${avgCompletion}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Readers</CardTitle>
            <Eye className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{readingData?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Reading sessions tracked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Articles by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {topCategories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data</p>
            ) : (
              <div className="space-y-3">
                {topCategories.map(([cat, count]) => {
                  const pct = Math.round((count / (articles?.length ?? 1)) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{cat}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscriber Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscriber Interests</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(interestCount).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(interestCount)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => {
                    const pct = Math.round((count / (subscribers?.length ?? 1)) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{cat}</span>
                          <span className="text-muted-foreground">{count} subscribers ({pct}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-accent rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Published Articles</span>
                </div>
                <Badge>{publishedArticles.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm font-medium">Draft Articles</span>
                </div>
                <Badge variant="secondary">{draftArticles.length}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm font-medium">Active Subscribers</span>
                </div>
                <Badge>{subscribers?.filter(s => s.is_active).length ?? 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscribers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            {!subscribers?.length ? (
              <p className="text-muted-foreground text-center py-4">No subscribers yet</p>
            ) : (
              <div className="space-y-3">
                {subscribers.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm truncate max-w-[200px]">{sub.email}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
