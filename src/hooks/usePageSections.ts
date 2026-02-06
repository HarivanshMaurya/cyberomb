import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PageSection {
  id: string;
  page_key: string;
  page_name: string;
  title: string;
  subtitle: string | null;
  content: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePageSection(pageKey: string) {
  return useQuery({
    queryKey: ['page-section', pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_key', pageKey)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as PageSection | null;
    },
  });
}

export function useAllPageSections() {
  return useQuery({
    queryKey: ['page-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('page_name', { ascending: true });

      if (error) throw error;
      return data as PageSection[];
    },
  });
}

export function useUpdatePageSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<PageSection> & { id: string }) => {
      const { id, ...data } = updates;
      const { error } = await supabase
        .from('page_sections')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-sections'] });
      queryClient.invalidateQueries({ queryKey: ['page-section'] });
      toast({
        title: 'Page Updated',
        description: 'The page content has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
