import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShopService from '@/app/services/ShopService';

interface Props {
  shop: { id: string; translations: { language: string; name: string }[] };
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteShopConfirm({ shop, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);

  const name = shop.translations.find(t => t.language === 'uz')?.name || 'Do\'kon';

  const handleDelete = async () => {
    setLoading(true);
    try {
      await new ShopService().deleteShop(shop.id);
      onDeleted();
    } catch {
      console.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do'konni o'chirish</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          <strong>{name}</strong> do'konini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "O'chirish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
