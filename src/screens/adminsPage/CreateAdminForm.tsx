import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminService from '@/app/services/AdminService';
import ShopService from '@/app/services/ShopService';

interface Props { onBack: () => void; onCreated: () => void; }

export default function CreateAdminForm({ onBack, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shops, setShops] = useState<{ id: string; translations: { name: string }[] }[]>([]);
  const [form, setForm] = useState({ fullName: '', username: '', phoneNumber: '', password: '', role: 2, shopId: '' });

  useEffect(() => { new ShopService().getShops({ limit: 100 }).then(r => setShops(r.records)); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new AdminService().createAdmin({ ...form, shopId: form.shopId || null, status: 1 });
      onCreated();
    } catch { setError('Xatolik yuz berdi. Username takrorlanayotgan bo\'lishi mumkin.'); }
    finally { setLoading(false); }
  };

  const selectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm';

  return (
    <div className="max-w-lg">
      <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Orqaga</Button>
      <Card>
        <CardHeader><CardTitle>Yangi admin yaratish</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2"><label className="text-sm font-medium">To'liq ism *</label><Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Username *</label><Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Telefon *</label><Input value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} required /></div>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium">Parol *</label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: Number(e.target.value) })} className={selectClass}>
                  <option value={1}>SuperAdmin</option>
                  <option value={2}>Shop Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Do'kon</label>
                <select value={form.shopId} onChange={e => setForm({ ...form, shopId: e.target.value })} className={selectClass}>
                  <option value="">Tanlanmagan</option>
                  {shops.map(s => <option key={s.id} value={s.id}>{s.translations[0]?.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yaratish'}</Button>
              <Button type="button" variant="outline" onClick={onBack}>Bekor qilish</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
