import { useState, useEffect } from 'react';
import ListadoGenerico from './ListadoGenerico';
import API from '../api/axios';

export default function Empleados() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/usuarios')
      .then(r => setUsuarios(r.data.filter(u => u.estado === 'ACTIVO')))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  return (
    <ListadoGenerico
      titulo="Empleados"
      endpoint="/empleados"
      idKey="id_empleado"
      columnas={[
        { key: 'usuario', label: 'Usuario', render: (v) => v ? `${v.nombre} ${v.apellido || ''}`.trim() : '-' },
        { key: 'cargo', label: 'Cargo' },
        { key: 'eps', label: 'EPS' },
        { key: 'arl', label: 'ARL' },
        { key: 'sueldo', label: 'Sueldo', render: (v) => v ? `$${Number(v).toLocaleString()}` : '-' },
        { key: 'estado', label: 'Estado' },
      ]}
      formFields={[
        { name: 'id_usuario', label: 'Usuario', type: 'select',
          options: usuarios.map(u => ({ value: u.id_usuario, label: `${u.nombre} ${u.apellido || ''} - ${u.email}` })) },
        { name: 'cargo', label: 'Cargo', type: 'text' },
        { name: 'tipo_contrato', label: 'Tipo Contrato', type: 'text' },
        { name: 'eps', label: 'EPS', type: 'text' },
        { name: 'arl', label: 'ARL', type: 'text' },
        { name: 'pension', label: 'Pensión', type: 'text' },
        { name: 'sueldo', label: 'Sueldo', type: 'number' },
      ]}
      formInitial={{ id_usuario: '', cargo: '', tipo_contrato: '', eps: '', arl: '', pension: '', sueldo: 0 }}
    />
  );
}
