import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import MainLayout from '@/layout/MainLayout';
import RequireAuth from '@/libs/helper/RequireAuth';
import LoginPage from '@/screens/loginPage';
import ShopsPage from '@/screens/shopsPage';
import CategoriesPage from '@/screens/categoriesPage';
import FlowersPage from '@/screens/flowersPage';
import AdminsPage from '@/screens/adminsPage';
import TariffsPage from '@/screens/tariffsPage';
import SubscriptionsPage from '@/screens/subscriptionsPage';
import { setUser } from '@/auth/slice';
import AuthService from './services/AuthService';

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
