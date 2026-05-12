import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiImageUpload } from '@/components/ImageUpload';
import FlowerService from '@/app/services/FlowerService';
import ShopService from '@/app/services/ShopService';
import CategoryService from '@/app/services/CategoryService';
import UploadService from '@/app/services/UploadService';

interface Props { onBack: () => void; onCreated: () => void; }

export default function CreateFlowerForm({ onBack, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [shops, setShops] = useState<{ id: string; translations: { name: string }[] }[]>([]);
  const [categories, setCategories] = useState<{ id: string; translations: { name: string }[] }[]>([]);
  const [form, setForm] = useState({ shopId: '', categoryId: '', price: '', discountPrice: '', nameUz: '', nameRu: '', descUz: '', descRu: '' });
  const uploadService = new UploadService();

  const handleUploadFlowerImage = async (file: File) => {
    const result = await uploadService.uploadFlowerImage(file);
    return result.url;
  };

  useEffect(() => {
    new ShopService().getShops({ limit: 100 }).then(r => setShops(r.records));
    new CategoryService().getCategories({ limit: 100 }).then(r => setCategories(r.records));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new FlowerService().createFlower({
        shopId: form.shopId,
        categoryId: form.categoryId || null,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        images,
        status: 1,
        translations: [
          { language: 'uz', name: form.nameUz, description: form.descUz || null },
          ...(form.nameRu ? [{ language: 'ru', name: form.nameRu, description: form.descRu || null }] : []),
        ],
      });
      onCreated();
    } catch { setError('Xatolik yuz berdi. Subscription tekshiring.'); }
    finally { setLoading(false); }
  };

  const selectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm';

  return (
    <div className="max-w-2xl">
      <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Orqaga</Button>
      <Card>
        <CardHeader><CardTitle>Yangi gul qo'shish</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <MultiImageUpload label="Gul rasmlari" values={images} onChange={setImages} onUpload={handleUploadFlowerImage} max={10} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nomi (UZ) *</label><Input value={form.nameUz} onChange={e => setForm({ ...form, nameUz: e.target.value })} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Nomi (RU)</label><Input value={form.nameRu} onChange={e => setForm({ ...form, nameRu: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Do'kon *</label>
                <select value={form.shopId} onChange={e => setForm({ ...form, shopId: e.target.value })} className={selectClass} required>
                  <option value="">Tanlang</option>
                  {shops.map(s => <option key={s.id} value={s.id}>{s.translations[0]?.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Kategoriya</label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className={selectClass}>
                  <option value="">Tanlanmagan</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.translations[0]?.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Narx (so'm) *</label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Chegirma narx</label><Input type="number" value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} /></div>
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
