 import { useState, useEffect } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { useArticle, useCreateArticle, useUpdateArticle } from '@/hooks/useArticles';
 import { useAuth } from '@/contexts/AuthContext';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { RichTextEditor } from '@/components/admin/RichTextEditor';
 import { Loader2, Save, ArrowLeft, Eye } from 'lucide-react';
 
 const categories = ['wellness', 'travel', 'creativity', 'growth', 'uncategorized'];
 
 export default function ArticleEditor() {
   const { id } = useParams();
   const navigate = useNavigate();
   const { user } = useAuth();
   const isNew = id === 'new';
 
   const { data: article, isLoading } = useArticle(id || '');
   const createArticle = useCreateArticle();
   const updateArticle = useUpdateArticle();
 
   const [formData, setFormData] = useState({
     title: '',
     slug: '',
     excerpt: '',
     content: '',
     featured_image: '',
     category: 'uncategorized',
     author_name: '',
     status: 'draft' as 'draft' | 'published' | 'archived',
     read_time: '5 min read',
     meta_title: '',
     meta_description: '',
     og_image: '',
   });
 
   useEffect(() => {
     if (article && !isNew) {
       setFormData({
         title: article.title,
         slug: article.slug,
         excerpt: article.excerpt || '',
         content: article.content || '',
         featured_image: article.featured_image || '',
         category: article.category,
         author_name: article.author_name || '',
         status: article.status as 'draft' | 'published' | 'archived',
         read_time: article.read_time || '5 min read',
         meta_title: article.meta_title || '',
         meta_description: article.meta_description || '',
         og_image: article.og_image || '',
       });
     }
   }, [article, isNew]);
 
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
 
     const articleData = {
       ...formData,
       published_at: formData.status === 'published' ? new Date().toISOString() : null,
     };
 
     if (isNew) {
       createArticle.mutate(articleData, {
         onSuccess: (data) => {
           navigate(`/admin/articles/${data.id}`);
         },
       });
     } else {
       updateArticle.mutate({ id: id!, ...articleData });
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
           <Button variant="ghost" size="icon" onClick={() => navigate('/admin/articles')}>
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <div>
             <h1 className="text-3xl font-bold">
               {isNew ? 'New Article' : 'Edit Article'}
             </h1>
             <p className="text-muted-foreground mt-1">
               {isNew ? 'Create a new blog post' : 'Edit your blog post'}
             </p>
           </div>
         </div>
         {!isNew && article?.status === 'published' && (
           <Button variant="outline" asChild>
             <a href={`/article/${article.slug}`} target="_blank" rel="noopener noreferrer">
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
               {/* Main Content */}
               <div className="lg:col-span-2 space-y-6">
                 <Card>
                   <CardContent className="pt-6 space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="title">Title</Label>
                       <Input
                         id="title"
                         value={formData.title}
                         onChange={(e) => handleTitleChange(e.target.value)}
                         placeholder="Enter article title"
                         required
                       />
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="slug">Slug</Label>
                       <Input
                         id="slug"
                         value={formData.slug}
                         onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                         placeholder="article-url-slug"
                         required
                       />
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="excerpt">Excerpt</Label>
                       <Textarea
                         id="excerpt"
                         value={formData.excerpt}
                         onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                         placeholder="Brief description of the article"
                         rows={3}
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
                       placeholder="Write your article content here..."
                     />
                   </CardContent>
                 </Card>
               </div>
 
               {/* Sidebar */}
               <div className="space-y-6">
                 <Card>
                   <CardHeader>
                     <CardTitle>Publish</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label>Status</Label>
                       <Select
                         value={formData.status}
                       onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: value })}
                       >
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="draft">Draft</SelectItem>
                           <SelectItem value="published">Published</SelectItem>
                           <SelectItem value="archived">Archived</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
 
                     <Button
                       type="submit"
                       className="w-full"
                       disabled={createArticle.isPending || updateArticle.isPending}
                     >
                       {createArticle.isPending || updateArticle.isPending ? (
                         <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Saving...
                         </>
                       ) : (
                         <>
                           <Save className="mr-2 h-4 w-4" />
                           {isNew ? 'Create Article' : 'Save Changes'}
                         </>
                       )}
                     </Button>
                   </CardContent>
                 </Card>
 
                 <Card>
                   <CardHeader>
                     <CardTitle>Details</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label>Category</Label>
                       <Select
                         value={formData.category}
                         onValueChange={(value) => setFormData({ ...formData, category: value })}
                       >
                         <SelectTrigger>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           {categories.map((cat) => (
                             <SelectItem key={cat} value={cat} className="capitalize">
                               {cat}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="author_name">Author Name</Label>
                       <Input
                         id="author_name"
                         value={formData.author_name}
                         onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                         placeholder="Author name"
                       />
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="read_time">Read Time</Label>
                       <Input
                         id="read_time"
                         value={formData.read_time}
                         onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                         placeholder="5 min read"
                       />
                     </div>
                   </CardContent>
                 </Card>
 
                 <Card>
                   <CardHeader>
                     <CardTitle>Featured Image</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="featured_image">Image URL</Label>
                       <Input
                         id="featured_image"
                         value={formData.featured_image}
                         onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                         placeholder="https://example.com/image.jpg"
                       />
                     </div>
                     {formData.featured_image && (
                       <div className="rounded-lg overflow-hidden border border-border">
                         <img
                           src={formData.featured_image}
                           alt="Featured"
                           className="w-full h-40 object-cover"
                         />
                       </div>
                     )}
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
                     placeholder="SEO title (defaults to article title)"
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