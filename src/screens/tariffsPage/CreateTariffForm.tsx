import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TariffService from '@/app/services/TariffService';

interface Props { onBack: () => void; onCreated: () => void; }

export default function CreateTariffForm({ onBack, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nameUz: '', nameRu: '', descUz: '', descRu: '', price: '', durationDays: '', flowerLimit: '0' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new TariffService().createTariff({
        price: Number(form.price), durationDays: Number(form.durationDays), flowerLimit: Number(form.flowerLimit), status: 1,
        translations: [
          { language: 'uz', name: form.nameUz, description: form.descUz || form.nameUz },
          ...(form.nameRu ? [{ language: 'ru', name: form.nameRu, description: form.descRu || form.nameRu }] : []),
        ],
      });
      onCreated();
    } catch { setError('Xatolik yuz berdi'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg">
      <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Orqaga</Button>
      <Card>
        <CardHeader><CardTitle>Yangi tarif</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nomi (UZ) *</label><Input value={form.nameUz} onChange={e => setForm({ ...form, nameUz: e.target.value })} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Nomi (RU)</label><Input value={form.nameRu} onChange={e => setForm({ ...form, nameRu: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Narx (so'm) *</label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Muddat (kun) *</label><Input type="number" value={form.durationDays} onChange={e => setForm({ ...form, durationDays: e.target.value })} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Gul limiti</label><Input type="number" value={form.flowerLimit} onChange={e => setForm({ ...form, flowerLimit: e.target.value })} placeholder="0 = cheksiz" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Tavsif (UZ)</label><Textarea value={form.descUz} onChange={e => setForm({ ...form, descUz: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Tavsif (RU)</label><Textarea value={form.descRu} onChange={e => setForm({ ...form, descRu: e.target.value })} rows={3} /></div>
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
