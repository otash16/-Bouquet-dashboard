import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminService from '@/app/services/AdminService';

interface Props { admin: { id: string; fullName: string }; onClose: () => void; onDeleted: () => void; }

export default function DeleteAdminConfirm({ admin, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try { await new AdminService().deleteAdmin(admin.id); onDeleted(); }
    catch { console.error('Delete failed'); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Adminni o'chirish</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground"><strong>{admin.fullName}</strong> adminni o'chirmoqchimisiz?</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "O'chirish"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
