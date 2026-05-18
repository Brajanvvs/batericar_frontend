import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { usuario, loading } = useAuth();

  if (loading) return <div style={{ padding: 40 }}>Cargando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 24, background: '#f0f2f5', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
