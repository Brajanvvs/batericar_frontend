export default function LineItems({ items, setItems, productos, precioLabel, precioField, autoPrecio, readonlyPrecio, showStock }) {
  const addItem = () => {
    setItems([...items, { id_producto: '', cantidad: 1, [precioField]: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];

    if (field === 'id_producto' && autoPrecio) {
      const prod = productos.find(p => p.id_producto === Number(value));
      updated[index][precioField] = prod ? Number(prod.precio_venta) : 0;
    }

    updated[index][field] = value;
    setItems(updated);
  };

  const getProducto = (id) => productos.find(p => p.id_producto === Number(id));

  const totalLinea = (item) => {
    const cant = Number(item.cantidad) || 0;
    const prec = Number(item[precioField]) || 0;
    return cant * prec;
  };

  const totalGeneral = items.reduce((sum, item) => sum + totalLinea(item), 0);

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h4 style={{ margin: 0 }}>Productos</h4>
        <button type="button" onClick={addItem}
          style={{ padding: '6px 12px', background: '#4e73df', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          + Agregar Producto
        </button>
      </div>

      {items.length === 0 ? (
        <p style={{ color: '#999', fontStyle: 'italic' }}>Agregue productos al movimiento</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8f9fc' }}>
                <th style={{ padding: 8, border: '1px solid #e3e6f0', textAlign: 'left' }}>Producto</th>
                {showStock && <th style={{ padding: 8, border: '1px solid #e3e6f0', width: 70 }}>Stock</th>}
                <th style={{ padding: 8, border: '1px solid #e3e6f0', width: 80 }}>Cantidad</th>
                <th style={{ padding: 8, border: '1px solid #e3e6f0', width: 120 }}>{precioLabel}</th>
                <th style={{ padding: 8, border: '1px solid #e3e6f0', width: 100 }}>Subtotal</th>
                <th style={{ padding: 8, border: '1px solid #e3e6f0', width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const prod = getProducto(item.id_producto);
                return (
                  <tr key={i}>
                    <td style={{ padding: 6, border: '1px solid #e3e6f0' }}>
                      <select value={item.id_producto} onChange={(e) => updateItem(i, 'id_producto', e.target.value)}
                        style={{ width: '100%', padding: 6, border: '1px solid #ccc', borderRadius: 4 }}>
                        <option value="">Seleccionar...</option>
                        {productos.filter(p => p.estado === 'ACTIVO').map(p => (
                          <option key={p.id_producto} value={p.id_producto}>
                            {p.codigo} - {p.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    {showStock && (
                      <td style={{ padding: 6, border: '1px solid #e3e6f0', textAlign: 'center', fontSize: 12 }}>
                        {prod ? prod.stock_actual : '-'}
                      </td>
                    )}
                    <td style={{ padding: 6, border: '1px solid #e3e6f0' }}>
                      <input type="number" min="1" value={item.cantidad}
                        onChange={(e) => updateItem(i, 'cantidad', e.target.value)}
                        style={{ width: '100%', padding: 6, border: '1px solid #ccc', borderRadius: 4 }} />
                    </td>
                    <td style={{ padding: 6, border: '1px solid #e3e6f0' }}>
                      <input type="number" min="0" step="0.01" value={item[precioField]}
                        onChange={(e) => updateItem(i, precioField, e.target.value)}
                        readOnly={readonlyPrecio}
                        style={{ width: '100%', padding: 6, border: '1px solid #ccc', borderRadius: 4, background: readonlyPrecio ? '#f5f5f5' : '#fff' }} />
                    </td>
                    <td style={{ padding: 6, border: '1px solid #e3e6f0', textAlign: 'right' }}>
                      ${totalLinea(item).toLocaleString()}
                    </td>
                    <td style={{ padding: 6, border: '1px solid #e3e6f0', textAlign: 'center' }}>
                      <button type="button" onClick={() => removeItem(i)}
                        style={{ padding: '4px 8px', background: '#e74a3b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
                        x
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8f9fc', fontWeight: 'bold' }}>
                <td colSpan={showStock ? 4 : 3} style={{ padding: 8, border: '1px solid #e3e6f0', textAlign: 'right' }}>TOTAL</td>
                <td style={{ padding: 8, border: '1px solid #e3e6f0', textAlign: 'right' }}>${totalGeneral.toLocaleString()}</td>
                <td style={{ padding: 8, border: '1px solid #e3e6f0' }}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
