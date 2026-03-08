import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Languages, Loader2 } from 'lucide-react';
import {
  useTranslationLanguages,
  useCreateLanguage,
  useUpdateLanguage,
  useDeleteLanguage,
  TranslationLanguage,
} from '@/hooks/useTranslationLanguages';

function LangForm({
  initial,
  onSubmit,
  loading,
}: {
  initial?: Partial<TranslationLanguage>;
  onSubmit: (data: { code: string; label: string; sublabel: string; sort_order: number; is_active: boolean }) => void;
  loading: boolean;
}) {
  const [code, setCode] = useState(initial?.code || '');
  const [label, setLabel] = useState(initial?.label || '');
  const [sublabel, setSublabel] = useState(initial?.sublabel || '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ code: code.trim().toLowerCase(), label: label.trim(), sublabel: sublabel.trim(), sort_order: sortOrder, is_active: isActive });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Language Code</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. ja, zh, es" required />
          <p className="text-xs text-muted-foreground mt-1">ISO code (hi, mr, ja, zh, etc.)</p>
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </div>
      </div>
      <div>
        <Label>Native Label</Label>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. 日本語, 中文, Español" required />
        <p className="text-xs text-muted-foreground mt-1">Language name in its own script</p>
      </div>
      <div>
        <Label>English Label</Label>
        <Input value={sublabel} onChange={(e) => setSublabel(e.target.value)} placeholder="e.g. Japanese, Chinese, Spanish" required />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={isActive} onCheckedChange={setIsActive} />
        <Label>Active</Label>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {initial?.id ? 'Update Language' : 'Add Language'}
      </Button>
    </form>
  );
}

export default function LanguagesManager() {
  const { data: languages = [], isLoading } = useTranslationLanguages();
  const createLang = useCreateLanguage();
  const updateLang = useUpdateLanguage();
  const deleteLang = useDeleteLanguage();
  const [editItem, setEditItem] = useState<TranslationLanguage | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Languages className="w-6 h-6" /> Translation Languages
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage languages available for eBook translation. Add any language and it will appear in the reader's translate dropdown.
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Language</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Language</DialogTitle></DialogHeader>
            <LangForm
              loading={createLang.isPending}
              onSubmit={(data) => {
                createLang.mutate(data, { onSuccess: () => setAddOpen(false) });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>All Languages</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
          ) : languages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No languages added yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Native Label</TableHead>
                  <TableHead>English</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.map((lang) => (
                  <TableRow key={lang.id}>
                    <TableCell className="font-mono font-bold">{lang.code}</TableCell>
                    <TableCell className="text-lg">{lang.label}</TableCell>
                    <TableCell>{lang.sublabel}</TableCell>
                    <TableCell>{lang.sort_order}</TableCell>
                    <TableCell>
                      <Switch
                        checked={lang.is_active}
                        onCheckedChange={(checked) =>
                          updateLang.mutate({ id: lang.id, is_active: checked })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditItem(lang); setEditOpen(true); }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm(`Delete "${lang.sublabel}"?`)) deleteLang.mutate(lang.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Language</DialogTitle></DialogHeader>
          {editItem && (
            <LangForm
              initial={editItem}
              loading={updateLang.isPending}
              onSubmit={(data) => {
                updateLang.mutate({ id: editItem.id, ...data }, { onSuccess: () => setEditOpen(false) });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
