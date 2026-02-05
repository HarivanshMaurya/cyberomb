 import { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { usePages, useDeletePage } from '@/hooks/usePages';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
 
 export default function PagesList() {
   const { data: pages, isLoading } = usePages();
   const deletePage = useDeletePage();
   const navigate = useNavigate();
 
   const [search, setSearch] = useState('');
   const [deleteId, setDeleteId] = useState<string | null>(null);
 
   const filteredPages = pages?.filter((page) =>
     page.title.toLowerCase().includes(search.toLowerCase())
   );
 
   const handleDelete = () => {
     if (deleteId) {
       deletePage.mutate(deleteId);
       setDeleteId(null);
     }
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold">Pages</h1>
           <p className="text-muted-foreground mt-1">Manage your website pages</p>
         </div>
         <Button onClick={() => navigate('/admin/pages/new')}>
           <Plus className="mr-2 h-4 w-4" />
           New Page
         </Button>
       </div>
 
       <Card>
         <CardHeader>
           <div className="flex items-center gap-4">
             <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search pages..."
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
           ) : filteredPages?.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-muted-foreground">No pages found</p>
               <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/pages/new')}>
                 Create your first page
               </Button>
             </div>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Title</TableHead>
                   <TableHead>Slug</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Last Updated</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredPages?.map((page) => (
                   <TableRow key={page.id}>
                     <TableCell>
                       <Link
                         to={`/admin/pages/${page.id}`}
                         className="font-medium hover:text-primary transition-colors"
                       >
                         {page.title}
                       </Link>
                     </TableCell>
                     <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                     <TableCell>
                       <span
                         className={`text-xs px-2 py-1 rounded-full ${
                           page.is_published
                             ? 'bg-green-100 text-green-700'
                             : 'bg-yellow-100 text-yellow-700'
                         }`}
                       >
                         {page.is_published ? 'Published' : 'Draft'}
                       </span>
                     </TableCell>
                     <TableCell>{new Date(page.updated_at).toLocaleDateString()}</TableCell>
                     <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => navigate(`/admin/pages/${page.id}`)}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="text-destructive hover:text-destructive"
                           onClick={() => setDeleteId(page.id)}
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
 
       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Delete Page?</AlertDialogTitle>
             <AlertDialogDescription>
               This action cannot be undone. This will permanently delete the page.
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