 import { useState, useEffect } from 'react';
 import { useHeroContent, useUpdateHeroContent } from '@/hooks/useHeroContent';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { Loader2, Save, Eye } from 'lucide-react';
 
 export default function HeroEditor() {
   const { data: hero, isLoading } = useHeroContent();
   const updateHero = useUpdateHeroContent();
 
   const [formData, setFormData] = useState({
     title: '',
     subtitle: '',
     background_image: '',
     button_text: '',
     button_link: '',
   });
 
   useEffect(() => {
     if (hero) {
       setFormData({
         title: hero.title,
         subtitle: hero.subtitle,
         background_image: hero.background_image,
         button_text: hero.button_text,
         button_link: hero.button_link,
       });
     }
   }, [hero]);
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!hero) return;
 
     updateHero.mutate({
       id: hero.id,
       ...formData,
     });
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
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold">Hero Section</h1>
           <p className="text-muted-foreground mt-1">
             Edit the hero section that appears on your homepage
           </p>
         </div>
         <Button variant="outline" asChild>
           <a href="/" target="_blank" rel="noopener noreferrer">
             <Eye className="mr-2 h-4 w-4" />
             View Live
           </a>
         </Button>
       </div>
 
       <div className="grid lg:grid-cols-2 gap-6">
         {/* Form */}
         <Card>
           <CardHeader>
             <CardTitle>Hero Content</CardTitle>
             <CardDescription>
               Changes will be reflected immediately on your website
             </CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="title">Title</Label>
                 <Input
                   id="title"
                   value={formData.title}
                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                   placeholder="Enter hero title"
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="subtitle">Subtitle / Description</Label>
                 <Textarea
                   id="subtitle"
                   value={formData.subtitle}
                   onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                   placeholder="Enter hero description"
                   rows={4}
                 />
               </div>
 
               <div className="space-y-2">
                 <Label htmlFor="background_image">Background Image URL</Label>
                 <Input
                   id="background_image"
                   value={formData.background_image}
                   onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
                   placeholder="https://example.com/image.jpg"
                 />
               </div>
 
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="button_text">Button Text</Label>
                   <Input
                     id="button_text"
                     value={formData.button_text}
                     onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                     placeholder="Join Now"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="button_link">Button Link</Label>
                   <Input
                     id="button_link"
                     value={formData.button_link}
                     onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                     placeholder="#signup"
                   />
                 </div>
               </div>
 
               <Button type="submit" disabled={updateHero.isPending} className="w-full">
                 {updateHero.isPending ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   <>
                     <Save className="mr-2 h-4 w-4" />
                     Save Changes
                   </>
                 )}
               </Button>
             </form>
           </CardContent>
         </Card>
 
         {/* Preview */}
         <Card>
           <CardHeader>
             <CardTitle>Preview</CardTitle>
             <CardDescription>How your hero section will look</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="rounded-lg overflow-hidden border border-border">
               <div className="relative aspect-video bg-muted">
                 {formData.background_image && (
                   <img
                     src={formData.background_image}
                     alt="Hero preview"
                     className="w-full h-full object-cover"
                   />
                 )}
                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center">
                   <h2 className="text-xl md:text-2xl font-bold mb-2">{formData.title}</h2>
                   <p className="text-sm text-white/80 mb-4 max-w-md line-clamp-2">
                     {formData.subtitle}
                   </p>
                   <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm">
                     {formData.button_text}
                   </span>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }