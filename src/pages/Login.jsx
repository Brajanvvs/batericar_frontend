import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1a1a2e' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 40, borderRadius: 8, width: 360 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24, color: '#1a1a2e' }}>Iniciar Sesión</h1>
        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ width: '100%', padding: 8, marginTop: 4, border: '1px solid #ccc', borderRadius: 4 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: '100%', padding: 8, marginTop: 4, border: '1px solid #ccc', borderRadius: 4 }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}
