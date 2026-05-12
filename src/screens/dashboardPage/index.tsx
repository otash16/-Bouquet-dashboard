import { useEffect, useState } from 'react';
import { Store, Flower, FolderTree, Users, Receipt, Eye, UserPlus, CalendarDays, TrendingUp } from 'lucide-react';
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
  users: {
    total: number;
    monthlyNew: number;
  };
  visits: {
    total: number;
    monthly: number;
    today: number;
  };
  visitChart: { date: string; label: string; count: number }[];
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

function VisitChart({ data }: { data: { label: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="flex items-end gap-[3px] h-40 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover border rounded px-1.5 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {d.label}: {d.count}
          </div>
          <div
            className="w-full bg-primary/80 rounded-t-sm min-h-[2px] transition-all duration-300 hover:bg-primary"
            style={{ height: `${(d.count / maxCount) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

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
      <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>

      {/* Asosiy statistika */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {statCards.map(card => (
          <Card key={card.key}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">
                    {stats.counts[card.key]}
                  </p>
                </div>
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-muted flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User va Visit statistika */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Jami userlar</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.users.total}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-muted flex items-center justify-center text-cyan-500">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Oylik yangi</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.users.monthlyNew}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-muted flex items-center justify-center text-emerald-500">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Bugungi tashriflar</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.visits.today}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-muted flex items-center justify-center text-orange-500">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Oylik tashriflar</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.visits.monthly}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-muted flex items-center justify-center text-indigo-500">
                <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visit grafik */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tashriflar (oxirgi 30 kun)
            </CardTitle>
            <span className="text-sm text-muted-foreground">Jami: {stats.visits.total}</span>
          </div>
        </CardHeader>
        <CardContent>
          <VisitChart data={stats.visitChart} />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{stats.visitChart[0]?.label}</span>
            <span>{stats.visitChart[stats.visitChart.length - 1]?.label}</span>
          </div>
        </CardContent>
      </Card>

      {/* Oxirgi do'konlar */}
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
                    <span className="text-xs text-muted-foreground hidden sm:inline">
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
