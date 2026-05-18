import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { to: '/', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'ALMACEN', 'COMPRAS', 'VENTAS'] },
  { to: '/productos', label: 'Productos', icon: '📦', roles: ['ADMIN', 'ALMACEN'] },
  { to: '/tipos-producto', label: 'Tipos Producto', icon: '🏷️', roles: ['ADMIN', 'ALMACEN'] },
  { to: '/proveedores', label: 'Proveedores', icon: '🏢', roles: ['ADMIN', 'COMPRAS'] },
  { to: '/almacenes', label: 'Almacenes', icon: '🏭', roles: ['ADMIN', 'ALMACEN'] },
  { to: '/bodegas', label: 'Bodegas', icon: '🗄️', roles: ['ADMIN', 'ALMACEN'] },
  { to: '/clientes', label: 'Clientes', icon: '👥', roles: ['ADMIN', 'VENTAS'] },
  { to: '/pedidos-compra', label: 'Pedidos Compra', icon: '📋', roles: ['ADMIN', 'COMPRAS'] },
  { to: '/ingresos', label: 'Ingresos', icon: '📥', roles: ['ADMIN', 'ALMACEN'] },
  { to: '/salidas', label: 'Salidas', icon: '📤', roles: ['ADMIN', 'VENTAS', 'ALMACEN'] },
  { to: '/novedades', label: 'Novedades', icon: '⚠️', roles: ['ADMIN', 'ALMACEN'] },
  { to: '/usuarios', label: 'Usuarios', icon: '🔐', roles: ['ADMIN'] },
  { to: '/empleados', label: 'Empleados', icon: '👤', roles: ['ADMIN'] },
];

export default function Sidebar() {
  const { usuario } = useAuth();

  return (
    <aside style={{ width: 240, background: '#1a1a2e', color: '#eee', padding: 16, height: '100vh', overflowY: 'auto' }}>
      <h2 style={{ fontSize: 18, marginBottom: 24 }}>Inventario</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {menuItems
          .filter((item) => item.roles.includes(usuario?.rol))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                padding: '8px 12px',
                borderRadius: 6,
                textDecoration: 'none',
                color: isActive ? '#fff' : '#aaa',
                background: isActive ? '#16213e' : 'transparent',
                fontSize: 14,
              })}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
