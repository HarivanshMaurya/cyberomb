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
import { PageBuilder } from '@/components/admin/page-builder/PageBuilder';
import { BlockRenderer } from '@/components/page-blocks/BlockRenderer';
import { PageBlock } from '@/components/admin/page-builder/types';
import { Loader2, Save, ArrowLeft, Eye, EyeOff, LayoutGrid, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  const [sections, setSections] = useState<PageBlock[]>([]);
  const [editorMode, setEditorMode] = useState<'builder' | 'classic'>('builder');
  const [showPreview, setShowPreview] = useState(false);

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
      const raw = page as any;
      if (Array.isArray(raw.sections) && raw.sections.length > 0) {
        setSections(raw.sections);
        setEditorMode('builder');
      } else if (page.content) {
        setEditorMode('classic');
      }
    }
  }, [page, isNew]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
    const payload: any = { ...formData };

    if (isNew) {
      createPage.mutate(payload, {
        onSuccess: async (data) => {
          if (editorMode === 'builder' && sections.length > 0) {
            await supabase.from('pages').update({ sections } as any).eq('id', data.id);
          }
          navigate(`/admin/pages/${data.id}`);
        },
      });
    } else {
      updatePage.mutate({ id: id!, ...payload }, {
        onSuccess: async () => {
          if (editorMode === 'builder') {
            await supabase.from('pages').update({ sections } as any).eq('id', id!);
          }
        },
      });
    }
  };

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Preview mode
  if (showPreview && editorMode === 'builder') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold">Live Preview</h2>
              <p className="text-sm text-muted-foreground">This is how your page will look</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowPreview(false)} className="gap-2">
            <EyeOff className="h-4 w-4" />
            Back to Editor
          </Button>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-background shadow-lg">
          {/* Simulated page header */}
          <div className="border-b border-border px-6 py-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold">{formData.title || 'Untitled Page'}</h1>
          </div>
          {/* Rendered blocks */}
          {sections.length > 0 ? (
            <BlockRenderer blocks={sections} />
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>No blocks to preview. Add some blocks first!</p>
            </div>
          )}
        </div>
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
            <p className="text-muted-foreground mt-1">{isNew ? 'Create a new page' : 'Edit your page'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editorMode === 'builder' && sections.length > 0 && (
            <Button variant="outline" className="gap-2" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          )}
          {!isNew && page?.is_published && (
            <Button variant="outline" asChild>
              <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                View Live
              </a>
            </Button>
          )}
        </div>
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
                      <Input id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter page title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="page-url-slug" required />
                    </div>
                  </CardContent>
                </Card>

                {/* Editor Mode Toggle */}
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1.5 w-fit">
                  <Button type="button" variant={editorMode === 'builder' ? 'default' : 'ghost'} size="sm" className="gap-2" onClick={() => setEditorMode('builder')}>
                    <LayoutGrid className="h-4 w-4" />
                    Page Builder
                  </Button>
                  <Button type="button" variant={editorMode === 'classic' ? 'default' : 'ghost'} size="sm" className="gap-2" onClick={() => setEditorMode('classic')}>
                    <FileText className="h-4 w-4" />
                    Classic Editor
                  </Button>
                </div>

                {editorMode === 'builder' ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <LayoutGrid className="h-5 w-5" />
                            Page Builder
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">Drag & drop blocks to build your page</p>
                        </div>
                        {sections.length > 0 && (
                          <Button type="button" variant="ghost" size="sm" className="gap-1.5" onClick={() => setShowPreview(true)}>
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <PageBuilder blocks={sections} onChange={setSections} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                    <CardContent>
                      <div className="border border-input rounded-lg overflow-hidden">
                        <textarea
                          className="w-full min-h-[300px] p-4 bg-background text-foreground resize-y"
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Write your page content (HTML supported)..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_published">Published</Label>
                      <Switch id="is_published" checked={formData.is_published} onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })} />
                    </div>
                    <Button type="submit" className="w-full" disabled={createPage.isPending || updatePage.isPending}>
                      {createPage.isPending || updatePage.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                      ) : (
                        <><Save className="mr-2 h-4 w-4" />{isNew ? 'Create Page' : 'Save Changes'}</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {editorMode === 'builder' && sections.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Block Summary</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {sections.map((s, i) => (
                          <div key={s.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{i + 1}</span>
                            <span className="capitalize">{s.type.replace('_', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input id="meta_title" value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} placeholder="SEO title" maxLength={60} />
                  <p className="text-xs text-muted-foreground">{formData.meta_title.length}/60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea id="meta_description" value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} placeholder="SEO description" maxLength={160} rows={3} />
                  <p className="text-xs text-muted-foreground">{formData.meta_description.length}/160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="og_image">Open Graph Image URL</Label>
                  <Input id="og_image" value={formData.og_image} onChange={(e) => setFormData({ ...formData, og_image: e.target.value })} placeholder="https://example.com/og-image.jpg" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
