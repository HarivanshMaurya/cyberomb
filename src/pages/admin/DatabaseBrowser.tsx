import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Database, Table, Search, Trash2, Pencil, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const TABLES = [
  'articles', 'authors', 'categories', 'hero_content', 'media',
  'navbar_config', 'page_sections', 'pages', 'products',
  'reading_analytics', 'site_sections', 'site_settings',
  'user_roles', 'profiles', 'newsletter_subscribers',
] as const;

type TableName = typeof TABLES[number];

const PAGE_SIZE = 20;

export default function DatabaseBrowser() {
  const queryClient = useQueryClient();
  const [selectedTable, setSelectedTable] = useState<TableName>('articles');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [editRow, setEditRow] = useState<Record<string, any> | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['db-browser', selectedTable, page],
    queryFn: async () => {
      const { data, error, count } = await (supabase
        .from(selectedTable) as any)
        .select('*', { count: 'exact' })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { rows: data ?? [], count: count ?? 0 };
    },
  });

  const rows = data?.rows ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const filteredRows = search
    ? rows.filter((row: any) =>
        Object.values(row).some(v =>
          String(v ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : rows;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this row?')) return;
    const { error } = await (supabase.from(selectedTable) as any).delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Row deleted');
      refetch();
    }
  };

  const handleEdit = (row: Record<string, any>) => {
    setEditRow(row);
    const vals: Record<string, string> = {};
    Object.entries(row).forEach(([k, v]) => {
      vals[k] = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v ?? '');
    });
    setEditValues(vals);
  };

  const handleSave = async () => {
    if (!editRow) return;
    const updates: Record<string, any> = {};
    Object.entries(editValues).forEach(([key, val]) => {
      if (key === 'id' || key === 'created_at') return;
      const original = editRow[key];
      if (typeof original === 'object' && original !== null) {
        try { updates[key] = JSON.parse(val); } catch { updates[key] = val; }
      } else if (typeof original === 'number') {
        updates[key] = Number(val);
      } else if (typeof original === 'boolean') {
        updates[key] = val === 'true';
      } else {
        updates[key] = val || null;
      }
    });

    const { error } = await (supabase.from(selectedTable) as any)
      .update(updates)
      .eq('id', editRow.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Row updated');
      setEditRow(null);
      refetch();
    }
  };

  const truncate = (val: any, max = 60) => {
    const s = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—');
    return s.length > max ? s.slice(0, max) + '…' : s;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8 text-primary" />
            Database Browser
          </h1>
          <p className="text-muted-foreground mt-1">View and manage all database tables</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedTable} onValueChange={(v) => { setSelectedTable(v as TableName); setPage(0); setSearch(''); }}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TABLES.map(t => (
              <SelectItem key={t} value={t}>
                <span className="flex items-center gap-2">
                  <Table className="h-3 w-3" /> {t}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search in results..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Badge variant="secondary" className="self-center">{totalCount} rows</Badge>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredRows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No data found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {columns.slice(0, 8).map(col => (
                      <th key={col} className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">
                        {col.replace(/_/g, ' ')}
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-xs uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row: any, idx: number) => (
                    <tr key={row.id ?? idx} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      {columns.slice(0, 8).map(col => (
                        <td key={col} className="px-3 py-2.5 max-w-[200px] whitespace-nowrap">
                          {col === 'is_active' || col === 'is_published' || col === 'show_logo' || col === 'show_site_name' ? (
                            <Badge variant={row[col] ? 'default' : 'secondary'}>{row[col] ? 'Yes' : 'No'}</Badge>
                          ) : (
                            <span className="text-foreground" title={String(row[col] ?? '')}>
                              {truncate(row[col])}
                            </span>
                          )}
                        </td>
                      ))}
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(row)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(row.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Row</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {editRow && Object.keys(editRow).map(key => (
              <div key={key}>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{key}</label>
                {key === 'id' || key === 'created_at' ? (
                  <Input value={editValues[key] ?? ''} disabled className="mt-1 bg-muted/30" />
                ) : (editValues[key]?.length ?? 0) > 100 ? (
                  <Textarea
                    value={editValues[key] ?? ''}
                    onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                    className="mt-1 font-mono text-xs"
                    rows={4}
                  />
                ) : (
                  <Input
                    value={editValues[key] ?? ''}
                    onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                    className="mt-1"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRow(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
