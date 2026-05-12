import { useEffect, useState } from 'react';
import { Plus, Trash2, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Pagination from '@/components/Pagination';
import AdminService from '@/app/services/AdminService';
import CreateAdminForm from './CreateAdminForm';
import DeleteAdminConfirm from './DeleteAdminConfirm';

interface Admin { id: string; fullName: string; username: string; phoneNumber: string; role: number; status: number; shopName: string | null; createdAt: string; }
type View = 'list' | 'create';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [deleteAdmin, setDeleteAdmin] = useState<Admin | null>(null);

  const fetchAdmins = async (p = page, s = search) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 10 };
      if (s) params.search = s;
      const result = await new AdminService().getAdmins(params);
      setAdmins(result.records);
      setPagination(result.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmins(); }, []);
  const handleSearch = () => { setPage(1); fetchAdmins(1, search); };
  const handlePageChange = (p: number) => { setPage(p); fetchAdmins(p, search); };

  if (view === 'create') return <div className="animate-fade-in"><CreateAdminForm onBack={() => setView('list')} onCreated={() => { setView('list'); fetchAdmins(1, ''); }} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Adminlar</h1>
          <p className="text-sm text-muted-foreground">{pagination.totalCount} ta admin</p>
        </div>
        <Button onClick={() => setView('create')}><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline"> Yangi admin</span></Button>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="pl-9" />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12"><Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">Adminlar topilmadi</p></div>
      ) : (
        <div className="grid gap-3">
          {admins.map(admin => (
            <Card key={admin.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{admin.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">@{admin.username}</span>
                  <span className="text-sm text-muted-foreground">· {admin.phoneNumber}</span>
                  {admin.shopName && <span className="text-sm text-muted-foreground">· {admin.shopName}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{admin.role === 1 ? 'SuperAdmin' : 'Shop Admin'}</Badge>
                <Badge variant={admin.status === 1 ? 'success' : 'destructive'}>{admin.status === 1 ? 'Aktiv' : 'Noaktiv'}</Badge>
                <Button variant="ghost" size="icon" onClick={() => setDeleteAdmin(admin)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
      {deleteAdmin && <DeleteAdminConfirm admin={deleteAdmin} onClose={() => setDeleteAdmin(null)} onDeleted={() => { setDeleteAdmin(null); fetchAdmins(); }} />}
    </div>
  );
}
