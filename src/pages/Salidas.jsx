import { useState, useEffect } from 'react';
import API from '../api/axios';
import LineItems from '../components/LineItems';

export default function Salidas() {
  const [data, setData] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const [cabecera, setCabecera] = useState({
    id_cliente: '', id_almacen: '', id_empleado_vende: '',
    tipo_salida: 'VENTA', documento_salida: '', observacion: ''
  });
  const [detalles, setDetalles] = useState([]);

  const cargar = async () => {
    setLoading(true);
    try {
      const [sal, prod, cli, alm, emp] = await Promise.all([
        API.get('/salidas'), API.get('/productos'), API.get('/clientes'),
        API.get('/almacenes'), API.get('/empleados')
      ]);
      setData(sal.data);
      setProductos(prod.data);
      setClientes(cli.data);
      setAlmacenes(alm.data);
      setEmpleados(emp.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const subtotal = detalles.reduce((s, d) => s + (Number(d.cantidad) || 0) * (Number(d.precio_unitario) || 0), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (detalles.length === 0) return setError('Debe agregar al menos un producto');
    try {
      await API.post('/salidas', { ...cabecera, detalles, subtotal, iva, total });
      setShowForm(false);
      setCabecera({ id_cliente: '', id_almacen: '', id_empleado_vende: '', tipo_salida: 'VENTA', documento_salida: '', observacion: '' });
      setDetalles([]);
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Salidas de Mercancía</h1>
        <button onClick={() => { setShowForm(true); setError(null); }}
          style={{ padding: '8px 16px', background: '#4e73df', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Nueva Salida
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
          <h3 style={{ marginTop: 0 }}>Nueva Salida</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Tipo de Salida</label>
              <select value={cabecera.tipo_salida} onChange={(e) => setCabecera({ ...cabecera, tipo_salida: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                <option value="VENTA">Venta</option>
                <option value="REMISION">Remisión</option>
                <option value="AJUSTE">Ajuste</option>
                <option value="AVERIA">Avería</option>
                <option value="DEVOLUCION">Devolución</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Cliente</label>
              <select value={cabecera.id_cliente} onChange={(e) => setCabecera({ ...cabecera, id_cliente: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                <option value="">Seleccionar...</option>
                {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Almacén</label>
              <select value={cabecera.id_almacen} onChange={(e) => setCabecera({ ...cabecera, id_almacen: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                <option value="">Seleccionar...</option>
                {almacenes.map(a => <option key={a.id_almacen} value={a.id_almacen}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Empleado que Vende</label>
              <select value={cabecera.id_empleado_vende} onChange={(e) => setCabecera({ ...cabecera, id_empleado_vende: e.target.value })}
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
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Documento Salida</label>
              <input type="text" value={cabecera.documento_salida}
                onChange={(e) => setCabecera({ ...cabecera, documento_salida: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#666' }}>Observación</label>
              <input type="text" value={cabecera.observacion}
                onChange={(e) => setCabecera({ ...cabecera, observacion: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
            </div>
          </div>

          <LineItems items={detalles} setItems={setDetalles} productos={productos}
            precioLabel="Precio Unitario" precioField="precio_unitario"
            autoPrecio readonlyPrecio showStock />

          <div style={{ marginTop: 12, display: 'flex', gap: 24, justifyContent: 'flex-end', fontSize: 14 }}>
            <span>Subtotal: <strong>${subtotal.toLocaleString()}</strong></span>
            <span>IVA (19%): <strong>${iva.toLocaleString()}</strong></span>
            <span style={{ fontSize: 16 }}>Total: <strong>${total.toLocaleString()}</strong></span>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="submit"
              style={{ padding: '10px 20px', background: '#1cc88a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Guardar Salida
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
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Cliente</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Almacén</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Tipo</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Total</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12 }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#999' }}>No hay salidas</td></tr>
            ) : data.map((item) => (
              <tr key={item.id_salida}>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>
                  {new Date(item.fecha_hora).toLocaleString()}
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.cliente?.nombre || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.almacen?.nombre || '-'}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.tipo_salida}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>${Number(item.total).toLocaleString()}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>{item.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
