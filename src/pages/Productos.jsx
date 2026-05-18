import { useState, useEffect } from 'react';
import ListadoGenerico from './ListadoGenerico';
import API from '../api/axios';

export default function Productos() {
  const [tipos, setTipos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/tipos-producto'),
      API.get('/proveedores')
    ]).then(([t, p]) => {
      setTipos(t.data);
      setProveedores(p.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  return (
    <ListadoGenerico
      titulo="Productos"
      endpoint="/productos"
      idKey="id_producto"
      columnas={[
        { key: 'codigo', label: 'Código' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipo', label: 'Tipo', render: (val) => val?.nombre || '-' },
        { key: 'proveedor', label: 'Proveedor', render: (val) => val?.nombre || '-' },
        { key: 'precio_venta', label: 'Precio Venta', render: (v) => v ? `$${parseFloat(v).toLocaleString()}` : '-' },
        { key: 'stock_actual', label: 'Stock' },
        { key: 'estado', label: 'Estado' },
      ]}
      formFields={[
        { name: 'codigo', label: 'Código', type: 'text' },
        { name: 'nombre', label: 'Nombre', type: 'text' },
        { name: 'id_tipo', label: 'Tipo', type: 'select', options: tipos.map(t => ({ value: t.id_tipo, label: t.nombre })) },
        { name: 'id_proveedor', label: 'Proveedor', type: 'select', options: proveedores.map(p => ({ value: p.id_proveedor, label: p.nombre })) },
        { name: 'precio_venta', label: 'Precio Venta', type: 'number' },
        { name: 'unidad_medida', label: 'Unidad', type: 'text' },
        { name: 'stock_minimo', label: 'Stock Mínimo', type: 'number' },
        { name: 'stock_maximo', label: 'Stock Máximo', type: 'number' },
      ]}
      formInitial={{ codigo: '', nombre: '', id_tipo: '', id_proveedor: '', precio_venta: 0, unidad_medida: 'UNID', stock_minimo: 0, stock_maximo: 0 }}
    />
  );
}
