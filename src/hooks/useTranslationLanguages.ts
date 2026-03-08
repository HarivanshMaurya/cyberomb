import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TranslationLanguage {
  id: string;
  code: string;
  label: string;
  sublabel: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useTranslationLanguages() {
  return useQuery({
    queryKey: ['translation-languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translation_languages' as any)
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as unknown as TranslationLanguage[];
    },
  });
}

export function useActiveTranslationLanguages() {
  return useQuery({
    queryKey: ['translation-languages', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translation_languages' as any)
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as unknown as TranslationLanguage[];
    },
  });
}

export function useCreateLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lang: Omit<TranslationLanguage, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('translation_languages' as any).insert(lang as any);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['translation-languages'] }); toast.success('Language added'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TranslationLanguage> & { id: string }) => {
      const { error } = await supabase.from('translation_languages' as any).update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['translation-languages'] }); toast.success('Language updated'); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('translation_languages' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['translation-languages'] }); toast.success('Language deleted'); },
    onError: (e: Error) => toast.error(e.message),
  });
}
