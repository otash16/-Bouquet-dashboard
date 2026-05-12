import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CategoryService from '@/app/services/CategoryService';

interface Props {
  category: { id: string; translations: { language: string; name: string }[] };
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteCategoryConfirm({ category, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const name = category.translations.find(t => t.language === 'uz')?.name || 'Kategoriya';

  const handleDelete = async () => {
    setLoading(true);
    try { await new CategoryService().deleteCategory(category.id); onDeleted(); }
    catch { console.error('Delete failed'); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Kategoriyani o'chirish</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground"><strong>{name}</strong> kategoriyasini o'chirmoqchimisiz?</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "O'chirish"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
