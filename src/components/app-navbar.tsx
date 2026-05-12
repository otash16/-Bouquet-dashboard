import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/theme';
import { selectUser } from '@/auth/selector';
import { logout } from '@/auth/slice';
import AuthService from '@/app/services/AuthService';

export default function AppNavbar() {
  const { theme, setTheme } = useTheme();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6">
      <div>
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

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{user?.fullName}</span>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
