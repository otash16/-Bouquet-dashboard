import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/app-sidebar';
import AppNavbar from '@/components/app-navbar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppNavbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
