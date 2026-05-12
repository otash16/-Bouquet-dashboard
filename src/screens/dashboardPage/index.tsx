import { useEffect, useState } from 'react';
import { Store, Flower, FolderTree, Users, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatsService from '@/app/services/StatsService';
import { format } from 'date-fns';

interface Stats {
  counts: {
    shops: number;
    flowers: number;
    categories: number;
    admins: number;
    activeSubscriptions: number;
  };
  recentShops: {
    id: string;
    name: string;
    status: number;
    flowerCount: number;
    createdAt: string;
  }[];
}

const statCards = [
  { key: 'shops', label: "Do'konlar", icon: Store, color: 'text-blue-500' },
  { key: 'flowers', label: 'Gullar', icon: Flower, color: 'text-pink-500' },
  { key: 'categories', label: 'Kategoriyalar', icon: FolderTree, color: 'text-amber-500' },
  { key: 'admins', label: 'Adminlar', icon: Users, color: 'text-violet-500' },
  { key: 'activeSubscriptions', label: 'Aktiv obunalar', icon: Receipt, color: 'text-green-500' },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    new StatsService()
      .getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>;
  }

  if (!stats) {
    return <div className="text-center py-12 text-muted-foreground">Ma'lumot topilmadi</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map(card => (
          <Card key={card.key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-3xl font-bold mt-1">
                    {stats.counts[card.key]}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oxirgi qo'shilgan do'konlar</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentShops.length === 0 ? (
            <p className="text-sm text-muted-foreground">Hali do'kon qo'shilmagan</p>
          ) : (
            <div className="space-y-3">
              {stats.recentShops.map(shop => (
                <div key={shop.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Store className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{shop.name}</p>
                      <p className="text-xs text-muted-foreground">{shop.flowerCount} ta gul</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={shop.status === 1 ? 'success' : 'destructive'}>
                      {shop.status === 1 ? 'Aktiv' : 'Noaktiv'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(shop.createdAt), 'dd.MM.yyyy')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
