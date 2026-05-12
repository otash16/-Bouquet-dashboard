import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiImageUpload } from '@/components/ImageUpload';
import FlowerService from '@/app/services/FlowerService';
import CategoryService from '@/app/services/CategoryService';
import UploadService from '@/app/services/UploadService';

interface FlowerItem { id: string; price: number; discountPrice: number | null; images: string[]; status: number; shopId: string; translations: { language: string; name: string; description: string | null }[]; categoryId?: string | null; }
interface Props { flower: FlowerItem; onBack: () => void; onUpdated: () => void; }

export default function EditFlowerForm({ flower, onBack, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>(flower.images || []);
  const [categories, setCategories] = useState<{ id: string; translations: { name: string }[] }[]>([]);
  const uploadService = new UploadService();

  const handleUploadFlowerImage = async (file: File) => {
    const result = await uploadService.uploadFlowerImage(file);
    return result.url;
  };
  const get = (lang: string) => flower.translations.find(t => t.language === lang);
  const [form, setForm] = useState({
    categoryId: (flower as any).categoryId || '',
    price: String(flower.price),
    discountPrice: flower.discountPrice ? String(flower.discountPrice) : '',
    status: flower.status,
    nameUz: get('uz')?.name || '',
    nameRu: get('ru')?.name || '',
    descUz: get('uz')?.description || '',
    descRu: get('ru')?.description || '',
  });

  useEffect(() => { new CategoryService().getCategories({ limit: 100 }).then(r => setCategories(r.records)); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new FlowerService().updateFlower(flower.id, {
        categoryId: form.categoryId || null,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        images,
        status: form.status,
        translations: [
          { language: 'uz', name: form.nameUz, description: form.descUz || null },
          ...(form.nameRu ? [{ language: 'ru', name: form.nameRu, description: form.descRu || null }] : []),
        ],
      });
      onUpdated();
    } catch { setError('Xatolik yuz berdi'); }
    finally { setLoading(false); }
  };

  const selectClass = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm';

  return (
    <div className="max-w-2xl">
      <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Orqaga</Button>
      <Card>
        <CardHeader><CardTitle>Gulni tahrirlash</CardTitle></CardHeader>
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
                <label className="text-sm font-medium">Kategoriya</label>
                <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className={selectClass}>
                  <option value="">Tanlanmagan</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.translations[0]?.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: Number(e.target.value) })} className={selectClass}>
                  <option value={1}>Aktiv</option>
                  <option value={-1}>Noaktiv</option>
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
              <Button type="submit" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Saqlash'}</Button>
              <Button type="button" variant="outline" onClick={onBack}>Bekor qilish</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
