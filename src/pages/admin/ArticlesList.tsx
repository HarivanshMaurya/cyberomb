 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { useArticles, useDeleteArticle } from '@/hooks/useArticles';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
 } from '@/components/ui/alert-dialog';
 import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
 
 export default function ArticlesList() {
   const { data: articles, isLoading } = useArticles();
   const deleteArticle = useDeleteArticle();
   const navigate = useNavigate();
 
   const [search, setSearch] = useState('');
   const [deleteId, setDeleteId] = useState<string | null>(null);
 
   const filteredArticles = articles?.filter(
     (article) =>
       article.title.toLowerCase().includes(search.toLowerCase()) ||
       article.category.toLowerCase().includes(search.toLowerCase())
   );
 
   const handleDelete = () => {
     if (deleteId) {
       deleteArticle.mutate(deleteId);
       setDeleteId(null);
     }
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold">Articles</h1>
           <p className="text-muted-foreground mt-1">
             Manage your blog posts and articles
           </p>
         </div>
         <Button onClick={() => navigate('/admin/articles/new')}>
           <Plus className="mr-2 h-4 w-4" />
           New Article
         </Button>
       </div>
 
       <Card>
         <CardHeader>
           <div className="flex items-center gap-4">
             <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search articles..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9"
               />
             </div>
           </div>
         </CardHeader>
         <CardContent>
           {isLoading ? (
             <div className="flex items-center justify-center py-8">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
           ) : filteredArticles?.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-muted-foreground">No articles found</p>
               <Button
                 variant="outline"
                 className="mt-4"
                 onClick={() => navigate('/admin/articles/new')}
               >
                 Create your first article
               </Button>
             </div>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Title</TableHead>
                   <TableHead>Category</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Date</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredArticles?.map((article) => (
                   <TableRow key={article.id}>
                     <TableCell>
                       <Link
                         to={`/admin/articles/${article.id}`}
                         className="font-medium hover:text-primary transition-colors"
                       >
                         {article.title}
                       </Link>
                     </TableCell>
                     <TableCell className="capitalize">{article.category}</TableCell>
                     <TableCell>
                       <span
                         className={`text-xs px-2 py-1 rounded-full ${
                           article.status === 'published'
                             ? 'bg-green-100 text-green-700'
                             : article.status === 'draft'
                             ? 'bg-yellow-100 text-yellow-700'
                             : 'bg-gray-100 text-gray-700'
                         }`}
                       >
                         {article.status}
                       </span>
                     </TableCell>
                     <TableCell>
                       {new Date(article.created_at).toLocaleDateString()}
                     </TableCell>
                     <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => navigate(`/admin/articles/${article.id}`)}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="text-destructive hover:text-destructive"
                           onClick={() => setDeleteId(article.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           )}
         </CardContent>
       </Card>
 
       {/* Delete Confirmation Dialog */}
       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Delete Article?</AlertDialogTitle>
             <AlertDialogDescription>
               This action cannot be undone. This will permanently delete the article.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>Cancel</AlertDialogCancel>
             <AlertDialogAction
               onClick={handleDelete}
               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
             >
               Delete
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   );
 }