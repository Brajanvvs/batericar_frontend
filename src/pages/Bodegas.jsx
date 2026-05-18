import { useState, useEffect } from 'react';
import ListadoGenerico from './ListadoGenerico';
import API from '../api/axios';

export default function Bodegas() {
  const [almacenes, setAlmacenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/almacenes')
      .then(r => setAlmacenes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  return (
    <ListadoGenerico
      titulo="Bodegas"
      endpoint="/bodegas"
      idKey="id_bodega"
      columnas={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'estado', label: 'Estado' },
        { key: 'almacen', label: 'Almacén', render: (v) => v?.nombre || '-' }
      ]}
      formFields={[
        { name: 'nombre', label: 'Nombre', type: 'text' },
        {
          name: 'id_almacen', label: 'Almacén', type: 'select',
          options: almacenes.map(a => ({ value: a.id_almacen, label: a.nombre }))
        },
        { name: 'estado', label: 'Estado', type: 'select', options: [
          { value: 'ACTIVO', label: 'Activo' }, { value: 'INACTIVO', label: 'Inactivo' }
        ]},
      ]}
      formInitial={{ nombre: '', id_almacen: '', estado: 'ACTIVO' }}
    />
  );
}
