 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from '@/hooks/use-toast';
 
 export interface HeroContent {
   id: string;
   title: string;
   subtitle: string;
   background_image: string;
   button_text: string;
   button_link: string;
   is_active: boolean;
   created_at: string;
   updated_at: string;
 }
 
 export function useHeroContent() {
   return useQuery({
     queryKey: ['hero-content'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('hero_content')
         .select('*')
         .eq('is_active', true)
         .maybeSingle();
 
       if (error) throw error;
       return data as HeroContent | null;
     },
   });
 }
 
 export function useUpdateHeroContent() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (updates: Partial<HeroContent> & { id: string }) => {
       const { id, ...data } = updates;
       const { error } = await supabase
         .from('hero_content')
         .update(data)
         .eq('id', id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['hero-content'] });
       toast({
         title: 'Hero Updated',
         description: 'Your hero section has been updated successfully.',
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