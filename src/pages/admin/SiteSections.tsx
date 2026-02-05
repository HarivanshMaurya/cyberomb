 import { useState } from 'react';
 import { useSiteSections, useUpdateSiteSection } from '@/hooks/useSiteSections';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { Loader2, Save, Globe } from 'lucide-react';
 import type { Json } from '@/integrations/supabase/types';
 
 export default function SiteSections() {
   const { data: sections, isLoading } = useSiteSections();
   const updateSection = useUpdateSiteSection();
 
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editContent, setEditContent] = useState<Record<string, string>>({});
 
   const handleEdit = (section: { id: string; content: Json }) => {
     setEditingId(section.id);
     const content = section.content as Record<string, unknown>;
     const stringContent: Record<string, string> = {};
     Object.keys(content).forEach((key) => {
       stringContent[key] = String(content[key] || '');
     });
     setEditContent(stringContent);
   };
 
   const handleSave = (sectionId: string) => {
     updateSection.mutate({
       id: sectionId,
       content: editContent as unknown as Json,
     });
     setEditingId(null);
   };
 
   const handleCancel = () => {
     setEditingId(null);
     setEditContent({});
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
           <h1 className="text-3xl font-bold">Site Content</h1>
           <p className="text-muted-foreground mt-1">
             Edit text content across your website
           </p>
         </div>
         <Button variant="outline" asChild>
           <a href="/" target="_blank" rel="noopener noreferrer">
             <Globe className="mr-2 h-4 w-4" />
             View Site
           </a>
         </Button>
       </div>
 
       <div className="grid gap-6">
         {sections?.map((section) => {
           const isEditing = editingId === section.id;
           const content = section.content as Record<string, unknown>;
 
           return (
             <Card key={section.id}>
               <CardHeader>
                 <CardTitle>{section.section_name}</CardTitle>
                 <CardDescription>Key: {section.section_key}</CardDescription>
               </CardHeader>
               <CardContent>
                 {isEditing ? (
                   <div className="space-y-4">
                     {Object.keys(editContent).map((key) => (
                       <div key={key} className="space-y-2">
                         <Label htmlFor={key} className="capitalize">
                           {key.replace(/_/g, ' ')}
                         </Label>
                         {editContent[key].length > 100 ? (
                           <Textarea
                             id={key}
                             value={editContent[key]}
                             onChange={(e) =>
                               setEditContent({ ...editContent, [key]: e.target.value })
                             }
                             rows={4}
                           />
                         ) : (
                           <Input
                             id={key}
                             value={editContent[key]}
                             onChange={(e) =>
                               setEditContent({ ...editContent, [key]: e.target.value })
                             }
                           />
                         )}
                       </div>
                     ))}
                     <div className="flex gap-2">
                       <Button
                         onClick={() => handleSave(section.id)}
                         disabled={updateSection.isPending}
                       >
                         {updateSection.isPending ? (
                           <>
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                             Saving...
                           </>
                         ) : (
                           <>
                             <Save className="mr-2 h-4 w-4" />
                             Save
                           </>
                         )}
                       </Button>
                       <Button variant="outline" onClick={handleCancel}>
                         Cancel
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {Object.entries(content).map(([key, value]) => (
                       <div key={key} className="space-y-1">
                         <p className="text-sm font-medium text-muted-foreground capitalize">
                           {key.replace(/_/g, ' ')}
                         </p>
                         <p className="text-sm">{String(value)}</p>
                       </div>
                     ))}
                     <Button variant="outline" onClick={() => handleEdit(section)}>
                       Edit Content
                     </Button>
                   </div>
                 )}
               </CardContent>
             </Card>
           );
         })}
       </div>
     </div>
   );
 }