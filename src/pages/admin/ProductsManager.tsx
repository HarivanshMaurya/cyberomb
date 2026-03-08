import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "@/hooks/useProducts";
import { useActiveTranslationLanguages } from "@/hooks/useTranslationLanguages";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Pencil, Trash2, BookOpen, X, Languages, Loader2, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const emptyForm = {
  title: "",
  description: "",
  long_description: "",
  image: "",
  price: 0,
  buy_link: "#",
  is_active: true,
  sort_order: 0,
  author: "",
  pages_count: 0,
  language: "Hindi",
  gallery_images: [] as string[],
  table_of_contents: [] as { title: string; page?: string }[],
  chapters: [] as { title: string; content: string }[],
  slug: "",
};

const ProductsManager = () => {
  const { data: products, isLoading, refetch } = useProducts();
  const { data: activeLangs = [] } = useActiveTranslationLanguages();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newTocTitle, setNewTocTitle] = useState("");
  const [newTocPage, setNewTocPage] = useState("");
  const [preTranslating, setPreTranslating] = useState<string | null>(null);
  const [preTranslateProgress, setPreTranslateProgress] = useState({ langIdx: 0, batchIdx: 0, totalBatches: 0, langName: "", totalLangs: 0 });

  // Pre-translate all chapters for all active languages
  const handlePreTranslate = async (product: Product) => {
    if (preTranslating || !product.chapters?.length || !activeLangs.length) return;
    setPreTranslating(product.id);
    
    const BATCH_SIZE = 3;
    const allTranslations: Record<string, { title: string; content: string }[]> = {};
    
    // Load existing translations from DB
    try {
      const { data: existing } = await supabase
        .from("products" as any)
        .select("translations")
        .eq("id", product.id)
        .single();
      if (existing && (existing as any).translations) {
        Object.assign(allTranslations, (existing as any).translations);
      }
    } catch {}
    
    let failed = false;
    
    for (let langIdx = 0; langIdx < activeLangs.length; langIdx++) {
      const lang = activeLangs[langIdx];
      
      // Skip if already translated
      if (allTranslations[lang.code]?.length === product.chapters.length) continue;
      
      const totalBatches = Math.ceil(product.chapters.length / BATCH_SIZE);
      setPreTranslateProgress({ langIdx: langIdx + 1, batchIdx: 0, totalBatches, langName: lang.sublabel, totalLangs: activeLangs.length });
      
      const translated: { title: string; content: string }[] = [];
      
      for (let b = 0; b < totalBatches; b++) {
        setPreTranslateProgress(prev => ({ ...prev, batchIdx: b + 1 }));
        const batch = product.chapters.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
        
        try {
          const { data, error } = await supabase.functions.invoke('translate-ebook', {
            body: { chapters: batch, targetLang: lang.code, langName: `${lang.label} (${lang.sublabel})` },
          });
          if (error) throw error;
          if (data?.error) throw new Error(data.error);
          translated.push(...(data?.chapters || batch));
        } catch (err: any) {
          console.error(`Pre-translate failed for ${lang.code} batch ${b}:`, err);
          toast.error(`Failed translating ${lang.sublabel}: ${err.message}`);
          failed = true;
          break;
        }
      }
      
      if (failed) break;
      allTranslations[lang.code] = translated;
      
      // Save after each language completes
      await supabase
        .from("products" as any)
        .update({ translations: allTranslations } as any)
        .eq("id", product.id);
    }
    
    setPreTranslating(null);
    if (!failed) {
      toast.success(`All ${activeLangs.length} languages pre-translated & saved! Users will get instant translation now.`);
      refetch();
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description || "",
      long_description: p.long_description || "",
      image: p.image || "",
      price: p.price,
      buy_link: p.buy_link,
      is_active: p.is_active,
      sort_order: p.sort_order,
      author: p.author || "",
      pages_count: p.pages_count || 0,
      language: p.language || "Hindi",
      gallery_images: p.gallery_images || [],
      table_of_contents: p.table_of_contents || [],
      chapters: p.chapters || [],
      slug: p.slug || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const payload = {
      ...form,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    };
    if (editingId) {
      await updateProduct.mutateAsync({ id: editingId, ...payload });
    } else {
      await createProduct.mutateAsync(payload);
    }
    setDialogOpen(false);
  };

  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setForm({ ...form, gallery_images: [...form.gallery_images, newGalleryUrl.trim()] });
    setNewGalleryUrl("");
  };

  const removeGalleryImage = (i: number) => {
    setForm({ ...form, gallery_images: form.gallery_images.filter((_, idx) => idx !== i) });
  };

  const addTocItem = () => {
    if (!newTocTitle.trim()) return;
    setForm({
      ...form,
      table_of_contents: [...form.table_of_contents, { title: newTocTitle.trim(), page: newTocPage.trim() || undefined }],
    });
    setNewTocTitle("");
    setNewTocPage("");
  };

  const removeTocItem = (i: number) => {
    setForm({ ...form, table_of_contents: form.table_of_contents.filter((_, idx) => idx !== i) });
  };

  const addChapter = () => {
    setForm({ ...form, chapters: [...form.chapters, { title: "", content: "" }] });
  };

  const updateChapter = (i: number, field: "title" | "content", value: string) => {
    const updated = [...form.chapters];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, chapters: updated });
  };

  const removeChapter = (i: number) => {
    setForm({ ...form, chapters: form.chapters.filter((_, idx) => idx !== i) });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            eBooks Manager
          </h1>
          <p className="text-muted-foreground mt-1">Manage ebooks / buying cards shown on the Travel page</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" /> Add eBook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit eBook" : "Add eBook"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Book name" />
                </div>
                <div>
                  <Label>Author</Label>
                  <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-title" />
                </div>
              </div>

              <div>
                <Label>Short Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="One-liner about the book" rows={2} />
              </div>

              <div>
                <Label>Detailed Description</Label>
                <Textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} placeholder="Full book description..." rows={5} />
              </div>

              {/* Cover Image */}
              <div>
                <Label>Cover Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                {form.image && <img src={form.image} alt="Cover" className="mt-2 h-32 object-cover rounded-lg" />}
              </div>

              {/* Gallery */}
              <div>
                <Label>Gallery Images</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={newGalleryUrl} onChange={(e) => setNewGalleryUrl(e.target.value)} placeholder="Image URL" className="flex-1" />
                  <Button type="button" variant="outline" onClick={addGalleryImage}>Add</Button>
                </div>
                {form.gallery_images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {form.gallery_images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-16 h-20 object-cover rounded-lg border border-border" />
                        <button onClick={() => removeGalleryImage(i)} className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Meta */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} />
                </div>
                <div>
                  <Label>Pages</Label>
                  <Input type="number" value={form.pages_count} onChange={(e) => setForm({ ...form, pages_count: Number(e.target.value) })} min={0} />
                </div>
                <div>
                  <Label>Language</Label>
                  <Input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Buy Link</Label>
                  <Input value={form.buy_link} onChange={(e) => setForm({ ...form, buy_link: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <Label>Sort Order</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
                </div>
              </div>

              {/* Table of Contents */}
              <div>
                <Label>Table of Contents</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={newTocTitle} onChange={(e) => setNewTocTitle(e.target.value)} placeholder="Chapter title" className="flex-1" />
                  <Input value={newTocPage} onChange={(e) => setNewTocPage(e.target.value)} placeholder="Page" className="w-20" />
                  <Button type="button" variant="outline" onClick={addTocItem}>Add</Button>
                </div>
                {form.table_of_contents.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                    {form.table_of_contents.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-muted rounded-lg text-sm">
                        <span>{i + 1}. {item.title} {item.page && <span className="text-muted-foreground ml-1">(p. {item.page})</span>}</span>
                        <button onClick={() => removeTocItem(i)} className="text-destructive hover:text-destructive/80">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chapter Content Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Chapter Content Editor</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addChapter}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Chapter
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Write full eBook content chapter by chapter using the rich text editor.</p>

                {form.chapters.length > 0 && (
                  <Accordion type="multiple" className="space-y-2">
                    {form.chapters.map((chapter, i) => (
                      <AccordionItem key={i} value={`chapter-${i}`} className="border rounded-lg px-3">
                        <div className="flex items-center gap-2">
                          <AccordionTrigger className="flex-1 py-3">
                            <span className="text-sm font-medium">
                              Chapter {i + 1}{chapter.title ? `: ${chapter.title}` : ""}
                            </span>
                          </AccordionTrigger>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeChapter(i); }}
                            className="text-destructive hover:text-destructive/80 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <AccordionContent className="space-y-3 pb-4">
                          <div>
                            <Label className="text-xs">Chapter Title</Label>
                            <Input
                              value={chapter.title}
                              onChange={(e) => updateChapter(i, "title", e.target.value)}
                              placeholder={`Chapter ${i + 1} title`}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Chapter Content</Label>
                            <RichTextEditor
                              content={chapter.content}
                              onChange={(val) => updateChapter(i, "content", val)}
                              placeholder="Write chapter content here..."
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

                {form.chapters.length === 0 && (
                  <div className="border border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground">
                    No chapters added yet. Click "Add Chapter" to start writing.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <Label>Active</Label>
              </div>

              <Button onClick={handleSave} className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>
                {editingId ? "Update" : "Create"} eBook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!products?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No ebooks yet. Click "Add eBook" to create your first one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((p) => (
            <Card key={p.id} className={!p.is_active ? "opacity-50" : ""}>
              <CardContent className="flex items-center gap-4 py-4">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-14 h-18 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-18 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    ₹{p.price.toLocaleString('en-IN')} • {p.author || "No author"} • /{p.slug || "no-slug"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{p.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProduct.mutate(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsManager;
