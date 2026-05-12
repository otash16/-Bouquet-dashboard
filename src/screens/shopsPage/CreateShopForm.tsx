import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShopService from '@/app/services/ShopService';

interface Props {
  onBack: () => void;
  onCreated: () => void;
}

export default function CreateShopForm({ onBack, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    slug: '',
    phone: '',
    address: '',
    nameUz: '',
    nameRu: '',
    descUz: '',
    descRu: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new ShopService().createShop({
        slug: form.slug,
        phone: form.phone || null,
        address: form.address || null,
        status: 1,
        translations: [
          { language: 'uz', name: form.nameUz, description: form.descUz || null },
          ...(form.nameRu ? [{ language: 'ru', name: form.nameRu, description: form.descRu || null }] : []),
        ],
      });
      onCreated();
    } catch {
      setError("Xatolik yuz berdi. Slug takrorlanayotgan bo'lishi mumkin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Orqaga
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Yangi do'kon yaratish</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nomi (UZ) *</label>
                <Input value={form.nameUz} onChange={e => setForm({ ...form, nameUz: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nomi (RU)</label>
                <Input value={form.nameRu} onChange={e => setForm({ ...form, nameRu: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="masalan: gul-markazi" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon</label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+998..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Manzil</label>
                <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tavsif (UZ)</label>
                <Textarea value={form.descUz} onChange={e => setForm({ ...form, descUz: e.target.value })} rows={3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tavsif (RU)</label>
                <Textarea value={form.descRu} onChange={e => setForm({ ...form, descRu: e.target.value })} rows={3} />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Yaratish'}
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>Bekor qilish</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
