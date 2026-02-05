 import { useState, useRef } from 'react';
 import { useMedia, useUploadMedia, useDeleteMedia, useUpdateMediaAlt, MediaItem } from '@/hooks/useMedia';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from '@/components/ui/dialog';
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
 import { Upload, Search, Trash2, Copy, Loader2, Image as ImageIcon } from 'lucide-react';
 import { toast } from '@/hooks/use-toast';
 
 export default function MediaLibrary() {
   const { data: media, isLoading } = useMedia();
   const uploadMedia = useUploadMedia();
   const deleteMedia = useDeleteMedia();
   const updateAlt = useUpdateMediaAlt();
 
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [search, setSearch] = useState('');
   const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
   const [altText, setAltText] = useState('');
 
   const filteredMedia = media?.filter((item) =>
     item.name.toLowerCase().includes(search.toLowerCase())
   );
 
   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = e.target.files;
     if (!files) return;
 
     for (let i = 0; i < files.length; i++) {
       await uploadMedia.mutateAsync(files[i]);
     }
 
     if (fileInputRef.current) {
       fileInputRef.current.value = '';
     }
   };
 
   const handleDelete = () => {
     if (deleteTarget) {
       deleteMedia.mutate(deleteTarget);
       setDeleteTarget(null);
       setSelectedMedia(null);
     }
   };
 
   const handleCopyUrl = (url: string) => {
     navigator.clipboard.writeText(url);
     toast({
       title: 'URL Copied',
       description: 'Image URL has been copied to clipboard.',
     });
   };
 
   const handleSaveAlt = () => {
     if (selectedMedia) {
       updateAlt.mutate({ id: selectedMedia.id, alt_text: altText });
     }
   };
 
   const formatFileSize = (bytes: number | null) => {
     if (!bytes) return 'Unknown';
     if (bytes < 1024) return bytes + ' B';
     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
     return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
   };
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold">Media Library</h1>
           <p className="text-muted-foreground mt-1">Upload and manage your images</p>
         </div>
         <div>
           <input
             type="file"
             ref={fileInputRef}
             onChange={handleUpload}
             accept="image/*"
             multiple
             className="hidden"
           />
           <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMedia.isPending}>
             {uploadMedia.isPending ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Uploading...
               </>
             ) : (
               <>
                 <Upload className="mr-2 h-4 w-4" />
                 Upload
               </>
             )}
           </Button>
         </div>
       </div>
 
       <Card>
         <CardHeader>
           <div className="flex items-center gap-4">
             <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search files..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="pl-9"
               />
             </div>
           </div>
         </CardHeader>
         <CardContent>
           {isLoading ? (
             <div className="flex items-center justify-center py-12">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
           ) : filteredMedia?.length === 0 ? (
             <div className="text-center py-12">
               <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
               <p className="text-muted-foreground">No media files yet</p>
               <Button variant="outline" className="mt-4" onClick={() => fileInputRef.current?.click()}>
                 Upload your first file
               </Button>
             </div>
           ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {filteredMedia?.map((item) => (
                 <div
                   key={item.id}
                   className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted cursor-pointer hover:border-primary transition-colors"
                   onClick={() => {
                     setSelectedMedia(item);
                     setAltText(item.alt_text || '');
                   }}
                 >
                   {item.file_type.startsWith('image/') ? (
                     <img
                       src={item.file_url}
                       alt={item.alt_text || item.name}
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="flex items-center justify-center h-full">
                       <ImageIcon className="h-8 w-8 text-muted-foreground" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-white text-xs px-2 text-center truncate">
                       {item.name}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </CardContent>
       </Card>
 
       {/* Media Detail Dialog */}
       <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle>Media Details</DialogTitle>
           </DialogHeader>
           {selectedMedia && (
             <div className="grid md:grid-cols-2 gap-6">
               <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                 {selectedMedia.file_type.startsWith('image/') ? (
                   <img
                     src={selectedMedia.file_url}
                     alt={selectedMedia.alt_text || selectedMedia.name}
                     className="w-full h-full object-contain"
                   />
                 ) : (
                   <div className="flex items-center justify-center h-full">
                     <ImageIcon className="h-16 w-16 text-muted-foreground" />
                   </div>
                 )}
               </div>
               <div className="space-y-4">
                 <div>
                   <p className="text-sm font-medium text-muted-foreground">Name</p>
                   <p className="text-sm truncate">{selectedMedia.name}</p>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-muted-foreground">Size</p>
                   <p className="text-sm">{formatFileSize(selectedMedia.file_size)}</p>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-muted-foreground">Type</p>
                   <p className="text-sm">{selectedMedia.file_type}</p>
                 </div>
                 <div>
                   <p className="text-sm font-medium text-muted-foreground mb-1">Alt Text</p>
                   <Input
                     value={altText}
                     onChange={(e) => setAltText(e.target.value)}
                     placeholder="Describe this image"
                   />
                   <Button
                     size="sm"
                     className="mt-2"
                     onClick={handleSaveAlt}
                     disabled={updateAlt.isPending}
                   >
                     Save Alt Text
                   </Button>
                 </div>
                 <div className="flex gap-2 pt-4">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => handleCopyUrl(selectedMedia.file_url)}
                   >
                     <Copy className="mr-2 h-4 w-4" />
                     Copy URL
                   </Button>
                   <Button
                     variant="destructive"
                     size="sm"
                     onClick={() => setDeleteTarget(selectedMedia)}
                   >
                     <Trash2 className="mr-2 h-4 w-4" />
                     Delete
                   </Button>
                 </div>
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>
 
       {/* Delete Confirmation */}
       <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Delete File?</AlertDialogTitle>
             <AlertDialogDescription>
               This action cannot be undone. This will permanently delete the file.
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