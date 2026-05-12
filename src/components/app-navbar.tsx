import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User, KeyRound, Monitor, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/theme';
import { selectUser } from '@/auth/selector';
import { logout } from '@/auth/slice';
import AuthService from '@/app/services/AuthService';
import ChangePasswordModal from './ChangePasswordModal';

interface Props {
  onMenuClick: () => void;
}

export default function AppNavbar({ onMenuClick }: Props) {
  const { theme, setTheme } = useTheme();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await new AuthService().logout();
    } catch {
      // ignore
    }
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-sm font-medium text-muted-foreground">
            {user?.shopName ? user.shopName : 'Bouquet Admin'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium hidden sm:inline">{user?.fullName}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border bg-popover p-1 shadow-md z-50 animate-scale-in">
                  <button
                    onClick={() => { setMenuOpen(false); setPasswordModalOpen(true); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors cursor-pointer"
                  >
                    <KeyRound className="h-4 w-4" />
                    Parolni o'zgartirish
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/sessions'); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Monitor className="h-4 w-4" />
                    Sessiyalar
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-accent text-destructive transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Chiqish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </>
  );
}
