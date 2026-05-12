import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryService from '@/app/services/CategoryService';

interface Category { id: string; slug: string; status: number; translations: { language: string; name: string }[]; }
interface Props { category: Category; onBack: () => void; onUpdated: () => void; }

export default function EditCategoryForm({ category, onBack, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const get = (lang: string) => category.translations.find(t => t.language === lang);
  const [form, setForm] = useState({ slug: category.slug, status: category.status, nameUz: get('uz')?.name || '', nameRu: get('ru')?.name || '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new CategoryService().updateCategory(category.id, {
        slug: form.slug,
        status: form.status,
        translations: [
          { language: 'uz', name: form.nameUz },
          ...(form.nameRu ? [{ language: 'ru', name: form.nameRu }] : []),
        ],
      });
      onUpdated();
    } catch { setError('Xatolik yuz berdi'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg">
      <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" /> Orqaga</Button>
      <Card>
        <CardHeader><CardTitle>Kategoriyani tahrirlash</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Nomi (UZ) *</label><Input value={form.nameUz} onChange={e => setForm({ ...form, nameUz: e.target.value })} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Nomi (RU)</label><Input value={form.nameRu} onChange={e => setForm({ ...form, nameRu: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Slug *</label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: Number(e.target.value) })} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option value={1}>Aktiv</option>
                  <option value={-1}>Noaktiv</option>
                </select>
              </div>
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
