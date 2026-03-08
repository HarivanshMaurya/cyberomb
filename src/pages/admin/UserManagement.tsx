import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Shield, Search, Trash2, UserPlus, UserCheck, UserX } from 'lucide-react';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const getUserRole = (userId: string) => {
    return roles?.find(r => r.user_id === userId)?.role ?? 'user';
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    const existing = roles?.find(r => r.user_id === userId);
    
    if (existing) {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });
      if (error) { toast.error(error.message); return; }
    }

    toast.success(`Role updated to ${newRole}`);
    queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}'s profile? This won't delete their auth account.`)) return;
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Profile removed');
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    }
  };

  const filtered = profiles?.filter(p =>
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const adminCount = profiles?.filter(p => getUserRole(p.user_id) === 'admin').length ?? 0;
  const totalUsers = profiles?.length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">Manage registered users and their roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{totalUsers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            <Shield className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{adminCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Regular Users</CardTitle>
            <UserCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{totalUsers - adminCount}</div></CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => {
                    const role = getUserRole(user.user_id);
                    return (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {(user.full_name ?? user.email)?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium">{user.full_name ?? '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <Select value={role} onValueChange={(v) => handleRoleChange(user.user_id, v as 'admin' | 'user')}>
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteUser(user.user_id, user.email)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
