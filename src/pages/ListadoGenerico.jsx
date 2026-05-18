import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function ListadoGenerico({ titulo, endpoint, columnas, formFields, formInitial, idKey }) {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(formInitial || {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const pk = idKey || (columnas.length > 0 ? columnas[0].key : null) || 'id';

  const cargar = async () => {
    setLoading(true);
    try {
      const res = await API.get(endpoint);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const pkValue = (item) => {
    const candidates = ['id_' + endpoint.replace('/',''), 'id_' + endpoint.split('/').pop(), 'id'];
    for (const c of candidates) {
      if (item[c] !== undefined) return item[c];
    }
    for (const key of Object.keys(item)) {
      if (key.startsWith('id_')) return item[key];
    }
    return item[pk];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await API.put(`${endpoint}/${editing}`, form);
      } else {
        await API.post(endpoint, form);
      }
      setShowForm(false);
      setEditing(null);
      setForm(formInitial || {});
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const filtered = {};
    (formFields || []).forEach(f => {
      filtered[f.name] = item[f.name] !== undefined ? item[f.name] : '';
    });
    setForm(filtered);
    setEditing(pkValue(item));
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    const id = pkValue(item);
    if (!window.confirm('¿Está seguro de eliminar?')) return;
    try {
      await API.delete(`${endpoint}/${id}`);
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>{titulo}</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(formInitial || {}); setError(null); }}
          style={{ padding: '8px 16px', background: '#4e73df', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Nuevo
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {formFields && formFields.map((field) => (
              <div key={field.name}>
                <label style={{ display: 'block', fontSize: 12, color: '#666' }}>{field.label}</label>
                {field.type === 'select' ? (
                  <select value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}>
                    <option value="">Seleccionar...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input type={field.type || 'text'} value={form[field.name] || ''}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving}
              style={{ padding: '8px 16px', background: '#1cc88a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setError(null); }}
              style={{ padding: '8px 16px', background: '#858796', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ padding: 20, textAlign: 'center', color: '#666' }}>Cargando...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fc' }}>
                {columnas && columnas.map((col) => (
                  <th key={col.key} style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e3e6f0', fontSize: 12, whiteSpace: 'nowrap' }}>{col.label}</th>
                ))}
                <th style={{ padding: 12, borderBottom: '2px solid #e3e6f0', width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? data.map((item) => (
                <tr key={pkValue(item)}>
                  {columnas && columnas.map((col) => (
                    <td key={col.key} style={{ padding: 12, borderBottom: '1px solid #e3e6f0', fontSize: 13 }}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td style={{ padding: 12, borderBottom: '1px solid #e3e6f0' }}>
                    <button onClick={() => handleEdit(item)} style={{ marginRight: 4, padding: '4px 8px', background: '#4e73df', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Editar</button>
                    <button onClick={() => handleDelete(item)} style={{ padding: '4px 8px', background: '#e74a3b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Eliminar</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={(columnas?.length || 1) + 1} style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                    No hay registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
