import { useState } from 'react';
import { useMedia, useUploadMedia } from '@/hooks/useMedia';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageIcon, Upload, Search, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function MediaPicker({ value, onChange, label = 'Select Image' }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data: media, isLoading } = useMedia();
  const uploadMedia = useUploadMedia();

  const images = (media || []).filter(
    (m) => m.file_type.startsWith('image/') && m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadMedia.mutateAsync(file);
    onChange(result.file_url);
    setOpen(false);
  };

  const handleSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or select from library"
          className="flex-1"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon" title={label}>
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Media Library</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search images..."
                  className="pl-9"
                />
              </div>
              <label>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                <Button type="button" variant="outline" className="gap-2 cursor-pointer" asChild>
                  <span>
                    {uploadMedia.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload
                  </span>
                </Button>
              </label>
            </div>

            <ScrollArea className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-1">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:ring-2 hover:ring-primary/50',
                        value === img.file_url ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                      )}
                      onClick={() => handleSelect(img.file_url)}
                    >
                      <img
                        src={img.file_url}
                        alt={img.alt_text || img.name}
                        className="w-full h-full object-cover"
                      />
                      {value === img.file_url && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-foreground/60 text-primary-foreground text-[10px] px-1.5 py-0.5 truncate">
                        {img.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {value && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}
