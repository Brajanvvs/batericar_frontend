import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Novedades() {
  const [data, setData] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [idDetalleIngreso, setIdDetalleIngreso] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const [nov, ing] = await Promise.all([
        API.get('/novedades'),
        API.get('/ingresos')
      ]);
      setData(nov.data);
      // Obtener detalles del primer ingreso para poder seleccionarlos
      const detallesPromises = ing.data
        .filter(i => i.estado === 'REGISTRADO')
        .map(i => API.get(`/ingresos/${i.id_ingreso}`).then(r => r.data.detalles || []));
      const detallesArr = await Promise.all(detallesPromises);
      setIngresos(detallesArr.flat().filter(Boolean));
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await API.post('/novedades', {
        descripcion,
        cantidad: Number(cantidad),
        id_detalle_ingreso: idDetalleIngreso || null
      });
      setShowForm(false);
      setDescripcion('');
      setCantidad(0);
      setIdDetalleIngreso('');
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Novedades</h1>
        <button onClick={() => { setShowForm(true); setError(null); }}
          style={{ padding: '8px 16px', background: '#4e73df', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Nueva Novedad
        </button>
      </div>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '8px 12px', borderRadius: 4, marginBottom: 12 }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>x</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3 style={{ marginTop: 0 }}>Nueva Novedad</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={2}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Cantidad</label>
              <input type="number" min="0" value={cantidad} onChange={(e) => setCantidad(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Vincular a Ingreso (opcional)</label>
              <select value={idDetalleIngreso} onChange={(e) => setIdDetalleIngreso(e.target.value)}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                <option value="">Sin vínculo - Novedad manual</option>
                {ingresos.map(d => (
                  <option key={d.id_detalle_ingreso} value={d.id_detalle_ingreso}>
                    Ingreso #{d.id_ingreso} - {d.producto?.nombre || 'Producto'} (x{d.cantidad})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button type="submit"
              style={{ padding: '10px 20px', background: '#1cc88a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Guardar Novedad
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(null); }}
              style={{ padding: '10px 20px', background: '#858796', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div style={{ background: '#fff', borderRadius: 8, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fc' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Fecha</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Descripción</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Cantidad</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Ingreso</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Producto</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#999' }}>No hay novedades</td></tr>
            ) : data.map((item) => (
              <tr key={item.id_novedad}>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>
                  {new Date(item.fecha_registro).toLocaleString()}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.descripcion}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.cantidad}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>
                  {item.detalleIngreso?.ingreso ? `#${item.detalleIngreso.ingreso.id_ingreso}` : '-'}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>
                  {item.detalleIngreso?.producto?.nombre || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
