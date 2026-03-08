import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Users, Shield, Search, Trash2, UserCheck, Eye, Copy, RefreshCw, Key, Mail, Clock, Fingerprint } from 'lucide-react';

type AuthUser = {
  id: string;
  email: string;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  provider: string;
  providers: string[];
  is_anonymous: boolean;
};

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const queryClient = useQueryClient();

  // Fetch auth users from edge function
  const { data: authUsers, isLoading: authLoading } = useQuery({
    queryKey: ['admin-auth-users'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('list-users');
      if (error) throw error;
      return (data?.users ?? []) as AuthUser[];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error) throw error;
      return data;
    },
  });

  const getUserRole = (userId: string) => roles?.find(r => r.user_id === userId)?.role ?? 'user';
  const getProfile = (userId: string) => profiles?.find(p => p.user_id === userId);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    const existing = roles?.find(r => r.user_id === userId);
    if (existing) {
      const { error } = await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: newRole });
      if (error) { toast.error(error.message); return; }
    }
    toast.success(`Role updated to ${newRole}`);
    queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
  };

  const handleDeleteProfile = async (userId: string, email: string) => {
    if (!confirm(`Remove ${email}'s profile?`)) return;
    const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
    if (error) toast.error(error.message);
    else {
      toast.success('Profile removed');
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const users = authUsers ?? profiles?.map(p => ({
    id: p.user_id,
    email: p.email,
    phone: null,
    created_at: p.created_at,
    last_sign_in_at: null,
    email_confirmed_at: null,
    provider: 'email',
    providers: ['email'],
    is_anonymous: false,
  })) ?? [];

  const filtered = users.filter(u =>
    (u.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => getUserRole(u.id) === 'admin').length;

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleString() : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">View all users, their IDs, login info and manage roles</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-auth-users'] });
          queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
          queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
        }}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{users.length}</div></CardContent>
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
          <CardContent><div className="text-3xl font-bold">{users.length - adminCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Email Verified</CardTitle>
            <Mail className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{users.filter(u => u.email_confirmed_at).length}</div></CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-start gap-3">
        <Key className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium">Password Security</p>
          <p className="text-muted-foreground">Passwords are securely hashed and cannot be viewed. You can see User IDs, emails, login provider, last sign-in time, and email verification status.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by email or user ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {authLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">User ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Provider</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Sign In</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => {
                    const role = getUserRole(user.id);
                    const profile = getProfile(user.id);
                    return (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {(profile?.full_name ?? user.email)?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="font-medium">{profile?.full_name ?? '—'}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono max-w-[120px] truncate" title={user.id}>
                              {user.id.slice(0, 8)}...
                            </code>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(user.id)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs capitalize">{user.provider}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Select value={role} onValueChange={(v) => handleRoleChange(user.id, v as 'admin' | 'user')}>
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(user.last_sign_in_at)}
                        </td>
                        <td className="px-4 py-3">
                          {user.email_confirmed_at ? (
                            <Badge className="text-xs">Verified</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Unverified</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedUser(user)} title="View details">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteProfile(user.id, user.email ?? '')} title="Delete profile">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
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

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(o) => !o && setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                {[
                  { label: 'User ID', value: selectedUser.id, copyable: true },
                  { label: 'Email', value: selectedUser.email, copyable: true },
                  { label: 'Phone', value: selectedUser.phone ?? 'Not set' },
                  { label: 'Auth Provider', value: selectedUser.provider },
                  { label: 'All Providers', value: selectedUser.providers?.join(', ') },
                  { label: 'Email Verified', value: selectedUser.email_confirmed_at ? `Yes (${formatDate(selectedUser.email_confirmed_at)})` : 'No' },
                  { label: 'Account Created', value: formatDate(selectedUser.created_at) },
                  { label: 'Last Sign In', value: formatDate(selectedUser.last_sign_in_at) },
                  { label: 'Role', value: getUserRole(selectedUser.id) },
                  { label: 'Password', value: '••••••••  (securely hashed, cannot be viewed)' },
                ].map(item => (
                  <div key={item.label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-muted-foreground shrink-0 w-32">{item.label}</span>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-sm font-medium break-all">{item.value}</span>
                      {'copyable' in item && item.copyable && (
                        <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0" onClick={() => copyToClipboard(item.value ?? '')}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {getProfile(selectedUser.id) && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Profile Data</p>
                  {[
                    { label: 'Full Name', value: getProfile(selectedUser.id)?.full_name ?? '—' },
                    { label: 'Avatar', value: getProfile(selectedUser.id)?.avatar_url ?? 'Not set' },
                    { label: 'Profile Created', value: formatDate(getProfile(selectedUser.id)?.created_at ?? null) },
                  ].map(item => (
                    <div key={item.label} className="flex items-start justify-between gap-4">
                      <span className="text-sm text-muted-foreground shrink-0 w-32">{item.label}</span>
                      <span className="text-sm font-medium break-all">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
