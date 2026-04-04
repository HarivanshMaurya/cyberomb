import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useArticles, useDeleteArticle } from '@/hooks/useArticles';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Loader2, CalendarIcon, Languages } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export default function ArticlesList() {
  const { data: articles, isLoading, refetch } = useArticles();
  const deleteArticle = useDeleteArticle();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preTranslating, setPreTranslating] = useState<string | null>(null);
  const [translateProgress, setTranslateProgress] = useState({ current: 0, total: 0 });

  const { data: languages } = useQuery({
    queryKey: ['translation-languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translation_languages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const filteredArticles = articles?.filter(
    (article) =>
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteArticle.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handlePreTranslate = async (articleId: string) => {
    if (!languages || languages.length === 0) {
      toast.error('No languages configured. Add languages first.');
      return;
    }

    const article = articles?.find(a => a.id === articleId);
    if (!article) return;

    // Get existing translations
    const { data: current } = await supabase
      .from('articles')
      .select('translations')
      .eq('id', articleId)
      .maybeSingle();

    const existing = (current?.translations as unknown as Record<string, any>) || {};

    // Find languages not yet translated
    const missingLangs = languages.filter(l => !existing[l.code]);

    if (missingLangs.length === 0) {
      toast.success('All languages already translated!');
      return;
    }

    setPreTranslating(articleId);
    setTranslateProgress({ current: 0, total: missingLangs.length });

    try {
      const translations: Record<string, any> = { ...existing };

      for (let i = 0; i < missingLangs.length; i++) {
        const lang = missingLangs[i];
        setTranslateProgress({ current: i, total: missingLangs.length });

        const { data, error } = await supabase.functions.invoke('translate-article', {
          body: {
            title: article.title,
            content: article.content || '',
            excerpt: article.excerpt || '',
            targetLang: lang.code,
          },
        });

        if (error) {
          console.error(`Failed to translate to ${lang.label}:`, error);
          toast.error(`Failed: ${lang.label}`);
          continue;
        }

        translations[lang.code] = {
          title: data.title || article.title,
          content: data.content || article.content,
          excerpt: data.excerpt || article.excerpt,
        };
      }

      // Save all translations
      await supabase
        .from('articles')
        .update({ translations: translations as any })
        .eq('id', articleId);

      setTranslateProgress({ current: missingLangs.length, total: missingLangs.length });
      toast.success('Pre-translation complete!');
      refetch();
    } catch (err) {
      console.error('Pre-translate error:', err);
      toast.error('Pre-translation failed');
    } finally {
      setTimeout(() => {
        setPreTranslating(null);
        setTranslateProgress({ current: 0, total: 0 });
      }, 1500);
    }
  };

  const getTranslationCount = (article: any) => {
    const t = article.translations as Record<string, any> | null;
    if (!t || typeof t !== 'object') return 0;
    return Object.keys(t).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground mt-1">
            Manage your blog posts and articles
          </p>
        </div>
        <Button onClick={() => navigate('/admin/articles/new')}>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredArticles?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/admin/articles/new')}
              >
                Create your first article
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Translations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles?.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <Link
                        to={`/admin/articles/${article.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">{article.category}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : article.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : article.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {article.status === 'scheduled' ? `📅 ${article.status}` : article.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(article.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {article.status === 'scheduled' && article.published_at ? (
                        <div className="flex items-center gap-1 text-xs text-blue-600">
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(article.published_at), 'MMM dd, yyyy HH:mm')}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {getTranslationCount(article)}/{languages?.length || 0}
                        </span>
                        {preTranslating === article.id ? (
                          <div className="w-24">
                            <Progress
                              value={translateProgress.total > 0 ? (translateProgress.current / translateProgress.total) * 100 : 0}
                              className="h-2"
                            />
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handlePreTranslate(article.id)}
                            disabled={!!preTranslating}
                          >
                            <Languages className="h-3 w-3 mr-1" />
                            Pre-Translate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/articles/${article.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the article.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
