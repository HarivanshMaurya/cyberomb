import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WellnessArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_name: string | null;
  status: string;
  read_time: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useWellnessArticles() {
  return useQuery({
    queryKey: ['wellness-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wellness_articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as WellnessArticle[];
    },
  });
}

export function usePublishedWellnessArticles() {
  return useQuery({
    queryKey: ['wellness-articles', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wellness_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as WellnessArticle[];
    },
  });
}

export function useWellnessArticle(id: string) {
  return useQuery({
    queryKey: ['wellness-article', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      const { data, error } = await supabase
        .from('wellness_articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as WellnessArticle | null;
    },
    enabled: !!id && id !== 'new',
  });
}

export function useWellnessArticleBySlug(slug: string) {
  return useQuery({
    queryKey: ['wellness-article-slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wellness_articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      return data as WellnessArticle | null;
    },
    enabled: !!slug,
  });
}

export function useCreateWellnessArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (article: Omit<WellnessArticle, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('wellness_articles')
        .insert(article)
        .select()
        .single();
      if (error) throw error;
      return data as WellnessArticle;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wellness-articles'] });
      toast({ title: 'Article Created', description: 'Wellness article has been created.' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}

export function useUpdateWellnessArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WellnessArticle> & { id: string }) => {
      const { error } = await supabase
        .from('wellness_articles')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wellness-articles'] });
      qc.invalidateQueries({ queryKey: ['wellness-article'] });
      toast({ title: 'Saved', description: 'Wellness article has been updated.' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}

export function useDeleteWellnessArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wellness_articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wellness-articles'] });
      toast({ title: 'Deleted', description: 'Wellness article has been deleted.' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}
