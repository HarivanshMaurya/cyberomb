 import { useEditor, EditorContent } from '@tiptap/react';
 import StarterKit from '@tiptap/starter-kit';
 import Link from '@tiptap/extension-link';
 import Image from '@tiptap/extension-image';
 import Placeholder from '@tiptap/extension-placeholder';
 import { Table } from '@tiptap/extension-table';
 import { TableRow } from '@tiptap/extension-table-row';
 import { TableCell } from '@tiptap/extension-table-cell';
 import { TableHeader } from '@tiptap/extension-table-header';
 import { Button } from '@/components/ui/button';
 import {
   Bold,
   Italic,
   Strikethrough,
   List,
   ListOrdered,
   Quote,
   Code,
   Heading1,
   Heading2,
   Heading3,
   Link as LinkIcon,
   Image as ImageIcon,
   Table as TableIcon,
   Undo,
   Redo,
   Minus,
 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { useEffect } from 'react';
 
 interface RichTextEditorProps {
   content: string;
   onChange: (content: string) => void;
   placeholder?: string;
 }
 
 export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
   const editor = useEditor({
     extensions: [
       StarterKit.configure({
         heading: {
           levels: [1, 2, 3],
         },
       }),
       Link.configure({
         openOnClick: false,
       }),
       Image,
       Table.configure({
         resizable: true,
       }),
       TableRow,
       TableHeader,
       TableCell,
       Placeholder.configure({
         placeholder,
       }),
     ],
     content,
     onUpdate: ({ editor }) => {
       onChange(editor.getHTML());
     },
   });
 
   useEffect(() => {
     if (editor && content !== editor.getHTML()) {
       editor.commands.setContent(content);
     }
   }, [content, editor]);
 
   if (!editor) {
     return null;
   }
 
   const addLink = () => {
     const url = window.prompt('Enter URL');
     if (url) {
       editor.chain().focus().setLink({ href: url }).run();
     }
   };
 
   const addImage = () => {
     const url = window.prompt('Enter image URL');
     if (url) {
       editor.chain().focus().setImage({ src: url }).run();
     }
   };
 
   const addTable = () => {
     editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
   };
 
   return (
     <div className="border border-input rounded-lg overflow-hidden">
       {/* Toolbar */}
       <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b border-input">
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('bold') && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleBold().run()}
         >
           <Bold className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('italic') && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleItalic().run()}
         >
           <Italic className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('strike') && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleStrike().run()}
         >
           <Strikethrough className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('code') && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleCode().run()}
         >
           <Code className="h-4 w-4" />
         </Button>
 
         <div className="w-px bg-border mx-1" />
 
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('heading', { level: 1 }) && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
         >
           <Heading1 className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('heading', { level: 2 }) && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
         >
           <Heading2 className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('heading', { level: 3 }) && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
         >
           <Heading3 className="h-4 w-4" />
         </Button>
 
         <div className="w-px bg-border mx-1" />
 
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('bulletList') && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleBulletList().run()}
         >
           <List className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('orderedList') && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleOrderedList().run()}
         >
           <ListOrdered className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('blockquote') && 'bg-muted')}
           onClick={() => editor.chain().focus().toggleBlockquote().run()}
         >
           <Quote className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className="h-8 w-8"
           onClick={() => editor.chain().focus().setHorizontalRule().run()}
         >
           <Minus className="h-4 w-4" />
         </Button>
 
         <div className="w-px bg-border mx-1" />
 
         <Button
           variant="ghost"
           size="icon"
           className={cn('h-8 w-8', editor.isActive('link') && 'bg-muted')}
           onClick={addLink}
         >
           <LinkIcon className="h-4 w-4" />
         </Button>
         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addImage}>
           <ImageIcon className="h-4 w-4" />
         </Button>
         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={addTable}>
           <TableIcon className="h-4 w-4" />
         </Button>
 
         <div className="w-px bg-border mx-1" />
 
         <Button
           variant="ghost"
           size="icon"
           className="h-8 w-8"
           onClick={() => editor.chain().focus().undo().run()}
           disabled={!editor.can().undo()}
         >
           <Undo className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className="h-8 w-8"
           onClick={() => editor.chain().focus().redo().run()}
           disabled={!editor.can().redo()}
         >
           <Redo className="h-4 w-4" />
         </Button>
       </div>
 
       {/* Editor Content */}
       <EditorContent
         editor={editor}
         className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
       />
     </div>
   );
 }