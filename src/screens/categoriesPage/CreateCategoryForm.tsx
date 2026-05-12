import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryService from '@/app/services/CategoryService';

interface Props { onBack: () => void; onCreated: () => void; }

export default function CreateCategoryForm({ onBack, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ slug: '', nameUz: '', nameRu: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new CategoryService().createCategory({
        slug: form.slug,
        status: 1,
        translations: [
          { language: 'uz', name: form.nameUz },
          ...(form.nameRu ? [{ language: 'ru', name: form.nameRu }] : []),
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
        <CardHeader><CardTitle>Yangi kategoriya</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="masalan: romantik" required />
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
