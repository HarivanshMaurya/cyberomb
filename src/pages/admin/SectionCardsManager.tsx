import { useState, useEffect } from 'react';
import {
  useAllSectionCards,
  useUpdateSectionCards,
  SectionCard,
} from '@/hooks/useSectionCards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Trash2, Loader2, Heart, Plane, GripVertical } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const defaultCard: SectionCard = {
  id: '',
  title: '',
  description: '',
  image: '',
  link: '',
};

interface CardEditorProps {
  cards: SectionCard[];
  onChange: (cards: SectionCard[]) => void;
}

const CardEditor = ({ cards, onChange }: CardEditorProps) => {
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
                  placeholder="/blog/article-slug"
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

  const [wellnessCards, setWellnessCards] = useState<SectionCard[]>([]);
  const [travelCards, setTravelCards] = useState<SectionCard[]>([]);

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
              <CardEditor cards={wellnessCards} onChange={setWellnessCards} />
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
              <CardEditor cards={travelCards} onChange={setTravelCards} />
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
