import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Store, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Pagination from '@/components/Pagination';
import ShopService from '@/app/services/ShopService';
import CreateShopForm from './CreateShopForm';
import EditShopForm from './EditShopForm';
import DeleteShopConfirm from './DeleteShopConfirm';

interface Shop {
  id: string;
  slug: string;
  logo: string | null;
  coverImage: string | null;
  phone: string | null;
  address: string | null;
  status: number;
  translations: { language: string; name: string; description: string | null }[];
  flowerCount: number;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

type View = 'list' | 'create' | 'edit';

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [deleteShop, setDeleteShop] = useState<Shop | null>(null);

  const fetchShops = async (p = page, s = search) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 10 };
      if (s) params.search = s;
      const result = await new ShopService().getShops(params);
      setShops(result.records);
      setPagination(result.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchShops(1, search);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchShops(p, search);
  };

  const handleCreated = () => {
    setView('list');
    fetchShops(1, '');
  };

  const handleUpdated = () => {
    setView('list');
    setSelectedShop(null);
    fetchShops();
  };

  const handleDeleted = () => {
    setDeleteShop(null);
    fetchShops();
  };

  const getName = (shop: Shop) => shop.translations.find(t => t.language === 'uz')?.name || shop.slug;

  if (view === 'create') {
    return <CreateShopForm onBack={() => setView('list')} onCreated={handleCreated} />;
  }

  if (view === 'edit' && selectedShop) {
    return <EditShopForm shop={selectedShop} onBack={() => { setView('list'); setSelectedShop(null); }} onUpdated={handleUpdated} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Do'konlar</h1>
          <p className="text-sm text-muted-foreground">{pagination.totalCount} ta do'kon</p>
        </div>
        <Button onClick={() => setView('create')} size="sm" className="sm:size-default">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Yangi do'kon</span>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>
      ) : shops.length === 0 ? (
        <div className="text-center py-12">
          <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Do'konlar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {shops.map(shop => (
            <Card key={shop.id} className="p-4">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    {shop.logo ? (
                      <img src={shop.logo} alt="" className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover" />
                    ) : (
                      <Store className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{getName(shop)}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                      <span className="text-xs sm:text-sm text-muted-foreground">{shop.slug}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">· {shop.flowerCount} ta gul</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={shop.status === 1 ? 'success' : 'destructive'} className="hidden sm:inline-flex">
                    {shop.status === 1 ? 'Aktiv' : 'Noaktiv'}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedShop(shop); setView('edit'); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteShop(shop)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />

      {deleteShop && (
        <DeleteShopConfirm shop={deleteShop} onClose={() => setDeleteShop(null)} onDeleted={handleDeleted} />
      )}
    </div>
  );
}
