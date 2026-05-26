import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Notificamos al backend del cierre de sesión
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor', error);
    } finally {
      // Limpiamos el estado y el local storage mediante la función del contexto
      if (logout) {
        logout();
      } else {
        localStorage.removeItem('token'); // Fallback por si acaso
      }
      setIsLoading(false);
      navigate('/login');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: isLoading ? '#f87171' : '#ef4444',
        color: '#ffffff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)'
      }}
      onMouseOver={(e) => {
        if(!isLoading) {
          e.currentTarget.style.backgroundColor = '#dc2626';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseOut={(e) => {
        if(!isLoading) {
          e.currentTarget.style.backgroundColor = '#ef4444';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {isLoading ? (
        <span style={{ fontSize: '16px' }}>⏳</span>
      ) : (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      )}
      {isLoading ? 'Cerrando...' : 'Cerrar Sesión'}
    </button>
  );
}