 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from '@/hooks/use-toast';
 import type { Json } from '@/integrations/supabase/types';
 
 export interface SiteSection {
   id: string;
   section_key: string;
   section_name: string;
   content: Json;
   is_active: boolean;
   created_at: string;
   updated_at: string;
 }
 
 export function useSiteSections() {
   return useQuery({
     queryKey: ['site-sections'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('site_sections')
         .select('*')
         .order('section_name');
 
       if (error) throw error;
       return data as SiteSection[];
     },
   });
 }
 
 export function useSiteSection(sectionKey: string) {
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
 
 export function useUpdateSiteSection() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (updates: { id: string; content: Json }) => {
       const { error } = await supabase
         .from('site_sections')
         .update({ content: updates.content })
         .eq('id', updates.id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['site-sections'] });
       queryClient.invalidateQueries({ queryKey: ['site-section'] });
       toast({
         title: 'Section Updated',
         description: 'Your content has been saved successfully.',
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