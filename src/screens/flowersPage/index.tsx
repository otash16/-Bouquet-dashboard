import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Flower, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Pagination from '@/components/Pagination';
import FlowerService from '@/app/services/FlowerService';
import CreateFlowerForm from './CreateFlowerForm';
import EditFlowerForm from './EditFlowerForm';
import DeleteFlowerConfirm from './DeleteFlowerConfirm';

interface FlowerItem {
  id: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  status: number;
  shopId: string;
  shopName: string;
  categoryName: string | null;
  translations: { language: string; name: string; description: string | null }[];
  createdAt: string;
}

type View = 'list' | 'create' | 'edit';

export default function FlowersPage() {
  const [flowers, setFlowers] = useState<FlowerItem[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [selectedFlower, setSelectedFlower] = useState<FlowerItem | null>(null);
  const [deleteFlower, setDeleteFlower] = useState<FlowerItem | null>(null);

  const fetchFlowers = async (p = page, s = search) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 10 };
      if (s) params.search = s;
      const result = await new FlowerService().getFlowers(params);
      setFlowers(result.records);
      setPagination(result.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFlowers(); }, []);

  const handleSearch = () => { setPage(1); fetchFlowers(1, search); };
  const handlePageChange = (p: number) => { setPage(p); fetchFlowers(p, search); };
  const getName = (f: FlowerItem) => f.translations.find(t => t.language === 'uz')?.name || 'Nomsiz';

  const formatPrice = (price: number) => price.toLocaleString('uz-UZ') + " so'm";

  if (view === 'create') return <CreateFlowerForm onBack={() => setView('list')} onCreated={() => { setView('list'); fetchFlowers(1, ''); }} />;
  if (view === 'edit' && selectedFlower) return <EditFlowerForm flower={selectedFlower} onBack={() => { setView('list'); setSelectedFlower(null); }} onUpdated={() => { setView('list'); setSelectedFlower(null); fetchFlowers(); }} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Gullar</h1>
          <p className="text-sm text-muted-foreground">{pagination.totalCount} ta gul</p>
        </div>
        <Button onClick={() => setView('create')}><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline"> Yangi gul</span></Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>
      ) : flowers.length === 0 ? (
        <div className="text-center py-12">
          <Flower className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Gullar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {flowers.map(flower => (
            <Card key={flower.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {flower.images[0] ? (
                    <img src={flower.images[0]} alt="" className="h-12 w-12 object-cover" />
                  ) : (
                    <Flower className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{getName(flower)}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-primary">{formatPrice(flower.price)}</span>
                    {flower.discountPrice && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(flower.discountPrice)}</span>
                    )}
                    <span className="text-sm text-muted-foreground">· {flower.shopName}</span>
                    {flower.categoryName && <span className="text-sm text-muted-foreground">· {flower.categoryName}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={flower.status === 1 ? 'success' : 'destructive'}>{flower.status === 1 ? 'Aktiv' : 'Noaktiv'}</Badge>
                <Button variant="ghost" size="icon" onClick={() => { setSelectedFlower(flower); setView('edit'); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteFlower(flower)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
      {deleteFlower && <DeleteFlowerConfirm flower={deleteFlower} onClose={() => setDeleteFlower(null)} onDeleted={() => { setDeleteFlower(null); fetchFlowers(); }} />}
    </div>
  );
}
