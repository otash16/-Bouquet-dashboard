import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Flower2,
  Store,
  FolderTree,
  Flower,
  Users,
  CreditCard,
  Receipt,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { selectUser } from '@/auth/selector';

const superAdminMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Do\'konlar', icon: Store, path: '/shops' },
  { title: 'Kategoriyalar', icon: FolderTree, path: '/categories' },
  { title: 'Gullar', icon: Flower, path: '/flowers' },
  { title: 'Adminlar', icon: Users, path: '/admins' },
  { title: 'Tariflar', icon: CreditCard, path: '/tariffs' },
  { title: 'Obunalar', icon: Receipt, path: '/subscriptions' },
];

const shopAdminMenuItems = [
  { title: 'Do\'konim', icon: Store, path: '/shops' },
  { title: 'Gullarim', icon: Flower, path: '/flowers' },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const isSuperAdmin = user?.role === 1;
  const menuItems = isSuperAdmin ? superAdminMenuItems : shopAdminMenuItems;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar min-h-screen">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Flower2 className="h-5 w-5 text-primary" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">Bouquet</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
