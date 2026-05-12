import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FolderTree, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Pagination from '@/components/Pagination';
import CategoryService from '@/app/services/CategoryService';
import CreateCategoryForm from './CreateCategoryForm';
import EditCategoryForm from './EditCategoryForm';
import DeleteCategoryConfirm from './DeleteCategoryConfirm';

interface Category {
  id: string;
  slug: string;
  image: string | null;
  status: number;
  translations: { language: string; name: string }[];
  createdAt: string;
}

type View = 'list' | 'create' | 'edit';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const fetchCategories = async (p = page, s = search) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page: p, limit: 10 };
      if (s) params.search = s;
      const result = await new CategoryService().getCategories(params);
      setCategories(result.records);
      setPagination(result.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSearch = () => { setPage(1); fetchCategories(1, search); };
  const handlePageChange = (p: number) => { setPage(p); fetchCategories(p, search); };
  const getName = (c: Category) => c.translations.find(t => t.language === 'uz')?.name || c.slug;

  if (view === 'create') return <div className="animate-fade-in"><CreateCategoryForm onBack={() => setView('list')} onCreated={() => { setView('list'); fetchCategories(1, ''); }} /></div>;
  if (view === 'edit' && selectedCategory) return <div className="animate-fade-in"><EditCategoryForm category={selectedCategory} onBack={() => { setView('list'); setSelectedCategory(null); }} onUpdated={() => { setView('list'); setSelectedCategory(null); fetchCategories(); }} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Kategoriyalar</h1>
          <p className="text-sm text-muted-foreground">{pagination.totalCount} ta kategoriya</p>
        </div>
        <Button onClick={() => setView('create')}><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline"> Yangi kategoriya</span></Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yuklanmoqda...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <FolderTree className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Kategoriyalar topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {categories.map(category => (
            <Card key={category.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <FolderTree className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{getName(category)}</h3>
                  <span className="text-sm text-muted-foreground">{category.slug}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={category.status === 1 ? 'success' : 'destructive'}>
                  {category.status === 1 ? 'Aktiv' : 'Noaktiv'}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(category); setView('edit'); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteCategory(category)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
      {deleteCategory && <DeleteCategoryConfirm category={deleteCategory} onClose={() => setDeleteCategory(null)} onDeleted={() => { setDeleteCategory(null); fetchCategories(); }} />}
    </div>
  );
}
