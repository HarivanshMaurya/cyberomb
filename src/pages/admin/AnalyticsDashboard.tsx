import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell,
  AreaChart, Area, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import {
  BarChart3, Users, Eye, BookOpen, Mail, Newspaper,
  TrendingUp, Clock, FileText, Activity, Zap, Target,
  ArrowUpRight, ArrowDownRight, CalendarDays, Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(24, 70%, 55%)',
  'hsl(142, 50%, 45%)',
  'hsl(280, 50%, 55%)',
  'hsl(200, 60%, 50%)',
];

export default function AnalyticsDashboard() {
  const { data: articles } = useQuery({
    queryKey: ['analytics-articles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('articles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: wellnessArticles } = useQuery({
    queryKey: ['analytics-wellness'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wellness_articles').select('*');
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

  const { data: contactMessages } = useQuery({
    queryKey: ['analytics-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_messages').select('*');
      if (error) throw error;
      return data;
    },
  });

  // Computed stats
  const publishedArticles = articles?.filter(a => a.status === 'published') ?? [];
  const draftArticles = articles?.filter(a => a.status === 'draft') ?? [];
  const totalContent = (articles?.length ?? 0) + (wellnessArticles?.length ?? 0);
  const totalReadingTime = readingData?.reduce((sum, r) => sum + r.total_reading_time_seconds, 0) ?? 0;
  const avgCompletion = readingData?.length
    ? Math.round(readingData.reduce((sum, r) => sum + Number(r.completion_percent), 0) / readingData.length)
    : 0;

  const thisMonthSubs = subscribers?.filter(s => {
    const d = new Date(s.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }) ?? [];

  const lastMonthSubs = subscribers?.filter(s => {
    const d = new Date(s.created_at);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
  }) ?? [];

  const subGrowth = lastMonthSubs.length > 0
    ? Math.round(((thisMonthSubs.length - lastMonthSubs.length) / lastMonthSubs.length) * 100)
    : thisMonthSubs.length > 0 ? 100 : 0;

  // Category distribution for bar chart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    articles?.forEach(a => { counts[a.category] = (counts[a.category] ?? 0) + 1; });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }));
  }, [articles]);

  // Content over time (last 6 months)
  const contentTimeline = useMemo(() => {
    const months: Record<string, { articles: number; wellness: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      months[key] = { articles: 0, wellness: 0 };
    }
    articles?.forEach(a => {
      const d = new Date(a.created_at);
      const key = d.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      if (months[key]) months[key].articles++;
    });
    wellnessArticles?.forEach(a => {
      const d = new Date(a.created_at);
      const key = d.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      if (months[key]) months[key].wellness++;
    });
    return Object.entries(months).map(([month, data]) => ({ month, ...data }));
  }, [articles, wellnessArticles]);

  // Subscriber growth over time
  const subTimeline = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }
    subscribers?.forEach(s => {
      const d = new Date(s.created_at);
      const key = d.toLocaleDateString('en', { month: 'short', year: '2-digit' });
      if (months[key] !== undefined) months[key]++;
    });
    let cumulative = subscribers?.filter(s => {
      const d = new Date(s.created_at);
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      return d < cutoff;
    }).length ?? 0;
    return Object.entries(months).map(([month, count]) => {
      cumulative += count;
      return { month, newSubs: count, total: cumulative };
    });
  }, [subscribers]);

  // Content status for pie chart
  const statusData = useMemo(() => [
    { name: 'Published', value: publishedArticles.length, fill: CHART_COLORS[0] },
    { name: 'Drafts', value: draftArticles.length, fill: CHART_COLORS[1] },
    { name: 'Wellness', value: wellnessArticles?.filter(a => a.status === 'published').length ?? 0, fill: CHART_COLORS[3] },
  ].filter(d => d.value > 0), [publishedArticles, draftArticles, wellnessArticles]);

  // Reading engagement
  const readingEngagement = useMemo(() => {
    if (!readingData?.length) return [];
    const buckets = [
      { range: '0-25%', min: 0, max: 25, count: 0 },
      { range: '26-50%', min: 26, max: 50, count: 0 },
      { range: '51-75%', min: 51, max: 75, count: 0 },
      { range: '76-100%', min: 76, max: 100, count: 0 },
    ];
    readingData.forEach(r => {
      const pct = Number(r.completion_percent);
      const bucket = buckets.find(b => pct >= b.min && pct <= b.max);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [readingData]);

  // Subscriber interests
  const interestData = useMemo(() => {
    const counts: Record<string, number> = {};
    subscribers?.forEach(s => {
      (s.categories as string[] || []).forEach((cat: string) => {
        counts[cat] = (counts[cat] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [subscribers]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const chartConfig = {
    articles: { label: 'Articles', color: CHART_COLORS[0] },
    wellness: { label: 'Wellness', color: CHART_COLORS[3] },
    count: { label: 'Count', color: CHART_COLORS[0] },
    newSubs: { label: 'New', color: CHART_COLORS[0] },
    total: { label: 'Total', color: CHART_COLORS[2] },
    value: { label: 'Readers', color: CHART_COLORS[0] },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Activity className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          </div>
          <p className="text-muted-foreground ml-14">Real-time overview of your content, audience & engagement</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
          <CalendarDays className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Content"
          value={totalContent}
          desc={`${publishedArticles.length} published`}
          icon={Newspaper}
          trend={publishedArticles.length > 0 ? 'up' : undefined}
          color="primary"
        />
        <KPICard
          title="Subscribers"
          value={subscribers?.length ?? 0}
          desc={`+${thisMonthSubs.length} this month`}
          icon={Mail}
          trend={subGrowth >= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(subGrowth)}%`}
          color="primary"
        />
        <KPICard
          title="Registered Users"
          value={profiles?.length ?? 0}
          desc="Active accounts"
          icon={Users}
          color="primary"
        />
        <KPICard
          title="Products"
          value={products?.length ?? 0}
          desc={`${products?.filter(p => p.is_active).length ?? 0} active`}
          icon={BookOpen}
          color="primary"
        />
      </div>

      {/* Reading Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reading Time</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatTime(totalReadingTime)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all readers</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Completion</CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCompletion}%</div>
            <Progress value={avgCompletion} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contactMessages?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {contactMessages?.filter(m => !m.is_read).length ?? 0} unread
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Content Published (6 Months)
                </CardTitle>
                <CardDescription>Articles and wellness content over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <AreaChart data={contentTimeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillArticles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="fillWellness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS[3]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS[3]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="articles" stroke={CHART_COLORS[0]} fill="url(#fillArticles)" strokeWidth={2} />
                    <Area type="monotone" dataKey="wellness" stroke={CHART_COLORS[3]} fill="url(#fillWellness)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Articles by Category
                </CardTitle>
                <CardDescription>Top categories by article count</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground">No data available</div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} fill={CHART_COLORS[0]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Content Status Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Content Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length === 0 ? (
                  <div className="flex items-center justify-center h-[250px] text-muted-foreground">No data</div>
                ) : (
                  <div className="flex items-center gap-6">
                    <div className="w-[180px] h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%" cy="50%"
                            innerRadius={50} outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {statusData.map((entry, i) => (
                              <Cell key={i} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {statusData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="secondary" className="ml-auto">{item.value}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Recent Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(articles ?? []).slice(0, 5).map(article => (
                    <div key={article.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{article.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{article.category}</p>
                      </div>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="ml-3 shrink-0">
                        {article.status}
                      </Badge>
                    </div>
                  ))}
                  {!articles?.length && <p className="text-muted-foreground text-center py-4">No articles</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscriber Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Subscriber Growth
                </CardTitle>
                <CardDescription>New subscribers and cumulative total</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <LineChart data={subTimeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="total" stroke={CHART_COLORS[2]} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="newSubs" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Subscriber Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Subscriber Interests
                </CardTitle>
                <CardDescription>Top topics your audience cares about</CardDescription>
              </CardHeader>
              <CardContent>
                {interestData.length === 0 ? (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground">No data yet</div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart data={interestData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} fill={CHART_COLORS[0]} />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Recent Subscribers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Recent Subscribers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!subscribers?.length ? (
                  <p className="text-muted-foreground text-center py-4">No subscribers yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subscribers.slice(0, 8).map(sub => (
                      <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {sub.email[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium truncate block max-w-[200px]">{sub.email}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(sub.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <Badge variant={sub.is_active ? 'default' : 'secondary'} className="shrink-0">
                          {sub.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reading Completion Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Reading Completion
                </CardTitle>
                <CardDescription>How far readers get through content</CardDescription>
              </CardHeader>
              <CardContent>
                {readingEngagement.length === 0 ? (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground">No reading data</div>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart data={readingEngagement} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                      <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {readingEngagement.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Top Read Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Reading Activity
                </CardTitle>
                <CardDescription>Recent reading sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {!readingData?.length ? (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground">No sessions yet</div>
                ) : (
                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {readingData.slice(0, 8).map((r) => (
                      <div key={r.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium truncate max-w-[200px]">{r.product_slug}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(r.total_reading_time_seconds)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={Number(r.completion_percent)} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium text-muted-foreground w-10 text-right">{r.completion_percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Engagement Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Stats Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBlock label="Active Subscribers" value={subscribers?.filter(s => s.is_active).length ?? 0} />
                  <StatBlock label="Active Readers" value={readingData?.length ?? 0} />
                  <StatBlock label="Unread Messages" value={contactMessages?.filter(m => !m.is_read).length ?? 0} />
                  <StatBlock label="Active Products" value={products?.filter(p => p.is_active).length ?? 0} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KPICard({ title, value, desc, icon: Icon, trend, trendValue, color }: {
  title: string; value: number; desc: string; icon: any;
  trend?: 'up' | 'down'; trendValue?: string; color?: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{value}</span>
          {trend && (
            <span className={`flex items-center text-xs font-medium mb-1 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trendValue}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl bg-muted/40 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
