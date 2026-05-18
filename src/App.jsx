import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Bodegas from './pages/Bodegas';
import PedidosCompra from './pages/PedidosCompra';
import Ingresos from './pages/Ingresos';
import Salidas from './pages/Salidas';
import Novedades from './pages/Novedades';
import Empleados from './pages/Empleados';
import ListadoGenerico from './pages/ListadoGenerico';

const pages = [
  {
    path: '/tipos-producto', titulo: 'Tipos de Producto', endpoint: '/tipos-producto', idKey: 'id_tipo',
    columnas: [{ key: 'nombre', label: 'Nombre' }, { key: 'estado', label: 'Estado' }],
    fields: [{ name: 'nombre', label: 'Nombre', type: 'text' }],
    initial: { nombre: '' }
  },
  {
    path: '/proveedores', titulo: 'Proveedores', endpoint: '/proveedores', idKey: 'id_proveedor',
    columnas: [
      { key: 'nombre', label: 'Nombre' }, { key: 'nit', label: 'NIT' },
      { key: 'telefono', label: 'Teléfono' }, { key: 'email', label: 'Email' }, { key: 'estado', label: 'Estado' }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'nit', label: 'NIT', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'direccion', label: 'Dirección', type: 'text' },
      { name: 'representante', label: 'Representante', type: 'text' },
    ],
    initial: { nombre: '', nit: '', telefono: '', email: '', direccion: '', representante: '' }
  },
  {
    path: '/almacenes', titulo: 'Almacenes', endpoint: '/almacenes', idKey: 'id_almacen',
    columnas: [{ key: 'nombre', label: 'Nombre' }, { key: 'ubicacion', label: 'Ubicación' }, { key: 'estado', label: 'Estado' }],
    fields: [{ name: 'nombre', label: 'Nombre', type: 'text' }, { name: 'ubicacion', label: 'Ubicación', type: 'text' }],
    initial: { nombre: '', ubicacion: '' }
  },
  {
    path: '/clientes', titulo: 'Clientes', endpoint: '/clientes', idKey: 'id_cliente',
    columnas: [
      { key: 'nombre', label: 'Nombre' }, { key: 'tipo_documento', label: 'Tipo Doc' },
      { key: 'numero_documento', label: 'Nro Doc' }, { key: 'telefono', label: 'Teléfono' }, { key: 'estado', label: 'Estado' }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'tipo_documento', label: 'Tipo Documento', type: 'select', options: [
        { value: 'NIT', label: 'NIT' }, { value: 'CEDULA', label: 'Cédula' }, { value: 'CEDULA EXTRANJERIA', label: 'Cédula Extranjería' }
      ]},
      { name: 'numero_documento', label: 'Número Documento', type: 'text' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'direccion', label: 'Dirección', type: 'text' },
      { name: 'tipo_cliente', label: 'Tipo Cliente', type: 'select', options: [
        { value: 'NATURAL', label: 'Natural' }, { value: 'JURIDICA', label: 'Jurídica' }
      ]},
    ],
    initial: { nombre: '', tipo_documento: 'NIT', numero_documento: '', telefono: '', email: '', direccion: '', tipo_cliente: 'JURIDICA' }
  },
  {
    path: '/usuarios', titulo: 'Usuarios', endpoint: '/usuarios', idKey: 'id_usuario',
    columnas: [
      { key: 'nombre', label: 'Nombre' }, { key: 'apellido', label: 'Apellido' },
      { key: 'email', label: 'Email' }, { key: 'rol', label: 'Rol' }, { key: 'estado', label: 'Estado' }
    ],
    fields: [
      { name: 'cedula', label: 'Cédula', type: 'text' },
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'apellido', label: 'Apellido', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'telefono', label: 'Teléfono', type: 'text' },
      { name: 'rol', label: 'Rol', type: 'select', options: [
        { value: 'ADMIN', label: 'Admin' }, { value: 'ALMACEN', label: 'Almacén' },
        { value: 'COMPRAS', label: 'Compras' }, { value: 'VENTAS', label: 'Ventas' }, { value: 'OTRO', label: 'Otro' }
      ]},
      { name: 'password', label: 'Contraseña', type: 'password' },
    ],
    initial: { cedula: '', nombre: '', apellido: '', email: '', telefono: '', rol: 'OTRO', password: '' }
  },
];

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/bodegas" element={<Bodegas />} />
        <Route path="/pedidos-compra" element={<PedidosCompra />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/salidas" element={<Salidas />} />
        <Route path="/novedades" element={<Novedades />} />
        <Route path="/empleados" element={<Empleados />} />
        {pages.map((p) => (
          <Route key={p.path} path={p.path} element={
            <ListadoGenerico key={p.endpoint}
              titulo={p.titulo}
              endpoint={p.endpoint}
              idKey={p.idKey}
              columnas={p.columnas}
              formFields={p.fields}
              formInitial={p.initial}
            />
          } />
        ))}
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
