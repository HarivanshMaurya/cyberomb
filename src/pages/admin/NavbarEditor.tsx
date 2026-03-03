import { useState, useEffect } from 'react';
import { useNavbarConfig, useUpdateNavbarConfig, NavLink } from '@/hooks/useNavbarConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, GripVertical, Save, Eye, EyeOff } from 'lucide-react';
import { useMedia } from '@/hooks/useMedia';

export default function NavbarEditor() {
  const { data: config, isLoading } = useNavbarConfig();
  const updateConfig = useUpdateNavbarConfig();
  const { toast } = useToast();
  const { data: mediaFiles } = useMedia();

  const [siteName, setSiteName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [showSiteName, setShowSiteName] = useState(true);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    if (config) {
      setSiteName(config.site_name);
      setLogoUrl(config.logo_url || '');
      setShowLogo(config.show_logo);
      setShowSiteName(config.show_site_name);
      setNavLinks([...config.nav_links].sort((a, b) => a.order - b.order));
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig.mutateAsync({
        site_name: siteName,
        logo_url: logoUrl || null,
        show_logo: showLogo,
        show_site_name: showSiteName,
        nav_links: navLinks as any,
      });
      toast({ title: 'Navbar updated successfully!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const addLink = () => {
    setNavLinks([
      ...navLinks,
      { label: 'New Link', href: '/', visible: true, order: navLinks.length + 1 },
    ]);
  };

  const removeLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof NavLink, value: any) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [field]: value };
    setNavLinks(updated);
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === navLinks.length - 1)) return;
    const updated = [...navLinks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    updated.forEach((link, i) => (link.order = i + 1));
    setNavLinks(updated);
  };

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Navbar Editor</h1>
          <p className="text-muted-foreground mt-1">Customize your site's navigation bar</p>
        </div>
        <Button onClick={handleSave} disabled={updateConfig.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {updateConfig.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Your Site Name" />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://... or select from media" />
              {logoUrl && (
                <img src={logoUrl} alt="Logo preview" className="w-10 h-10 rounded-lg object-contain border" />
              )}
            </div>
          </div>

          {/* Media picker */}
          {mediaFiles && mediaFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Or pick from Media Library:</Label>
              <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto">
                {mediaFiles
                  .filter((m) => m.file_type.startsWith('image/'))
                  .slice(0, 12)
                  .map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setLogoUrl(m.file_url)}
                      className={`w-12 h-12 rounded border-2 overflow-hidden transition-all ${logoUrl === m.file_url ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                    >
                      <img src={m.file_url} alt={m.alt_text || m.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={showLogo} onCheckedChange={setShowLogo} />
              <Label>Show Logo</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showSiteName} onCheckedChange={setShowSiteName} />
              <Label>Show Site Name</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Navigation Links</CardTitle>
          <Button variant="outline" size="sm" onClick={addLink}>
            <Plus className="h-4 w-4 mr-1" /> Add Link
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {navLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveLink(index, 'up')} disabled={index === 0} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▲</button>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <button onClick={() => moveLink(index, 'down')} disabled={index === navLinks.length - 1} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▼</button>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="text-sm"
                />
                <Input
                  value={link.href}
                  onChange={(e) => updateLink(index, 'href', e.target.value)}
                  placeholder="/path"
                  className="text-sm"
                />
              </div>

              <button
                onClick={() => updateLink(index, 'visible', !link.visible)}
                className="p-1.5 rounded hover:bg-muted"
                title={link.visible ? 'Visible' : 'Hidden'}
              >
                {link.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              </button>

              <button
                onClick={() => removeLink(index)}
                className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {navLinks.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No navigation links. Click "Add Link" to create one.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
