import { useState, useEffect } from 'react';
import {
  useAllSectionCards,
  useUpdateSectionCards,
  SectionCard,
} from '@/hooks/useSectionCards';
import { useArticles } from '@/hooks/useArticles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Save, Trash2, Loader2, Heart, Plane, GripVertical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const defaultCard: SectionCard = {
  id: '',
  title: '',
  description: '',
  image: '',
  link: '',
};

interface ArticleOption {
  slug: string;
  title: string;
  featured_image: string | null;
}

interface CardEditorProps {
  cards: SectionCard[];
  onChange: (cards: SectionCard[]) => void;
  articleOptions?: ArticleOption[];
}

const CardEditor = ({ cards, onChange, articleOptions = [] }: CardEditorProps) => {
  const addCard = () => {
    onChange([...cards, { ...defaultCard, id: crypto.randomUUID() }]);
  };

  const updateCard = (index: number, field: keyof SectionCard, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onChange(newCards);
  };

  const removeCard = (index: number) => {
    onChange(cards.filter((_, i) => i !== index));
  };

  const applyArticle = (index: number, slug: string) => {
    const selected = articleOptions.find((a) => a.slug === slug);
    if (!selected) return;

    // Always set link to the dynamic blog page
    updateCard(index, 'link', `/blog/${selected.slug}`);

    // Helpful defaults (only fill if empty)
    if (!cards[index]?.title?.trim()) updateCard(index, 'title', selected.title);
    if (!cards[index]?.image?.trim() && selected.featured_image) {
      updateCard(index, 'image', selected.featured_image);
    }
  };

  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <Card key={card.id || index} className="relative">
          <CardContent className="pt-6 space-y-4">
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => removeCard(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {articleOptions.length > 0 && (
              <div>
                <Label>Choose existing article (optional)</Label>
                <Select onValueChange={(slug) => applyArticle(index, slug)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an article…" />
                  </SelectTrigger>
                  <SelectContent>
                    {articleOptions.map((a) => (
                      <SelectItem key={a.slug} value={a.slug}>
                        {a.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  This will set Link to <span className="font-mono">/blog/&lt;slug&gt;</span>.
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Title</Label>
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(index, 'title', e.target.value)}
                  placeholder="Card title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={card.link}
                  onChange={(e) => updateCard(index, 'link', e.target.value)}
                  placeholder="Paste full URL, /blog/article-slug, or just article-slug"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={card.description}
                onChange={(e) => updateCard(index, 'description', e.target.value)}
                placeholder="Brief description"
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Image URL</Label>
              <Input
                value={card.image}
                onChange={(e) => updateCard(index, 'image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
              {card.image && (
                <img
                  src={card.image}
                  alt={card.title}
                  className="mt-2 h-32 w-full object-cover rounded-md"
                  loading="lazy"
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addCard} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Card
      </Button>
    </div>
  );
};

export default function SectionCardsManager() {
  const { data: sections, isLoading } = useAllSectionCards();
  const updateSection = useUpdateSectionCards();
  const { data: articles } = useArticles();

  const [wellnessCards, setWellnessCards] = useState<SectionCard[]>([]);
  const [travelCards, setTravelCards] = useState<SectionCard[]>([]);

  const wellnessArticleOptions: ArticleOption[] =
    articles
      ?.filter((a) => a.category?.toLowerCase() === 'wellness')
      .map((a) => ({ slug: a.slug, title: a.title, featured_image: a.featured_image })) || [];

  const travelArticleOptions: ArticleOption[] =
    articles
      ?.filter((a) => a.category?.toLowerCase() === 'travel')
      .map((a) => ({ slug: a.slug, title: a.title, featured_image: a.featured_image })) || [];

  useEffect(() => {
    if (sections) {
      const wellness = sections.find((s) => s.section_key === 'wellness_cards');
      const travel = sections.find((s) => s.section_key === 'travel_cards');

      if (wellness?.content?.cards) {
        setWellnessCards(wellness.content.cards);
      }
      if (travel?.content?.cards) {
        setTravelCards(travel.content.cards);
      }
    }
  }, [sections]);

  const saveWellnessCards = async () => {
    await updateSection.mutateAsync({
      sectionKey: 'wellness_cards',
      sectionName: 'Wellness Featured Cards',
      cards: wellnessCards,
    });
  };

  const saveTravelCards = async () => {
    await updateSection.mutateAsync({
      sectionKey: 'travel_cards',
      sectionName: 'Travel Featured Cards',
      cards: travelCards,
    });
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
        <h1 className="text-3xl font-bold">Section Cards</h1>
        <p className="text-muted-foreground mt-2">
          Manage featured cards for Wellness and Travel pages (separate from Articles)
        </p>
      </div>

      <Tabs defaultValue="wellness">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wellness" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Wellness Cards
          </TabsTrigger>
          <TabsTrigger value="travel" className="flex items-center gap-2">
            <Plane className="h-4 w-4" />
            Travel Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wellness">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Wellness Featured Cards
              </CardTitle>
              <CardDescription>
                These cards appear on the Wellness page navbar section, separate from article cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardEditor
                cards={wellnessCards}
                onChange={setWellnessCards}
                articleOptions={wellnessArticleOptions}
              />
              <Button
                onClick={saveWellnessCards}
                disabled={updateSection.isPending}
                className="w-full sm:w-auto"
              >
                {updateSection.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Wellness Cards
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Travel Featured Cards
              </CardTitle>
              <CardDescription>
                These cards appear on the Travel page navbar section, separate from article cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardEditor
                cards={travelCards}
                onChange={setTravelCards}
                articleOptions={travelArticleOptions}
              />
              <Button
                onClick={saveTravelCards}
                disabled={updateSection.isPending}
                className="w-full sm:w-auto"
              >
                {updateSection.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Travel Cards
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
