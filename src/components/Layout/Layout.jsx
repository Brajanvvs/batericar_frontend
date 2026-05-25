import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../LogoutButton';

export default function Layout() {
  const { usuario, loading } = useAuth();

  if (loading) return <div style={{ padding: 40 }}>Cargando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f0f2f5', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e3e6f0' }}>
          <span style={{ marginRight: '16px', color: '#5a5c69' }}>Hola, <b>{usuario.nombre}</b></span>
          <LogoutButton />
        </header>
        <div style={{ padding: 24, flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
