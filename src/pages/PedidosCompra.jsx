import { useState, useEffect } from 'react';
import ListadoGenerico from './ListadoGenerico';
import API from '../api/axios';

export default function PedidosCompra() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/proveedores')
      .then(r => setProveedores(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  return (
    <ListadoGenerico
      titulo="Pedidos de Compra"
      endpoint="/pedidos-compra"
      idKey="id_pedido_compra"
      columnas={[
        { key: 'fecha_pedido', label: 'Fecha' },
        { key: 'proveedor', label: 'Proveedor', render: (v) => v?.nombre || '-' },
        { key: 'total', label: 'Total' },
        { key: 'estado', label: 'Estado' },
      ]}
      formFields={[
        { name: 'fecha_pedido', label: 'Fecha', type: 'date' },
        { name: 'id_proveedor', label: 'Proveedor', type: 'select',
          options: proveedores.map(p => ({ value: p.id_proveedor, label: p.nombre })) },
      ]}
      formInitial={{ fecha_pedido: '', id_proveedor: '' }}
    />
  );
}
