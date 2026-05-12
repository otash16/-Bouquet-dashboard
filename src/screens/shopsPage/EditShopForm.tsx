import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShopService from '@/app/services/ShopService';

interface Shop {
  id: string;
  slug: string;
  phone: string | null;
  address: string | null;
  status: number;
  translations: { language: string; name: string; description: string | null }[];
}

interface Props {
  shop: Shop;
  onBack: () => void;
  onUpdated: () => void;
}

export default function EditShopForm({ shop, onBack, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTranslation = (lang: string) => shop.translations.find(t => t.language === lang);

  const [form, setForm] = useState({
    slug: shop.slug,
    phone: shop.phone || '',
    address: shop.address || '',
    status: shop.status,
    nameUz: getTranslation('uz')?.name || '',
    nameRu: getTranslation('ru')?.name || '',
    descUz: getTranslation('uz')?.description || '',
    descRu: getTranslation('ru')?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new ShopService().updateShop(shop.id, {
        slug: form.slug,
        phone: form.phone || null,
        address: form.address || null,
        status: form.status,
        translations: [
          { language: 'uz', name: form.nameUz, description: form.descUz || null },
          ...(form.nameRu ? [{ language: 'ru', name: form.nameRu, description: form.descRu || null }] : []),
        ],
      });
      onUpdated();
    } catch {
      setError('Xatolik yuz berdi');
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
          <CardTitle>Do'konni tahrirlash</CardTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: Number(e.target.value) })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value={1}>Aktiv</option>
                  <option value={-1}>Noaktiv</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon</label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
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
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Saqlash'}
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>Bekor qilish</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
