import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ productos: 0, proveedores: 0, clientes: 0, pedidos: 0 });

  useEffect(() => {
    Promise.all([
      API.get('/productos'),
      API.get('/proveedores'),
      API.get('/clientes'),
      API.get('/pedidos-compra'),
    ]).then(([prod, prov, cli, ped]) => {
      setStats({
        productos: prod.data.length,
        proveedores: prov.data.length,
        clientes: cli.data.length,
        pedidos: ped.data.length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Productos', value: stats.productos, color: '#4e73df' },
    { label: 'Proveedores', value: stats.proveedores, color: '#1cc88a' },
    { label: 'Clientes', value: stats.clientes, color: '#36b9cc' },
    { label: 'Pedidos Compra', value: stats.pedidos, color: '#f6c23e' },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginTop: 20 }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: '#fff', padding: 24, borderRadius: 8, borderLeft: `4px solid ${card.color}` }}>
            <h3 style={{ color: '#666', fontSize: 14, margin: 0 }}>{card.label}</h3>
            <p style={{ fontSize: 32, fontWeight: 'bold', margin: '8px 0 0', color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
