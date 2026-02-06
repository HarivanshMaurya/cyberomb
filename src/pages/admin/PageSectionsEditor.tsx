import { useState } from 'react';
import { useAllPageSections, useUpdatePageSection, PageSection } from '@/hooks/usePageSections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, FileText, Plane, Heart, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PageSectionsEditor = () => {
  const { data: pages, isLoading } = useAllPageSections();
  const updatePage = useUpdatePageSection();
  const [editingPage, setEditingPage] = useState<PageSection | null>(null);

  const handleSave = async () => {
    if (!editingPage) return;
    await updatePage.mutateAsync({
      id: editingPage.id,
      title: editingPage.title,
      subtitle: editingPage.subtitle,
      content: editingPage.content,
    });
  };

  const updateContent = (key: string, value: any) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      content: { ...editingPage.content, [key]: value },
    });
  };

  const updateValue = (values: any[]) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      content: { ...editingPage.content, values },
    });
  };

  const getPageIcon = (key: string) => {
    switch (key) {
      case 'wellness': return <Heart className="h-4 w-4" />;
      case 'travel': return <Plane className="h-4 w-4" />;
      case 'about': return <Info className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page Sections</h1>
        <p className="text-muted-foreground mt-2">
          Edit content for Wellness, Travel, and About pages
        </p>
      </div>

      <Tabs defaultValue={pages?.[0]?.page_key || 'wellness'} onValueChange={(key) => {
        const page = pages?.find(p => p.page_key === key);
        setEditingPage(page ? { ...page } : null);
      }}>
        <TabsList className="grid w-full grid-cols-3">
          {pages?.map((page) => (
            <TabsTrigger key={page.page_key} value={page.page_key} className="flex items-center gap-2">
              {getPageIcon(page.page_key)}
              {page.page_name.replace(' Page', '')}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages?.map((page) => (
          <TabsContent key={page.page_key} value={page.page_key}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getPageIcon(page.page_key)}
                  {page.page_name}
                </CardTitle>
                <CardDescription>
                  Edit the content displayed on the {page.page_name.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Fields */}
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`${page.page_key}-title`}>Page Title</Label>
                    <Input
                      id={`${page.page_key}-title`}
                      defaultValue={page.title}
                      onChange={(e) => {
                        if (editingPage?.page_key === page.page_key) {
                          setEditingPage({ ...editingPage, title: e.target.value });
                        } else {
                          setEditingPage({ ...page, title: e.target.value });
                        }
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${page.page_key}-subtitle`}>Page Subtitle</Label>
                    <Textarea
                      id={`${page.page_key}-subtitle`}
                      defaultValue={page.subtitle || ''}
                      onChange={(e) => {
                        if (editingPage?.page_key === page.page_key) {
                          setEditingPage({ ...editingPage, subtitle: e.target.value });
                        } else {
                          setEditingPage({ ...page, subtitle: e.target.value });
                        }
                      }}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Page-specific content */}
                {page.page_key === 'wellness' && (
                  <WellnessEditor 
                    content={editingPage?.page_key === 'wellness' ? editingPage.content : page.content}
                    onChange={(key, value) => {
                      if (editingPage?.page_key !== 'wellness') {
                        setEditingPage({ ...page });
                      }
                      updateContent(key, value);
                    }}
                  />
                )}

                {page.page_key === 'travel' && (
                  <TravelEditor 
                    content={editingPage?.page_key === 'travel' ? editingPage.content : page.content}
                    onChange={(key, value) => {
                      if (editingPage?.page_key !== 'travel') {
                        setEditingPage({ ...page });
                      }
                      updateContent(key, value);
                    }}
                  />
                )}

                {page.page_key === 'about' && (
                  <AboutEditor 
                    content={editingPage?.page_key === 'about' ? editingPage.content : page.content}
                    onChange={(key, value) => {
                      if (editingPage?.page_key !== 'about') {
                        setEditingPage({ ...page });
                      }
                      updateContent(key, value);
                    }}
                    onValuesChange={(values) => {
                      if (editingPage?.page_key !== 'about') {
                        setEditingPage({ ...page, content: { ...page.content, values } });
                      } else {
                        updateValue(values);
                      }
                    }}
                  />
                )}

                <Button 
                  onClick={handleSave} 
                  disabled={updatePage.isPending || !editingPage}
                  className="w-full sm:w-auto"
                >
                  {updatePage.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Wellness page editor
const WellnessEditor = ({ content, onChange }: { content: any; onChange: (key: string, value: any) => void }) => (
  <div className="space-y-4 border-t pt-4">
    <h3 className="font-semibold">Featured Section</h3>
    <div>
      <Label>Section Title</Label>
      <Input
        value={content?.section_title || ''}
        onChange={(e) => onChange('section_title', e.target.value)}
        className="mt-1"
      />
    </div>
    <div>
      <Label>Section Content</Label>
      <Textarea
        value={content?.section_content || ''}
        onChange={(e) => onChange('section_content', e.target.value)}
        className="mt-1"
        rows={6}
      />
    </div>
  </div>
);

// Travel page editor
const TravelEditor = ({ content, onChange }: { content: any; onChange: (key: string, value: any) => void }) => (
  <div className="space-y-4 border-t pt-4">
    <h3 className="font-semibold">Philosophy Section</h3>
    <div>
      <Label>Section Title</Label>
      <Input
        value={content?.section_title || ''}
        onChange={(e) => onChange('section_title', e.target.value)}
        className="mt-1"
      />
    </div>
    <div>
      <Label>Section Content</Label>
      <Textarea
        value={content?.section_content || ''}
        onChange={(e) => onChange('section_content', e.target.value)}
        className="mt-1"
        rows={6}
      />
    </div>
  </div>
);

// About page editor
const AboutEditor = ({ 
  content, 
  onChange, 
  onValuesChange 
}: { 
  content: any; 
  onChange: (key: string, value: any) => void;
  onValuesChange: (values: any[]) => void;
}) => {
  const values = content?.values || [];
  
  const updateValueItem = (index: number, field: string, value: string) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: value };
    onValuesChange(newValues);
  };

  return (
    <div className="space-y-6 border-t pt-4">
      {/* Story Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">Story Section</h3>
        <div>
          <Label>Story Title</Label>
          <Input
            value={content?.story_title || ''}
            onChange={(e) => onChange('story_title', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Story Content</Label>
          <Textarea
            value={content?.story_content || ''}
            onChange={(e) => onChange('story_content', e.target.value)}
            className="mt-1"
            rows={6}
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">Mission Section</h3>
        <div>
          <Label>Mission Title</Label>
          <Input
            value={content?.mission_title || ''}
            onChange={(e) => onChange('mission_title', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Mission Content</Label>
          <Textarea
            value={content?.mission_content || ''}
            onChange={(e) => onChange('mission_content', e.target.value)}
            className="mt-1"
            rows={4}
          />
        </div>
        <div>
          <Label>Mission Points (one per line)</Label>
          <Textarea
            value={(content?.mission_points || []).join('\n')}
            onChange={(e) => onChange('mission_points', e.target.value.split('\n').filter(Boolean))}
            className="mt-1"
            rows={4}
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">Values Section</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((val: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-4 space-y-2">
                <Input
                  placeholder="Value title"
                  value={val.title || ''}
                  onChange={(e) => updateValueItem(index, 'title', e.target.value)}
                />
                <Textarea
                  placeholder="Value description"
                  value={val.description || ''}
                  onChange={(e) => updateValueItem(index, 'description', e.target.value)}
                  rows={2}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="space-y-4">
        <h3 className="font-semibold">CTA Section</h3>
        <div>
          <Label>CTA Title</Label>
          <Input
            value={content?.cta_title || ''}
            onChange={(e) => onChange('cta_title', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>CTA Description</Label>
          <Textarea
            value={content?.cta_description || ''}
            onChange={(e) => onChange('cta_description', e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default PageSectionsEditor;
