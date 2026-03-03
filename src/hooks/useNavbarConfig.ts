import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NavLink {
  label: string;
  href: string;
  visible: boolean;
  order: number;
}

export interface NavbarConfig {
  id: string;
  site_name: string;
  logo_url: string | null;
  show_logo: boolean;
  show_site_name: boolean;
  nav_links: NavLink[];
  updated_at: string;
}

export function useNavbarConfig() {
  return useQuery({
    queryKey: ['navbar-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('navbar_config')
        .select('*')
        .limit(1)
        .single();
      if (error) throw error;
      return {
        ...data,
        nav_links: (data.nav_links as unknown as NavLink[]) || [],
      } as NavbarConfig;
    },
  });
}

export function useUpdateNavbarConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Omit<NavbarConfig, 'id' | 'updated_at'>>) => {
      // Get the current config id first
      const { data: existing } = await supabase
        .from('navbar_config')
        .select('id')
        .limit(1)
        .single();

      if (!existing) throw new Error('No navbar config found');

      const { data, error } = await supabase
        .from('navbar_config')
        .update(updates as any)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['navbar-config'] });
    },
  });
}
