import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings2, Globe, Share2, FileText, Mail, Save } from 'lucide-react';

type SettingsData = Record<string, any>;

function useSettingByKey(key: string) {
  return useQuery({
    queryKey: ['site-setting', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();
      if (error) throw error;
      return data?.value as SettingsData | null;
    },
  });
}

function SettingsSection({ settingKey, title, fields }: {
  settingKey: string;
  title: string;
  fields: { name: string; label: string; type?: 'text' | 'textarea' | 'url'; placeholder?: string }[];
}) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useSettingByKey(settingKey);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Sync loaded data
  const currentValues = { ...data, ...values };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', settingKey)
        .maybeSingle();

      const payload = { key: settingKey, value: currentValues };

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: currentValues, updated_at: new Date().toISOString() })
          .eq('key', settingKey);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert(payload);
        if (error) throw error;
      }

      toast.success(`${title} saved`);
      setValues({});
      queryClient.invalidateQueries({ queryKey: ['site-setting', settingKey] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          fields.map(field => (
            <div key={field.name}>
              <Label className="text-sm">{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={currentValues[field.name] ?? ''}
                  onChange={e => setValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <Input
                  type={field.type === 'url' ? 'url' : 'text'}
                  value={currentValues[field.name] ?? ''}
                  onChange={e => setValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="mt-1"
                />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function SiteSettingsHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings2 className="h-8 w-8 text-primary" />
          Site Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage all site-wide settings from one place</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="general" className="gap-2"><Globe className="h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="social" className="gap-2"><Share2 className="h-4 w-4" /> Social</TabsTrigger>
          <TabsTrigger value="contact" className="gap-2"><Mail className="h-4 w-4" /> Contact</TabsTrigger>
          <TabsTrigger value="footer" className="gap-2"><FileText className="h-4 w-4" /> Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <SettingsSection
            settingKey="general"
            title="General Settings"
            fields={[
              { name: 'site_title', label: 'Site Title', placeholder: 'Cyberॐ' },
              { name: 'site_tagline', label: 'Tagline', placeholder: 'Your site tagline' },
              { name: 'site_description', label: 'Site Description', type: 'textarea', placeholder: 'Brief description of your site' },
              { name: 'default_language', label: 'Default Language', placeholder: 'Hindi / English' },
              { name: 'analytics_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX' },
            ]}
          />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SettingsSection
            settingKey="social_links"
            title="Social Media Links"
            fields={[
              { name: 'instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
              { name: 'twitter', label: 'Twitter / X URL', type: 'url', placeholder: 'https://x.com/...' },
              { name: 'facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/...' },
              { name: 'youtube', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/...' },
              { name: 'linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
              { name: 'telegram', label: 'Telegram URL', type: 'url', placeholder: 'https://t.me/...' },
            ]}
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <SettingsSection
            settingKey="contact_info"
            title="Contact Information"
            fields={[
              { name: 'email', label: 'Contact Email', placeholder: 'hello@example.com' },
              { name: 'phone', label: 'Phone Number', placeholder: '+91 XXXXXXXXXX' },
              { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Your business address' },
              { name: 'whatsapp', label: 'WhatsApp Number', placeholder: '+91 XXXXXXXXXX' },
            ]}
          />
        </TabsContent>

        <TabsContent value="footer" className="space-y-6">
          <SettingsSection
            settingKey="footer"
            title="Footer Settings"
            fields={[
              { name: 'copyright_text', label: 'Copyright Text', placeholder: '© 2026 Cyberॐ. All rights reserved.' },
              { name: 'footer_tagline', label: 'Footer Tagline', type: 'textarea', placeholder: 'A short description for the footer' },
              { name: 'powered_by', label: 'Powered By Text', placeholder: 'Made with ❤️' },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
