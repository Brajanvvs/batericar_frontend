# BateriCar - Frontend

Aplicación web del sistema de inventario y compras BateriCar.

## Stack

- React 19 + Vite 8
- React Router DOM v7
- Axios para peticiones HTTP
- ESLint 10

## Requisitos

- Node.js 18+
- npm 10+

## Instalación

```bash
npm install
cp .env.example .env
# Editar .env con la URL de la API
npm run dev
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza build |
| `npm run lint` | Ejecuta linter |

## Variables de Entorno

```
VITE_API_URL=http://localhost:4000/api
```

## Módulos

- Login / Autenticación JWT
- Dashboard con indicadores
- CRUD: Productos, Tipos Producto, Proveedores, Almacenes, Bodegas, Clientes, Usuarios
- Pedidos de Compra, Ingresos a Almacén, Salidas de Mercancía, Novedades, Empleados
- Sidebar con filtro por roles (ADMIN, ALMACEN, COMPRAS, VENTAS)
