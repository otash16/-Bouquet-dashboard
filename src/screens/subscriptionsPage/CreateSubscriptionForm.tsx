import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SubscriptionService from '@/app/services/SubscriptionService';
import ShopService from '@/app/services/ShopService';
import TariffService from '@/app/services/TariffService';

interface Props { onBack: () => void; onCreated: () => void; }

export default function CreateSubscriptionForm({ onBack, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shops, setShops] = useState<{ id: string; translations: { name: string }[] }[]>([]);
  const [tariffs, setTariffs] = useState<{ id: string; price: number; durationDays: number; translations: { name: string }[] }[]>([]);
  const [form, setForm] = useState({ shopId: '', tariffId: '' });

  useEffect(() => {
    new ShopService().getShops({ limit: 100 }).then(r => setShops(r.records));
    new TariffService().getTariffs({ limit: 100 }).then(r => setTariffs(r.records));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await new SubscriptionService().createSubscription(form); onCreated(); }
    catch { setError('Xatolik yuz berdi'); }
    finally { setLoading(false); }
  };

  const selectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm';

  return (
    <div className="max-w-lg">
      <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Orqaga</Button>
      <Card>
        <CardHeader><CardTitle>Obuna qo'shish</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
              <label className="text-sm font-medium">Do'kon *</label>
              <select value={form.shopId} onChange={e => setForm({ ...form, shopId: e.target.value })} className={selectClass} required>
                <option value="">Tanlang</option>
                {shops.map(s => <option key={s.id} value={s.id}>{s.translations[0]?.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tarif *</label>
              <select value={form.tariffId} onChange={e => setForm({ ...form, tariffId: e.target.value })} className={selectClass} required>
                <option value="">Tanlang</option>
                {tariffs.map(t => <option key={t.id} value={t.id}>{t.translations[0]?.name} — {t.price.toLocaleString()} so'm / {t.durationDays} kun</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Obuna qilish'}</Button>
              <Button type="button" variant="outline" onClick={onBack}>Bekor qilish</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
