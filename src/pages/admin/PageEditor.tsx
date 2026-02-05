 import { useState, useEffect } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { usePage, useCreatePage, useUpdatePage } from '@/hooks/usePages';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { Switch } from '@/components/ui/switch';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { RichTextEditor } from '@/components/admin/RichTextEditor';
 import { Loader2, Save, ArrowLeft, Eye } from 'lucide-react';
 
 export default function PageEditor() {
   const { id } = useParams();
   const navigate = useNavigate();
   const isNew = id === 'new';
 
   const { data: page, isLoading } = usePage(id || '');
   const createPage = useCreatePage();
   const updatePage = useUpdatePage();
 
   const [formData, setFormData] = useState({
     title: '',
     slug: '',
     content: '',
     is_published: false,
     meta_title: '',
     meta_description: '',
     og_image: '',
   });
 
   useEffect(() => {
     if (page && !isNew) {
       setFormData({
         title: page.title,
         slug: page.slug,
         content: page.content || '',
         is_published: page.is_published,
         meta_title: page.meta_title || '',
         meta_description: page.meta_description || '',
         og_image: page.og_image || '',
       });
     }
   }, [page, isNew]);
 
   const generateSlug = (title: string) => {
     return title
       .toLowerCase()
       .replace(/[^a-z0-9]+/g, '-')
       .replace(/(^-|-$)/g, '');
   };
 
   const handleTitleChange = (title: string) => {
     setFormData({
       ...formData,
       title,
       slug: isNew ? generateSlug(title) : formData.slug,
     });
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     if (isNew) {
       createPage.mutate(formData, {
         onSuccess: (data) => {
           navigate(`/admin/pages/${data.id}`);
         },
       });
     } else {
       updatePage.mutate({ id: id!, ...formData });
     }
   };
 
   if (isLoading && !isNew) {
     return (
       <div className="flex items-center justify-center h-64">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pages')}>
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <div>
             <h1 className="text-3xl font-bold">{isNew ? 'New Page' : 'Edit Page'}</h1>
             <p className="text-muted-foreground mt-1">
               {isNew ? 'Create a new page' : 'Edit your page'}
             </p>
           </div>
         </div>
         {!isNew && page?.is_published && (
           <Button variant="outline" asChild>
             <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
               <Eye className="mr-2 h-4 w-4" />
               View Live
             </a>
           </Button>
         )}
       </div>
 
       <form onSubmit={handleSubmit}>
         <Tabs defaultValue="content" className="space-y-6">
           <TabsList>
             <TabsTrigger value="content">Content</TabsTrigger>
             <TabsTrigger value="seo">SEO</TabsTrigger>
           </TabsList>
 
           <TabsContent value="content" className="space-y-6">
             <div className="grid lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                 <Card>
                   <CardContent className="pt-6 space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="title">Title</Label>
                       <Input
                         id="title"
                         value={formData.title}
                         onChange={(e) => handleTitleChange(e.target.value)}
                         placeholder="Enter page title"
                         required
                       />
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="slug">Slug</Label>
                       <Input
                         id="slug"
                         value={formData.slug}
                         onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                         placeholder="page-url-slug"
                         required
                       />
                     </div>
                   </CardContent>
                 </Card>
 
                 <Card>
                   <CardHeader>
                     <CardTitle>Content</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <RichTextEditor
                       content={formData.content}
                       onChange={(content) => setFormData({ ...formData, content })}
                       placeholder="Write your page content here..."
                     />
                   </CardContent>
                 </Card>
               </div>
 
               <div className="space-y-6">
                 <Card>
                   <CardHeader>
                     <CardTitle>Publish</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                       <Label htmlFor="is_published">Published</Label>
                       <Switch
                         id="is_published"
                         checked={formData.is_published}
                         onCheckedChange={(checked) =>
                           setFormData({ ...formData, is_published: checked })
                         }
                       />
                     </div>
 
                     <Button
                       type="submit"
                       className="w-full"
                       disabled={createPage.isPending || updatePage.isPending}
                     >
                       {createPage.isPending || updatePage.isPending ? (
                         <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Saving...
                         </>
                       ) : (
                         <>
                           <Save className="mr-2 h-4 w-4" />
                           {isNew ? 'Create Page' : 'Save Changes'}
                         </>
                       )}
                     </Button>
                   </CardContent>
                 </Card>
               </div>
             </div>
           </TabsContent>
 
           <TabsContent value="seo" className="space-y-6">
             <Card>
               <CardHeader>
                 <CardTitle>SEO Settings</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="meta_title">Meta Title</Label>
                   <Input
                     id="meta_title"
                     value={formData.meta_title}
                     onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                     placeholder="SEO title"
                     maxLength={60}
                   />
                   <p className="text-xs text-muted-foreground">
                     {formData.meta_title.length}/60 characters
                   </p>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="meta_description">Meta Description</Label>
                   <Textarea
                     id="meta_description"
                     value={formData.meta_description}
                     onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                     placeholder="SEO description"
                     maxLength={160}
                     rows={3}
                   />
                   <p className="text-xs text-muted-foreground">
                     {formData.meta_description.length}/160 characters
                   </p>
                 </div>
 
                 <div className="space-y-2">
                   <Label htmlFor="og_image">Open Graph Image URL</Label>
                   <Input
                     id="og_image"
                     value={formData.og_image}
                     onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                     placeholder="https://example.com/og-image.jpg"
                   />
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
       </form>
     </div>
   );
 }