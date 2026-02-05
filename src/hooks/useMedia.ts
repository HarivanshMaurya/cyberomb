 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { toast } from '@/hooks/use-toast';
 
 export interface MediaItem {
   id: string;
   name: string;
   file_path: string;
   file_url: string;
   file_type: string;
   file_size: number | null;
   alt_text: string | null;
   uploaded_by: string | null;
   created_at: string;
 }
 
 export function useMedia() {
   return useQuery({
     queryKey: ['media'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('media')
         .select('*')
         .order('created_at', { ascending: false });
 
       if (error) throw error;
       return data as MediaItem[];
     },
   });
 }
 
 export function useUploadMedia() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (file: File) => {
       const fileExt = file.name.split('.').pop();
       const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
       const filePath = `uploads/${fileName}`;
 
       // Upload to storage
       const { error: uploadError } = await supabase.storage
         .from('media')
         .upload(filePath, file);
 
       if (uploadError) throw uploadError;
 
       // Get public URL
       const { data: urlData } = supabase.storage
         .from('media')
         .getPublicUrl(filePath);
 
       // Save to database
       const { data, error } = await supabase
         .from('media')
         .insert({
           name: file.name,
           file_path: filePath,
           file_url: urlData.publicUrl,
           file_type: file.type,
           file_size: file.size,
         })
         .select()
         .single();
 
       if (error) throw error;
       return data as MediaItem;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['media'] });
       toast({
         title: 'Upload Complete',
         description: 'Your file has been uploaded successfully.',
       });
     },
     onError: (error) => {
       toast({
         title: 'Upload Failed',
         description: error.message,
         variant: 'destructive',
       });
     },
   });
 }
 
 export function useDeleteMedia() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async (media: MediaItem) => {
       // Delete from storage
       const { error: storageError } = await supabase.storage
         .from('media')
         .remove([media.file_path]);
 
       if (storageError) throw storageError;
 
       // Delete from database
       const { error } = await supabase.from('media').delete().eq('id', media.id);
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['media'] });
       toast({
         title: 'File Deleted',
         description: 'The file has been removed.',
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
 
 export function useUpdateMediaAlt() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ id, alt_text }: { id: string; alt_text: string }) => {
       const { error } = await supabase
         .from('media')
         .update({ alt_text })
         .eq('id', id);
 
       if (error) throw error;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['media'] });
       toast({
         title: 'Updated',
         description: 'Alt text has been saved.',
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