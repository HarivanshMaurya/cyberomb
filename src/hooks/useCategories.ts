 import { useQuery } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 
 export interface Category {
   id: string;
   name: string;
   slug: string;
   description: string | null;
   created_at: string;
 }
 
 export function useCategories() {
   return useQuery({
     queryKey: ['categories'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('categories')
         .select('*')
         .order('name', { ascending: true });
 
       if (error) throw error;
       return data as Category[];
     },
   });
 }
 
 export function useArticlesByCategory(categorySlug: string | null) {
   return useQuery({
     queryKey: ['articles-by-category', categorySlug],
     queryFn: async () => {
       let query = supabase
         .from('articles')
         .select('*')
         .eq('status', 'published')
         .order('created_at', { ascending: false });
 
       if (categorySlug) {
         query = query.ilike('category', categorySlug);
       }
 
       const { data, error } = await query.limit(10);
       if (error) throw error;
       return data;
     },
   });
 }