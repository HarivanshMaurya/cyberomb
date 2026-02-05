 import { useState, useEffect } from 'react';
 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { Loader2, Save } from 'lucide-react';
 import { toast } from '@/hooks/use-toast';
 import type { Json } from '@/integrations/supabase/types';
 
 interface SEOData {
   site_title: string;
   site_description: string;
   default_og_image: string;
   twitter_handle: string;
   google_analytics_id: string;
 }
 
 export default function SEOSettings() {
   const queryClient = useQueryClient();
 
   const { data: settings, isLoading } = useQuery({
     queryKey: ['site-settings', 'seo'],
     queryFn: async () => {
       const { data, error } = await supabase
         .from('site_settings')
         .select('*')
         .eq('key', 'seo')
         .maybeSingle();
 
       if (error) throw error;
       return data;
     },
   });
 
   const [formData, setFormData] = useState<SEOData>({
     site_title: '',
     site_description: '',
     default_og_image: '',
     twitter_handle: '',
     google_analytics_id: '',
   });
 
   useEffect(() => {
     if (settings) {
       const value = settings.value as Record<string, unknown>;
       setFormData({
         site_title: String(value.site_title || ''),
         site_description: String(value.site_description || ''),
         default_og_image: String(value.default_og_image || ''),
         twitter_handle: String(value.twitter_handle || ''),
         google_analytics_id: String(value.google_analytics_id || ''),
       });
     }
   }, [settings]);
 
   const saveMutation = useMutation({
     mutationFn: async (data: SEOData) => {
       if (settings) {
         const { error } = await supabase
           .from('site_settings')
           .update({ value: data as unknown as Json })
           .eq('id', settings.id);
         if (error) throw error;
       } else {
         const { error } = await supabase
           .from('site_settings')
           .insert([{ key: 'seo', value: data as unknown as Json }]);
         if (error) throw error;
       }
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['site-settings', 'seo'] });
       toast({
         title: 'SEO Settings Saved',
         description: 'Your SEO settings have been updated.',
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
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     saveMutation.mutate(formData);
   };
 
   if (isLoading) {
     return (
       <div className="flex items-center justify-center h-64">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-3xl font-bold">SEO Settings</h1>
         <p className="text-muted-foreground mt-1">
           Configure global SEO settings for your website
         </p>
       </div>
 
       <form onSubmit={handleSubmit}>
         <Card>
           <CardHeader>
             <CardTitle>Global SEO Configuration</CardTitle>
             <CardDescription>
               These settings will be used as defaults across your website
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
             <div className="space-y-2">
               <Label htmlFor="site_title">Site Title</Label>
               <Input
                 id="site_title"
                 value={formData.site_title}
                 onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                 placeholder="Perspective Blog"
                 maxLength={60}
               />
               <p className="text-xs text-muted-foreground">
                 {formData.site_title.length}/60 characters
               </p>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="site_description">Site Description</Label>
               <Textarea
                 id="site_description"
                 value={formData.site_description}
                 onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                 placeholder="A blog about wellness, travel, creativity, and personal growth"
                 maxLength={160}
                 rows={3}
               />
               <p className="text-xs text-muted-foreground">
                 {formData.site_description.length}/160 characters
               </p>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="default_og_image">Default Open Graph Image</Label>
               <Input
                 id="default_og_image"
                 value={formData.default_og_image}
                 onChange={(e) => setFormData({ ...formData, default_og_image: e.target.value })}
                 placeholder="https://example.com/og-image.jpg"
               />
               <p className="text-xs text-muted-foreground">
                 Used when sharing on social media (recommended: 1200x630px)
               </p>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="twitter_handle">Twitter Handle</Label>
               <Input
                 id="twitter_handle"
                 value={formData.twitter_handle}
                 onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                 placeholder="@yourusername"
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
               <Input
                 id="google_analytics_id"
                 value={formData.google_analytics_id}
                 onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                 placeholder="G-XXXXXXXXXX"
               />
             </div>
 
             <Button type="submit" disabled={saveMutation.isPending}>
               {saveMutation.isPending ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Saving...
                 </>
               ) : (
                 <>
                   <Save className="mr-2 h-4 w-4" />
                   Save Settings
                 </>
               )}
             </Button>
           </CardContent>
         </Card>
       </form>
     </div>
   );
 }