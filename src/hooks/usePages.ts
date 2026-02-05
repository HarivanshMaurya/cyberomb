 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from '@/hooks/use-toast';
 
 export interface Page {
   id: string;
   title: string;
   slug: string;
   content: string | null;
   is_published: boolean;
   meta_title: string | null;
   meta_description: string | null;
   og_image: string | null;
   created_at: string;
   updated_at: string;
 }
 
 export function usePages() {
   return useQuery({
     queryKey: ['pages'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('pages')
         .select('*')
         .order('title');
 
       if (error) throw error;
       return data as Page[];
     },
   });
 }
 
 export function usePage(id: string) {
   return useQuery({
     queryKey: ['page', id],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('pages')
         .select('*')
         .eq('id', id)
         .maybeSingle();
 
       if (error) throw error;
       return data as Page | null;
     },
     enabled: !!id,
   });
 }
 
 export function useCreatePage() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (page: { title: string; slug: string; content?: string; is_published?: boolean; meta_title?: string; meta_description?: string; og_image?: string }) => {
       const { data, error } = await supabase
         .from('pages')
         .insert([page])
         .select()
         .single();
 
       if (error) throw error;
       return data as Page;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['pages'] });
       toast({
         title: 'Page Created',
         description: 'Your page has been created successfully.',
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
 
 export function useUpdatePage() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (updates: Partial<Page> & { id: string }) => {
       const { id, ...data } = updates;
       const { error } = await supabase
         .from('pages')
         .update(data)
         .eq('id', id);
 
       if (error) throw error;
     },
     onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: ['pages'] });
       queryClient.invalidateQueries({ queryKey: ['page', variables.id] });
       toast({
         title: 'Page Updated',
         description: 'Your page has been saved successfully.',
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
 
 export function useDeletePage() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (id: string) => {
       const { error } = await supabase.from('pages').delete().eq('id', id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['pages'] });
       toast({
         title: 'Page Deleted',
         description: 'The page has been deleted.',
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