import { useState, useEffect } from 'react';
import API from '../api/axios';
import LineItems from '../components/LineItems';

export default function Ingresos() {
  const [data, setData] = useState([]);
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const [cabecera, setCabecera] = useState({
    id_almacen: '', id_proveedor: '', id_empleado_recibe: '',
    transportador: '', factura_remision: '', placa_vehiculo: '', observacion: ''
  });
  const [detalles, setDetalles] = useState([]);
  const [novedadTexto, setNovedadTexto] = useState('');

  const cargar = async () => {
    setLoading(true);
    try {
      const [ing, prod, alm, prov, emp] = await Promise.all([
        API.get('/ingresos'), API.get('/productos'), API.get('/almacenes'),
        API.get('/proveedores'), API.get('/empleados')
      ]);
      setData(ing.data);
      setProductos(prod.data);
      setAlmacenes(alm.data);
      setProveedores(prov.data);
      setEmpleados(emp.data);
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
    if (detalles.length === 0) return setError('Debe agregar al menos un producto');
    try {
      await API.post('/ingresos', { ...cabecera, detalles, novedad_descripcion: novedadTexto || undefined });
      setShowForm(false);
      setCabecera({ id_almacen: '', id_proveedor: '', id_empleado_recibe: '', transportador: '', factura_remision: '', placa_vehiculo: '', observacion: '' });
      setDetalles([]);
      setNovedadTexto('');
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Ingresos a Almacén</h1>
        <button onClick={() => { setShowForm(true); setError(null); }}
          style={{ padding: '8px 16px', background: '#4e73df', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Nuevo Ingreso
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
          <h3 style={{ marginTop: 0 }}>Nuevo Ingreso</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Almacén</label>
              <select value={cabecera.id_almacen} onChange={(e) => setCabecera({ ...cabecera, id_almacen: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                <option value="">Seleccionar...</option>
                {almacenes.map(a => <option key={a.id_almacen} value={a.id_almacen}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Proveedor</label>
              <select value={cabecera.id_proveedor} onChange={(e) => setCabecera({ ...cabecera, id_proveedor: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                <option value="">Seleccionar...</option>
                {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Empleado que Recibe</label>
              <select value={cabecera.id_empleado_recibe} onChange={(e) => setCabecera({ ...cabecera, id_empleado_recibe: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                <option value="">Seleccionar...</option>
                {empleados.filter(e => e.estado === 'ACTIVO').map(e => (
                  <option key={e.id_empleado} value={e.id_empleado}>
                    {e.usuario?.nombre} {e.usuario?.apellido} - {e.cargo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Transportador</label>
              <input type="text" value={cabecera.transportador}
                onChange={(e) => setCabecera({ ...cabecera, transportador: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Factura/Remisión</label>
              <input type="text" value={cabecera.factura_remision}
                onChange={(e) => setCabecera({ ...cabecera, factura_remision: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Placa Vehículo</label>
              <input type="text" value={cabecera.placa_vehiculo}
                onChange={(e) => setCabecera({ ...cabecera, placa_vehiculo: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Observación</label>
              <input type="text" value={cabecera.observacion}
                onChange={(e) => setCabecera({ ...cabecera, observacion: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Novedad (opcional)</label>
            <textarea value={novedadTexto} onChange={(e) => setNovedadTexto(e.target.value)}
              placeholder="Si hay alguna novedad en este ingreso, descríbala aquí. Si se deja vacío se creará automáticamente: 'Ingreso #X sin novedad'"
              rows={2}
              style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, resize: 'vertical' }} />
          </div>

          <LineItems items={detalles} setItems={setDetalles} productos={productos}
            precioLabel="Costo Unitario" precioField="costo_unitario"
            autoPrecio readonlyPrecio />

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="submit"
              style={{ padding: '10px 20px', background: '#1cc88a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Guardar Ingreso
            </button>
            <button type="button" onClick={() => { setShowForm(false); setDetalles([]); setError(null); }}
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
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Almacén</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Proveedor</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: '#999' }}>No hay ingresos</td></tr>
            ) : data.map((item) => (
              <tr key={item.id_ingreso}>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>
                  {new Date(item.fecha_hora).toLocaleString()}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.almacen?.nombre || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.proveedor?.nombre || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
