import { useEffect, useState } from 'react';
import { Plus, Receipt, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Pagination from '@/components/Pagination';
import SubscriptionService from '@/app/services/SubscriptionService';
import CreateSubscriptionForm from './CreateSubscriptionForm';
import { format } from 'date-fns';

interface Subscription { id: string; shopName: string; tariffName: string; tariffPrice: number; flowerLimit: number; startDate: string; endDate: string; status: number; createdAt: string; }
type View = 'list' | 'create';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');

  const fetchSubs = async (p = page) => {
    setLoading(true);
    try { const r = await new SubscriptionService().getSubscriptions({ page: p, limit: 10 }); setSubs(r.records); setPagination(r.pagination); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleCancel = async (id: string) => {
    try { await new SubscriptionService().cancelSubscription(id); fetchSubs(); }
    catch { console.error('Cancel failed'); }
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) return <Badge variant="success">Aktiv</Badge>;
    if (status === -1) return <Badge variant="secondary">Noaktiv</Badge>;
    return <Badge variant="destructive">Tugagan</Badge>;
  };

  const formatPrice = (p: number) => p.toLocaleString('uz-UZ') + " so'm";

  if (view === 'create') return <CreateSubscriptionForm onBack={() => setView('list')} onCreated={() => { setView('list'); fetchSubs(1); }} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl sm:text-2xl font-bold">Obunalar</h1><p className="text-sm text-muted-foreground">{pagination.totalCount} ta obuna</p></div>
        <Button onClick={() => setView('create')}><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline"> Obuna</span> qo'shish</Button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>
      ) : subs.length === 0 ? (
        <div className="text-center py-12"><Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">Obunalar topilmadi</p></div>
      ) : (
        <div className="grid gap-3">
          {subs.map(sub => (
            <Card key={sub.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{sub.shopName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-primary font-medium">{sub.tariffName}</span>
                  <span className="text-sm text-muted-foreground">· {formatPrice(sub.tariffPrice)}</span>
                  <span className="text-sm text-muted-foreground">· {format(new Date(sub.startDate), 'dd.MM.yyyy')} - {format(new Date(sub.endDate), 'dd.MM.yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(sub.status)}
                {sub.status === 1 && (
                  <Button variant="ghost" size="sm" onClick={() => handleCancel(sub.id)}>
                    <XCircle className="h-4 w-4 text-destructive mr-1" /> Bekor qilish
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={p => { setPage(p); fetchSubs(p); }} />
    </div>
  );
}
