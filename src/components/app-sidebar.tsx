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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { selectUser } from '@/auth/selector';

const superAdminMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: "Do'konlar", icon: Store, path: '/shops' },
  { title: 'Kategoriyalar', icon: FolderTree, path: '/categories' },
  { title: 'Gullar', icon: Flower, path: '/flowers' },
  { title: 'Adminlar', icon: Users, path: '/admins' },
  { title: 'Tariflar', icon: CreditCard, path: '/tariffs' },
  { title: 'Obunalar', icon: Receipt, path: '/subscriptions' },
];

const shopAdminMenuItems = [
  { title: "Do'konim", icon: Store, path: '/shops' },
  { title: 'Gullarim', icon: Flower, path: '/flowers' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AppSidebar({ open, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);

  const isSuperAdmin = user?.role === 1;
  const menuItems = isSuperAdmin ? superAdminMenuItems : shopAdminMenuItems;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Flower2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">Bouquet</span>
        </div>
        <button onClick={onClose} className="md:hidden text-sidebar-foreground/70 cursor-pointer">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
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
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar min-h-screen shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-72 flex flex-col bg-sidebar z-50 md:hidden shadow-xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
