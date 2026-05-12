import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Pagination from '@/components/Pagination';
import TariffService from '@/app/services/TariffService';
import CreateTariffForm from './CreateTariffForm';
import DeleteTariffConfirm from './DeleteTariffConfirm';

interface Tariff { id: string; price: number; durationDays: number; flowerLimit: number; status: number; translations: { language: string; name: string; description: string }[]; subscriptionCount: number; createdAt: string; }
type View = 'list' | 'create';

export default function TariffsPage() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [deleteTariff, setDeleteTariff] = useState<Tariff | null>(null);

  const fetchTariffs = async (p = page) => {
    setLoading(true);
    try { const r = await new TariffService().getTariffs({ page: p, limit: 10 }); setTariffs(r.records); setPagination(r.pagination); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTariffs(); }, []);
  const getName = (t: Tariff) => t.translations.find(tr => tr.language === 'uz')?.name || 'Nomsiz';
  const formatPrice = (p: number) => p.toLocaleString('uz-UZ') + " so'm";

  if (view === 'create') return <div className="animate-fade-in"><CreateTariffForm onBack={() => setView('list')} onCreated={() => { setView('list'); fetchTariffs(1); }} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl sm:text-2xl font-bold">Tariflar</h1><p className="text-sm text-muted-foreground">{pagination.totalCount} ta tarif</p></div>
        <Button onClick={() => setView('create')}><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline"> Yangi tarif</span></Button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>
      ) : tariffs.length === 0 ? (
        <div className="text-center py-12"><CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" /><p className="text-muted-foreground">Tariflar topilmadi</p></div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tariffs.map(tariff => (
            <Card key={tariff.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{getName(tariff)}</h3>
                <Badge variant={tariff.status === 1 ? 'success' : 'destructive'}>{tariff.status === 1 ? 'Aktiv' : 'Noaktiv'}</Badge>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{formatPrice(tariff.price)}</div>
              <p className="text-sm text-muted-foreground mb-4">{tariff.durationDays} kun</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Gul limiti</span><span>{tariff.flowerLimit === 0 ? 'Cheksiz' : tariff.flowerLimit}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Obunalar</span><span>{tariff.subscriptionCount}</span></div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={() => setDeleteTariff(tariff)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={p => { setPage(p); fetchTariffs(p); }} />
      {deleteTariff && <DeleteTariffConfirm tariff={deleteTariff} onClose={() => setDeleteTariff(null)} onDeleted={() => { setDeleteTariff(null); fetchTariffs(); }} />}
    </div>
  );
}
