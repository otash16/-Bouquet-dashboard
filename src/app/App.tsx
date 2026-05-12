import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainLayout from '@/layout/MainLayout';
import RequireAuth from '@/libs/helper/RequireAuth';
import LoginPage from '@/screens/loginPage';
import { setUser } from '@/auth/slice';
import AuthService from './services/AuthService';

// Placeholder pages
function DashboardPage() {
  return <div className="text-2xl font-bold">Dashboard</div>;
}

function ShopsPage() {
  return <div className="text-2xl font-bold">Do'konlar</div>;
}

function CategoriesPage() {
  return <div className="text-2xl font-bold">Kategoriyalar</div>;
}

function FlowersPage() {
  return <div className="text-2xl font-bold">Gullar</div>;
}

function AdminsPage() {
  return <div className="text-2xl font-bold">Adminlar</div>;
}

function TariffsPage() {
  return <div className="text-2xl font-bold">Tariflar</div>;
}

function SubscriptionsPage() {
  return <div className="text-2xl font-bold">Obunalar</div>;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      new AuthService()
        .getInfo()
        .then(user => dispatch(setUser(user)))
        .catch(() => {
          localStorage.removeItem('accessToken');
        });
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/flowers" element={<FlowersPage />} />
        <Route path="/admins" element={<AdminsPage />} />
        <Route path="/tariffs" element={<TariffsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/shops" replace />} />
    </Routes>
  );
}
