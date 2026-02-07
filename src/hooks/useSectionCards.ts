import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface SectionCard {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface SiteSection {
  id: string;
  section_key: string;
  section_name: string;
  content: {
    cards?: SectionCard[];
    [key: string]: unknown;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useSectionCards(sectionKey: string) {
  return useQuery({
    queryKey: ['site-section', sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .eq('section_key', sectionKey)
        .maybeSingle();

      if (error) throw error;
      return data as SiteSection | null;
    },
  });
}

export function useAllSectionCards() {
  return useQuery({
    queryKey: ['site-sections-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .in('section_key', ['wellness_cards', 'travel_cards'])
        .order('section_key');

      if (error) throw error;
      return data as SiteSection[];
    },
  });
}

export function useUpdateSectionCards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sectionKey,
      sectionName,
      cards,
    }: {
      sectionKey: string;
      sectionName: string;
      cards: SectionCard[];
    }) => {
      // Check if section exists
      const { data: existing } = await supabase
        .from('site_sections')
        .select('id')
        .eq('section_key', sectionKey)
        .maybeSingle();

      const contentPayload: Json = { cards: cards as unknown as Json[] };

      if (existing) {
        const { error } = await supabase
          .from('site_sections')
          .update({ content: contentPayload })
          .eq('section_key', sectionKey);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_sections').insert({
          section_key: sectionKey,
          section_name: sectionName,
          content: contentPayload,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-sections-cards'] });
      queryClient.invalidateQueries({ queryKey: ['site-section'] });
      toast.success('Cards updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update cards: ' + error.message);
    },
  });
}
